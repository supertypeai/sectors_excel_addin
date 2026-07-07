// ============================================================
// DO NOT EDIT MANUALLY.
// Regenerate with: npx tsx scripts/generate_schema.ts
// ============================================================

export interface ParamDef {
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
  optional?: boolean;
  example?: string;
}

export interface EndpointDef {
  functionName: string;
  path: string;
  description: string;
  params: ParamDef[];
  extraQueryParams?: Record<string, unknown>;
  exchange?: string;
  category?: string;
  "x-mdx-path"?: string;
}

export const SECTORS_BROKER_ACTIVITY_BY_CODE_DEF: EndpointDef = {
  functionName: "SECTORS_BROKER_ACTIVITY_BY_CODE",
  path: "broker-activity/{broker_code}",
  description: "Broker Activity By Code",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/broker-activity-by-code",
  params: [
    { name: "broker_code", type: "string", description: "Broker code. E.g. `MG`, `AK`, `CC`.", example: "MG" },
    { name: "symbol", type: "string", description: "Optional filter to a single stock ticker (e.g. `BBCA`).", optional: true, example: "BBCA" },
    { name: "start", type: "string", description: "Start date (YYYY-MM-DD). Default: end - 14 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date (YYYY-MM-DD). Default: today.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_BROKER_ACTIVITY_PER_SYMBOL_DEF: EndpointDef = {
  functionName: "SECTORS_BROKER_ACTIVITY_PER_SYMBOL",
  path: "broker-summary/{symbol}",
  description: "Broker Activity Per Symbol",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/broker-summary-by-symbol",
  params: [
    { name: "symbol", type: "string", description: "IDX ticker symbol. E.g. `BBCA`, `GOTO`.", example: "BBCA" },
    { name: "broker_code", type: "string", description: "Optional filter to a single broker code (e.g. `MG`).", optional: true, example: "MG" },
    { name: "start", type: "string", description: "Start date (YYYY-MM-DD). Default: end - 14 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date (YYYY-MM-DD). Default: today.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_BROKER_REGISTRY_DEF: EndpointDef = {
  functionName: "SECTORS_BROKER_REGISTRY",
  path: "brokers",
  description: "Broker Registry",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/broker-registry",
  params: [
    { name: "cohort", type: "string", description: "Optional filter by broker cohort (case-insensitive).", optional: true, example: "institutional" },
    { name: "origin", type: "string", description: "Optional filter by broker origin.", optional: true, example: "domestic" },
  ],
};

export const SECTORS_COMPANIES_SCREENER_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANIES_SCREENER",
  path: "companies",
  description: "Companies Screener",
  exchange: "Indonesia (IDX)",
  category: "Company Screener",
  "x-mdx-path": "v2/indonesia/screener/companies",
  params: [
    { name: "where", type: "string", description: "SQL-like conditions for advanced filtering. Ignored if `q` is present. Supports operators `=`, `!=`, `>`, `>=`, `<`, `<=`, `like`, `in` combined with `and`/`or`. Use bracket notation for yearly fields: `revenue[2024] > 1000000000000`. Supports arithmetic on both sides: `revenue[2024] / total_assets[2024] > 0.5`.", optional: true, example: "revenue[2024] > 1000000000000" },
    { name: "q", type: "string", description: "A natural language query (e.g. `top 10 tech companies by revenue in 2023`). When `q` is provided, all other query parameters (`where`, `order_by`, etc.) are ignored as the LLM will generate them.", optional: true, example: "top 10 tech companies by revenue in 2023" },
    { name: "order_by", type: "string", description: "Field to sort results by. Use `-` prefix for descending order (e.g. `-market_cap`). Supports arithmetic expressions (e.g. `-(earnings[2024]/earnings[2023])`). Ignored if `q` is present.", optional: true, example: "symbol" },
    { name: "desc", type: "boolean", description: "Sort in descending order. Ignored if `q` is present.", optional: true, example: "false" },
    { name: "limit", type: "number", description: "Maximum number of results to return. Max: 200. Ignored if `q` is present.", optional: true, example: "50" },
    { name: "offset", type: "number", description: "Number of results to skip for pagination. Ignored if `q` is present.", optional: true, example: "0" },
    { name: "include_query_values", type: "boolean", description: "If `true`, the response includes a `query_values` object showing the interpreted year and country extracted from the query.", optional: true, example: "false" },
  ],
};

export const SECTORS_COMPANIES_WITH_REVENUE_SEGMENTS_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANIES_WITH_REVENUE_SEGMENTS",
  path: "companies/list_companies_with_segments",
  description: "Companies with Revenue Segments",
  exchange: "Indonesia (IDX)",
  category: "Helper Lists",
  "x-mdx-path": "v2/indonesia/helper-list/companies-segments-list",
  params: [],
};

export const SECTORS_COMPANY_FILINGS_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANY_FILINGS",
  path: "filings",
  description: "Company Filings",
  exchange: "Indonesia (IDX)",
  category: "News & Filings",
  "x-mdx-path": "v2/indonesia/news/filings",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol symbol to filter by. E.g. `BBCA`, `BMRI`.", optional: true, example: "BBCA" },
    { name: "sector", type: "string", description: "Kebab-case sector slug. E.g. `healthcare`, `financials`. Get valid values from the [Subsectors](../helper-list/subsectors) endpoint.", optional: true, example: "financials" },
    { name: "sub_sector", type: "string", description: "Kebab-case subsector slug. E.g. `banks`, `tobacco`. Get valid values from the [Subsectors](../helper-list/subsectors) endpoint.", optional: true, example: "banks" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `timestamp`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Number of results to return. Maximum: 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Number of results to skip for pagination.", optional: true, example: "0" },
    { name: "transaction_type", type: "string", description: "Filter by transaction direction: `buy`, `sell`, or `others`.", optional: true, example: "buy" },
    { name: "tags", type: "string", description: "Comma-separated tag slugs. E.g. `Bullish,insider-trading`. Get valid values from the [News Tags](../helper-list/tags) endpoint.", optional: true, example: "bullish,insider-trading" },
    { name: "holder_type", type: "string", description: "Filter by holder type (case-insensitive).", optional: true, example: "insider" },
  ],
};

export const SECTORS_COMPANY_IPO_AND_LISTING_PERFORMANCE_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANY_IPO_AND_LISTING_PERFORMANCE",
  path: "listing-performance/{symbol}",
  description: "Company IPO & Listing Performance",
  exchange: "Indonesia (IDX)",
  category: "IPO & Performance",
  "x-mdx-path": "v2/indonesia/ipo/listing-performance",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol symbol. E.g. `ARTO`, `BREN`, `GOTO`.", example: "GOTO" },
  ],
};

