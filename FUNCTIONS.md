# Sectors Financial — Excel Add-in Function Implementation Guide

This guide documents the custom functions currently implemented in Sectors Excel Add In functions, using Sectors API v2 endpoints.

## Part 1: Custom Function Catalog

Namespace prefix: `SECTORS.`

Example:

```excel
=SECTORS.COMPANY_OVERVIEW("BBCA")
```

### Design Principles

- Returns tabular output suitable for Excel spill ranges
- Focuses on analyst workflows: screening, valuation, financial modeling, and market monitoring
- Handles API failures gracefully by returning `[["Error", "..."]]`

### Runtime Behavior and Error Cases

- API key is required. If missing, functions return `[["Error", "No API key. Open the Sectors task pane and save your API key first."]]`.
- API rate limit (`HTTP 429`) is surfaced as `[["Error", "Rate limit exceeded. Please wait."]]`.
- All functions return 2D string arrays after sanitization (rows are normalized for Excel spill compatibility).

### API Base URL Used in Current Code

- Current implementation uses the direct API base URL:
  - `https://api.sectors.app/v2`

### Parameter Conventions

- Dates: `YYYY-MM-DD`
- Omitted optional parameter: leave blank in Excel, for example `=SECTORS.QUARTERLY_FINANCIALS("BBCA",, "2024-12-31")`
- `ticker` values are market-specific:
  - IDX examples: `BBCA`, `GOTO`
  - KLSE examples: `1155`
  - SGX examples: `D05`

---

### 1. API Key Management

| # | Excel Function | Purpose |
|---|---|---|
| 1 | Task Pane (Sectors API) | Save API key in workbook settings |

How to use:

1. Open the Sectors task pane.
2. Enter API key.
3. Click Save Key.

---

### 2. Companies Screener (IDX)

| # | Excel Function | Endpoint | Key Parameters | Real Usage |
|---|---|---|---|---|
| 2 | `SECTORS.SCREEN` | `GET /v2/companies/` | `where`, `order_by`, `limit` | SQL-like filtering on financial metrics |
| 3 | `SECTORS.SCREEN_NL` | `GET /v2/companies/` | `q` | Natural-language stock screening |
| 4 | `SECTORS.FREE_FLOAT` | `GET /v2/free-float/` | `[sub_sector]` | Liquidity and ownership-quality analysis |

Examples:

```excel
=SECTORS.SCREEN("sub_sector = 'banks' and pe_ttm < 15", "-market_cap", 10)
=SECTORS.SCREEN_NL("top 5 companies by dividend yield in financials sector")
=SECTORS.FREE_FLOAT("banks")
```

---

### 3. Company Report by Section (IDX)

Endpoint pattern: `GET /v2/company/report/{ticker}/?sections=<section>`

| # | Excel Function | Section | Real Usage |
|---|---|---|---|
| 5 | `SECTORS.COMPANY_OVERVIEW` | `overview` | Snapshot of sector, listing, price, ESG |
| 6 | `SECTORS.COMPANY_VALUATION` | `valuation` | Historical valuation metrics |
| 7 | `SECTORS.COMPANY_FINANCIALS` | `financials` | Core statement and cash flow history |
| 8 | `SECTORS.COMPANY_DIVIDEND` | `dividend` | Yield and payout analysis |
| 9 | `SECTORS.COMPANY_OWNERSHIP` | `ownership` | Major shareholders and stake composition |

Examples:

```excel
=SECTORS.COMPANY_OVERVIEW("BBCA")
=SECTORS.COMPANY_VALUATION("BBCA")
=SECTORS.COMPANY_FINANCIALS("BBCA")
=SECTORS.COMPANY_DIVIDEND("BBCA")
=SECTORS.COMPANY_OWNERSHIP("BBCA")
```

---

### 4. Subsector Report by Section (IDX)

Endpoint pattern: `GET /v2/subsector/report/{sub_sector}/?sections=<section>`

