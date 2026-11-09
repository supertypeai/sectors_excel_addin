# Sectors Financial — Excel Add-in Function Reference

The add-in exposes **104 custom functions** covering every `GET` endpoint in Sectors API v2 (`schema.json`, API version 2.0.0): IDX, KLSE, SGX (including REITs), brokers, and Indonesian mining.

Namespace prefix: `SECTORS.` (dev manifest) or `SECTORSPROD.` (prod manifest).

```excel
=SECTORS.COMPANY_OVERVIEW("BBCA")
```

## Conventions

- **API key**: open the Sectors task pane, paste your key, click **Save Key**. Without it every function returns `Error | No API key...`.
- **Output**: every function spills a rectangular 2-D range. Errors spill as `Error | <message>` (for example `Rate limit exceeded. Please wait.` on HTTP 429).
- **Types**: numbers stay numeric (numeric strings from the API such as `"0.7315"` are converted), `YYYY-MM-DD` dates become Excel date serials (format the cells as dates), lists (tags, indices) are joined with `, `.
- **Optional parameters**: leave blank, e.g. `=SECTORS.QUARTERLY_FINANCIALS("BBCA",, "2024-12-31")`.
- **Booleans**: pass `TRUE`/`FALSE`.
- **Comma-separated lists** (classifications, periods, tags, symbols): pass one string, e.g. `"top_gainers,top_losers"`.
- **Pagination**: list endpoints with `limit`/`offset` return one page per call (max 30 for most, 200 for screeners). Each call costs API credits, so the add-in never auto-paginates.
- **Tickers**: IDX `BBCA`, KLSE `1155`, SGX `D05`. The `.JK`/`.SI` suffix is optional.
- **Sections** (`Title` row followed by a header row) are used where one response holds several differently-shaped lists, e.g. corporate actions.

---

## 1. Screeners (IDX)

| Function | Endpoint | Returns |
|---|---|---|
| `SCREEN(where, [orderBy], [limit], [offset])` | `/v2/companies/` | `Symbol`, `Company Name`, plus one column per field used in `where`/`orderBy` |
| `SCREEN_NL(query)` | `/v2/companies/?q=` | Same as `SCREEN`, fields chosen by the natural-language translation |
| `FREE_FLOAT([subSector], [sector], [industry], [subIndustry])` | `/v2/free-float/` | `Symbol`, `Company Name`, `Free Float %` (fraction). Use at most one filter |

```excel
=SECTORS.SCREEN("sub_sector = 'banks' and free_float > 0.3", "-market_cap", 20)
=SECTORS.SCREEN_NL("top 5 companies by dividend yield in financials sector")
=SECTORS.FREE_FLOAT(, , "oil-gas")
```

`free_float` is a screener field, so `SCREEN` can filter and sort on it and shows its value as a column.

## 2. Company Report (IDX)

All read `/v2/company/report/{ticker}/?sections=<section>`.

| Function | Section | Returns |
|---|---|---|
| `COMPANY_OVERVIEW(ticker)` | overview | Key-value: sector/industry, market cap & rank, price, listing, ESG, contact, indices, tags, 52W/YTD/all-time high & low |
| `COMPANY_VALUATION(ticker)` | valuation | Forward PE, intrinsic value; yearly PE/PB/PS/PCF/PEG/EV multiples with peer averages |
| `COMPANY_FINANCIALS(ticker)` | financials | EPS and YoY growth; yearly income statement, balance sheet and cash flow |
| `COMPANY_FINANCIAL_RATIOS(ticker)` | financials | Yearly profitability, leverage, liquidity, efficiency and capital ratios |
| `COMPANY_DIVIDEND(ticker)` | dividend | Yield/payout metrics; yearly totals; upcoming dividends if any |
| `COMPANY_OWNERSHIP(ticker)` | ownership | Major shareholders |
| `COMPANY_INSTITUTIONAL_FLOW(ticker)` | ownership | Whale investors, conglomerate group, institutional net flow, top buyers/sellers |
| `COMPANY_MANAGEMENT(ticker)` | management | Key executives; executive shareholdings |
| `COMPANY_PEERS(ticker)` | peers | Peer table: market cap, PE TTM, PB MRQ, revenue, net income, balance sheet |
| `COMPANY_FORECAST(ticker)` | future | EPS/revenue estimates, growth forecasts, analyst rating breakdown |