export const SECTORS_COMPANY_QUARTERLY_FINANCIALS_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANY_QUARTERLY_FINANCIALS",
  path: "financials/quarterly/{symbol}",
  description: "Company Quarterly Financials",
  exchange: "Indonesia (IDX)",
  category: "Detailed Reports",
  "x-mdx-path": "v2/indonesia/report/quarterly-financials",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol symbol. E.g. `BMRI`, `BBCA`.", example: "BBCA" },
    { name: "report_date", type: "string", description: "Specific report date (YYYY-MM-DD). Use the [Quarterly Financial Dates](../helper-list/company-quarterly-dates) endpoint to get valid values.", optional: true, example: "2026-05-01" },
    { name: "approx", type: "boolean", description: "If `true` (default), use approximate quarter matching when an exact date is not found.", optional: true, example: "true" },
    { name: "n_quarters", type: "number", description: "Number of most recent quarters to return.", optional: true, example: "4" },
  ],
};

export const SECTORS_COMPANY_REPORT_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANY_REPORT",
  path: "company/report/{symbol}",
  description: "Company Report",
  exchange: "Indonesia (IDX)",
  category: "Detailed Reports",
  "x-mdx-path": "v2/indonesia/report/company-report",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol symbol. E.g. `BREN`, `BBCA`.", example: "BBCA" },
    { name: "sections", type: "string", description: "Comma-separated list of sections to include. Default: all. Options: `overview`, `valuation`, `future`, `peers`, `financials`, `dividend`, `management`, `ownership`.", optional: true, example: "valuation" },
  ],
};

export const SECTORS_COMPANY_REVENUE_SEGMENTS_DEF: EndpointDef = {
  functionName: "SECTORS_COMPANY_REVENUE_SEGMENTS",
  path: "company/get-segments/{symbol}",
  description: "Company Revenue Segments",
  exchange: "Indonesia (IDX)",
  category: "Detailed Reports",
  "x-mdx-path": "v2/indonesia/report/company-segments",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol symbol. E.g. `BUMI`, `TLKM`. Not all companies have segment data — check the [Companies with Revenue Segments](../helper-list/companies-segments-list) helper first.", example: "BBCA" },
    { name: "financial_year", type: "number", description: "Financial year to retrieve. Defaults to the latest available year.", optional: true, example: "2024" },
  ],
};

export const SECTORS_CORPORATE_ACTIONS_DEF: EndpointDef = {
  functionName: "SECTORS_CORPORATE_ACTIONS",
  path: "company/corporate-actions/{symbol}",
  description: "Corporate Actions",
  exchange: "Indonesia (IDX)",
  category: "Detailed Reports",
  "x-mdx-path": "v2/indonesia/company/corporate-actions",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol. E.g. `BBCA`, `BMRI`.", example: "BBCA" },
  ],
};