| # | Excel Function | Section | Real Usage |
|---|---|---|---|
| 10 | `SECTORS.SUBSECTOR_STATISTICS` | `statistics` | Subsector valuation distribution |
| 11 | `SECTORS.SUBSECTOR_MARKET_CAP` | `market_cap` | Size and performance trend |
| 12 | `SECTORS.SUBSECTOR_VALUATION` | `valuation` | Historical PE/PB/PS/PCF view |
| 13 | `SECTORS.SUBSECTOR_GROWTH` | `growth` | Weighted earnings/revenue growth history |

Examples:

```excel
=SECTORS.SUBSECTOR_STATISTICS("banks")
=SECTORS.SUBSECTOR_MARKET_CAP("banks")
=SECTORS.SUBSECTOR_VALUATION("banks")
=SECTORS.SUBSECTOR_GROWTH("banks")
```

---

### 5. Quarterly Financials and Segments

| # | Excel Function | Endpoint | Real Usage |
|---|---|---|---|
| 14 | `SECTORS.QUARTERLY_FINANCIALS` | `GET /v2/financials/quarterly/{ticker}/` | Quarterly modeling and trend analysis |
| 15 | `SECTORS.COMPANY_SEGMENTS` | `GET /v2/company/get-segments/{ticker}/` | Revenue structure by business line |

Examples:

```excel
=SECTORS.QUARTERLY_FINANCIALS("BBCA", 4)
=SECTORS.QUARTERLY_FINANCIALS("BBCA",, "2024-12-31")
=SECTORS.COMPANY_SEGMENTS("ASII", 2024)
```

---

### 6. Price and Market Data

| # | Excel Function | Endpoint | Real Usage |
|---|---|---|---|
| 16 | `SECTORS.DAILY_PRICE` | `GET /v2/daily/{ticker}/` | Stock charting and volume analysis |
| 17 | `SECTORS.IDX_MARKET_CAP` | `GET /v2/idx-total/` | Macro IDX trend tracking |
| 18 | `SECTORS.INDEX_DAILY` | `GET /v2/index-daily/{index_code}/` | Benchmark index performance |

Examples:

```excel
=SECTORS.DAILY_PRICE("BBCA", "2025-01-01", "2025-03-01")
=SECTORS.IDX_MARKET_CAP("2025-01-01", "2025-03-01")
=SECTORS.INDEX_DAILY("ihsg", "2025-01-01", "2025-03-01")
```

---

### 7. Rankings and IPO

| # | Excel Function | Endpoint | Real Usage |
|---|---|---|---|
| 19 | `SECTORS.MOST_TRADED` | `GET /v2/most-traded/` | Liquidity and activity watchlist |
| 20 | `SECTORS.TOP_MOVERS` | `GET /v2/companies/top-changes/` | Gainers/losers by time period |
| 21 | `SECTORS.IPO_PERFORMANCE` | `GET /v2/listing-performance/{ticker}/` | Post-listing performance checks |

Examples:

```excel
=SECTORS.MOST_TRADED("2025-01-01", "2025-01-31", 5)
=SECTORS.TOP_MOVERS("top_gainers", "7d", 5)
=SECTORS.IPO_PERFORMANCE("GOTO")
```

---

### 8. Malaysia (KLSE)

| # | Excel Function | Endpoint | Real Usage |
|---|---|---|---|
| 22 | `SECTORS.KLSE_SECTORS` | `GET /v2/klse/sectors/` | Sector discovery |
| 23 | `SECTORS.KLSE_COMPANIES` | `GET /v2/klse/companies/` | Company list by sector |
| 24 | `SECTORS.KLSE_TOP_COMPANIES` | `GET /v2/klse/companies/top/` | Ranking by valuation/dividend/size |
| 25 | `SECTORS.KLSE_OVERVIEW` | `GET /v2/klse/company/report/{ticker}/` | Snapshot metrics |
| 26 | `SECTORS.KLSE_VALUATION` | `GET /v2/klse/company/report/{ticker}/` | Valuation ratios |
| 27 | `SECTORS.KLSE_FINANCIALS` | `GET /v2/klse/company/report/{ticker}/` | Financial history and ratios |
| 28 | `SECTORS.KLSE_DIVIDEND` | `GET /v2/klse/company/report/{ticker}/` | Dividend metrics |

