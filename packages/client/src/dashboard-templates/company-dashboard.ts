// ============================================================
// company-dashboard.ts
// Excel equivalent of the Google Sheets company-dashboard.ts.
//
// Architecture difference:
//   Sheets: server-side TS functions fetch data → write to cache sheets → Dashboard reads via INDIRECT.
//   Excel:  SECTORS.* formula cells placed in data sheets spill live data → Dashboard reads via direct cell refs.
//
// Sheet layout produced:
//   "{TICKER} - Company Report"     → A1: =SECTORS.COMPANY_REPORT(ticker)
//   "{TICKER} - Daily Transactions" → A1: =SECTORS.DAILY_TRANSACTION_DATA(ticker)
//   "{TICKER} - Corporate Actions"  → A1: =SECTORS.CORPORATE_ACTIONS(ticker)
//   "{TICKER} - Company Filings"    → A1: =SECTORS.COMPANY_FILINGS(ticker)
//   "{TICKER} - News Articles"      → A1: =SECTORS.NEWS_ARTICLES(,,,,,"30",,,,, ticker)
//   "Dashboard"                     → KPI row + dropdown table viewer referencing the above sheets
// ============================================================

const LABELS = [
  "Company Report",
  "Daily Transactions",
  "Corporate Actions",
  "Company Filings",
  "News Articles",
] as const;

type Label = typeof LABELS[number];

function sheetName(ticker: string, label: Label): string {
  return `${ticker} - ${label}`;
}

/** Delete a sheet by name if it exists. */
async function deleteIfExists(context: Excel.RequestContext, name: string): Promise<void> {
  const ws = context.workbook.worksheets.getItemOrNullObject(name);
  await context.sync();
  if (!ws.isNullObject) {
    ws.delete();
    await context.sync();
  }
}

// ── Data sheet formulas ──────────────────────────────────────────────────────
// Each label maps to the SECTORS.* formula that populates its data sheet.
// These spill the full dataset into the sheet starting at A1.
function dataFormula(ticker: string, label: Label): string {
  switch (label) {
    case "Company Report":
      return `=SECTORS.COMPANY_REPORT("${ticker}")`;
    case "Daily Transactions":
      return `=SECTORS.DAILY_TRANSACTION_DATA("${ticker}")`;
    case "Corporate Actions":
      return `=SECTORS.CORPORATE_ACTIONS("${ticker}")`;
    case "Company Filings":
      return `=SECTORS.COMPANY_FILINGS("${ticker}")`;
    case "News Articles":
      // symbols is the 11th parameter; pass 30 as limit (6th) and ticker as symbols (11th)
      return `=SECTORS.NEWS_ARTICLES(,,,,,"30",,,,, "${ticker}")`;
  }
}

// ── syncDataCaches ───────────────────────────────────────────────────────────
// Creates/overwrites one sheet per dataset, each containing a single spilling
// SECTORS.* formula. Equivalent to the Sheets syncDataCaches that fetched data
// server-side; here Excel evaluates the formulas live.
export async function syncDataCaches(ticker: string): Promise<void> {
  ticker = ticker.trim().toUpperCase();

  await Excel.run(async (context) => {
    for (const label of LABELS) {
      const name = sheetName(ticker, label);

      // Delete and recreate to clear any stale spill data
      await deleteIfExists(context, name);

      const ws = context.workbook.worksheets.add(name);
      ws.getRange("A1").formulas = [[dataFormula(ticker, label)]];
    }

    await context.sync();
  });
}

// ── generateDashboard ────────────────────────────────────────────────────────
// Creates/overwrites the "Dashboard" sheet.
// Mirrors the Sheets implementation:
//   Row 1    : Ticker label + value
//   Row 2-3  : KPI headers + values (Last Close, Last Date, Volume) from Daily Transactions sheet
//   Row 5+   : Dropdown (B5) to select dataset, table viewer below (A7)
//
// KPIs use INDIRECT to reference the Daily Transactions data sheet, same as Sheets.
// Table viewer uses INDIRECT to show whichever dataset is selected in the dropdown.
export async function generateDashboard(ticker: string): Promise<void> {
  ticker = ticker.trim().toUpperCase();

  // Ensure data sheets exist first
  await syncDataCaches(ticker);

  await Excel.run(async (context) => {
    await deleteIfExists(context, "Dashboard");

    const s = context.workbook.worksheets.add("Dashboard");
    s.activate();

    // ── Column widths ──────────────────────────────────────────────────────
    s.getRange("A:A").format.columnWidth = 160;
    s.getRange("B:B").format.columnWidth = 200;
    s.getRange("C:C").format.columnWidth = 160;

    // ── 1. Ticker (Row 1) ──────────────────────────────────────────────────
    const tickerLabel = s.getRange("A1");
    tickerLabel.values = [["Ticker"]];
    tickerLabel.format.font.bold = true;
    s.getRange("B1").values = [[ticker]];
    s.getRange("B1").numberFormat = [["@"]]; // force text — prevents serial date conversion

    // ── 2. KPI headers (Row 2) ────────────────────────────────────────────
    const kpiHeaders = s.getRange("A2:C2");
    kpiHeaders.values = [["Last Close (IDR)", "Last Date", "Volume"]];
    kpiHeaders.format.font.bold = true;

    // ── 3. KPI values (Row 3) — sourced from Daily Transactions sheet ─────
    // Use MATCH on the header row to find columns by name — robust to API column order changes.
    const dtSheet = sheetName(ticker, "Daily Transactions");
    const dtRef = (col: string) => `INDIRECT("'${dtSheet}'!${col}:${col}")`;
    const dt1 = `INDIRECT("'${dtSheet}'!1:1")`; // header row
    const lastRow = `COUNTA(${dtRef("A")})`;
    const dtRect = `INDIRECT("'${dtSheet}'!A:Z")`;
    const kpi = (header: string) =>
      `=IFERROR(INDEX(${dtRect},${lastRow},MATCH("${header}",${dt1},0)),"—")`;

    s.getRange("A3").formulas = [[kpi("close")]];
    s.getRange("A3").numberFormat = [["#,##0"]];

    s.getRange("B3").formulas = [[kpi("date")]];
    s.getRange("B3").numberFormat = [["@"]]; // keep as text — API returns "YYYY-MM-DD" strings

    s.getRange("C3").formulas = [[kpi("volume")]];
    s.getRange("C3").numberFormat = [["#,##0"]];

    // ── 4. Dataset selector (Row 5) + hyperlink index (Row 7+) ──────────────
    // Dropdown lets user pick a dataset; HYPERLINK() below navigates to that sheet.
    // Full re-spill on Dashboard causes #SPILL! (ranges overlap); data lives on
    // dedicated sheets instead, which spill freely with no conflicts.
    s.getRange("A5").values = [["Dataset"]];
    s.getRange("A5").format.font.bold = true;

    const dropdownCell = s.getRange("B5");
    dropdownCell.values = [[LABELS[0]]];
    dropdownCell.dataValidation.rule = {
      list: { inCellDropDown: true, source: LABELS.join(",") },
    };

    // HYPERLINK formula — navigates to A1 of the selected dataset sheet on click.
    // Sheet name is constructed from ticker + B5 value, matching our naming convention.
    s.getRange("A7").values = [["Open dataset →"]];
    s.getRange("A7").format.font.bold = true;
    s.getRange("B7").formulas = [[
      `=HYPERLINK("#'"&"${ticker} - "&B5&"'!A1","Go to "&B5)`,
    ]];
    s.getRange("B7").format.font.color = "#1155CC";

    await context.sync();
  });
}