export const SECTORS_DAILY_NET_FOREIGN_INFLOW_DEF: EndpointDef = {
  functionName: "SECTORS_DAILY_NET_FOREIGN_INFLOW",
  path: "foreign-flow/{symbol}",
  description: "Daily Net Foreign Inflow",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/foreign-flow-by-symbol",
  params: [
    { name: "symbol", type: "string", description: "IDX ticker symbol. E.g. `BBCA`, `GOTO`.", example: "BBCA" },
    { name: "start", type: "string", description: "Start date (YYYY-MM-DD). Default: end - 30 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date (YYYY-MM-DD). Default: today.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_DAILY_TRANSACTION_DATA_DEF: EndpointDef = {
  functionName: "SECTORS_DAILY_TRANSACTION_DATA",
  path: "daily/{symbol}",
  description: "Daily Transaction Data",
  exchange: "Indonesia (IDX)",
  category: "Transaction Data",
  "x-mdx-path": "v2/indonesia/transaction/daily",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol. E.g. `BBCA`, `GOTO`, `TLKM`.", example: "BBCA" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Defaults to 30 days before `end`. Wider ranges are clamped to the most recent 90 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Defaults to today. Future dates return 400.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_FREE_FLOAT_MARKET_ANALYSIS_DEF: EndpointDef = {
  functionName: "SECTORS_FREE_FLOAT_MARKET_ANALYSIS",
  path: "free-float",
  description: "Free Float Market Analysis",
  exchange: "Indonesia (IDX)",
  category: "Company Screener",
  "x-mdx-path": "v2/indonesia/screener/free-float",
  params: [
    { name: "sector", type: "string", description: "Kebab-case sector slug. E.g. `infrastructures`, `healthcare`, `transportation-logistic`. Retrieve valid values from the [Subsectors](./helper-list/subsectors) endpoint.", optional: true, example: "healthcare" },
    { name: "sub_sector", type: "string", description: "Kebab-case subsector slug. E.g. `banks`, `basic-materials`, `food-beverage`. Retrieve valid values from the [Subsectors](./helper-list/subsectors) endpoint.", optional: true, example: "" },
    { name: "industry", type: "string", description: "Kebab-case industry slug. E.g. `oil-gas`, `electrical`, `chemicals`. Retrieve valid values from the [Industries](./helper-list/industries) endpoint.", optional: true, example: "" },
    { name: "sub_industry", type: "string", description: "Kebab-case sub-industry slug. E.g. `coal-production`, `gold`, `healthcare-providers`. Retrieve valid values from the [Subindustries](./helper-list/subindustries) endpoint.", optional: true, example: "" },
  ],
};

export const SECTORS_IDX_MARKET_SUMMARY_DEF: EndpointDef = {
  functionName: "SECTORS_IDX_MARKET_SUMMARY",
  path: "idx-total",
  description: "IDX Market Summary",
  exchange: "Indonesia (IDX)",
  category: "Transaction Data",
  "x-mdx-path": "v2/indonesia/transaction/idx-total",
  params: [
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Earliest valid: `2021-01-01`. Defaults to 30 days before `end`. Wider ranges are clamped to the most recent 90 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Defaults to today. Future dates return 400.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_INDEX_DAILY_TRANSACTION_DATA_DEF: EndpointDef = {
  functionName: "SECTORS_INDEX_DAILY_TRANSACTION_DATA",
  path: "index-daily/{index_code}",
  description: "Index Daily Transaction Data",
  exchange: "Indonesia (IDX)",
  category: "Transaction Data",
  "x-mdx-path": "v2/indonesia/transaction/index-daily",
  params: [
    { name: "index_code", type: "string", description: "Index code. E.g. `lq45`, `ihsg`, `idx30`.", example: "lq45" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Defaults to 30 days before `end`. Wider ranges are clamped to the most recent 90 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Defaults to today. Future dates return 400.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_INDUSTRIES_DEF: EndpointDef = {
  functionName: "SECTORS_INDUSTRIES",
  path: "industries",
  description: "Industries",
  exchange: "Indonesia (IDX)",
  category: "Helper Lists",
  "x-mdx-path": "v2/indonesia/helper-list/industries",
  params: [],
};

export const SECTORS_KLSE_FULL_COMPANY_REPORT_FOR_A_KLSE_LISTED_SYMBOL_DEF: EndpointDef = {
  functionName: "SECTORS_KLSE_FULL_COMPANY_REPORT_FOR_A_KLSE_LISTED_SYMBOL",
  path: "klse/company/report/{symbol}",
  description: "Full company report for a KLSE-listed symbol",
  exchange: "Malaysia (KLSE)",
  category: "KLSE",
  "x-mdx-path": "v2/malaysia/klse-report",
  params: [
    { name: "symbol", type: "string", description: "KLSE symbol symbol (4-digit numeric code). E.g. `1155`, `4197`.", example: "1155" },
    { name: "sections", type: "string", description: "Comma-separated sections to include. Options: `overview`, `valuation`, `financials`, `dividend`. Default: all sections.", optional: true, example: "valuation" },
  ],
};

export const SECTORS_KLSE_LIST_ALL_KLSE_SECTORS_DEF: EndpointDef = {
  functionName: "SECTORS_KLSE_LIST_ALL_KLSE_SECTORS",
  path: "klse/sectors",
  description: "List all KLSE sectors",
  exchange: "Malaysia (KLSE)",
  category: "KLSE",
  "x-mdx-path": "v2/malaysia/klse-sectors",
  params: [],
};

export const SECTORS_KLSE_LIST_KLSE_COMPANIES_FILTERED_BY_SECTOR_DEF: EndpointDef = {
  functionName: "SECTORS_KLSE_LIST_KLSE_COMPANIES_FILTERED_BY_SECTOR",
  path: "klse/companies",
  description: "List KLSE companies filtered by sector",
  exchange: "Malaysia (KLSE)",
  category: "KLSE",
  "x-mdx-path": "v2/malaysia/klse-companies",
  params: [
    { name: "sector", type: "string", description: "Kebab-case sector slug. E.g. `financials`, `healthcare`. Get valid values from the [KLSE Sectors](../malaysia/klse-sectors) endpoint.", example: "financials" },
  ],
};

export const SECTORS_KLSE_TOP_KLSE_COMPANIES_BY_CLASSIFICATION_DEF: EndpointDef = {
  functionName: "SECTORS_KLSE_TOP_KLSE_COMPANIES_BY_CLASSIFICATION",
  path: "klse/companies/top",
  description: "Top KLSE companies by classification",
  exchange: "Malaysia (KLSE)",
  category: "KLSE",
  "x-mdx-path": "v2/malaysia/klse-top-companies",
  params: [
    { name: "sector", type: "string", description: "Filter by sector slug. E.g. `financials`, `healthcare`. Default: all sectors.", optional: true, example: "financials" },
    { name: "n_stock", type: "number", description: "Number of top companies to return per classification. Max 10. Default: 5.", optional: true, example: "5" },
    { name: "classifications", type: "string", description: "Comma-separated list of classifications. Options: `dividend_yield`, `revenue`, `earnings`, `market_cap`, `pe`. Default: all.", optional: true, example: "revenue,earnings" },
    { name: "min_mcap_million", type: "number", description: "Minimum market cap in million MYR. Default: 1000.", optional: true, example: "1000" },
  ],
};

export const SECTORS_MOST_TRADED_STOCKS_DEF: EndpointDef = {
  functionName: "SECTORS_MOST_TRADED_STOCKS",
  path: "most-traded",
  description: "Most Traded Stocks",
  exchange: "Indonesia (IDX)",
  category: "Rankings",
  "x-mdx-path": "v2/indonesia/ranking/most-traded",
  params: [
    { name: "sub_sector", type: "string", description: "Filter by kebab-case subsector slug. E.g. `banks`. Get valid values from the [Subsectors](./helper-list/subsectors) endpoint.", optional: true, example: "banks" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Defaults to 30 days before `end`. Wider ranges are clamped to the most recent 90 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Defaults to today. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "adjusted", type: "boolean", description: "If `true`, rank by volume × closing price instead of raw volume.", optional: true, example: "false" },
    { name: "n_stock", type: "number", description: "Number of tickers per day. Default 5, max 10.", optional: true, example: "5" },
  ],
};

export const SECTORS_NEWS_ARTICLES_DEF: EndpointDef = {
  functionName: "SECTORS_NEWS_ARTICLES",
  path: "news",
  description: "News Articles",
  exchange: "Indonesia (IDX)",
  category: "News & Filings",
  "x-mdx-path": "v2/indonesia/news/news",
  params: [
    { name: "sector", type: "string", description: "**IDX only.** Comma-separated sector slugs (kebab-case).", optional: true, example: "financials" },
    { name: "sub_sector", type: "string", description: "**IDX only.** Comma-separated subsector slugs (kebab-case).", optional: true, example: "banks" },
    { name: "commodity_type", type: "string", description: "**Mining only.** Filter by commodity type. E.g. `Coal`, `Nickel`.", optional: true, example: "" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `timestamp`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Items per page. Max 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Items to skip for pagination.", optional: true, example: "0" },
    { name: "tags", type: "string", description: "**IDX only.** Comma-separated tag slugs. Get valid values from the [News Tags](../helper-list/tags) endpoint.", optional: true, example: "" },
    { name: "extension", type: "string", description: "Data source. Default `idx`.", optional: true, example: "idx" },
    { name: "keyword", type: "string", description: "Case-insensitive substring match on article title. Works for both IDX and mining.", optional: true, example: "" },
    { name: "symbols", type: "string", description: "**IDX only.** Comma-separated IDX symbols. E.g. `BBCA,BBRI`.", optional: true, example: "" },
  ],
};

export const SECTORS_NEWS_TAGS_DEF: EndpointDef = {
  functionName: "SECTORS_NEWS_TAGS",
  path: "tags",
  description: "News Tags",
  exchange: "Indonesia (IDX)",
  category: "Helper Lists",
  "x-mdx-path": "v2/indonesia/helper-list/tags",
  params: [],
};

export const SECTORS_QUARTERLY_FINANCIAL_DATES_DEF: EndpointDef = {
  functionName: "SECTORS_QUARTERLY_FINANCIAL_DATES",
  path: "company/get_quarterly_financial_dates/{symbol}",
  description: "Quarterly Financial Dates",
  exchange: "Indonesia (IDX)",
  category: "Helper Lists",
  "x-mdx-path": "v2/indonesia/helper-list/company-quarterly-dates",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol symbol. E.g. `ASII`, `BBCA`.", example: "BBCA" },
  ],
};

export const SECTORS_SGX_COMPANIES_SCREENER_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_COMPANIES_SCREENER",
  path: "sgx/companies",
  description: "SGX Companies Screener",
  exchange: "Singapore (SGX)",
  category: "SGX - Company Screener",
  "x-mdx-path": "v2/singapore/screener/sgx-companies",
  params: [
    { name: "where", type: "string", description: "SQL-like conditions for advanced filtering. Ignored if `q` is present. Supports operators `=`, `!=`, `>`, `>=`, `<`, `<=`, `like`, `in` combined with `and`/`or`. Use bracket notation for yearly fields: `revenue[2024] > 1000000000`. Supports arithmetic on both sides: `earnings[2024] / earnings[2023] > 1.25`.", optional: true, example: "revenue[2024] > 1000000000" },
    { name: "q", type: "string", description: "A natural language query (e.g. `top 5 SGX banks by market cap`). When `q` is provided, all other query parameters (`where`, `order_by`, etc.) are ignored as the LLM will generate them.", optional: true, example: "top 5 SGX banks by market cap" },
    { name: "order_by", type: "string", description: "Field to sort results by. Use `-` prefix for descending order (e.g. `-market_cap`). Supports arithmetic expressions (e.g. `-(earnings[2024]/earnings[2023])`). Ignored if `q` is present.", optional: true, example: "symbol" },
    { name: "desc", type: "boolean", description: "Sort in descending order. Ignored if `q` is present.", optional: true, example: "false" },
    { name: "limit", type: "number", description: "Maximum number of results to return. Max: 200. Ignored if `q` is present.", optional: true, example: "50" },
    { name: "offset", type: "number", description: "Number of results to skip for pagination. Ignored if `q` is present.", optional: true, example: "0" },
    { name: "include_query_values", type: "boolean", description: "If `true`, the response includes a `query_values` object showing the field values used in filtering/sorting.", optional: true, example: "false" },
  ],
};

export const SECTORS_SGX_DAILY_PRICE_DATA_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_DAILY_PRICE_DATA",
  path: "sgx/daily/{symbol}",
  description: "SGX Daily Price Data",
  exchange: "Singapore (SGX)",
  category: "SGX - Transaction Data",
  "x-mdx-path": "v2/singapore/transaction/daily",
  params: [
    { name: "symbol", type: "string", description: "SGX symbol. E.g. `D05`, `U11`.", example: "D05" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Defaults to 30 days before `end`. Wider ranges are clamped to the most recent 90 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Defaults to today. Future dates return 400.", optional: true, example: "2026-06-1" },
  ],
};

export const SECTORS_SGX_FULL_COMPANY_REPORT_FOR_AN_SGX_LISTED_SYMBOL_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_FULL_COMPANY_REPORT_FOR_AN_SGX_LISTED_SYMBOL",
  path: "sgx/company/report/{symbol}",
  description: "Full company report for an SGX-listed symbol",
  exchange: "Singapore (SGX)",
  category: "SGX - Detailed Reports",
  "x-mdx-path": "v2/singapore/report/company-report",
  params: [
    { name: "symbol", type: "string", description: "SGX symbol symbol. E.g. `D05`, `U11`, `Z74`.", example: "D05" },
    { name: "sections", type: "string", description: "Comma-separated sections to include. Options: `overview`, `valuation`, `financials`, `dividend`. Default: all sections.", optional: true, example: "valuation" },
  ],
};

export const SECTORS_SGX_INSIDER_FILINGS_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_INSIDER_FILINGS",
  path: "sgx/filings",
  description: "SGX Insider Filings",
  exchange: "Singapore (SGX)",
  category: "SGX - News & Filings",
  "x-mdx-path": "v2/singapore/news/sgx-filings",
  params: [
    { name: "symbol", type: "string", description: "SGX symbol to filter by. E.g. `D05`, `U11`.", optional: true, example: "D05" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `timestamp`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Number of results to return. Maximum: 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Number of results to skip for pagination.", optional: true, example: "0" },
    { name: "transaction_type", type: "string", description: "Filter by transaction type (case-insensitive).", optional: true, example: "buy" },
    { name: "holder_type", type: "string", description: "Filter by holder type (case-insensitive).", optional: true, example: "insider" },
  ],
};

export const SECTORS_SGX_LIST_ALL_SGX_SECTORS_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_LIST_ALL_SGX_SECTORS",
  path: "sgx/sectors",
  description: "List all SGX sectors",
  exchange: "Singapore (SGX)",
  category: "SGX - Helper Lists",
  "x-mdx-path": "v2/singapore/helper-list/sgx-sectors",
  params: [],
};

export const SECTORS_SGX_NEWS_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_NEWS",
  path: "sgx/news",
  description: "SGX News",
  exchange: "Singapore (SGX)",
  category: "SGX - News & Filings",
  "x-mdx-path": "v2/singapore/news/sgx-news",
  params: [
    { name: "sector", type: "string", description: "Filter by sector (case-insensitive).", optional: true, example: "financial-services" },
    { name: "sub_sector", type: "string", description: "Filter by sub-sector (case-insensitive).", optional: true, example: "" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `timestamp`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Items per page. Max 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Number of items to skip.", optional: true, example: "0" },
    { name: "tags", type: "string", description: "Comma-separated tag slugs. Get values from [SGX Tags](../singapore/sgx-tags).", optional: true, example: "" },
    { name: "symbols", type: "string", description: "Comma-separated SGX symbols. E.g. `D05,U11`.", optional: true, example: "" },
  ],
};

export const SECTORS_SGX_NEWS_TAGS_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_NEWS_TAGS",
  path: "sgx/tags",
  description: "SGX News Tags",
  exchange: "Singapore (SGX)",
  category: "SGX - Helper Lists",
  "x-mdx-path": "v2/singapore/helper-list/sgx-tags",
  params: [],
};

export const SECTORS_SGX_SHARE_BUYBACKS_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_SHARE_BUYBACKS",
  path: "sgx/buybacks",
  description: "SGX Share Buybacks",
  exchange: "Singapore (SGX)",
  category: "SGX - Transaction Data",
  "x-mdx-path": "v2/singapore/transaction/share-buybacks",
  params: [
    { name: "symbol", type: "string", description: "SGX symbol to filter by. E.g. `D05`, `U11`.", optional: true, example: "D05" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `purchase_date`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Items per page. Max 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Number of items to skip.", optional: true, example: "0" },
  ],
};

export const SECTORS_SGX_SHORT_SELL_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_SHORT_SELL",
  path: "sgx/short-sell",
  description: "SGX Short Sell",
  exchange: "Singapore (SGX)",
  category: "SGX - Transaction Data",
  "x-mdx-path": "v2/singapore/transaction/short-sell",
  params: [
    { name: "symbol", type: "string", description: "SGX symbol to filter by. E.g. `D05`, `U11`.", optional: true, example: "D05" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `date`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Items per page. Max 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Number of items to skip.", optional: true, example: "0" },
  ],
};

export const SECTORS_SGX_TOP_SGX_COMPANIES_BY_CLASSIFICATION_DEF: EndpointDef = {
  functionName: "SECTORS_SGX_TOP_SGX_COMPANIES_BY_CLASSIFICATION",
  path: "sgx/companies/top",
  description: "Top SGX companies by classification",
  exchange: "Singapore (SGX)",
  category: "SGX - Rankings",
  "x-mdx-path": "v2/singapore/ranking/top-companies",
  params: [
    { name: "sector", type: "string", description: "Filter by sector slug. E.g. `financial-services`, `technology`. Default: all sectors.", optional: true, example: "financial-services" },
    { name: "n_stock", type: "number", description: "Number of top companies to return per classification. Max 10. Default: 5.", optional: true, example: "5" },
    { name: "classifications", type: "string", description: "Comma-separated list of classifications. Options: `dividend_yield`, `revenue`, `earnings`, `market_cap`, `pe`. Default: all.", optional: true, example: "market_cap" },
    { name: "min_mcap_million", type: "number", description: "Minimum market cap in million SGD. Default: 1000.", optional: true, example: "1000" },
  ],
};

export const SECTORS_SHAREHOLDERS_COMPOSITION_DEF: EndpointDef = {
  functionName: "SECTORS_SHAREHOLDERS_COMPOSITION",
  path: "company/shareholders-composition/{symbol}",
  description: "Shareholders Composition",
  exchange: "Indonesia (IDX)",
  category: "Detailed Reports",
  "x-mdx-path": "v2/indonesia/company/shareholders-composition",
  params: [
    { name: "symbol", type: "string", description: "IDX symbol. E.g. `BBCA`, `BMRI`.", example: "BBCA" },
    { name: "year", type: "number", description: "Calendar year (e.g. `2025`). Defaults to the current year. Data is available from 2021; earlier years return an empty `data` array. Future years are rejected.", optional: true, example: "2025" },
  ],
};

export const SECTORS_STOCK_SUSPENSIONS_DEF: EndpointDef = {
  functionName: "SECTORS_STOCK_SUSPENSIONS",
  path: "suspensions",
  description: "Stock Suspensions",
  exchange: "Indonesia (IDX)",
  category: "News & Filings",
  "x-mdx-path": "v2/indonesia/news/suspensions",
  params: [
    { name: "symbol", type: "string", description: "Optional filter by IDX symbol (case-insensitive). E.g. `BBCA`, `GOTO`.", optional: true, example: "BBCA" },
    { name: "start", type: "string", description: "Start date in `YYYY-MM-DD` format. Optional; if omitted, no lower bound is applied. Filters on `suspension_date`.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date in `YYYY-MM-DD` format. Optional; if omitted, no upper bound is applied. Future dates return 400.", optional: true, example: "2026-06-1" },
    { name: "limit", type: "number", description: "Items per page. Max 30.", optional: true, example: "20" },
    { name: "offset", type: "number", description: "Number of items to skip.", optional: true, example: "0" },
  ],
};

export const SECTORS_SUBINDUSTRIES_DEF: EndpointDef = {
  functionName: "SECTORS_SUBINDUSTRIES",
  path: "subindustries",
  description: "Subindustries",
  exchange: "Indonesia (IDX)",
  category: "Helper Lists",
  "x-mdx-path": "v2/indonesia/helper-list/subindustries",
  params: [],
};

export const SECTORS_SUBSECTOR_REPORT_DEF: EndpointDef = {
  functionName: "SECTORS_SUBSECTOR_REPORT",
  path: "subsector/report/{sub_sector}",
  description: "Subsector Report",
  exchange: "Indonesia (IDX)",
  category: "Detailed Reports",
  "x-mdx-path": "v2/indonesia/report/sector-report",
  params: [
    { name: "sub_sector", type: "string", description: "Kebab-case subsector slug. E.g. `banks`, `utilities`. Get valid values from the [Subsectors](./helper-list/subsectors) endpoint.", example: "banks" },
    { name: "sections", type: "string", description: "Comma-separated sections to include. Default: all. Options: `statistics`, `market_cap`, `stability`, `valuation`, `growth`, `companies`.", optional: true, example: "valuation,market_cap" },
  ],
};

export const SECTORS_SUBSECTORS_DEF: EndpointDef = {
  functionName: "SECTORS_SUBSECTORS",
  path: "subsectors",
  description: "Subsectors",
  exchange: "Indonesia (IDX)",
  category: "Helper Lists",
  "x-mdx-path": "v2/indonesia/helper-list/subsectors",
  params: [],
};

export const SECTORS_TOP_ACCUMULATIONS_AND_DISTRIBUTIONS_PER_BROKER_DEF: EndpointDef = {
  functionName: "SECTORS_TOP_ACCUMULATIONS_AND_DISTRIBUTIONS_PER_BROKER",
  path: "broker-activity/{broker_code}/top",
  description: "Top Accumulations and Distributions Per Broker",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/broker-activity-top",
  params: [
    { name: "broker_code", type: "string", description: "Broker code. E.g. `MG`, `AK`, `CC`.", example: "MG" },
    { name: "start", type: "string", description: "Start date (YYYY-MM-DD). Default: end - 30 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date (YYYY-MM-DD). Default: today.", optional: true, example: "2026-06-1" },
    { name: "n_brokers", type: "number", description: "How many accumulations and distributions to return each (default 10, max 100).", optional: true, example: "10" },
  ],
};

export const SECTORS_TOP_BROKERS_DAILY_RANKING_DEF: EndpointDef = {
  functionName: "SECTORS_TOP_BROKERS_DAILY_RANKING",
  path: "brokers/top",
  description: "Top Brokers Daily Ranking",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/top",
  params: [
    { name: "cohort", type: "string", description: "Filter by broker cohort (case-insensitive). Default `all`.", optional: true, example: "all" },
    { name: "date", type: "string", description: "Target date (YYYY-MM-DD). Default: latest available.", optional: true, example: "" },
    { name: "metric", type: "string", description: "`gross` ranks by total buy + sell value; `net` ranks by absolute net flow. Default `gross`.", optional: true, example: "gross" },
    { name: "n_brokers", type: "number", description: "How many brokers to return. Default: all matching (typically ~80). Max 200.", optional: true, example: "10" },
    { name: "origin", type: "string", description: "Filter by broker origin. Default `all`.", optional: true, example: "all" },
  ],
};

export const SECTORS_TOP_BUYERS_AND_SELLERS_PER_SYMBOL_DEF: EndpointDef = {
  functionName: "SECTORS_TOP_BUYERS_AND_SELLERS_PER_SYMBOL",
  path: "broker-summary/{symbol}/top",
  description: "Top Buyers and Sellers Per Symbol",
  exchange: "Indonesia (IDX)",
  category: "Brokers",
  "x-mdx-path": "v2/indonesia/brokers/broker-summary-top",
  params: [
    { name: "symbol", type: "string", description: "IDX ticker symbol. E.g. `BBCA`, `GOTO`.", example: "BBCA" },
    { name: "start", type: "string", description: "Start date (YYYY-MM-DD). Default: end - 30 days.", optional: true, example: "2026-05-01" },
    { name: "end", type: "string", description: "End date (YYYY-MM-DD). Default: today.", optional: true, example: "2026-06-1" },
    { name: "cohort", type: "string", description: "Filter brokers by cohort (case-insensitive). Default `all`.", optional: true, example: "all" },
    { name: "n_brokers", type: "number", description: "How many buyers and sellers to return each (default 10, max 100).", optional: true, example: "10" },
    { name: "origin", type: "string", description: "Filter brokers by origin. Default `all`.", optional: true, example: "all" },
  ],
};

export const SECTORS_TOP_COMPANY_MOVERS_DEF: EndpointDef = {
  functionName: "SECTORS_TOP_COMPANY_MOVERS",
  path: "companies/top-changes",
  description: "Top Company Movers",
  exchange: "Indonesia (IDX)",
  category: "Rankings",
  "x-mdx-path": "v2/indonesia/ranking/top-changes",
  params: [
    { name: "sub_sector", type: "string", description: "Filter by kebab-case subsector slug. E.g. `banks`. Get valid values from the [Subsectors](./helper-list/subsectors) endpoint.", optional: true, example: "banks" },
    { name: "n_stock", type: "number", description: "Number of companies per period. Default 5, max 10.", optional: true, example: "5" },
    { name: "classifications", type: "string", description: "Comma-separated. Choices: `top_gainers`, `top_losers`. Default: both.", optional: true, example: "top_gainers,top_losers" },
    { name: "periods", type: "string", description: "Comma-separated periods. Choices: `1d`, `7d`, `14d`, `30d`, `365d`. Default: all.", optional: true, example: "7d" },
    { name: "min_mcap_billion", type: "number", description: "Minimum market cap filter in billion IDR. Default 5000.", optional: true, example: "5000" },
  ],
};

export const SECTORS_SCREEN_DEF: EndpointDef = {
  functionName: "SECTORS_SCREEN",
  path: "companies",
  description: "Screen IDX companies using SQL-like filters",
  exchange: "Indonesia (IDX)",
  category: "Screener",
  "x-mdx-path": "v2/indonesia/companies/screener",
  params: [
    { name: "where", type: "string", description: "SQL-like filter expression. E.g. `sub_sector = 'banks' and pe_ttm < 15`.", example: "sub_sector = 'banks' and pe_ttm < 15" },
    { name: "order_by", type: "string", description: "Sort field with optional `-` prefix for descending. E.g. `-market_cap`.", optional: true, example: "-market_cap" },
    { name: "limit", type: "number", description: "Max results (default 50, max 200).", optional: true, example: "10" },
  ],
};

export const SECTORS_SCREEN_NL_DEF: EndpointDef = {
  functionName: "SECTORS_SCREEN_NL",
  path: "companies",
  description: "Screen IDX companies using a natural-language query",
  exchange: "Indonesia (IDX)",
  category: "Screener",
  "x-mdx-path": "v2/indonesia/companies/screener",
  params: [
    { name: "q", type: "string", description: "Plain-English query. E.g. `top 10 banks by market cap`.", example: "top 10 banks by market cap" },
  ],
};

export const SECTORS_IDX_MARKET_CAP_DEF: EndpointDef = {
  functionName: "SECTORS_IDX_MARKET_CAP",
  path: "idx-total",
  description: "Total IDX market capitalisation over time",
  exchange: "Indonesia (IDX)",
  category: "Market",
  "x-mdx-path": "v2/indonesia/market/idx-total",
  params: [
    { name: "start", type: "string", description: "Start date (YYYY-MM-DD).", optional: true, example: "2024-01-01" },
    { name: "end", type: "string", description: "End date (YYYY-MM-DD).", optional: true, example: "2024-12-31" },
  ],
};

export const API_SCHEMA: EndpointDef[] = [
  SECTORS_BROKER_ACTIVITY_BY_CODE_DEF,
  SECTORS_BROKER_ACTIVITY_PER_SYMBOL_DEF,
  SECTORS_BROKER_REGISTRY_DEF,
  SECTORS_COMPANIES_SCREENER_DEF,
  SECTORS_COMPANIES_WITH_REVENUE_SEGMENTS_DEF,
  SECTORS_COMPANY_FILINGS_DEF,
  SECTORS_COMPANY_IPO_AND_LISTING_PERFORMANCE_DEF,
  SECTORS_COMPANY_QUARTERLY_FINANCIALS_DEF,
  SECTORS_COMPANY_REPORT_DEF,
  SECTORS_COMPANY_REVENUE_SEGMENTS_DEF,
  SECTORS_CORPORATE_ACTIONS_DEF,
  SECTORS_DAILY_NET_FOREIGN_INFLOW_DEF,
  SECTORS_DAILY_TRANSACTION_DATA_DEF,
  SECTORS_FREE_FLOAT_MARKET_ANALYSIS_DEF,
  SECTORS_IDX_MARKET_SUMMARY_DEF,
  SECTORS_INDEX_DAILY_TRANSACTION_DATA_DEF,
  SECTORS_INDUSTRIES_DEF,
  SECTORS_KLSE_FULL_COMPANY_REPORT_FOR_A_KLSE_LISTED_SYMBOL_DEF,
  SECTORS_KLSE_LIST_ALL_KLSE_SECTORS_DEF,
  SECTORS_KLSE_LIST_KLSE_COMPANIES_FILTERED_BY_SECTOR_DEF,
  SECTORS_KLSE_TOP_KLSE_COMPANIES_BY_CLASSIFICATION_DEF,
  SECTORS_MOST_TRADED_STOCKS_DEF,
  SECTORS_NEWS_ARTICLES_DEF,
  SECTORS_NEWS_TAGS_DEF,
  SECTORS_QUARTERLY_FINANCIAL_DATES_DEF,
  SECTORS_SGX_COMPANIES_SCREENER_DEF,
  SECTORS_SGX_DAILY_PRICE_DATA_DEF,
  SECTORS_SGX_FULL_COMPANY_REPORT_FOR_AN_SGX_LISTED_SYMBOL_DEF,
  SECTORS_SGX_INSIDER_FILINGS_DEF,
  SECTORS_SGX_LIST_ALL_SGX_SECTORS_DEF,
  SECTORS_SGX_NEWS_DEF,
  SECTORS_SGX_NEWS_TAGS_DEF,
  SECTORS_SGX_SHARE_BUYBACKS_DEF,
  SECTORS_SGX_SHORT_SELL_DEF,
  SECTORS_SGX_TOP_SGX_COMPANIES_BY_CLASSIFICATION_DEF,
  SECTORS_SHAREHOLDERS_COMPOSITION_DEF,
  SECTORS_STOCK_SUSPENSIONS_DEF,
  SECTORS_SUBINDUSTRIES_DEF,
  SECTORS_SUBSECTOR_REPORT_DEF,
  SECTORS_SUBSECTORS_DEF,
  SECTORS_TOP_ACCUMULATIONS_AND_DISTRIBUTIONS_PER_BROKER_DEF,
  SECTORS_TOP_BROKERS_DAILY_RANKING_DEF,
  SECTORS_TOP_BUYERS_AND_SELLERS_PER_SYMBOL_DEF,
  SECTORS_TOP_COMPANY_MOVERS_DEF,
  SECTORS_SCREEN_DEF,
  SECTORS_SCREEN_NL_DEF,
  SECTORS_IDX_MARKET_CAP_DEF,
];