Examples:

```excel
=SECTORS.KLSE_SECTORS()
=SECTORS.KLSE_COMPANIES("financials")
=SECTORS.KLSE_TOP_COMPANIES("market_cap", "financials")
=SECTORS.KLSE_OVERVIEW("1155")
=SECTORS.KLSE_VALUATION("1155")
=SECTORS.KLSE_FINANCIALS("1155")
=SECTORS.KLSE_DIVIDEND("1155")
```

---

### 9. Singapore (SGX)

| # | Excel Function | Endpoint | Real Usage |
|---|---|---|---|
| 29 | `SECTORS.SGX_SECTORS` | `GET /v2/sgx/sectors/` | Sector discovery |
| 30 | `SECTORS.SGX_COMPANIES` | `GET /v2/sgx/companies/` | Company list by sector |
| 31 | `SECTORS.SGX_TOP_COMPANIES` | `GET /v2/sgx/companies/top/` | Ranking by valuation/dividend/size |
| 32 | `SECTORS.SGX_OVERVIEW` | `GET /v2/sgx/company/report/{ticker}/` | Snapshot with multi-period change |
| 33 | `SECTORS.SGX_VALUATION` | `GET /v2/sgx/company/report/{ticker}/` | Valuation ratios |
| 34 | `SECTORS.SGX_FINANCIALS` | `GET /v2/sgx/company/report/{ticker}/` | Financial history |
| 35 | `SECTORS.SGX_DIVIDEND` | `GET /v2/sgx/company/report/{ticker}/` | Dividend history and yield |

Examples:

```excel
=SECTORS.SGX_SECTORS()
=SECTORS.SGX_COMPANIES("financial-services")
=SECTORS.SGX_TOP_COMPANIES("dividend_yield", "financial-services")
=SECTORS.SGX_OVERVIEW("D05")
=SECTORS.SGX_VALUATION("D05")
=SECTORS.SGX_FINANCIALS("D05")
=SECTORS.SGX_DIVIDEND("D05")
```

---

## Part 2: Detailed Implementation Reference (Parameters + Output Schema)

### A. Companies Screener (IDX)

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.SCREEN` | `SCREEN(where, [orderBy], [limit])` | `limit`: API default 50, max 200. `orderBy`: supports `-` prefix for descending. | Header row: `Symbol`, `Company Name` |
| `SECTORS.SCREEN_NL` | `SCREEN_NL(query)` | Natural-language `query` sent as `q`. | Header row: `Symbol`, `Company Name` |
| `SECTORS.FREE_FLOAT` | `FREE_FLOAT([subSector])` | `subSector` optional (`sub_sector`). | Header row: `Symbol`, `Company Name`, `Free Float %` |

### B. Company Report by Section (IDX)

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.COMPANY_OVERVIEW` | `COMPANY_OVERVIEW(ticker)` | `ticker` required. | Key-value rows: `Company Name`, `Sector`, `Sub Sector`, `Industry`, `Market Cap`, `Market Cap Rank`, `Last Close Price`, `Daily Change`, `Listing Date`, `Employee Count`, `ESG Score`, `Website` |
| `SECTORS.COMPANY_VALUATION` | `COMPANY_VALUATION(ticker)` | `ticker` required. | Key metrics rows, then table header: `Year`, `PE`, `PB`, `PS`, `PCF`, `PEG`, `EV/EBITDA`, `EV/Revenue` |
| `SECTORS.COMPANY_FINANCIALS` | `COMPANY_FINANCIALS(ticker)` | `ticker` required. | Key metrics rows, then table header: `Year`, `Revenue`, `Earnings`, `EBITDA`, `EBIT`, `Total Assets`, `Total Equity`, `Total Debt`, `Free Cash Flow`, `Operating Cash Flow` |
| `SECTORS.COMPANY_DIVIDEND` | `COMPANY_DIVIDEND(ticker)` | `ticker` required. | Key metrics rows, then table header: `Year`, `Total Dividend`, `Total Yield` |
| `SECTORS.COMPANY_OWNERSHIP` | `COMPANY_OWNERSHIP(ticker)` | `ticker` required. | Header row: `Shareholder`, `Share %`, `Share Amount`, `Share Value` |