| Function | Endpoint | Returns |
|---|---|---|
| `COMPANY_CORPORATE_ACTIONS(ticker, [actionType])` | `/v2/company/corporate-actions/{ticker}/` | One section per type (agm, dividend, stock_split, right_issue, bonus, warrant, upcoming_dividend), or one table if `actionType` is set |
| `SHAREHOLDERS_COMPOSITION(ticker, [year])` | `/v2/company/shareholders-composition/{ticker}/` | Monthly holdings by investor type; `_l` local, `_f` foreign |

## 3. Subsector Report (IDX)

All read `/v2/subsector/report/{subSector}/?sections=<section>`.

| Function | Section | Returns |
|---|---|---|
| `SUBSECTOR_STATISTICS(subSector)` | statistics | Company count, median/weighted PE, min/max PE |
| `SUBSECTOR_MARKET_CAP(subSector)` | market_cap | Total/avg market cap, 1W/1Y/YTD change, quarterly TTM market cap |
| `SUBSECTOR_VALUATION(subSector)` | valuation | Yearly PE/PB/PS/PCF with rank among subsectors |
| `SUBSECTOR_GROWTH(subSector)` | growth | Yearly weighted earnings/revenue growth; growth forecasts |
| `SUBSECTOR_STABILITY(subSector)` | stability | Weighted max drawdown, weighted RSD of close |
| `SUBSECTOR_TOP_COMPANIES(subSector)` | companies | Top companies by market cap, growth, profit, revenue |

## 4. Financial Statements and Segments (IDX)

| Function | Endpoint | Returns |
|---|---|---|
| `QUARTERLY_FINANCIALS(ticker, [nQuarters], [reportDate], [approx])` | `/v2/financials/quarterly/{ticker}/` | Quarterly income statement, balance sheet, cash flow; bank metrics (NII, loans, deposits) where available |
| `QUARTERLY_FINANCIAL_DATES(ticker)` | `/v2/company/get_quarterly_financial_dates/{ticker}/` | `Year`, `Date`, `Quarter` |
| `LATEST_QUARTERLY_DATES([year], [since], [limit], [offset])` | `/v2/companies/quarterly-financial-dates/` | Latest reported quarter per company |
| `COMPANY_SEGMENTS(ticker, [financialYear])` | `/v2/company/get-segments/{ticker}/` | `Source`, `Target`, `Value (IDR)` |
| `COMPANIES_WITH_SEGMENTS()` | `/v2/companies/list_companies_with_segments/` | `Symbol`, `Financial Years` |

## 5. Prices and Market Data (IDX)

| Function | Endpoint | Returns |
|---|---|---|
| `DAILY_PRICE(ticker, [start], [end])` | `/v2/daily/{ticker}/` | `Date`, `Close`, `Volume`, `Market Cap`, `Open`, `High`, `Low` (max 90 days per call) |
| `DAILY_CLOSE_ALL([date], [limit], [offset])` | `/v2/close/` | Close of every ticker on one day |
| `IDX_MARKET_CAP([start], [end])` | `/v2/idx-total/` | `Date`, `IDX Total Market Cap` |
| `INDEX_DAILY(indexCode, [start], [end])` | `/v2/index-daily/{indexCode}/` | `Date`, `Index`, `Price` |
| `INDEX_DAILY_ALL([date])` | `/v2/index-daily/` | Every index on one day |
| `MOST_TRADED([start], [end], [nStock], [subSector], [adjusted])` | `/v2/most-traded/` | `Date`, `Symbol`, `Company`, `Volume`, `Price` |
| `TOP_MOVERS([classifications], [periods], [nStock], [subSector], [minMcapBillion])` | `/v2/companies/top-changes/` | `Type`, `Period`, `Symbol`, `Name`, `Price Change`, `Last Price`, `Latest Close Date` |
| `IPO_PERFORMANCE(ticker)` | `/v2/listing-performance/{ticker}/` | 7/30/90/365-day change since listing, then IPO offering details |
| `FOREIGN_FLOW(ticker, [start], [end])` | `/v2/foreign-flow/{ticker}/` | Daily foreign buy/sell/net and foreign share |
| `FOREIGN_FLOW_ALL([date], [orderBy], [limit], [offset])` | `/v2/foreign-flow/` | Foreign flow for every ticker on one day |
| `SUSPENSIONS([symbol], [start], [end], [limit], [offset])` | `/v2/suspensions/` | `Symbol`, `Suspension Date`, `Reason`, `PDF` |
| `CORPORATE_ACTIONS_CALENDAR([actionType], [start], [end])` | `/v2/corporate-actions/` | One section per action type across all companies |

