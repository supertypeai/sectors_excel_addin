const BASE_URL = "https://api.sectors.app/v2";

/* ────────── API KEY MANAGEMENT ────────── */
function getApiKey() {
  return Office.context.document.settings.get("SECTORS_API_KEY") || "";
}

/* ────────── FETCH UTILITY ────────── */
async function apiFetch(endpoint, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("No API key. Open the Sectors task pane and save your API key first.");
  }

  const url = new URL(BASE_URL + endpoint);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  });

  if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ────────── OUTPUT SANITIZER ────────── */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

function toExcelDateSerial(value) {
  const [y, m, d] = value.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d);
  const excelEpochUtc = Date.UTC(1899, 11, 30);
  return (utc - excelEpochUtc) / 86400000;
}

function coerceValueType(value, type) {
  if (value === undefined || value === null || value === "") return value;

  if (type === "number") {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (NUMBER_REGEX.test(trimmed)) {
        const parsed = Number(trimmed);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
    return value;
  }

  if (type === "date") {
    if (value instanceof Date) {
      return (value.getTime() - Date.UTC(1899, 11, 30)) / 86400000;
    }
    if (typeof value === "string" && ISO_DATE_REGEX.test(value)) {
      return toExcelDateSerial(value);
    }
    return value;
  }

  return value;
}

function applyColumnTypes(rows, columnTypeMap, startRow = 1) {
  const entries = Object.entries(columnTypeMap).map(([k, t]) => [Number(k), t]);
  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length === 0) continue;
    for (const [columnIndex, type] of entries) {
      if (columnIndex >= 0 && columnIndex < row.length) {
        row[columnIndex] = coerceValueType(row[columnIndex], type);
      }
    }
  }
  return rows;
}

function applyKeyValueTypes(rows, keyTypeMap) {
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 2) continue;
    const type = keyTypeMap[row[0]];
    if (type) {
      row[1] = coerceValueType(row[1], type);
    }
  }
  return rows;
}

/**
 * Normalise a 2-D array so every row has the same number of columns while
 * preserving native scalar types for Excel (number/boolean/date serial/string).
 * Removes zero-length "separator" rows.
 * Excel custom functions REQUIRE rectangular output — ragged rows can cause
 * #VALUE!.
 */
function sanitize(rows) {
  function sanitizeCell(v) {
    if (v === undefined || v === null) return "";
    if (typeof v === "number" || typeof v === "boolean") return v;
    const coercedDate = coerceValueType(v, "date");
    if (coercedDate !== v) return coercedDate;
    return String(v);
  }

  // 1. Drop completely empty separator rows
  const filtered = rows.filter((r) => r.length > 0);
  // 2. Find the widest row
  const cols = filtered.reduce((max, r) => Math.max(max, r.length), 0);
  // 3. Pad + sanitize every cell
  return filtered.map((r) => {
    const row = [];
    for (let i = 0; i < cols; i++) {
      row.push(sanitizeCell(r[i]));
    }
    return row;
  });
}

/* ────────── SCREENING FUNCTIONS ────────── */
/**
 * Screen IDX companies using SQL-like filters.
 * @customfunction
 * @param {string} where SQL-like filter (e.g. "sub_sector = 'banks' and pe_ttm < 15").
 * @param {string} [orderBy] Sort field with optional "-" prefix for desc (e.g. "-market_cap").
 * @param {number} [limit] Max results (default 50, max 200).
 * @returns {string[][]} Filtered company list.
 */