### C. Subsector Report by Section (IDX)

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.SUBSECTOR_STATISTICS` | `SUBSECTOR_STATISTICS(subSector)` | `subSector` required (slug, example `banks`). | Key-value rows: `Total Companies`, `Filtered Median PE`, `Filtered Weighted Avg PE`, `Min Company PE`, `Max Company PE` |
| `SECTORS.SUBSECTOR_MARKET_CAP` | `SUBSECTOR_MARKET_CAP(subSector)` | `subSector` required. | Key-value rows: `Total Market Cap`, `Avg Market Cap`, `1W Change`, `1Y Change`, `YTD Change` |
| `SECTORS.SUBSECTOR_VALUATION` | `SUBSECTOR_VALUATION(subSector)` | `subSector` required. | Header row: `Year`, `PE`, `PB`, `PS`, `PCF` |
| `SECTORS.SUBSECTOR_GROWTH` | `SUBSECTOR_GROWTH(subSector)` | `subSector` required. | Header row: `Year`, `Avg Earnings Growth`, `Avg Revenue Growth` |

### D. Quarterly Financials and Segments

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.QUARTERLY_FINANCIALS` | `QUARTERLY_FINANCIALS(ticker, [nQuarters], [reportDate])` | `nQuarters` optional. `reportDate` optional (`YYYY-MM-DD`). | Header row: `Date`, `Revenue`, `Earnings`, `Total Assets`, `Total Equity`, `Total Liabilities`, `Operating Cash Flow` |
| `SECTORS.COMPANY_SEGMENTS` | `COMPANY_SEGMENTS(ticker, [financialYear])` | `financialYear` optional (latest if omitted). | Header row: `Source`, `Target`, `Value (IDR)` |

### E. Price and Market Data

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.DAILY_PRICE` | `DAILY_PRICE(ticker, [start], [end])` | `start`, `end` optional (`YYYY-MM-DD`). | Header row: `Date`, `Close`, `Volume`, `Market Cap` |
| `SECTORS.IDX_MARKET_CAP` | `IDX_MARKET_CAP([start], [end])` | `start`, `end` optional (`YYYY-MM-DD`). | Header row: `Date`, `IDX Total Market Cap` |
| `SECTORS.INDEX_DAILY` | `INDEX_DAILY(indexCode, [start], [end])` | `indexCode` required (examples: `ihsg`, `lq45`, `idx30`). | Header row: `Date`, `Index`, `Price` |

### F. Rankings and IPO

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.MOST_TRADED` | `MOST_TRADED([start], [end], [nStock])` | `nStock`: API default 5, max 10. | Header row: `Date`, `Symbol`, `Company`, `Volume`, `Price` |
| `SECTORS.TOP_MOVERS` | `TOP_MOVERS([classifications], [periods], [nStock])` | `classifications`: `top_gainers`, `top_losers`, or both. `periods`: `1d`, `7d`, `14d`, `30d`, `365d`. `nStock`: API default 5, max 10. | Header row: `Type`, `Period`, `Symbol`, `Name`, `Price Change`, `Last Price` |
| `SECTORS.IPO_PERFORMANCE` | `IPO_PERFORMANCE(ticker)` | `ticker` required. | Header row: `Period`, `Change` with rows `7 Days`, `30 Days`, `90 Days`, `365 Days` |