## 6. Filings and News (IDX)

| Function | Endpoint | Returns |
|---|---|---|
| `FILINGS([symbol], [subSector], [start], [end], [transactionType], [holderType], [limit], [offset], [sector], [tags])` | `/v2/filings/` | Insider/major-holder transactions with holdings before/after |
| `NEWS([symbols], [subSector], [start], [end], [keyword], [limit], [offset], [sector], [tags], [extension], [commodityType])` | `/v2/news/` | Articles; set `extension` to `"mining"` for mining news |

## 7. Brokers (IDX)

| Function | Endpoint | Returns |
|---|---|---|
| `BROKERS([cohort], [origin])` | `/v2/brokers/` | Broker registry |
| `TOP_BROKERS([date], [metric], [nBrokers], [origin], [cohort], [foreign])` | `/v2/brokers/top/` | Daily broker ranking by gross or net value |
| `BROKER_ACTIVITY(brokerCode, [symbol], [start], [end])` | `/v2/broker-activity/{brokerCode}/` | Daily buy/sell/net per stock for one broker |
| `BROKER_TOP_STOCKS(brokerCode, [start], [end], [nBrokers], [foreign])` | `/v2/broker-activity/{brokerCode}/top/` | Top accumulations and distributions |
| `BROKER_SUMMARY(ticker, [brokerCode], [start], [end])` | `/v2/broker-summary/{ticker}/` | Daily buy/sell/net per broker for one stock |
| `BROKER_SUMMARY_TOP(ticker, [start], [end], [nBrokers], [origin], [cohort], [foreign])` | `/v2/broker-summary/{ticker}/top/` | Top buying and selling brokers |

## 8. Helper Lists (IDX)

| Function | Endpoint |
|---|---|
| `SUBSECTORS()` | `/v2/subsectors/` |
| `INDUSTRIES()` | `/v2/industries/` |
| `SUBINDUSTRIES()` | `/v2/subindustries/` |
| `NEWS_TAGS()` | `/v2/tags/` |

## 9. Malaysia (KLSE)

| Function | Endpoint | Returns |
|---|---|---|
| `KLSE_SECTORS()` | `/v2/klse/sectors/` | Sector slugs |
| `KLSE_COMPANIES(sector)` | `/v2/klse/companies/` | `Symbol`, `Company Name` |
| `KLSE_TOP_COMPANIES([classifications], [sector], [nStock], [minMcapMillion])` | `/v2/klse/companies/top/` | `Classification`, `Symbol`, `Company`, `Value` |
| `KLSE_OVERVIEW(ticker)` | `/v2/klse/company/report/{ticker}/` | Market cap, sector, volume, 1D/7D/1M/1Y/YTD/3Y change |
| `KLSE_VALUATION(ticker)` | same | PE, PB, PS, PCF, Beta |
| `KLSE_FINANCIALS(ticker)` | same | Margins and ratios; revenue and earnings by period (TTM and years) |
| `KLSE_DIVIDEND(ticker)` | same | Yield, growth, payout, forward dividend, TTM |

## 10. Singapore (SGX)