async function SCREEN(where, orderBy, limit) {
  try {
    const data = await apiFetch("/companies/", { where, order_by: orderBy, limit });
    return sanitize([
      ["Symbol", "Company Name"],
      ...data.results.map((c) => [c.symbol, c.company_name]),
    ]);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Screen IDX companies using natural language.
 * @customfunction
 * @param {string} query Plain English query (e.g. "top 10 banks by market cap").
 * @returns {string[][]} Matching companies.
 */
async function SCREEN_NL(query) {
  try {
    const data = await apiFetch("/companies/", { q: query });
    return sanitize([
      ["Symbol", "Company Name"],
      ...data.results.map((c) => [c.symbol, c.company_name]),
    ]);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get free float percentage for companies.
 * @customfunction
 * @param {string} [subSector] Filter by subsector (e.g. "banks").
 * @returns {string[][]} Companies with free float percentages.
 */
async function FREE_FLOAT(subSector) {
  try {
    const params = {};
    if (subSector) params.sub_sector = subSector;
    const data = await apiFetch("/free-float/", params);
    const rows = [
      ["Symbol", "Company Name", "Free Float %"],
      ...data.map((c) => [c.symbol, c.company_name, c.free_float]),
    ];
    applyColumnTypes(rows, { 2: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/* ────────── COMPANY REPORT FUNCTIONS ────────── */
/**
 * Get company overview: market cap, sector, ESG, price, listing info.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Key-value overview data.
 */
async function COMPANY_OVERVIEW(ticker) {
  try {
    const d = await apiFetch(`/company/report/${ticker}/`, { sections: "overview" });
    const o = d.overview;
    const rows = [
      ["Company Name", d.company_name],
      ["Sector", o.sector],
      ["Sub Sector", o.sub_sector],
      ["Industry", o.industry],
      ["Market Cap", o.market_cap],
      ["Market Cap Rank", o.market_cap_rank],
      ["Last Close Price", o.last_close_price],
      ["Daily Change", o.daily_close_change],
      ["Listing Date", o.listing_date],
      ["Employee Count", o.employee_num],
      ["ESG Score", o.esg_score],
      ["Website", o.website],
    ];
    applyKeyValueTypes(rows, {
      "Market Cap": "number",
      "Market Cap Rank": "number",
      "Last Close Price": "number",
      "Daily Change": "number",
      "Listing Date": "date",
      "Employee Count": "number",
      "ESG Score": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get company valuation: PE, PB, PS, PCF ratios over time.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Valuation metrics table.
 */
async function COMPANY_VALUATION(ticker) {
  try {
    const d = await apiFetch(`/company/report/${ticker}/`, { sections: "valuation" });
    const v = d.valuation;
    const rows = [
      ["Last Close Price", v.last_close_price],
      ["Forward PE", v.forward_pe],
      ["Intrinsic Value", v.intrinsic_value],
      [],
      ["Year", "PE", "PB", "PS", "PCF", "PEG", "EV/EBITDA", "EV/Revenue"],
    ];
    (v.historical_valuation || []).forEach((h) => {
      rows.push([
        h.year,
        h.pe,
        h.pb,
        h.ps,
        h.pcf,
        h.peg,
        h.enterprise_to_ebitda,
        h.enterprise_to_revenue,
      ]);
    });
    applyKeyValueTypes(rows, {
      "Last Close Price": "number",
      "Forward PE": "number",
      "Intrinsic Value": "number",
    });
    applyColumnTypes(rows, {
      0: "number",
      1: "number",
      2: "number",
      3: "number",
      4: "number",
      5: "number",
      6: "number",
      7: "number",
    }, 5);
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get company financials: income stmt, balance sheet, ratios by year.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Historical financial data table.
 */
async function COMPANY_FINANCIALS(ticker) {
  try {
    const d = await apiFetch(`/company/report/${ticker}/`, { sections: "financials" });
    const f = d.financials;
    const rows = [
      ["EPS", f.eps],
      ["YoY Qtr Earnings Growth", f.yoy_quarter_earnings_growth],
      ["YoY Qtr Revenue Growth", f.yoy_quarter_revenue_growth],
      [],
      [
        "Year",
        "Revenue",
        "Earnings",
        "EBITDA",
        "EBIT",
        "Total Assets",
        "Total Equity",
        "Total Debt",
        "Free Cash Flow",
        "Operating Cash Flow",
      ],
    ];
    (f.historical_financials || []).forEach((h) => {
      rows.push([
        h.year,
        h.revenue,
        h.earnings,
        h.ebitda,
        h.ebit,
        h.total_assets,
        h.total_equity,
        h.total_debt,
        h.free_cash_flow,
        h.operating_cash_flow,
      ]);
    });
    applyKeyValueTypes(rows, {
      EPS: "number",
      "YoY Qtr Earnings Growth": "number",
      "YoY Qtr Revenue Growth": "number",
    });
    applyColumnTypes(rows, {
      0: "number",
      1: "number",
      2: "number",
      3: "number",
      4: "number",
      5: "number",
      6: "number",
      7: "number",
      8: "number",
      9: "number",
    }, 5);
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get company dividend history, yield, and payout ratio.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Dividend metrics and history.
 */
async function COMPANY_DIVIDEND(ticker) {
  try {
    const d = await apiFetch(`/company/report/${ticker}/`, { sections: "dividend" });
    const div = d.dividend;
    const rows = [
      ["Yield TTM", div.yield_ttm],
      ["Dividend TTM", div.dividend_ttm],
      ["Payout Ratio", div.payout_ratio],
      ["Cash Payout Ratio", div.cash_payout_ratio],
      ["Last Ex-Dividend Date", div.last_ex_dividend_date],
      [],
      ["Year", "Total Dividend", "Total Yield"],
    ];
    for (const [year, info] of Object.entries(div.historical_dividends || {})) {
      rows.push([year, info.total_dividend, info.total_yield]);
    }
    applyKeyValueTypes(rows, {
      "Yield TTM": "number",
      "Dividend TTM": "number",
      "Payout Ratio": "number",
      "Cash Payout Ratio": "number",
      "Last Ex-Dividend Date": "date",
    });
    applyColumnTypes(rows, { 0: "number", 1: "number", 2: "number" }, 7);
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get company major shareholders and institutional transaction flow.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Ownership breakdown table.
 */
async function COMPANY_OWNERSHIP(ticker) {
  try {
    const d = await apiFetch(`/company/report/${ticker}/`, { sections: "ownership" });
    const o = d.ownership;
    const rows = [["Shareholder", "Share %", "Share Amount", "Share Value"]];
    (o.major_shareholders || []).forEach((s) =>
      rows.push([s.name, s.share_percentage, s.share_amount, s.share_value])
    );
    applyColumnTypes(rows, { 1: "number", 2: "number", 3: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/* ────────── SUBSECTOR REPORT FUNCTIONS ────────── */
/**
 * Get subsector statistics: company count, PE distribution.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Subsector statistics.
 */
async function SUBSECTOR_STATISTICS(subSector) {
  try {
    const d = await apiFetch(`/subsector/report/${subSector}/`, { sections: "statistics" });
    const s = d.statistics;
    const rows = [
      ["Total Companies", s.total_companies],
      ["Filtered Median PE", s.filtered_median_pe],
      ["Filtered Weighted Avg PE", s.filtered_weighted_avg_pe],
      ["Min Company PE", s.min_company_pe],
      ["Max Company PE", s.max_company_pe],
    ];
    applyKeyValueTypes(rows, {
      "Total Companies": "number",
      "Filtered Median PE": "number",
      "Filtered Weighted Avg PE": "number",
      "Min Company PE": "number",
      "Max Company PE": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get subsector market cap data and performance.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Market cap metrics and changes.
 */
async function SUBSECTOR_MARKET_CAP(subSector) {
  try {
    const d = await apiFetch(`/subsector/report/${subSector}/`, { sections: "market_cap" });
    const m = d.market_cap;
    const rows = [
      ["Total Market Cap", m.total_market_cap],
      ["Avg Market Cap", m.avg_market_cap],
      ["1W Change", m.mcap_summary?.mcap_change?.["1w"]],
      ["1Y Change", m.mcap_summary?.mcap_change?.["1y"]],
      ["YTD Change", m.mcap_summary?.mcap_change?.ytd],
    ];
    applyKeyValueTypes(rows, {
      "Total Market Cap": "number",
      "Avg Market Cap": "number",
      "1W Change": "number",
      "1Y Change": "number",
      "YTD Change": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get subsector valuation: historical PE/PB/PS/PCF with percentile rank.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Valuation table by year.
 */
async function SUBSECTOR_VALUATION(subSector) {
  try {
    const d = await apiFetch(`/subsector/report/${subSector}/`, { sections: "valuation" });
    const rows = [["Year", "PE", "PB", "PS", "PCF"]];
    for (const [year, v] of Object.entries(d.valuation?.historical_valuation || {})) {
      rows.push([year, v.pe, v.pb, v.ps, v.pcf]);
    }
    applyColumnTypes(rows, { 0: "number", 1: "number", 2: "number", 3: "number", 4: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get subsector growth metrics and forecasts.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Growth data by year.
 */
async function SUBSECTOR_GROWTH(subSector) {
  try {
    const d = await apiFetch(`/subsector/report/${subSector}/`, { sections: "growth" });
    const rows = [["Year", "Avg Earnings Growth", "Avg Revenue Growth"]];
    for (const [year, g] of Object.entries(d.growth?.weighted_avg_growth_data || {})) {
      rows.push([year, g.avg_annual_earning_growth, g.avg_annual_revenue_growth]);
    }
    applyColumnTypes(rows, { 0: "number", 1: "number", 2: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/* ────────── QUARTERLY FINANCIALS & SEGMENTS ────────── */
/**
 * Get quarterly financial statements for a company.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {number} [nQuarters] Number of recent quarters to retrieve.
 * @param {string} [reportDate] Specific report date (YYYY-MM-DD).
 * @returns {string[][]} Quarterly financial data.
 */
async function QUARTERLY_FINANCIALS(ticker, nQuarters, reportDate) {
  try {
    const params = {};
    if (nQuarters) params.n_quarters = nQuarters;
    if (reportDate) params.report_date = reportDate;
    const data = await apiFetch(`/financials/quarterly/${ticker}/`, params);
    const rows = [
      ["Date", "Revenue", "Earnings", "Total Assets", "Total Equity", "Total Liabilities", "Operating Cash Flow"],
    ];
    data.forEach((q) =>
      rows.push([
        q.date,
        q.revenue,
        q.earnings,
        q.total_assets,
        q.total_equity,
        q.total_liabilities,
        q.operating_cash_flow,
      ])
    );
    applyColumnTypes(rows, {
      0: "date",
      1: "number",
      2: "number",
      3: "number",
      4: "number",
      5: "number",
      6: "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get revenue/cost breakdown by business segment.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "ASII").
 * @param {number} [financialYear] Year (defaults to latest).
 * @returns {string[][]} Revenue segment breakdown.
 */
async function COMPANY_SEGMENTS(ticker, financialYear) {
  try {
    const params = {};
    if (financialYear) params.financial_year = financialYear;
    const data = await apiFetch(`/company/get-segments/${ticker}/`, params);
    const rows = [["Source", "Target", "Value (IDR)"]];
    (data.revenue_breakdown || []).forEach((r) => rows.push([r.source, r.target, r.value]));
    applyColumnTypes(rows, { 2: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get daily close price, volume, and market cap for a ticker.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Daily price/volume data.
 */
async function DAILY_PRICE(ticker, start, end) {
  try {
    const data = await apiFetch(`/daily/${ticker}/`, { start, end });
    const rows = [["Date", "Close", "Volume", "Market Cap"]];
    data.forEach((d) => rows.push([d.date, d.close, d.volume, d.market_cap]));
    applyColumnTypes(rows, { 0: "date", 1: "number", 2: "number", 3: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get IDX total market capitalization over time.
 * @customfunction
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} IDX total market cap by date.
 */
async function IDX_MARKET_CAP(start, end) {
  try {
    const data = await apiFetch("/idx-total/", { start, end });
    const rows = [["Date", "IDX Total Market Cap"]];
    data.forEach((d) => rows.push([d.date, d.idx_total_market_cap]));
    applyColumnTypes(rows, { 0: "date", 1: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get daily closing prices for a stock index.
 * @customfunction
 * @param {string} indexCode Index code (e.g. "ihsg", "lq45", "idx30").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Index daily price data.
 */
async function INDEX_DAILY(indexCode, start, end) {
  try {
    const data = await apiFetch(`/index-daily/${indexCode}/`, { start, end });
    const rows = [["Date", "Index", "Price"]];
    data.forEach((d) => rows.push([d.date, d.index_code, d.price]));
    applyColumnTypes(rows, { 0: "date", 2: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get most traded stocks by volume in a date range.
 * @customfunction
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {number} [nStock] Number of stocks (default 5, max 10).
 * @returns {string[][]} Most traded stocks per date.
 */
async function MOST_TRADED(start, end, nStock) {
  try {
    const data = await apiFetch("/most-traded/", { start, end, n_stock: nStock });
    const rows = [["Date", "Symbol", "Company", "Volume", "Price"]];
    for (const [date, stocks] of Object.entries(data)) {
      stocks.forEach((s) => rows.push([date, s.symbol, s.company_name, s.volume, s.price]));
    }
    applyColumnTypes(rows, { 0: "date", 3: "number", 4: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get top stock price movers (gainers and losers).
 * @customfunction
 * @param {string} [classifications] "top_gainers", "top_losers", or both.
 * @param {string} [periods] "1d", "7d", "14d", "30d", "365d".
 * @param {number} [nStock] Number of stocks (default 5, max 10).
 * @returns {string[][]} Top movers table.
 */
async function TOP_MOVERS(classifications, periods, nStock) {
  try {
    const data = await apiFetch("/companies/top-changes/", {
      classifications,
      periods,
      n_stock: nStock,
    });
    const rows = [["Type", "Period", "Symbol", "Name", "Price Change", "Last Price"]];
    for (const [cls, periodData] of Object.entries(data)) {
      for (const [period, stocks] of Object.entries(periodData)) {
        stocks.forEach((s) =>
          rows.push([cls, period, s.symbol, s.name, s.price_change, s.last_close_price])
        );
      }
    }
    applyColumnTypes(rows, { 4: "number", 5: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get stock price performance since IPO listing.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "GOTO").
 * @returns {string[][]} Price change since listing by period.
 */
async function IPO_PERFORMANCE(ticker) {
  try {
    const d = await apiFetch(`/listing-performance/${ticker}/`);
    const rows = [
      ["Period", "Change"],
      ["7 Days", d.chg_7d],
      ["30 Days", d.chg_30d],
      ["90 Days", d.chg_90d],
      ["365 Days", d.chg_365d],
    ];
    applyColumnTypes(rows, { 1: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/* ────────── MALAYSIA (KLSE) FUNCTIONS ────────── */
/**
 * Get available KLSE sectors.
 * @customfunction
 * @returns {string[][]} List of KLSE sectors.
 */
async function KLSE_SECTORS() {
  try {
    const data = await apiFetch("/klse/sectors/");
    return sanitize([["Sector"], ...data.map((s) => [s])]);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get KLSE companies in a sector.
 * @customfunction
 * @param {string} sector KLSE sector slug (e.g. "financials").
 * @returns {string[][]} Companies list.
 */
async function KLSE_COMPANIES(sector) {
  try {
    const data = await apiFetch("/klse/companies/", { sector });
    return sanitize([
      ["Symbol", "Company Name"],
      ...data.map((c) => [c.symbol, c.company_name]),
    ]);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get top KLSE companies by a classification metric.
 * @customfunction
 * @param {string} [classifications] "dividend_yield","revenue","earnings","market_cap","pe".
 * @param {string} [sector] KLSE sector slug.
 * @returns {string[][]} Top KLSE companies.
 */
async function KLSE_TOP_COMPANIES(classifications, sector) {
  try {
    const data = await apiFetch("/klse/companies/top/", { classifications, sector });
    const rows = [["Classification", "Symbol", "Company", "Value"]];
    for (const [cls, stocks] of Object.entries(data)) {
      stocks.forEach((s) => {
        const val = s[cls] ?? s.forward_dividend_yield ?? "";
        rows.push([cls, s.symbol, s.company_name, val]);
      });
    }
    applyColumnTypes(rows, { 3: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get KLSE company overview: market cap, sector, price changes.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Overview data.
 */
async function KLSE_OVERVIEW(ticker) {
  try {
    const d = await apiFetch(`/klse/company/report/${ticker}/`);
    const o = d.overview;
    const rows = [
      ["Name", d.name],
      ["Market Cap", o.market_cap],
      ["Sector", o.sector],
      ["Sub Sector", o.sub_sector],
      ["Volume", o.volume],
      ["1D Change", o.change_1d],
      ["7D Change", o.change_7d],
    ];
    applyKeyValueTypes(rows, {
      "Market Cap": "number",
      Volume: "number",
      "1D Change": "number",
      "7D Change": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get KLSE company valuation ratios.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Valuation metrics.
 */
async function KLSE_VALUATION(ticker) {
  try {
    const d = await apiFetch(`/klse/company/report/${ticker}/`);
    const v = d.valuation;
    const rows = [
      ["PE", v.pe],
      ["PE TTM", v.pe_ttm],
      ["PB", v.pb],
      ["PS TTM", v.ps_ttm],
      ["PCF", v.pcf],
      ["PCF TTM", v.pcf_ttm],
    ];
    applyKeyValueTypes(rows, {
      PE: "number",
      "PE TTM": "number",
      PB: "number",
      "PS TTM": "number",
      PCF: "number",
      "PCF TTM": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get KLSE company financial data: earnings, revenue, ratios.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Financial data.
 */
async function KLSE_FINANCIALS(ticker) {
  try {
    const d = await apiFetch(`/klse/company/report/${ticker}/`);
    const f = d.financials;
    const rows = [
      ["EPS", f.eps],
      ["Operating Margin", f.operating_margin],
      ["Net Profit Margin", f.net_profit_margin],
      ["Current Ratio", f.current_ratio],
      ["Debt to Equity", f.debt_to_equity],
      [],
      ["Period", "Revenue", "Earnings"],
    ];
    (f.historical_revenue || []).forEach((r, i) => {
      const e = (f.historical_earnings || [])[i];
      rows.push([r.period, r.revenue, e?.earnings]);
    });
    applyKeyValueTypes(rows, {
      EPS: "number",
      "Operating Margin": "number",
      "Net Profit Margin": "number",
      "Current Ratio": "number",
      "Debt to Equity": "number",
    });
    applyColumnTypes(rows, { 1: "number", 2: "number" }, 7);
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get KLSE company dividend data.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Dividend metrics.
 */
async function KLSE_DIVIDEND(ticker) {
  try {
    const d = await apiFetch(`/klse/company/report/${ticker}/`);
    const div = d.dividend;
    const rows = [
      ["5Y Avg Yield", div.dividend_yield_5y_avg],
      ["Growth Rate", div.dividend_growth_rate],
      ["Payout Ratio", div.payout_ratio],
      ["Forward Dividend", div.forward_dividend],
      ["Forward Div Yield", div.forward_dividend_yield],
      ["Dividend TTM", div.dividend_ttm],
    ];
    applyKeyValueTypes(rows, {
      "5Y Avg Yield": "number",
      "Growth Rate": "number",
      "Payout Ratio": "number",
      "Forward Dividend": "number",
      "Forward Div Yield": "number",
      "Dividend TTM": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/* ────────── SINGAPORE (SGX) FUNCTIONS ────────── */
/**
 * Get available SGX sectors.
 * @customfunction
 * @returns {string[][]} List of SGX sectors.
 */
async function SGX_SECTORS() {
  try {
    const data = await apiFetch("/sgx/sectors/");
    return sanitize([["Sector"], ...data.map((s) => [s])]);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get SGX companies in a sector.
 * @customfunction
 * @param {string} sector SGX sector slug (e.g. "financial-services").
 * @returns {string[][]} Companies list.
 */
async function SGX_COMPANIES(sector) {
  try {
    const data = await apiFetch("/sgx/companies/", { sector });
    return sanitize([
      ["Symbol", "Company Name"],
      ...data.map((c) => [c.symbol, c.company_name]),
    ]);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get top SGX companies by a classification metric.
 * @customfunction
 * @param {string} [classifications] "dividend_yield","revenue","earnings","market_cap","pe".
 * @param {string} [sector] SGX sector slug.
 * @returns {string[][]} Top SGX companies.
 */
async function SGX_TOP_COMPANIES(classifications, sector) {
  try {
    const data = await apiFetch("/sgx/companies/top/", { classifications, sector });
    const rows = [["Classification", "Symbol", "Company", "Value"]];
    for (const [cls, stocks] of Object.entries(data)) {
      stocks.forEach((s) => {
        const val = s[cls] ?? s.forward_dividend_yield ?? "";
        rows.push([cls, s.symbol, s.company_name, val]);
      });
    }
    applyColumnTypes(rows, { 3: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get SGX company overview: market cap, sector, multi-period price changes.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Overview data.
 */
async function SGX_OVERVIEW(ticker) {
  try {
    const d = await apiFetch(`/sgx/company/report/${ticker}/`);
    const o = d.overview;
    const rows = [
      ["Name", d.name],
      ["Market Cap", o.market_cap],
      ["Sector", o.sector],
      ["Sub Sector", o.sub_sector],
      ["Volume", o.volume],
      ["1D Change", o.change_1d],
      ["7D Change", o.change_7d],
      ["1M Change", o.change_1m],
      ["1Y Change", o.change_1y],
      ["YTD Change", o.change_ytd],
    ];
    applyKeyValueTypes(rows, {
      "Market Cap": "number",
      Volume: "number",
      "1D Change": "number",
      "7D Change": "number",
      "1M Change": "number",
      "1Y Change": "number",
      "YTD Change": "number",
    });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get SGX company valuation ratios.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Valuation metrics.
 */
async function SGX_VALUATION(ticker) {
  try {
    const d = await apiFetch(`/sgx/company/report/${ticker}/`);
    const v = d.valuation;
    const rows = [["PE", v.pe], ["PB", v.pb], ["PS", v.ps], ["PCF", v.pcf]];
    applyKeyValueTypes(rows, { PE: "number", PB: "number", PS: "number", PCF: "number" });
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get SGX company financial data with income stmt and balance sheet.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Financial data table.
 */
async function SGX_FINANCIALS(ticker) {
  try {
    const d = await apiFetch(`/sgx/company/report/${ticker}/`);
    const f = d.financials;
    const rows = [
      ["EPS", f.eps],
      ["Operating Margin", f.operating_margin],
      ["Net Profit Margin", f.net_profit_margin],
      [],
      ["Year", "Revenue", "Earnings"],
    ];
    for (const [year, data] of Object.entries(f.historical_financials || {})) {
      rows.push([year, data.revenue, data.earnings]);
    }
    applyKeyValueTypes(rows, {
      EPS: "number",
      "Operating Margin": "number",
      "Net Profit Margin": "number",
    });
    applyColumnTypes(rows, { 0: "number", 1: "number", 2: "number" }, 5);
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/**
 * Get SGX company dividend data with full history.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Dividend metrics and yearly history.
 */
async function SGX_DIVIDEND(ticker) {
  try {
    const d = await apiFetch(`/sgx/company/report/${ticker}/`);
    const div = d.dividend;
    const rows = [
      ["5Y Avg Yield", div.dividend_yield_5y_avg],
      ["Growth Rate", div.dividend_growth_rate],
      ["Payout Ratio", div.payout_ratio],
      ["Forward Dividend", div.forward_dividend],
      ["Dividend TTM", div.dividend_ttm],
      [],
      ["Year", "Total Dividend", "Total Yield"],
    ];
    for (const [year, info] of Object.entries(div.historical_dividends || {})) {
      rows.push([year, info.total_dividend, info.total_yield]);
    }
    applyKeyValueTypes(rows, {
      "5Y Avg Yield": "number",
      "Growth Rate": "number",
      "Payout Ratio": "number",
      "Forward Dividend": "number",
      "Dividend TTM": "number",
    });
    applyColumnTypes(rows, { 0: "number", 1: "number", 2: "number" }, 7);
    return sanitize(rows);
  } catch (error) {
    return [["Error", error.message]];
  }
}

/* ────────── FUNCTION REGISTRATION ────────── */
CustomFunctions.associate("SCREEN", SCREEN);
CustomFunctions.associate("SCREEN_NL", SCREEN_NL);
CustomFunctions.associate("FREE_FLOAT", FREE_FLOAT);
CustomFunctions.associate("COMPANY_OVERVIEW", COMPANY_OVERVIEW);
CustomFunctions.associate("COMPANY_VALUATION", COMPANY_VALUATION);
CustomFunctions.associate("COMPANY_FINANCIALS", COMPANY_FINANCIALS);
CustomFunctions.associate("COMPANY_DIVIDEND", COMPANY_DIVIDEND);
CustomFunctions.associate("COMPANY_OWNERSHIP", COMPANY_OWNERSHIP);
CustomFunctions.associate("SUBSECTOR_STATISTICS", SUBSECTOR_STATISTICS);
CustomFunctions.associate("SUBSECTOR_MARKET_CAP", SUBSECTOR_MARKET_CAP);
CustomFunctions.associate("SUBSECTOR_VALUATION", SUBSECTOR_VALUATION);
CustomFunctions.associate("SUBSECTOR_GROWTH", SUBSECTOR_GROWTH);
CustomFunctions.associate("QUARTERLY_FINANCIALS", QUARTERLY_FINANCIALS);
CustomFunctions.associate("COMPANY_SEGMENTS", COMPANY_SEGMENTS);
CustomFunctions.associate("DAILY_PRICE", DAILY_PRICE);
CustomFunctions.associate("IDX_MARKET_CAP", IDX_MARKET_CAP);
CustomFunctions.associate("INDEX_DAILY", INDEX_DAILY);
CustomFunctions.associate("MOST_TRADED", MOST_TRADED);
CustomFunctions.associate("TOP_MOVERS", TOP_MOVERS);
CustomFunctions.associate("IPO_PERFORMANCE", IPO_PERFORMANCE);
CustomFunctions.associate("KLSE_SECTORS", KLSE_SECTORS);
CustomFunctions.associate("KLSE_COMPANIES", KLSE_COMPANIES);
CustomFunctions.associate("KLSE_TOP_COMPANIES", KLSE_TOP_COMPANIES);
CustomFunctions.associate("KLSE_OVERVIEW", KLSE_OVERVIEW);
CustomFunctions.associate("KLSE_VALUATION", KLSE_VALUATION);
CustomFunctions.associate("KLSE_FINANCIALS", KLSE_FINANCIALS);
CustomFunctions.associate("KLSE_DIVIDEND", KLSE_DIVIDEND);
CustomFunctions.associate("SGX_SECTORS", SGX_SECTORS);
CustomFunctions.associate("SGX_COMPANIES", SGX_COMPANIES);
CustomFunctions.associate("SGX_TOP_COMPANIES", SGX_TOP_COMPANIES);
CustomFunctions.associate("SGX_OVERVIEW", SGX_OVERVIEW);
CustomFunctions.associate("SGX_VALUATION", SGX_VALUATION);
CustomFunctions.associate("SGX_FINANCIALS", SGX_FINANCIALS);
CustomFunctions.associate("SGX_DIVIDEND", SGX_DIVIDEND);