### G. Malaysia (KLSE)

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.KLSE_SECTORS` | `KLSE_SECTORS()` | No parameters. | Header row: `Sector` |
| `SECTORS.KLSE_COMPANIES` | `KLSE_COMPANIES(sector)` | `sector` required (slug). | Header row: `Symbol`, `Company Name` |
| `SECTORS.KLSE_TOP_COMPANIES` | `KLSE_TOP_COMPANIES([classifications], [sector])` | `classifications` options: `dividend_yield`, `revenue`, `earnings`, `market_cap`, `pe`. `sector` optional. | Header row: `Classification`, `Symbol`, `Company`, `Value` |
| `SECTORS.KLSE_OVERVIEW` | `KLSE_OVERVIEW(ticker)` | `ticker` required. | Key-value rows: `Name`, `Market Cap`, `Sector`, `Sub Sector`, `Volume`, `1D Change`, `7D Change` |
| `SECTORS.KLSE_VALUATION` | `KLSE_VALUATION(ticker)` | `ticker` required. | Key-value rows: `PE`, `PE TTM`, `PB`, `PS TTM`, `PCF`, `PCF TTM` |
| `SECTORS.KLSE_FINANCIALS` | `KLSE_FINANCIALS(ticker)` | `ticker` required. | Key metrics rows, then table header: `Period`, `Revenue`, `Earnings` |
| `SECTORS.KLSE_DIVIDEND` | `KLSE_DIVIDEND(ticker)` | `ticker` required. | Key-value rows: `5Y Avg Yield`, `Growth Rate`, `Payout Ratio`, `Forward Dividend`, `Forward Div Yield`, `Dividend TTM` |

### H. Singapore (SGX)

| Function | Signature | Defaults / Allowed Values | Output Schema |
|---|---|---|---|
| `SECTORS.SGX_SECTORS` | `SGX_SECTORS()` | No parameters. | Header row: `Sector` |
| `SECTORS.SGX_COMPANIES` | `SGX_COMPANIES(sector)` | `sector` required (slug). | Header row: `Symbol`, `Company Name` |
| `SECTORS.SGX_TOP_COMPANIES` | `SGX_TOP_COMPANIES([classifications], [sector])` | `classifications` options: `dividend_yield`, `revenue`, `earnings`, `market_cap`, `pe`. `sector` optional. | Header row: `Classification`, `Symbol`, `Company`, `Value` |
| `SECTORS.SGX_OVERVIEW` | `SGX_OVERVIEW(ticker)` | `ticker` required. | Key-value rows: `Name`, `Market Cap`, `Sector`, `Sub Sector`, `Volume`, `1D Change`, `7D Change`, `1M Change`, `1Y Change`, `YTD Change` |
| `SECTORS.SGX_VALUATION` | `SGX_VALUATION(ticker)` | `ticker` required. | Key-value rows: `PE`, `PB`, `PS`, `PCF` |
| `SECTORS.SGX_FINANCIALS` | `SGX_FINANCIALS(ticker)` | `ticker` required. | Key metrics rows, then table header: `Year`, `Revenue`, `Earnings` |
| `SECTORS.SGX_DIVIDEND` | `SGX_DIVIDEND(ticker)` | `ticker` required. | Key metrics rows, then table header: `Year`, `Total Dividend`, `Total Yield` |

---

## Part 3: Quick Usage Notes for Analysts

- If a function spills only one `Error` row, validate API key first in task pane.
- For rolling datasets (`DAILY_PRICE`, `INDEX_DAILY`, `IDX_MARKET_CAP`, `MOST_TRADED`), always set explicit `start` and `end` for reproducible models.
- For rank/screener functions, keep formulas in a fixed output area because spill size can change by date and filters.

---