| Function | Endpoint | Returns |
|---|---|---|
| `SGX_SECTORS()` | `/v2/sgx/sectors/` | Sector slugs |
| `SGX_SUBSECTORS()` | `/v2/sgx/subsectors/` | Sector and subsector slugs |
| `SGX_COMPANIES(sector)` | `/v2/sgx/companies/` | `Symbol`, `Company Name` (slug or label, e.g. `"financial-services"`) |
| `SGX_SCREEN(where, [orderBy], [limit], [offset])` | `/v2/sgx/companies/` | Like `SCREEN` for SGX |
| `SGX_SCREEN_NL(query)` | `/v2/sgx/companies/?q=` | Like `SCREEN_NL` for SGX |
| `SGX_TOP_COMPANIES([classifications], [sector], [nStock], [minMcapMillion])` | `/v2/sgx/companies/top/` | `Classification`, `Symbol`, `Company`, `Value` |
| `SGX_OVERVIEW(ticker)` | `/v2/sgx/company/report/{ticker}/` | Market cap, sector, price, 1D–3Y change, listing, website |
| `SGX_VALUATION(ticker)` | same | PE, PB, PS, PCF, Beta |
| `SGX_FINANCIALS(ticker)` | same | Margins, growth, ratios; yearly revenue, earnings, cash flow |
| `SGX_DIVIDEND(ticker)` | same | Yield/payout metrics; yearly totals; upcoming dividends |
| `SGX_MANAGEMENT(ticker)` | same | Current and former management |
| `SGX_OWNERSHIP(ticker)` | same | Major shareholders |
| `SGX_DAILY_PRICE(ticker, [start], [end])` | `/v2/sgx/daily/{ticker}/` | `Date`, `Close`, `Volume`, `Open`, `High`, `Low` |
| `SGX_DAILY_CLOSE_ALL([date], [limit], [offset])` | `/v2/sgx/close/` | Close of every SGX ticker on one day |
| `SGX_CORPORATE_ACTIONS(ticker, [actionType])` | `/v2/sgx/company/corporate-actions/{ticker}/` | AGMs, dividends, upcoming dividends |
| `SGX_FILINGS([symbol], [start], [end], [transactionType], [holderType], [limit], [offset])` | `/v2/sgx/filings/` | Insider/institution filings with interest before/after |
| `SGX_NEWS([symbols], [sector], [subSector], [start], [end], [tags], [limit], [offset])` | `/v2/sgx/news/` | Articles |
| `SGX_NEWS_TAGS()` | `/v2/sgx/tags/` | Tag slugs |
| `SGX_BUYBACKS([symbol], [start], [end], [limit], [offset])` | `/v2/sgx/buybacks/` | Buybacks with price range and mandate |
| `SGX_SHORT_SELL([symbol], [start], [end], [orderBy], [limit], [offset])` | `/v2/sgx/short-sell/` | Daily short-sell volume and value |

### SGX REITs

| Function | Endpoint | Returns |
|---|---|---|
| `SGX_REIT_SCREEN([where], [orderBy], [limit], [offset])` | `/v2/sgx/reits/` | REITs plus the fields used, e.g. `aggregate_leverage[latest] < 0.4` |
| `SGX_REIT_SCREEN_NL(query)` | `/v2/sgx/reits/?q=` | REITs matching a natural-language query |
| `SGX_REIT_PROFILE(ticker)` | `/v2/sgx/reits/profile/{ticker}/` | Sponsor, trustee, managers, board |
| `SGX_REIT_PERFORMANCE(ticker, [financialYear])` | `/v2/sgx/reits/performance/{ticker}/` | Yield, P/NAV, NPI, DPU, gearing, occupancy, WALE; distribution record |
| `SGX_REIT_PROPERTIES(ticker, [financialYear])` | `/v2/sgx/reits/properties/{ticker}/` | Property portfolio |
| `SGX_REIT_TENANTS(ticker, [financialYear])` | `/v2/sgx/reits/tenants/{ticker}/` | Top tenants |
| `SGX_REIT_TRADE_MIX(ticker, [financialYear])` | `/v2/sgx/reits/trade-mix/{ticker}/` | Income by trade category |
| `SGX_REIT_TRANSACTIONS([symbol], [start], [end], [transactionType], [financialYear], [orderBy], [limit], [offset])` | `/v2/sgx/reits/transactions/` | Acquisitions and divestments |

## 11. Mining (Indonesia)

Company and site functions take a **slug** from `MINING_COMPANIES` / `MINING_SITES`.

