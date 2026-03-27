# Sectors Financial — Excel Add-in Function Implementation Guide

This guide documents the custom functions currently implemented in [Sectors Financial/src/functions/functions.js](Sectors%20Financial/src/functions/functions.js), using Sectors API v2 endpoints.

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

### API Base URL Used in Current Code

- Current implementation uses a CORS proxy:
  - `https://corsproxy.io/?https://api.sectors.app/v2`

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

Total implemented in current file: 35 functions

- 1 API key function
- 34 market/analytics functions