| Function | Endpoint |
|---|---|
| `MINING_COMMODITIES()` | `/v2/mining/commodities/` |
| `MINING_COMMODITY_PRICE(commodity, [startYear], [endYear])` | `/v2/mining/commodities/{commodity}/price/` |
| `MINING_COMPANIES([commodityType], [keyword], [companyType], [hasFinancials], [limit], [offset])` | `/v2/mining/companies/` |
| `MINING_COMPANY(slug)` | `/v2/mining/companies/{slug}/` |
| `MINING_COMPANY_FINANCIALS(slug, [year])` | `/v2/mining/companies/financials/{slug}/` |
| `MINING_COMPANY_OWNERSHIP(slug)` | `/v2/mining/companies/ownership/{slug}/` |
| `MINING_COMPANY_PERFORMANCE(slug, [commodityType], [year])` | `/v2/mining/companies/performance/{slug}/` |
| `MINING_SALES_DESTINATION(slug, [year])` | `/v2/mining/sales-destination/{slug}/` |
| `MINING_CONTRACTS([contractor], [mineOwner])` | `/v2/mining/contracts/` |
| `MINING_EXPORTS(commodityType, year, [limit])` | `/v2/mining/exports/` |
| `MINING_GLOBAL_COMMODITY([commodityType], [country], [limit])` | `/v2/mining/global-commodity/` |
| `MINING_TOTAL_PRODUCTION(commodityType)` | `/v2/mining/total-production/` |
| `MINING_LICENSES([province], [commodityType], [company], [licenseType], [activity], [expiringSoon], [orderBy], [limit], [offset])` | `/v2/mining/licenses/` |
| `MINING_LICENSE_AUCTIONS([province], [commodityType], [participant], [status], [areaType], [orderBy], [limit], [offset])` | `/v2/mining/license-auctions/` |
| `MINING_LICENSE_AUCTION(wiupCode)` | `/v2/mining/license-auctions/{wiupCode}/` |
| `MINING_SITES([province], [commodityType], [company], [year], [orderBy], [minProduction], [limit], [offset])` | `/v2/mining/sites/` |
| `MINING_SITE(slug)` | `/v2/mining/sites/{slug}/` |
| `MINING_RESERVES_INDEX()` | `/v2/mining/resources-reserves/` |
| `MINING_RESERVES(province, [commodityType], [year])` | `/v2/mining/resources-reserves/{province}/` |

---

## Changes in 1.1.0

All 34 existing function names and parameter positions are unchanged (new parameters were appended at the end), and new table columns were appended after the old ones. Layout changes that can shift cell references are listed below.

- **Fixed** `SGX_COMPANIES`: v2 turned `/sgx/companies/` into a screener, so the old `sector=` call returned an error. It now filters with `where sector = '<label>'`.
- **Fixed** `KLSE_FINANCIALS`: v2 returns revenue/earnings keyed by period (`TTM`, `2024`, ...), which the old code read as an empty list.
- **Changed rows** `KLSE_VALUATION`: `PE TTM`, `PS TTM` and `PCF TTM` no longer exist in v2 (they were always blank). Rows are now `PE`, `PB`, `PS`, `PCF`, `Beta`.
- **Changed layout**: `COMPANY_FINANCIALS` (+2 YoY TTM growth rows), `COMPANY_DIVIDEND` (+2 average-yield rows), `SGX_FINANCIALS` (+6 ratio rows) and `SGX_DIVIDEND` (+1 forward-yield row) gained summary rows above their yearly table, so the table starts lower. Formulas that point at fixed cells inside those spills (rather than using `INDEX`/`XLOOKUP` on the labels) need updating.
- `SCREEN` / `SCREEN_NL` now return the filtered/sorted field values as extra columns (e.g. `free_float`, `market_cap`).
- `FREE_FLOAT` accepts `sector`, `industry` and `subIndustry` filters.
- Report functions now request only their section, so they use less data per call.
- 70 new functions: company management/peers/forecast/ratios/institutional flow, corporate actions, shareholder composition, filings, news, suspensions, foreign flow, brokers, helper lists, full-universe close, SGX daily/filings/news/buybacks/short-sell/REITs, and mining.

## Quick Usage Notes for Analysts

- If a function spills only one `Error` row, check the API key in the task pane first.
- For rolling datasets (`DAILY_PRICE`, `INDEX_DAILY`, `IDX_MARKET_CAP`, `MOST_TRADED`, `FOREIGN_FLOW`), set explicit `start` and `end` for reproducible models.
- Keep screener and ranking formulas in a clear area: spill size changes with dates and filters.
