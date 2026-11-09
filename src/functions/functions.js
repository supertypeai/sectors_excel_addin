const BASE_URL = "https://api.sectors.app/v2";
const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
const DAY_MS = 86400000;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const NUMBER_REGEX = /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/;
const DATE_PARAMS = new Set(["start", "end", "date", "since", "report_date"]);

/** Excel passes date cells as serial numbers; the API wants YYYY-MM-DD. */
function toIsoDate(v) {
  if (typeof v !== "number") return v;
  return new Date(EXCEL_EPOCH + Math.floor(v) * DAY_MS).toISOString().slice(0, 10);
}

async function apiFetch(endpoint, params = {}) {
  const apiKey = Office.context.document.settings.get("SECTORS_API_KEY");
  if (!apiKey) {
    throw new Error("No API key. Open the Sectors task pane and save your API key first.");
  }

  const url = new URL(BASE_URL + endpoint);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, DATE_PARAMS.has(k) ? toIsoDate(v) : v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  });

  if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || body.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/** URL-encode a path segment (tickers, slugs, province or commodity names). */
function enc(value) {
  return encodeURIComponent(String(value ?? "").trim());
}

/** Numeric strings from the API (e.g. "0.7315") become numbers. */
function toNumber(v) {
  if (typeof v === "string" && NUMBER_REGEX.test(v.trim())) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return v;
}

function sanitizeCell(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "number" || typeof v === "boolean") return v;
  if (Array.isArray(v)) {
    return v.map((x) => (x !== null && typeof x === "object" ? JSON.stringify(x) : x)).join(", ");
  }
  if (typeof v === "object") return JSON.stringify(v);
  if (ISO_DATE_REGEX.test(v)) {
    const t = Date.parse(v);
    if (!Number.isNaN(t)) return (t - EXCEL_EPOCH) / DAY_MS;
  }
  return String(v);
}

/** Pad rows to a rectangle (Excel requires it) and convert cells to Excel scalars. */
function sanitize(rows) {
  const filtered = rows.filter((r) => r.length > 0);
  if (filtered.length === 0) return [["No data"]];
  const cols = Math.max(...filtered.map((r) => r.length));
  return filtered.map((r) => Array.from({ length: cols }, (_, i) => sanitizeCell(r[i])));
}

/** Wrap a function body: sanitize the rows it returns, or return an Error row. */
async function run(build) {
  try {
    return sanitize(await build());
  } catch (error) {
    return [["Error", error.message]];
  }
}

/** Read `a.b.c` from an object; a function accessor is called with the item. */
function pick(obj, accessor) {
  if (typeof accessor === "function") return accessor(obj);
  return String(accessor)
    .split(".")
    .reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), obj);
}

/** Paginated responses wrap rows in `results`; plain ones are arrays. */
function rowsOf(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function cell(obj, accessor, type) {
  const v = pick(obj, accessor);
  return type === "number" ? toNumber(v) : v;
}

/** columns: [[header, accessor, "number"?], ...] */
function table(items, columns) {
  return [columns.map((c) => c[0]), ...(items || []).map((item) => columns.map(([, a, t]) => cell(item, a, t)))];
}

/** spec: [[label, accessor, "number"?], ...] read from one object. */
function keyValues(obj, spec) {
  return spec.map(([label, a, t]) => [label, cell(obj || {}, a, t)]);
}

/** {key: {...}} -> [{[name]: key, ...}] */
function keyed(obj, name) {
  return Object.entries(obj || {}).map(([k, v]) => ({ [name]: k, ...v }));
}

/** Flatten nested objects into dotted keys; arrays of scalars stay arrays (joined later). */
function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v;
    }
  }
  return out;
}

/** Table with one column per (flattened) field, in first-seen order. */
function autoTable(items) {
  const flat = (items || []).map((i) => (i !== null && typeof i === "object" ? flatten(i) : { value: i }));
  const headers = [];
  for (const row of flat) {
    for (const k of Object.keys(row)) if (!headers.includes(k)) headers.push(k);
  }
  return [headers, ...flat.map((row) => headers.map((h) => row[h]))];
}

/**
 * Stack several titled tables vertically: a title row, then that table.
 * Used for responses that hold several differently-shaped lists.
 */
function stackSections(sections) {
  const rows = [];
  for (const [title, items] of sections) {
    if (!items || items.length === 0) continue;
    rows.push([title]);
    rows.push(...autoTable(items));
  }
  return rows;
}

/** Excel passes omitted booleans as null; only send them when set. */
function bool(v) {
  return v === undefined || v === null ? undefined : Boolean(v);
}

/** {group: [item, ...]} -> [{...item, [name]: group}] */
function grouped(obj, name) {
  return Object.entries(obj || {}).flatMap(([k, items]) => (items || []).map((i) => ({ ...i, [name]: k })));
}

/** The KLSE/SGX "top" endpoints key the dividend list by dividend_yield but the value by forward_dividend_yield. */
function topCompaniesRows(data) {
  return table(grouped(data, "_cls"), [
    ["Classification", "_cls"],
    ["Symbol", "symbol"],
    ["Company", "company_name"],
    ["Value", (s) => s[s._cls] ?? s.forward_dividend_yield, "number"],
  ]);
}

/** Screener rows: Symbol, Company Name, then every query_values field. */
async function screener(endpoint, params) {
  const results = rowsOf(await apiFetch(endpoint, { ...params, include_query_values: true }));
  const extra = [...new Set(results.flatMap((r) => Object.keys(r.query_values || {})))];
  return [
    ["Symbol", "Company Name", ...extra],
    ...results.map((r) => [r.symbol, r.company_name, ...extra.map((k) => r.query_values?.[k])]),
  ];
}

const SHAREHOLDER_COLUMNS = [
  ["Shareholder", "name"],
  ["Share %", "share_percentage", "number"],
  ["Share Amount", "share_amount", "number"],
  ["Share Value", "share_value", "number"],
];

const NEWS_COLUMNS = [
  ["Timestamp", "timestamp"],
  ["Title", "title"],
  ["Symbols", "symbols"],
  ["Sector", "sector"],
  ["Sub Sector", "sub_sector"],
  ["Tags", "tags"],
  ["Summary", "body"],
  ["Source", "source"],
];

const CLOSE_COLUMNS = [
  ["Symbol", "symbol"],
  ["Date", "date"],
  ["Close", "close", "number"],
];

const VALUATION_RATIOS = [
  ["PE", "pe", "number"],
  ["PB", "pb", "number"],
  ["PS", "ps", "number"],
  ["PCF", "pcf", "number"],
  ["Beta", "beta", "number"],
];

const PRICE_CHANGE_SPEC = [
  ["Market Cap", "market_cap", "number"],
  ["Sector", "sector"],
  ["Sub Sector", "sub_sector"],
  ["Volume", "volume", "number"],
  ["1D Change", "change_1d", "number"],
  ["7D Change", "change_7d", "number"],
  ["1M Change", "change_1m", "number"],
  ["1Y Change", "change_1y", "number"],
  ["YTD Change", "change_ytd", "number"],
  ["3Y Change", "change_3y", "number"],
];

/** Yearly dividend totals, then upcoming dividends if any (IDX and SGX share this shape). */
function dividendHistory(div) {
  const rows = [["Year", "Total Dividend", "Total Yield"]];
  for (const [year, info] of Object.entries(div.historical_dividends || {})) {
    rows.push([Number(year), info?.total_dividend, info?.total_yield]);
  }
  if (div.upcoming_dividends?.length) rows.push(["Upcoming Dividends"], ...autoTable(div.upcoming_dividends));
  return rows;
}

function corporateActionRows(ca, actionType) {
  return actionType ? autoTable(ca?.[actionType]) : stackSections(Object.entries(ca || {}));
}

/** Two ranked lists (buyers/sellers, accumulations/distributions) in one table. */
function topSides(sides, keyHeader, keyField) {
  const items = sides.flatMap(([side, list]) => (list || []).map((x) => ({ side, ...x })));
  return table(items, [
    ["Side", "side"],
    ["Rank", "rank"],
    [keyHeader, keyField],
    ["Net (IDR)", "net_idr", "number"],
    ["Buy (IDR)", "buy_idr", "number"],
    ["Sell (IDR)", "sell_idr", "number"],
    ["Foreign Net (IDR)", "foreign_net_idr", "number"],
    ["Foreign Buy (IDR)", "foreign_buy_idr", "number"],
    ["Foreign Sell (IDR)", "foreign_sell_idr", "number"],
  ]);
}

/* ────────── SCREENING FUNCTIONS ────────── */
/**
 * Screen IDX companies using SQL-like filters. Any field used in where/orderBy is returned as an extra column.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} where SQL-like filter (e.g. "sub_sector = 'banks' and free_float > 0.3").
 * @param {string} [orderBy] Sort field with optional "-" prefix for desc (e.g. "-market_cap").
 * @param {number} [limit] Max results (default 50, max 200).
 * @param {number} [offset] Results to skip, for pagination.
 * @returns {string[][]} Filtered company list.
 */
async function SCREEN(where, orderBy, limit, offset) {
  return run(() => screener("/companies/", { where, order_by: orderBy, limit, offset }));
}

/**
 * Screen IDX companies using natural language.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} query Plain English query (e.g. "top 10 banks by market cap").
 * @returns {string[][]} Matching companies.
 */
async function SCREEN_NL(query) {
  return run(() => screener("/companies/", { q: query }));
}

/**
 * Get free float for IDX companies (as a fraction, 0.35 = 35%). Use at most one filter.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [subSector] Subsector slug (e.g. "banks").
 * @param {string} [sector] Sector slug (e.g. "financials").
 * @param {string} [industry] Industry slug (e.g. "oil-gas").
 * @param {string} [subIndustry] Sub-industry slug (e.g. "coal-production").
 * @returns {string[][]} Companies with free float, highest first.
 */
async function FREE_FLOAT(subSector, sector, industry, subIndustry) {
  return run(async () => {
    const filters = { sub_sector: subSector, sector, industry, sub_industry: subIndustry };
    const set = Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "");
    if (set.length > 1) {
      throw new Error("Use only one filter: subSector, sector, industry or subIndustry.");
    }
    return table(await apiFetch("/free-float/", Object.fromEntries(set)), [
      ["Symbol", "symbol"],
      ["Company Name", "company_name"],
      ["Free Float %", "free_float", "number"],
    ]);
  });
}

/* ────────── COMPANY REPORT FUNCTIONS ────────── */
/**
 * Get company overview: market cap, sector, ESG, price, listing info.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Key-value overview data.
 */
async function COMPANY_OVERVIEW(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "overview" });
    const o = d.overview || {};
    const atp = o.all_time_price || {};
    const priceOf = (k) => Object.values(atp[k] || {})[0];
    return [
      ["Company Name", d.company_name],
      ...keyValues(o, [
        ["Sector", "sector"],
        ["Sub Sector", "sub_sector"],
        ["Industry", "industry"],
        ["Market Cap", "market_cap", "number"],
        ["Market Cap Rank", "market_cap_rank", "number"],
        ["Last Close Price", "last_close_price", "number"],
        ["Daily Change", "daily_close_change", "number"],
        ["Listing Date", "listing_date"],
        ["Employee Count", "employee_num", "number"],
        ["ESG Score", "esg_score", "number"],
        ["Website", "website"],
        ["Sub Industry", "sub_industry"],
        ["Listing Board", "listing_board"],
        ["Latest Close Date", "latest_close_date"],
        ["Phone", "phone"],
        ["Email", "email"],
        ["Address", "address"],
        ["Indices", "indices"],
        ["Tags", "tags"],
        ["Affiliates", "affiliates"],
      ]),
      ["52W High", priceOf("52_w_high")],
      ["52W Low", priceOf("52_w_low")],
      ["YTD High", priceOf("ytd_high")],
      ["YTD Low", priceOf("ytd_low")],
      ["All-Time High", priceOf("all_time_high")],
      ["All-Time Low", priceOf("all_time_low")],
    ];
  });
}

/**
 * Get company valuation: PE, PB, PS, PCF ratios over time, with peer averages.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Valuation metrics table.
 */
async function COMPANY_VALUATION(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "valuation" });
    const v = d.valuation || {};
    return [
      ...keyValues(v, [
        ["Last Close Price", "last_close_price", "number"],
        ["Forward PE", "forward_pe", "number"],
        ["Intrinsic Value", "intrinsic_value", "number"],
      ]),
      ...table(v.historical_valuation, [
        ["Year", "year", "number"],
        ["PE", "pe", "number"],
        ["PB", "pb", "number"],
        ["PS", "ps", "number"],
        ["PCF", "pcf", "number"],
        ["PEG", "peg", "number"],
        ["EV/EBITDA", "enterprise_to_ebitda", "number"],
        ["EV/Revenue", "enterprise_to_revenue", "number"],
        ["PE Peer Avg", "pe_peer_avg", "number"],
        ["PB Peer Avg", "pb_peer_avg", "number"],
        ["PS Peer Avg", "ps_peer_avg", "number"],
      ]),
    ];
  });
}

/**
 * Get company financials: income stmt, balance sheet, cash flow by year.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Historical financial data table.
 */
async function COMPANY_FINANCIALS(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "financials" });
    const f = d.financials || {};
    return [
      ...keyValues(f, [
        ["EPS", "eps", "number"],
        ["YoY Qtr Earnings Growth", "yoy_quarter_earnings_growth", "number"],
        ["YoY Qtr Revenue Growth", "yoy_quarter_revenue_growth", "number"],
        ["YoY TTM Earnings Growth", "yoy_ttm_earnings_growth", "number"],
        ["YoY TTM Revenue Growth", "yoy_ttm_revenue_growth", "number"],
      ]),
      ...table(f.historical_financials, [
        ["Year", "year", "number"],
        ["Revenue", "revenue", "number"],
        ["Earnings", "earnings", "number"],
        ["EBITDA", "ebitda", "number"],
        ["EBIT", "ebit", "number"],
        ["Total Assets", "total_assets", "number"],
        ["Total Equity", "total_equity", "number"],
        ["Total Debt", "total_debt", "number"],
        ["Free Cash Flow", "free_cash_flow", "number"],
        ["Operating Cash Flow", "operating_cash_flow", "number"],
        ["Gross Profit", "gross_profit", "number"],
        ["Operating P&L", "operating_pnl", "number"],
        ["Earnings Before Tax", "earnings_before_tax", "number"],
        ["Tax", "tax", "number"],
        ["Total Liabilities", "total_liabilities", "number"],
        ["Net Debt", "net_debt", "number"],
        ["Cash & Equivalents", "cash_and_equivalents", "number"],
        ["Investing Cash Flow", "investing_cash_flow", "number"],
        ["Financing Cash Flow", "financing_cash_flow", "number"],
        ["Outstanding Shares", "outstanding_shares", "number"],
      ]),
    ];
  });
}

/**
 * Get company financial ratios by year: profitability, leverage, liquidity, efficiency, capital.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Ratio table by year.
 */
async function COMPANY_FINANCIAL_RATIOS(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "financials" });
    return autoTable(d.financials?.historical_financial_ratio);
  });
}

/**
 * Get company dividend history, yield, and payout ratio.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Dividend metrics and history.
 */
async function COMPANY_DIVIDEND(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "dividend" });
    const div = d.dividend || {};
    return [
      ...keyValues(div, [
        ["Yield TTM", "yield_ttm", "number"],
        ["Dividend TTM", "dividend_ttm", "number"],
        ["Payout Ratio", "payout_ratio", "number"],
        ["Cash Payout Ratio", "cash_payout_ratio", "number"],
        ["Last Ex-Dividend Date", "last_ex_dividend_date"],
        ["Avg Yield (Period Years)", "dividend_yield_avg.period", "number"],
        ["Avg Yield", "dividend_yield_avg.avg_yield", "number"],
      ]),
      ...dividendHistory(div),
    ];
  });
}

/**
 * Get company major shareholders.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Ownership breakdown table.
 */
async function COMPANY_OWNERSHIP(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "ownership" });
    return table(d.ownership?.major_shareholders, SHAREHOLDER_COLUMNS);
  });
}

/**
 * Get institutional transaction flow, top institutional buyers/sellers, whale investors and conglomerate group.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Institutional flow sections.
 */
async function COMPANY_INSTITUTIONAL_FLOW(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "ownership" });
    const o = d.ownership || {};
    const top = o.top_transactions || {};
    return [
      ["Whale Investors", o.whale_investors],
      ["Conglomerate Group", o.conglomerates_group],
      ["Top Transactions Date", top.date],
      ...stackSections([
        ["Institutional Transaction Flow", o.institutional_transaction_flow],
        ["Top Buyers", top.top_buyers],
        ["Top Sellers", top.top_sellers],
      ]),
    ];
  });
}

/**
 * Get company key executives and executive shareholdings.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Management tables.
 */
async function COMPANY_MANAGEMENT(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "management" });
    const m = d.management || {};
    return stackSections([
      ["Key Executives", m.key_executives],
      ["Executive Shareholdings", m.executives_shareholdings],
    ]);
  });
}

/**
 * Get peer comparison: market cap, PE, PB, revenue and earnings for the company and its peers.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Peer comparison table.
 */
async function COMPANY_PEERS(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "peers" });
    const seen = new Set();
    const companies = [];
    for (const group of d.peers || []) {
      for (const c of group.peers_data?.companies || []) {
        if (seen.has(c.symbol)) continue;
        seen.add(c.symbol);
        companies.push(c);
      }
    }
    return table(companies, [
      ["Symbol", "symbol"],
      ["Company Name", "company_name"],
      ["Group", "group"],
      ["Year", "year", "number"],
      ["Market Cap", "market_cap", "number"],
      ["PE TTM", "pe_ttm", "number"],
      ["PB MRQ", "pb_mrq", "number"],
      ["Total Revenue", "total_revenue", "number"],
      ["Net Income", "net_income", "number"],
      ["Pretax Income", "pretax_income", "number"],
      ["Total Assets", "total_assets", "number"],
      ["Total Equity", "total_equity", "number"],
      ["Total Liabilities", "total_liabilities", "number"],
      ["Yearly Mcap Change", "yearly_mcap_chg", "number"],
      ["Employees", "employee_num", "number"],
    ]);
  });
}

/**
 * Get analyst forecasts: EPS/revenue estimates, growth forecasts and rating breakdown.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Forecast tables.
 */
async function COMPANY_FORECAST(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/report/${enc(ticker)}/`, { sections: "future" });
    const f = d.future || {};
    const rating = f.analyst_rating_breakdown;
    return [
      ...stackSections([
        ["Value Forecasts", f.company_value_forecasts],
        ["Growth Forecasts", f.company_growth_forecasts],
      ]),
      ...(rating ? [["Analyst Ratings"], ...autoTable([rating])] : []),
    ];
  });
}

/**
 * Get corporate actions for a company: AGMs, dividends, stock splits, rights issues, bonus, warrants.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [actionType] One of "agm", "dividend", "stock_split", "right_issue", "bonus", "warrant", "upcoming_dividend". Default: all.
 * @returns {string[][]} Corporate actions by type.
 */
async function COMPANY_CORPORATE_ACTIONS(ticker, actionType) {
  return run(async () => {
    const d = await apiFetch(`/company/corporate-actions/${enc(ticker)}/`);
    return corporateActionRows(d.corporate_actions, actionType);
  });
}

/**
 * Get shareholder composition by investor type (local "_l" and foreign "_f" holdings), monthly.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {number} [year] Calendar year (default current year, data from 2021).
 * @returns {string[][]} Shareholder composition by date.
 */
async function SHAREHOLDERS_COMPOSITION(ticker, year) {
  return run(async () => {
    const d = await apiFetch(`/company/shareholders-composition/${enc(ticker)}/`, { year });
    return autoTable(d.data);
  });
}

/* ────────── SUBSECTOR REPORT FUNCTIONS ────────── */
/**
 * Get subsector statistics: company count, PE distribution.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Subsector statistics.
 */
async function SUBSECTOR_STATISTICS(subSector) {
  return run(async () => {
    const d = await apiFetch(`/subsector/report/${enc(subSector)}/`, { sections: "statistics" });
    return keyValues(d.statistics, [
      ["Total Companies", "total_companies", "number"],
      ["Filtered Median PE", "filtered_median_pe", "number"],
      ["Filtered Weighted Avg PE", "filtered_weighted_avg_pe", "number"],
      ["Min Company PE", "min_company_pe", "number"],
      ["Max Company PE", "max_company_pe", "number"],
    ]);
  });
}

/**
 * Get subsector market cap data and performance.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Market cap metrics and changes.
 */
async function SUBSECTOR_MARKET_CAP(subSector) {
  return run(async () => {
    const d = await apiFetch(`/subsector/report/${enc(subSector)}/`, { sections: "market_cap" });
    const m = d.market_cap || {};
    const rows = keyValues(m, [
      ["Total Market Cap", "total_market_cap", "number"],
      ["Avg Market Cap", "avg_market_cap", "number"],
      ["1W Change", "mcap_summary.mcap_change.1w", "number"],
      ["1Y Change", "mcap_summary.mcap_change.1y", "number"],
      ["YTD Change", "mcap_summary.mcap_change.ytd", "number"],
      ["Performance Quantile", "mcap_summary.performance_quantile", "number"],
    ]);
    const q = m.quarterly_market_cap || {};
    const quarters = [
      ...new Set([
        ...Object.keys(q.prev_ttm_mcap || {}),
        ...Object.keys(q.current_ttm_mcap || {}),
      ]),
    ];
    if (quarters.length) {
      rows.push(["Quarter", "TTM Market Cap", "TTM Market Cap (Period Avg)"]);
      for (const k of quarters.sort()) {
        rows.push([k, q.current_ttm_mcap?.[k] ?? q.prev_ttm_mcap?.[k], q.current_ttm_mcap_pavg?.[k]]);
      }
    }
    return rows;
  });
}

/**
 * Get subsector valuation: historical PE/PB/PS/PCF with rank among subsectors.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Valuation table by year.
 */
async function SUBSECTOR_VALUATION(subSector) {
  return run(async () => {
    const d = await apiFetch(`/subsector/report/${enc(subSector)}/`, { sections: "valuation" });
    return table(keyed(d.valuation?.historical_valuation, "year"), [
      ["Year", "year", "number"],
      ["PE", "pe", "number"],
      ["PB", "pb", "number"],
      ["PS", "ps", "number"],
      ["PCF", "pcf", "number"],
      ["PE Rank", "pe_rank"],
      ["PB Rank", "pb_rank"],
      ["PS Rank", "ps_rank"],
      ["PCF Rank", "pcf_rank"],
    ]);
  });
}

/**
 * Get subsector growth metrics and forecasts.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Growth data by year, then forecasts.
 */
async function SUBSECTOR_GROWTH(subSector) {
  return run(async () => {
    const d = await apiFetch(`/subsector/report/${enc(subSector)}/`, { sections: "growth" });
    const forecasts = keyed(d.growth?.growth_forecasts, "year");
    return [
      ...table(keyed(d.growth?.weighted_avg_growth_data, "year"), [
        ["Year", "year", "number"],
        ["Avg Earnings Growth", "avg_annual_earning_growth"],
        ["Avg Revenue Growth", "avg_annual_revenue_growth"],
      ]),
      ...(forecasts.length
        ? table(forecasts, [
            ["Forecast Year", "year", "number"],
            ["Base Year", "base_year"],
            ["EPS Growth", "eps_growth"],
            ["Revenue Growth", "revenue_growth"],
          ])
        : []),
    ];
  });
}

/**
 * Get subsector price stability: weighted max drawdown and relative std. dev. of close.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Stability metrics.
 */
async function SUBSECTOR_STABILITY(subSector) {
  return run(async () => {
    const d = await apiFetch(`/subsector/report/${enc(subSector)}/`, { sections: "stability" });
    return keyValues(d.stability, [
      ["Weighted Max Drawdown", "weighted_max_drawdown", "number"],
      ["Weighted RSD Close", "weighted_rsd_close", "number"],
    ]);
  });
}

/**
 * Get top companies in a subsector by market cap, growth, profit and revenue.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Category, symbol, name, metric, value.
 */
async function SUBSECTOR_TOP_COMPANIES(subSector) {
  return run(async () => {
    const d = await apiFetch(`/subsector/report/${enc(subSector)}/`, { sections: "companies" });
    const rows = [["Category", "Symbol", "Name", "Metric", "Value"]];
    for (const [category, companies] of Object.entries(d.companies?.top_companies || {})) {
      for (const [symbol, info] of Object.entries(companies || {})) {
        const { name, ...metrics } = info || {};
        const [metric, value] = Object.entries(metrics)[0] || [];
        rows.push([category, symbol, name, metric, value]);
      }
    }
    return rows;
  });
}

/* ────────── QUARTERLY FINANCIALS & SEGMENTS ────────── */
/**
 * Get quarterly financial statements for a company.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {number} [nQuarters] Number of recent quarters to retrieve.
 * @param {string} [reportDate] Specific report date (YYYY-MM-DD).
 * @param {boolean} [approx] Match the nearest quarter when reportDate is not exact (default TRUE).
 * @returns {string[][]} Quarterly financial data.
 */
async function QUARTERLY_FINANCIALS(ticker, nQuarters, reportDate, approx) {
  return run(async () => {
    const data = await apiFetch(`/financials/quarterly/${enc(ticker)}/`, {
      n_quarters: nQuarters,
      report_date: reportDate,
      approx: bool(approx),
    });
    return table(rowsOf(data), [
      ["Date", "date"],
      ["Revenue", "revenue", "number"],
      ["Earnings", "earnings", "number"],
      ["Total Assets", "total_assets", "number"],
      ["Total Equity", "total_equity", "number"],
      ["Total Liabilities", "total_liabilities", "number"],
      ["Operating Cash Flow", "operating_cash_flow", "number"],
      ["Gross Profit", "gross_profit", "number"],
      ["Operating Expense", "operating_expense", "number"],
      ["Operating P&L", "operating_pnl", "number"],
      ["EBIT", "ebit", "number"],
      ["EBITDA", "ebitda", "number"],
      ["Earnings Before Tax", "earnings_before_tax", "number"],
      ["Tax", "tax", "number"],
      ["Total Debt", "total_debt", "number"],
      ["Cash Only", "cash_only", "number"],
      ["Investing Cash Flow", "investing_cash_flow", "number"],
      ["Financing Cash Flow", "financing_cash_flow", "number"],
      ["Free Cash Flow", "free_cash_flow", "number"],
      ["Net Interest Income", "financials_sector_metrics.net_interest_income", "number"],
      ["Gross Loan", "financials_sector_metrics.gross_loan", "number"],
      ["Total Deposit", "financials_sector_metrics.total_deposit", "number"],
    ]);
  });
}

/**
 * Get the quarterly report dates available for a company.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Year, date and quarter.
 */
async function QUARTERLY_FINANCIAL_DATES(ticker) {
  return run(async () => {
    const d = await apiFetch(`/company/get_quarterly_financial_dates/${enc(ticker)}/`);
    const rows = [["Year", "Date", "Quarter"]];
    for (const [year, entries] of Object.entries(d || {})) {
      for (const [date, quarter] of entries || []) rows.push([Number(year), date, quarter]);
    }
    return rows;
  });
}

/**
 * Get each IDX company's latest reported quarter (useful to find new quarterly reports).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {number} [year] Only quarters within this calendar year.
 * @param {string} [since] Only companies whose latest quarter is on/after this date (YYYY-MM-DD).
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Symbol, date, quarter.
 */
async function LATEST_QUARTERLY_DATES(year, since, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/companies/quarterly-financial-dates/", { year, since, limit, offset });
    return table(rowsOf(d), [
      ["Symbol", "symbol"],
      ["Date", "date"],
      ["Quarter", "quarter"],
    ]);
  });
}

/**
 * Get revenue/cost breakdown by business segment.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "ASII").
 * @param {number} [financialYear] Year (defaults to latest).
 * @returns {string[][]} Revenue segment breakdown.
 */
async function COMPANY_SEGMENTS(ticker, financialYear) {
  return run(async () => {
    const data = await apiFetch(`/company/get-segments/${enc(ticker)}/`, {
      financial_year: financialYear,
    });
    return table(data.revenue_breakdown, [
      ["Source", "source"],
      ["Target", "target"],
      ["Value (IDR)", "value", "number"],
    ]);
  });
}

/**
 * List companies that have revenue segment data, and the years available.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Symbol and available financial years.
 */
async function COMPANIES_WITH_SEGMENTS() {
  return run(async () => {
    const d = await apiFetch("/companies/list_companies_with_segments/");
    return [
      ["Symbol", "Financial Years"],
      ...Object.entries(d || {}).map(([symbol, info]) => [symbol, info?.financial_year]),
    ];
  });
}

/* ────────── MARKET DATA (IDX) ────────── */
/**
 * Get daily OHLC price, volume, and market cap for a ticker (max 90 days per call).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Daily price/volume data.
 */
async function DAILY_PRICE(ticker, start, end) {
  return run(async () => {
    const data = await apiFetch(`/daily/${enc(ticker)}/`, { start, end });
    return table(data, [
      ["Date", "date"],
      ["Close", "close", "number"],
      ["Volume", "volume", "number"],
      ["Market Cap", "market_cap", "number"],
      ["Open", "open", "number"],
      ["High", "high", "number"],
      ["Low", "low", "number"],
    ]);
  });
}

/**
 * Get the closing price of every IDX ticker for one trading day.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [date] Trading day (YYYY-MM-DD). Default: latest.
 * @param {number} [limit] Tickers per page (default 20, max 30).
 * @param {number} [offset] Tickers to skip.
 * @returns {string[][]} Symbol, date, close.
 */
async function DAILY_CLOSE_ALL(date, limit, offset) {
  return run(async () => {
    return table(rowsOf(await apiFetch("/close/", { date, limit, offset })), CLOSE_COLUMNS);
  });
}

/**
 * Get IDX total market capitalization over time.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} IDX total market cap by date.
 */
async function IDX_MARKET_CAP(start, end) {
  return run(async () => {
    const data = await apiFetch("/idx-total/", { start, end });
    return table(data, [
      ["Date", "date"],
      ["IDX Total Market Cap", "idx_total_market_cap", "number"],
    ]);
  });
}

/**
 * Get daily closing prices for a stock index.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} indexCode Index code (e.g. "ihsg", "lq45", "idx30").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Index daily price data.
 */
async function INDEX_DAILY(indexCode, start, end) {
  return run(async () => {
    const data = await apiFetch(`/index-daily/${enc(indexCode)}/`, { start, end });
    return table(data, [
      ["Date", "date"],
      ["Index", "index_code"],
      ["Price", "price", "number"],
    ]);
  });
}

/**
 * Get the closing level of every IDX index for one trading day.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [date] Trading day (YYYY-MM-DD). Default: latest.
 * @returns {string[][]} Index code, date, price.
 */
async function INDEX_DAILY_ALL(date) {
  return run(async () => {
    const data = await apiFetch("/index-daily/", { date });
    return table(data, [
      ["Index", "index_code"],
      ["Date", "date"],
      ["Price", "price", "number"],
    ]);
  });
}

/**
 * Get most traded stocks by volume in a date range.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {number} [nStock] Number of stocks per day (default 5, max 10).
 * @param {string} [subSector] Subsector slug filter (e.g. "banks").
 * @param {boolean} [adjusted] TRUE ranks by volume x price instead of raw volume.
 * @returns {string[][]} Most traded stocks per date.
 */
async function MOST_TRADED(start, end, nStock, subSector, adjusted) {
  return run(async () => {
    const data = await apiFetch("/most-traded/", {
      start,
      end,
      n_stock: nStock,
      sub_sector: subSector,
      adjusted: bool(adjusted),
    });
    return table(grouped(data, "_date"), [
      ["Date", "_date"],
      ["Symbol", "symbol"],
      ["Company", "company_name"],
      ["Volume", "volume", "number"],
      ["Price", "price", "number"],
    ]);
  });
}

/**
 * Get top stock price movers (gainers and losers).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [classifications] "top_gainers", "top_losers", or both (comma-separated).
 * @param {string} [periods] Comma-separated: "1d", "7d", "14d", "30d", "365d".
 * @param {number} [nStock] Number of stocks (default 5, max 10).
 * @param {string} [subSector] Subsector slug filter (e.g. "banks").
 * @param {number} [minMcapBillion] Minimum market cap in billion IDR (default 5000).
 * @returns {string[][]} Top movers table.
 */
async function TOP_MOVERS(classifications, periods, nStock, subSector, minMcapBillion) {
  return run(async () => {
    const data = await apiFetch("/companies/top-changes/", {
      classifications,
      periods,
      n_stock: nStock,
      sub_sector: subSector,
      min_mcap_billion: minMcapBillion,
    });
    const items = Object.entries(data || {}).flatMap(([type, periods]) =>
      grouped(periods, "_period").map((s) => ({ ...s, _type: type }))
    );
    return table(items, [
      ["Type", "_type"],
      ["Period", "_period"],
      ["Symbol", "symbol"],
      ["Name", "name"],
      ["Price Change", "price_change", "number"],
      ["Last Price", "last_close_price", "number"],
      ["Latest Close Date", "latest_close_date"],
    ]);
  });
}

/**
 * Get stock price performance since IPO listing, plus IPO offering details.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "GOTO").
 * @returns {string[][]} Price change since listing by period, then IPO details.
 */
async function IPO_PERFORMANCE(ticker) {
  return run(async () => {
    const d = await apiFetch(`/listing-performance/${enc(ticker)}/`);
    return [
      ["Period", "Change"],
      ...keyValues(d, [
        ["7 Days", "chg_7d", "number"],
        ["30 Days", "chg_30d", "number"],
        ["90 Days", "chg_90d", "number"],
        ["365 Days", "chg_365d", "number"],
        ["Company Name", "company_name"],
        ["Listing Date", "listing_date"],
        ["Offering Price", "offering_price", "number"],
        ["Shares Offered", "shares_offered", "number"],
        ["% of Total Shares", "percent_total_shares", "number"],
        ["Book Building Start", "book_building_start_date"],
        ["Book Building End", "book_building_end_date"],
        ["Book Building Lower Bound", "book_building_lower_bound", "number"],
        ["Book Building Upper Bound", "book_building_upper_bound", "number"],
        ["Offering Start", "offering_start_date"],
        ["Offering End", "offering_end_date"],
        ["Distribution Date", "distribution_date"],
        ["Prospectus URL", "prospectus_url"],
      ]),
    ];
  });
}

/**
 * Get daily net foreign inflow for a ticker.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [start] Start date (YYYY-MM-DD). Default: end - 90 days.
 * @param {string} [end] End date (YYYY-MM-DD). Default: today.
 * @returns {string[][]} Foreign buy/sell/net by date.
 */
async function FOREIGN_FLOW(ticker, start, end) {
  return run(async () => {
    const d = await apiFetch(`/foreign-flow/${enc(ticker)}/`, { start, end });
    return table(d.data, [
      ["Date", "date"],
      ["Net Foreign Inflow", "net_foreign_inflow", "number"],
      ["Foreign Buy (IDR)", "foreign_buy_idr", "number"],
      ["Foreign Sell (IDR)", "foreign_sell_idr", "number"],
      ["Foreign Share", "foreign_share", "number"],
    ]);
  });
}

/**
 * Get foreign flow for every IDX ticker on one trading day (default: top net foreign buys).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [date] Trading day (YYYY-MM-DD). Default: latest.
 * @param {string} [orderBy] "net_foreign_inflow", "foreign_buy_idr", "foreign_sell_idr" or "symbol"; "-" prefix for desc.
 * @param {number} [limit] Tickers per page (default 20, max 30).
 * @param {number} [offset] Tickers to skip.
 * @returns {string[][]} Foreign flow by ticker.
 */
async function FOREIGN_FLOW_ALL(date, orderBy, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/foreign-flow/", { date, order_by: orderBy, limit, offset });
    return table(rowsOf(d), [
      ["Symbol", "symbol"],
      ["Date", "date"],
      ["Net Foreign Inflow", "net_foreign_inflow", "number"],
      ["Foreign Buy (IDR)", "foreign_buy_idr", "number"],
      ["Foreign Sell (IDR)", "foreign_sell_idr", "number"],
    ]);
  });
}

/**
 * Get IDX insider and major-holder filings.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbol] IDX ticker (e.g. "BBCA").
 * @param {string} [subSector] Subsector slug (e.g. "banks").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {string} [transactionType] "buy", "sell" or "others".
 * @param {string} [holderType] "insider", "institution" or "corporate-investor".
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @param {string} [sector] Sector slug (e.g. "financials").
 * @param {string} [tags] Comma-separated tag slugs.
 * @returns {string[][]} Filings table.
 */
async function FILINGS(symbol, subSector, start, end, transactionType, holderType, limit, offset, sector, tags) {
  return run(async () => {
    const d = await apiFetch("/filings/", {
      symbol,
      sub_sector: subSector,
      start,
      end,
      transaction_type: transactionType,
      holder_type: holderType,
      limit,
      offset,
      sector,
      tags,
    });
    return table(rowsOf(d), [
      ["Timestamp", "timestamp"],
      ["Symbol", "symbol"],
      ["Holder Name", "holder_name"],
      ["Holder Type", "holder_type"],
      ["Transaction Type", "transaction_type"],
      ["Amount", "amount_transaction", "number"],
      ["Price", "price", "number"],
      ["Transaction Value", "transaction_value", "number"],
      ["Holding Before", "holding_before", "number"],
      ["Holding After", "holding_after", "number"],
      ["Share % Before", "share_percentage_before", "number"],
      ["Share % After", "share_percentage_after", "number"],
      ["Share % Transaction", "share_percentage_transaction", "number"],
      ["Title", "title"],
      ["Sector", "sector"],
      ["Sub Sector", "sub_sector"],
      ["Tags", "tags"],
      ["Source", "source"],
    ]);
  });
}

/**
 * Get news articles for IDX (or mining) with filters.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbols] Comma-separated IDX tickers (e.g. "BBCA,BBRI").
 * @param {string} [subSector] Comma-separated subsector slugs.
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {string} [keyword] Case-insensitive match on title.
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @param {string} [sector] Comma-separated sector slugs.
 * @param {string} [tags] Comma-separated tag slugs (see NEWS_TAGS).
 * @param {string} [extension] "idx" (default) or "mining".
 * @param {string} [commodityType] Mining only, e.g. "Coal", "Nickel".
 * @returns {string[][]} News table.
 */
async function NEWS(symbols, subSector, start, end, keyword, limit, offset, sector, tags, extension, commodityType) {
  return run(async () => {
    const ext = extension ? String(extension).toLowerCase() : undefined;
    const d = await apiFetch("/news/", {
      symbols,
      sub_sector: subSector,
      start,
      end,
      keyword,
      limit,
      offset,
      sector,
      tags,
      extension: ext,
      commodity_type: commodityType,
    });
    return ext === "mining" ? autoTable(rowsOf(d)) : table(rowsOf(d), NEWS_COLUMNS);
  });
}

/**
 * Get IDX stock suspensions.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbol] IDX ticker (e.g. "GOTO").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Suspensions table.
 */
async function SUSPENSIONS(symbol, start, end, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/suspensions/", { symbol, start, end, limit, offset });
    return table(rowsOf(d), [
      ["Symbol", "symbol"],
      ["Suspension Date", "suspension_date"],
      ["Reason", "reason"],
      ["PDF", "pdf_url"],
    ]);
  });
}

/**
 * Get the IDX corporate actions calendar across all companies.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [actionType] Comma-separated: "agm","dividend","stock_split","right_issue","bonus","warrant","upcoming_dividend". Default: all.
 * @param {string} [start] Start date (YYYY-MM-DD). Default: end - 30 days.
 * @param {string} [end] End date (YYYY-MM-DD), may be in the future. Default: today + 30 days.
 * @returns {string[][]} Corporate actions grouped by type.
 */
async function CORPORATE_ACTIONS_CALENDAR(actionType, start, end) {
  return run(async () => {
    const d = await apiFetch("/corporate-actions/", { type: actionType, start, end });
    const sections = Object.entries(d || {}).filter(([k, v]) => Array.isArray(v) && k !== "start" && k !== "end");
    return stackSections(sections);
  });
}

/* ────────── BROKERS (IDX) ────────── */
/**
 * List IDX brokers with origin and cohort.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [cohort] "institutional", "mixed", "retail" or "unknown".
 * @param {string} [origin] "domestic" or "foreign".
 * @returns {string[][]} Broker registry.
 */
async function BROKERS(cohort, origin) {
  return run(async () => {
    const d = await apiFetch("/brokers/", { cohort, origin });
    return table(d, [
      ["Code", "code"],
      ["Name", "name"],
      ["Foreign", "is_foreign"],
      ["Cohort", "cohort"],
      ["License Type", "license_type"],
    ]);
  });
}

/**
 * Rank brokers by daily gross or net traded value.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [date] Trading day (YYYY-MM-DD). Default: latest.
 * @param {string} [metric] "gross" (default) or "net".
 * @param {number} [nBrokers] Number of brokers (max 90). Default: all.
 * @param {string} [origin] "all", "domestic" or "foreign".
 * @param {string} [cohort] "all", "institutional", "mixed", "retail" or "unknown".
 * @param {boolean} [foreign] TRUE ranks by the foreign-investor portion of flow.
 * @returns {string[][]} Broker ranking.
 */
async function TOP_BROKERS(date, metric, nBrokers, origin, cohort, foreign) {
  return run(async () => {
    const d = await apiFetch("/brokers/top/", {
      date,
      metric,
      n_brokers: nBrokers,
      origin,
      cohort,
      foreign: bool(foreign),
    });
    return table(d.results, [
      ["Rank", "rank"],
      ["Broker", "broker_code"],
      ["Gross", "gross", "number"],
      ["Net", "net", "number"],
      ["Foreign Gross", "foreign_gross", "number"],
      ["Foreign Net", "foreign_net", "number"],
    ]);
  });
}

const BROKER_FLOW_COLUMNS = [
  ["Buy Freq", "bfreq", "number"],
  ["Buy Lot", "blot", "number"],
  ["Buy Value", "bval", "number"],
  ["Buy Avg Price", "bavg_per_share", "number"],
  ["Sell Freq", "sfreq", "number"],
  ["Sell Lot", "slot", "number"],
  ["Sell Value", "sval", "number"],
  ["Sell Avg Price", "savg_per_share", "number"],
  ["Net Lot", "nlot", "number"],
  ["Net Value", "nval", "number"],
  ["Net Avg Price", "navg_per_share", "number"],
  ["Foreign Buy Value", "f_bval", "number"],
  ["Foreign Sell Value", "f_sval", "number"],
];

function brokerDailyRows(data, keyHeader, keyField) {
  const items = [];
  for (const day of data || []) {
    for (const s of day.summary || []) items.push({ date: day.date, ...s });
  }
  return table(items, [["Date", "date"], [keyHeader, keyField], ...BROKER_FLOW_COLUMNS]);
}

/**
 * Get one broker's daily buy/sell activity per stock.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} brokerCode Broker code (e.g. "YP", "AK").
 * @param {string} [symbol] Limit to one IDX ticker.
 * @param {string} [start] Start date (YYYY-MM-DD). Default: end - 14 days.
 * @param {string} [end] End date (YYYY-MM-DD). Default: today.
 * @returns {string[][]} Daily activity by stock.
 */
async function BROKER_ACTIVITY(brokerCode, symbol, start, end) {
  return run(async () => {
    const d = await apiFetch(`/broker-activity/${enc(brokerCode)}/`, { symbol, start, end });
    return brokerDailyRows(d.data, "Symbol", "symbol");
  });
}

/**
 * Get the stocks a broker accumulated and distributed most over a period.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} brokerCode Broker code (e.g. "YP").
 * @param {string} [start] Start date (YYYY-MM-DD). Default: end - 90 days.
 * @param {string} [end] End date (YYYY-MM-DD). Default: today.
 * @param {number} [nBrokers] Number of stocks per side (default 10, max 90).
 * @param {boolean} [foreign] TRUE ranks by the foreign-investor portion of flow.
 * @returns {string[][]} Top accumulations and distributions.
 */
async function BROKER_TOP_STOCKS(brokerCode, start, end, nBrokers, foreign) {
  return run(async () => {
    const d = await apiFetch(`/broker-activity/${enc(brokerCode)}/top/`, {
      start,
      end,
      n_brokers: nBrokers,
      foreign: bool(foreign),
    });
    return topSides(
      [
        ["accumulation", d.top_accumulations],
        ["distribution", d.top_distributions],
      ],
      "Symbol",
      "symbol"
    );
  });
}

/**
 * Get daily broker buy/sell activity for one stock (broker summary).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [brokerCode] Limit to one broker code.
 * @param {string} [start] Start date (YYYY-MM-DD). Default: end - 14 days.
 * @param {string} [end] End date (YYYY-MM-DD). Default: today.
 * @returns {string[][]} Daily activity by broker.
 */
async function BROKER_SUMMARY(ticker, brokerCode, start, end) {
  return run(async () => {
    const d = await apiFetch(`/broker-summary/${enc(ticker)}/`, { broker_code: brokerCode, start, end });
    return brokerDailyRows(d.data, "Broker", "broker_code");
  });
}

/**
 * Get the top buying and selling brokers for one stock over a period.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [start] Start date (YYYY-MM-DD). Default: end - 90 days.
 * @param {string} [end] End date (YYYY-MM-DD). Default: today.
 * @param {number} [nBrokers] Brokers per side (default 10, max 90).
 * @param {string} [origin] "all", "domestic" or "foreign".
 * @param {string} [cohort] "all", "institutional", "mixed", "retail" or "unknown".
 * @param {boolean} [foreign] TRUE ranks by the foreign-investor portion of flow.
 * @returns {string[][]} Top buyers and sellers.
 */
async function BROKER_SUMMARY_TOP(ticker, start, end, nBrokers, origin, cohort, foreign) {
  return run(async () => {
    const d = await apiFetch(`/broker-summary/${enc(ticker)}/top/`, {
      start,
      end,
      n_brokers: nBrokers,
      origin,
      cohort,
      foreign: bool(foreign),
    });
    return topSides(
      [
        ["buyer", d.top_buyers],
        ["seller", d.top_sellers],
      ],
      "Broker",
      "broker_code"
    );
  });
}

/* ────────── HELPER LISTS (IDX) ────────── */
/**
 * List IDX sectors and subsectors (slugs used by other functions).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Sector and subsector slugs.
 */
async function SUBSECTORS() {
  return run(async () => table(await apiFetch("/subsectors/"), [["Sector", "sector"], ["Subsector", "subsector"]]));
}

/**
 * List IDX industries with their subsector.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Subsector and industry slugs.
 */
async function INDUSTRIES() {
  return run(async () => table(await apiFetch("/industries/"), [["Subsector", "subsector"], ["Industry", "industry"]]));
}

/**
 * List IDX sub-industries with their industry.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Industry and sub-industry slugs.
 */
async function SUBINDUSTRIES() {
  return run(async () =>
    table(await apiFetch("/subindustries/"), [["Industry", "industry"], ["Sub Industry", "sub_industry"]])
  );
}

/**
 * List IDX news/filings tag slugs.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Tag slugs.
 */
async function NEWS_TAGS() {
  return run(async () => table(await apiFetch("/tags/"), [["Tag", (t) => t]]));
}

/* ────────── MALAYSIA (KLSE) FUNCTIONS ────────── */
/**
 * Get available KLSE sectors.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} List of KLSE sectors.
 */
async function KLSE_SECTORS() {
  return run(async () => table(await apiFetch("/klse/sectors/"), [["Sector", (s) => s]]));
}

/**
 * Get KLSE companies in a sector.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} sector KLSE sector slug (e.g. "financials").
 * @returns {string[][]} Companies list.
 */
async function KLSE_COMPANIES(sector) {
  return run(async () => {
    const data = await apiFetch("/klse/companies/", { sector });
    return table(rowsOf(data), [["Symbol", "symbol"], ["Company Name", "company_name"]]);
  });
}

/**
 * Get top KLSE companies by a classification metric.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [classifications] Comma-separated: "dividend_yield","revenue","earnings","market_cap","pe".
 * @param {string} [sector] KLSE sector slug.
 * @param {number} [nStock] Companies per classification (default 5, max 10).
 * @param {number} [minMcapMillion] Minimum market cap in million MYR (default 1000).
 * @returns {string[][]} Top KLSE companies.
 */
async function KLSE_TOP_COMPANIES(classifications, sector, nStock, minMcapMillion) {
  return run(async () => {
    const data = await apiFetch("/klse/companies/top/", {
      classifications,
      sector,
      n_stock: nStock,
      min_mcap_million: minMcapMillion,
    });
    return topCompaniesRows(data);
  });
}

/**
 * Get KLSE company overview: market cap, sector, price changes.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Overview data.
 */
async function KLSE_OVERVIEW(ticker) {
  return run(async () => {
    const d = await apiFetch(`/klse/company/report/${enc(ticker)}/`, { sections: "overview" });
    return [
      ["Name", d.name],
      ...keyValues(d.overview, [...PRICE_CHANGE_SPEC, ["Employee Count", "employee_num", "number"]]),
    ];
  });
}

/**
 * Get KLSE company valuation ratios.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Valuation metrics.
 */
async function KLSE_VALUATION(ticker) {
  return run(async () => {
    const d = await apiFetch(`/klse/company/report/${enc(ticker)}/`, { sections: "valuation" });
    return keyValues(d.valuation, VALUATION_RATIOS);
  });
}

/**
 * Get KLSE company financial data: earnings, revenue, ratios.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Financial data.
 */
async function KLSE_FINANCIALS(ticker) {
  return run(async () => {
    const d = await apiFetch(`/klse/company/report/${enc(ticker)}/`, { sections: "financials" });
    const f = d.financials || {};
    const rows = keyValues(f, [
      ["EPS", "eps", "number"],
      ["Gross Margin", "gross_margin", "number"],
      ["Operating Margin", "operating_margin", "number"],
      ["Net Profit Margin", "net_profit_margin", "number"],
      ["Current Ratio", "current_ratio", "number"],
      ["Quick Ratio", "quick_ratio", "number"],
      ["Debt to Equity", "debt_to_equity", "number"],
    ]);
    rows.push(["Period", "Revenue", "Earnings"]);
    const revenue = f.historical_revenue || {};
    const earnings = f.historical_earnings || {};
    const periods = [...new Set([...Object.keys(revenue), ...Object.keys(earnings)])];
    for (const p of periods) {
      rows.push([toNumber(p), revenue[p], earnings[p]]);
    }
    return rows;
  });
}

/**
 * Get KLSE company dividend data.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Dividend metrics.
 */
async function KLSE_DIVIDEND(ticker) {
  return run(async () => {
    const d = await apiFetch(`/klse/company/report/${enc(ticker)}/`, { sections: "dividend" });
    return keyValues(d.dividend, [
      ["5Y Avg Yield", "dividend_yield_5y_avg", "number"],
      ["Growth Rate", "dividend_growth_rate", "number"],
      ["Payout Ratio", "payout_ratio", "number"],
      ["Forward Dividend", "forward_dividend", "number"],
      ["Forward Div Yield", "forward_dividend_yield", "number"],
      ["Dividend TTM", "dividend_ttm", "number"],
    ]);
  });
}

/* ────────── SINGAPORE (SGX) FUNCTIONS ────────── */
const SGX_SECTOR_LABELS = {
  "basic-materials": "Basic Materials",
  "communication-services": "Communication Services",
  "consumer-cyclicals": "Consumer Cyclicals",
  "consumer-defensive": "Consumer Defensive",
  "consumer-non-cyclicals": "Consumer Non-Cyclicals",
  energy: "Energy",
  "financial-services": "Financial Services",
  healthcare: "Healthcare",
  industrials: "Industrials",
  infrastructures: "Infrastructures",
  "properties-real-estate": "Properties & Real Estate",
  reit: "REIT",
  technology: "Technology",
  "transportation-logistics": "Transportation & Logistics",
  utilities: "Utilities",
};

/**
 * Get available SGX sectors.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} List of SGX sectors.
 */
async function SGX_SECTORS() {
  return run(async () => table(await apiFetch("/sgx/sectors/"), [["Sector", (s) => s]]));
}

/**
 * List SGX sectors and subsectors.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Sector and subsector slugs.
 */
async function SGX_SUBSECTORS() {
  return run(async () =>
    table(await apiFetch("/sgx/subsectors/"), [["Sector", "sector"], ["Subsector", "subsector"]])
  );
}

/**
 * Get SGX companies in a sector.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} sector SGX sector slug (e.g. "financial-services") or label (e.g. "Financial Services").
 * @returns {string[][]} Companies list.
 */
async function SGX_COMPANIES(sector) {
  return run(async () => {
    const key = String(sector || "").trim();
    if (!key) throw new Error("sector is required, e.g. \"financial-services\". See SGX_SECTORS().");
    const label = SGX_SECTOR_LABELS[key.toLowerCase()] || key;
    const data = await apiFetch("/sgx/companies/", { where: `sector = '${label}'`, limit: 200 });
    return table(rowsOf(data), [["Symbol", "symbol"], ["Company Name", "company_name"]]);
  });
}

/**
 * Screen SGX companies using SQL-like filters. Any field used in where/orderBy is returned as an extra column.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} where SQL-like filter (e.g. "sub_sector = 'Banks & Credit Services'").
 * @param {string} [orderBy] Sort field with optional "-" prefix for desc (e.g. "-market_cap").
 * @param {number} [limit] Max results (default 50, max 200).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Filtered company list.
 */
async function SGX_SCREEN(where, orderBy, limit, offset) {
  return run(() => screener("/sgx/companies/", { where, order_by: orderBy, limit, offset }));
}

/**
 * Screen SGX companies using natural language.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} query Plain English query (e.g. "top 5 SGX banks by market cap").
 * @returns {string[][]} Matching companies.
 */
async function SGX_SCREEN_NL(query) {
  return run(() => screener("/sgx/companies/", { q: query }));
}

/**
 * Get top SGX companies by a classification metric.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [classifications] Comma-separated: "dividend_yield","revenue","earnings","market_cap","pe".
 * @param {string} [sector] SGX sector slug.
 * @param {number} [nStock] Companies per classification (default 5, max 10).
 * @param {number} [minMcapMillion] Minimum market cap in million SGD (default 1000).
 * @returns {string[][]} Top SGX companies.
 */
async function SGX_TOP_COMPANIES(classifications, sector, nStock, minMcapMillion) {
  return run(async () => {
    const data = await apiFetch("/sgx/companies/top/", {
      classifications,
      sector,
      n_stock: nStock,
      min_mcap_million: minMcapMillion,
    });
    return topCompaniesRows(data);
  });
}

/**
 * Get SGX company overview: market cap, sector, multi-period price changes.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Overview data.
 */
async function SGX_OVERVIEW(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/report/${enc(ticker)}/`, { sections: "overview" });
    return [
      ["Name", d.name],
      ...keyValues(d.overview, [
        ...PRICE_CHANGE_SPEC,
        ["Last Close Price", "last_close_price", "number"],
        ["Listing Date", "listing_date"],
        ["Employee Count", "employee_num", "number"],
        ["Website", "website"],
        ["Address", "address"],
        ["Tags", "tags"],
      ]),
    ];
  });
}

/**
 * Get SGX company valuation ratios.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Valuation metrics.
 */
async function SGX_VALUATION(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/report/${enc(ticker)}/`, { sections: "valuation" });
    return keyValues(d.valuation, VALUATION_RATIOS);
  });
}

/**
 * Get SGX company financial data with income stmt and cash flow by year.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Financial data table.
 */
async function SGX_FINANCIALS(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/report/${enc(ticker)}/`, { sections: "financials" });
    const f = d.financials || {};
    const rows = keyValues(f, [
      ["EPS", "eps", "number"],
      ["Operating Margin", "operating_margin", "number"],
      ["Net Profit Margin", "net_profit_margin", "number"],
      ["Gross Margin", "gross_margin", "number"],
      ["1Y EPS Growth", "one_year_eps_growth", "number"],
      ["1Y Sales Growth", "one_year_sales_growth", "number"],
      ["Current Ratio", "current_ratio", "number"],
      ["Quick Ratio", "quick_ratio", "number"],
      ["Debt to Equity", "debt_to_equity", "number"],
    ]);
    rows.push(
      ...table(keyed(f.historical_financials, "year"), [
        ["Year", "year", "number"],
        ["Revenue", "revenue", "number"],
        ["Earnings", "earnings", "number"],
        ["Date", "date"],
        ["Operating Cash Flow", "cash_flow_metrics.operating_cash_flow", "number"],
        ["Free Cash Flow", "cash_flow_metrics.free_cash_flow", "number"],
        ["Capex", "cash_flow_metrics.capital_expenditure", "number"],
        ["Pretax Income", "income_stmt_metrics.pretax_income", "number"],
        ["Operating Income", "income_stmt_metrics.operating_income", "number"],
        ["Net Interest Income", "income_stmt_metrics.net_interest_income", "number"],
      ])
    );
    return rows;
  });
}

/**
 * Get SGX company dividend data with full history.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Dividend metrics and yearly history.
 */
async function SGX_DIVIDEND(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/report/${enc(ticker)}/`, { sections: "dividend" });
    const div = d.dividend || {};
    return [
      ...keyValues(div, [
        ["5Y Avg Yield", "dividend_yield_5y_avg", "number"],
        ["Growth Rate", "dividend_growth_rate", "number"],
        ["Payout Ratio", "payout_ratio", "number"],
        ["Forward Dividend", "forward_dividend", "number"],
        ["Dividend TTM", "dividend_ttm", "number"],
        ["Forward Div Yield", "forward_dividend_yield", "number"],
      ]),
      ...dividendHistory(div),
    ];
  });
}

/**
 * Get SGX company current and former management.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Management tables.
 */
async function SGX_MANAGEMENT(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/report/${enc(ticker)}/`, { sections: "management" });
    const m = d.management || {};
    return stackSections([
      ["Management", m.management],
      ["Former Management", m.former_management],
    ]);
  });
}

/**
 * Get SGX company major shareholders.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Ownership table.
 */
async function SGX_OWNERSHIP(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/report/${enc(ticker)}/`, { sections: "ownership" });
    return table(d.ownership?.major_shareholders, SHAREHOLDER_COLUMNS);
  });
}

/**
 * Get SGX daily OHLC price and volume (max 90 days per call).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Daily price data.
 */
async function SGX_DAILY_PRICE(ticker, start, end) {
  return run(async () => {
    const data = await apiFetch(`/sgx/daily/${enc(ticker)}/`, { start, end });
    return table(data, [
      ["Date", "date"],
      ["Close", "close", "number"],
      ["Volume", "volume", "number"],
      ["Open", "open", "number"],
      ["High", "high", "number"],
      ["Low", "low", "number"],
    ]);
  });
}

/**
 * Get the closing price of every SGX ticker for one trading day.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [date] Trading day (YYYY-MM-DD). Default: latest.
 * @param {number} [limit] Tickers per page (default 20, max 30).
 * @param {number} [offset] Tickers to skip.
 * @returns {string[][]} Symbol, date, close.
 */
async function SGX_DAILY_CLOSE_ALL(date, limit, offset) {
  return run(async () => {
    return table(rowsOf(await apiFetch("/sgx/close/", { date, limit, offset })), CLOSE_COLUMNS);
  });
}

/**
 * Get SGX corporate actions for a company: AGMs, dividends, upcoming dividends.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker SGX ticker (e.g. "C07").
 * @param {string} [actionType] e.g. "agm", "dividend", "upcoming_dividend". Default: all.
 * @returns {string[][]} Corporate actions by type.
 */
async function SGX_CORPORATE_ACTIONS(ticker, actionType) {
  return run(async () => {
    const d = await apiFetch(`/sgx/company/corporate-actions/${enc(ticker)}/`);
    return corporateActionRows(d.corporate_actions, actionType);
  });
}

/**
 * Get SGX insider and institutional filings.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbol] SGX ticker (e.g. "D05").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {string} [transactionType] "buy", "sell", "award", "transfer" or "others".
 * @param {string} [holderType] "insider" or "institution".
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Filings table.
 */
async function SGX_FILINGS(symbol, start, end, transactionType, holderType, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/sgx/filings/", {
      symbol,
      start,
      end,
      transaction_type: transactionType,
      holder_type: holderType,
      limit,
      offset,
    });
    return table(rowsOf(d), [
      ["Timestamp", "timestamp"],
      ["Symbol", "symbol"],
      ["Holder Name", "holder_name"],
      ["Holder Type", "holder_type"],
      ["Transaction Type", "transaction_type"],
      ["Transaction Value", "transaction_value", "number"],
      ["Share % Transaction", "share_percentage_transaction.total", "number"],
      ["Holding Before", "interest_breakdown.before.total.amount", "number"],
      ["Holding After", "interest_breakdown.after.total.amount", "number"],
      ["Share % Before", "interest_breakdown.before.total.percentage", "number"],
      ["Share % After", "interest_breakdown.after.total.percentage", "number"],
      ["Prices", (r) => (r.price_per_share || []).map((p) => `${p.amount}@${p.price}`).join("; ")],
    ]);
  });
}

/**
 * Get SGX news articles.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbols] Comma-separated SGX tickers (e.g. "D05,U11").
 * @param {string} [sector] Sector filter.
 * @param {string} [subSector] Sub-sector filter.
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {string} [tags] Comma-separated tag slugs (see SGX_NEWS_TAGS).
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} News table.
 */
async function SGX_NEWS(symbols, sector, subSector, start, end, tags, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/sgx/news/", {
      symbols,
      sector,
      sub_sector: subSector,
      start,
      end,
      tags,
      limit,
      offset,
    });
    return table(rowsOf(d), NEWS_COLUMNS);
  });
}

/**
 * List SGX news tag slugs.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Tag slugs.
 */
async function SGX_NEWS_TAGS() {
  return run(async () => {
    const d = await apiFetch("/sgx/tags/");
    return table(d.tags, [["Tag", (t) => t]]);
  });
}

/**
 * Get SGX share buybacks.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbol] SGX ticker (e.g. "U11").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Buybacks table.
 */
async function SGX_BUYBACKS(symbol, start, end, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/sgx/buybacks/", { symbol, start, end, limit, offset });
    return table(rowsOf(d), [
      ["Symbol", "symbol"],
      ["Purchase Date", "purchase_date"],
      ["Type", "type"],
      ["Lowest Price", "price_per_share.lowest", "number"],
      ["Highest Price", "price_per_share.highest", "number"],
      ["Total Value", "total_value", "number"],
      ["Shares Purchased", "total_shares_purchased", "number"],
      ["Treasury Shares After", "treasury_shares_after_purchase", "number"],
      ["Mandate Start", "mandate.mandate_start"],
      ["Mandate End", "mandate.mandate_end"],
      ["Mandate Total", "mandate.mandate_total", "number"],
      ["Mandate Remaining", "mandate.mandate_remaining", "number"],
      ["Cumulative Purchased", "mandate.cumulative_purchased", "number"],
    ]);
  });
}

/**
 * Get SGX daily short-sell volume and value.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbol] SGX ticker (e.g. "D05").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {string} [orderBy] "date", "symbol", "value" or "volume"; "-" prefix for desc (default "-date").
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Short-sell table.
 */
async function SGX_SHORT_SELL(symbol, start, end, orderBy, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/sgx/short-sell/", { symbol, start, end, order_by: orderBy, limit, offset });
    return table(rowsOf(d), [
      ["Symbol", "symbol"],
      ["Name", "name"],
      ["Date", "date"],
      ["Volume", "volume", "number"],
      ["Value", "value", "number"],
    ]);
  });
}

/* ────────── SGX REITs ────────── */
/**
 * Screen SGX REITs using SQL-like filters (e.g. "aggregate_leverage[latest] < 0.4").
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [where] SQL-like filter.
 * @param {string} [orderBy] Sort field with optional "-" prefix for desc.
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Matching REITs with the fields used.
 */
async function SGX_REIT_SCREEN(where, orderBy, limit, offset) {
  return run(() => screener("/sgx/reits/", { where, order_by: orderBy, limit, offset }));
}

/**
 * Screen SGX REITs using natural language.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} query Plain English query (e.g. "REITs with gearing below 35%").
 * @returns {string[][]} Matching REITs.
 */
async function SGX_REIT_SCREEN_NL(query) {
  return run(() => screener("/sgx/reits/", { q: query }));
}

/**
 * Get an SGX REIT's managers, sponsor, trustee and board.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker REIT ticker (e.g. "A17U").
 * @returns {string[][]} REIT profile.
 */
async function SGX_REIT_PROFILE(ticker) {
  return run(async () => {
    const d = await apiFetch(`/sgx/reits/profile/${enc(ticker)}/`);
    return [
      ["Company Name", d.company_name],
      ["Sub Sector", d.sub_sector],
      ...keyValues(d.management, [
        ["Sponsor", "sponsor"],
        ["Trustee", "trustee"],
        ["REIT Manager", "reit_manager"],
        ["Property Manager", "property_manager"],
      ]),
      ...stackSections([["Board", d.board]]),
    ];
  });
}

/**
 * Get an SGX REIT's yearly performance: NPI, DPU, gearing, occupancy, WALE.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker REIT ticker (e.g. "A17U").
 * @param {number} [financialYear] Financial year (default latest).
 * @returns {string[][]} Key-value performance metrics.
 */
async function SGX_REIT_PERFORMANCE(ticker, financialYear) {
  return run(async () => {
    const d = await apiFetch(`/sgx/reits/performance/${enc(ticker)}/`, { financial_year: financialYear });
    const { distribution_record: record, ...perf } = d.performance || {};
    const rows = [
      ...keyValues(d, [
        ["Financial Year", "financial_year", "number"],
        ["Available Years", "available_years"],
        ["Market Cap", "market_cap", "number"],
        ["Last Close Price", "last_close_price", "number"],
        ["Distribution Yield", "distribution_yield", "number"],
        ["Price to NAV", "price_to_nav", "number"],
      ]),
      ...Object.entries(flatten(perf)),
    ];
    if (record && record.length) rows.push(["Distribution Record"], ...autoTable(record));
    return rows;
  });
}

/**
 * Get an SGX REIT's property portfolio.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker REIT ticker (e.g. "A17U").
 * @param {number} [financialYear] Financial year (default latest).
 * @returns {string[][]} Properties table.
 */
async function SGX_REIT_PROPERTIES(ticker, financialYear) {
  return run(async () => {
    const d = await apiFetch(`/sgx/reits/properties/${enc(ticker)}/`, { financial_year: financialYear });
    return autoTable(d.properties);
  });
}

/**
 * Get an SGX REIT's top tenants.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker REIT ticker (e.g. "AJBU").
 * @param {number} [financialYear] Financial year (default latest).
 * @returns {string[][]} Tenants table.
 */
async function SGX_REIT_TENANTS(ticker, financialYear) {
  return run(async () => {
    const d = await apiFetch(`/sgx/reits/tenants/${enc(ticker)}/`, { financial_year: financialYear });
    return autoTable(d.tenants);
  });
}

/**
 * Get an SGX REIT's trade mix (income by trade category).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} ticker REIT ticker (e.g. "C38U").
 * @param {number} [financialYear] Financial year (default latest).
 * @returns {string[][]} Trade mix table.
 */
async function SGX_REIT_TRADE_MIX(ticker, financialYear) {
  return run(async () => {
    const d = await apiFetch(`/sgx/reits/trade-mix/${enc(ticker)}/`, { financial_year: financialYear });
    return autoTable(d.trade_mix);
  });
}

/**
 * Get SGX REIT property acquisitions and divestments.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [symbol] REIT ticker (e.g. "C38U").
 * @param {string} [start] Earliest completed date (YYYY-MM-DD).
 * @param {string} [end] Latest completed date (YYYY-MM-DD).
 * @param {string} [transactionType] "acquisition" or "divestment".
 * @param {number} [financialYear] Financial year.
 * @param {string} [orderBy] "completed_date", "symbol" or "transaction_price"; "-" prefix for desc.
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Transactions table.
 */
async function SGX_REIT_TRANSACTIONS(symbol, start, end, transactionType, financialYear, orderBy, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/sgx/reits/transactions/", {
      symbol,
      start,
      end,
      transaction_type: transactionType,
      financial_year: financialYear,
      order_by: orderBy,
      limit,
      offset,
    });
    return autoTable(rowsOf(d));
  });
}

/* ────────── MINING (INDONESIA) ────────── */
/**
 * List commodities with price history available.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Commodity names and date coverage.
 */
async function MINING_COMMODITIES() {
  return run(async () => autoTable(await apiFetch("/mining/commodities/")));
}

/**
 * Get monthly commodity price history (max 3-year range).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} commodity Commodity name (e.g. "Coal", "Gold").
 * @param {number} [startYear] Start year (default current year - 2).
 * @param {number} [endYear] End year inclusive (default current year).
 * @returns {string[][]} Price history.
 */
async function MINING_COMMODITY_PRICE(commodity, startYear, endYear) {
  return run(async () =>
    autoTable(
      await apiFetch(`/mining/commodities/${enc(commodity)}/price/`, { start_year: startYear, end_year: endYear })
    )
  );
}

/**
 * List mining companies.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [commodityType] e.g. "Coal", "Nickel", "Gold".
 * @param {string} [keyword] Search name, IDX symbol, slug or operations.
 * @param {string} [companyType] "Mine Owner", "Contractor", "Holding", "Trader", "Consultant" or "Manufacturer".
 * @param {boolean} [hasFinancials] TRUE returns only companies with financial data.
 * @param {number} [limit] Results per page (default 20).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Mining companies (use the slug in other MINING_ functions).
 */
async function MINING_COMPANIES(commodityType, keyword, companyType, hasFinancials, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/mining/companies/", {
      commodity_type: commodityType,
      keyword,
      company_type: companyType,
      has_financials: bool(hasFinancials),
      limit,
      offset,
    });
    return autoTable(rowsOf(d));
  });
}

/**
 * Get a mining company's profile and licenses.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} slug Company slug from MINING_COMPANIES (e.g. "pt-adaro-andalan-indonesia-tbk").
 * @returns {string[][]} Profile, then licenses and contracts.
 */
async function MINING_COMPANY(slug) {
  return run(async () => {
    const d = await apiFetch(`/mining/companies/${enc(slug)}/`);
    const { mining_license: licenses, mining_contract: contracts, ...profile } = d || {};
    return [
      ...Object.entries(flatten(profile)),
      ...stackSections([
        ["Mining Licenses", licenses],
        ["Mining Contracts", contracts],
      ]),
    ];
  });
}

/**
 * Get a mining company's financials (USD) for a year.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} slug Company slug (e.g. "pt-adaro-andalan-indonesia-tbk").
 * @param {number} [year] Year (default latest).
 * @returns {string[][]} Key-value financials.
 */
async function MINING_COMPANY_FINANCIALS(slug, year) {
  return run(async () => {
    const d = await apiFetch(`/mining/companies/financials/${enc(slug)}/`, { year });
    return [["Available Years", d.available_years], ...Object.entries(flatten(d.data))];
  });
}

/**
 * Get a mining company's parent companies and subsidiaries.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} slug Company slug (e.g. "pt-adaro-andalan-indonesia-tbk").
 * @returns {string[][]} Ownership tables.
 */
async function MINING_COMPANY_OWNERSHIP(slug) {
  return run(async () => {
    const d = await apiFetch(`/mining/companies/ownership/${enc(slug)}/`);
    return stackSections([
      ["Parents", d.parents],
      ["Subsidiaries", d.subsidiaries],
    ]);
  });
}

/**
 * Get a mining company's production, sales, strip ratio and reserves by commodity.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} slug Company slug (e.g. "pt-adaro-andalan-indonesia-tbk").
 * @param {string} [commodityType] e.g. "Coal", "Nickel".
 * @param {number} [year] Year (default latest).
 * @returns {string[][]} Performance table.
 */
async function MINING_COMPANY_PERFORMANCE(slug, commodityType, year) {
  return run(async () => {
    const d = await apiFetch(`/mining/companies/performance/${enc(slug)}/`, {
      commodity_type: commodityType,
      year,
    });
    const items = (d.data || []).map((x) => {
      const { products, ...stats } = x.commodity_stats || {};
      return { ...x, commodity_stats: stats, products: (products || []).map((p) => p.product_name) };
    });
    return autoTable(items);
  });
}

/**
 * Get a mining company's sales by destination country.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} slug Company slug (e.g. "pt-adaro-andalan-indonesia-tbk").
 * @param {number} [year] Year (default latest).
 * @returns {string[][]} Sales destinations.
 */
async function MINING_SALES_DESTINATION(slug, year) {
  return run(async () => {
    const d = await apiFetch(`/mining/sales-destination/${enc(slug)}/`, { year });
    return autoTable(keyed(d.data, "country"));
  });
}

/**
 * List mining contracts between mine owners and contractors.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [contractor] Contractor company slug.
 * @param {string} [mineOwner] Mine owner company slug.
 * @returns {string[][]} Contracts table.
 */
async function MINING_CONTRACTS(contractor, mineOwner) {
  return run(async () => autoTable(await apiFetch("/mining/contracts/", { contractor, mine_owner: mineOwner })));
}

/**
 * Get Indonesia's top export destinations for a commodity.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} commodityType "Coal", "Copper" or "Gold" (e.g. "Coal").
 * @param {number} year Year (e.g. 2024).
 * @param {number} [limit] Countries to return (default 20, max 30).
 * @returns {string[][]} Export destinations.
 */
async function MINING_EXPORTS(commodityType, year, limit) {
  return run(async () =>
    autoTable(await apiFetch("/mining/exports/", { commodity_type: commodityType, year, limit }))
  );
}

/**
 * Get global production, reserves and trade by country for a commodity.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [commodityType] e.g. "Coal", "Nickel" (required if no country).
 * @param {string} [country] e.g. "Australia" (required if no commodity).
 * @param {number} [limit] Results (default 20, max 30).
 * @returns {string[][]} Global commodity data.
 */
async function MINING_GLOBAL_COMMODITY(commodityType, country, limit) {
  return run(async () => {
    if (!commodityType && !country) throw new Error("Provide a commodityType or a country.");
    return autoTable(await apiFetch("/mining/global-commodity/", { commodity_type: commodityType, country, limit }));
  });
}

/**
 * Get Indonesia's total yearly production for a commodity.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} commodityType "Coal", "Copper", "Gold" or "Nickel" (e.g. "Coal").
 * @returns {string[][]} Production by year.
 */
async function MINING_TOTAL_PRODUCTION(commodityType) {
  return run(async () => autoTable(await apiFetch("/mining/total-production/", { commodity_type: commodityType })));
}

/**
 * List mining licenses (IUP, IUPK, etc.).
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [province] Province (exact, e.g. "Kalimantan Timur").
 * @param {string} [commodityType] e.g. "Coal", "Nickel".
 * @param {string} [company] Company slug.
 * @param {string} [licenseType] e.g. "IUP", "IUPK".
 * @param {string} [activity] "Eksplorasi" or "Operasi Produksi".
 * @param {boolean} [expiringSoon] TRUE for licenses expiring within 365 days.
 * @param {string} [orderBy] e.g. "license_expiry_date", "-licensed_area_ha".
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Licenses table.
 */
async function MINING_LICENSES(
  province,
  commodityType,
  company,
  licenseType,
  activity,
  expiringSoon,
  orderBy,
  limit,
  offset
) {
  return run(async () => {
    const d = await apiFetch("/mining/licenses/", {
      province,
      commodity_type: commodityType,
      company,
      license_type: licenseType,
      activity,
      expiring_soon: bool(expiringSoon),
      order_by: orderBy,
      limit,
      offset,
    });
    return autoTable(rowsOf(d));
  });
}

/**
 * List mining license (WIUP/WIUPK) auctions.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [province] Province (e.g. "Sulawesi Selatan").
 * @param {string} [commodityType] e.g. "Nickel", "Coal".
 * @param {string} [participant] Company name that participated (partial match).
 * @param {string} [status] Auction status (e.g. "Lelang Selesai").
 * @param {string} [areaType] "WIUP" or "WIUPK".
 * @param {string} [orderBy] e.g. "-winner_date", "-licensed_area_ha".
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Auctions table.
 */
async function MINING_LICENSE_AUCTIONS(province, commodityType, participant, status, areaType, orderBy, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/mining/license-auctions/", {
      province,
      commodity_type: commodityType,
      participant,
      status,
      area_type: areaType,
      order_by: orderBy,
      limit,
      offset,
    });
    return autoTable(rowsOf(d));
  });
}

/**
 * Get one mining license auction with its phases and participants.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} wiupCode WIUP code from MINING_LICENSE_AUCTIONS (e.g. "1752072062023002").
 * @returns {string[][]} Auction detail.
 */
async function MINING_LICENSE_AUCTION(wiupCode) {
  return run(async () => {
    const d = await apiFetch(`/mining/license-auctions/${enc(wiupCode)}/`);
    const { phases, participants, ...detail } = d || {};
    return [
      ...Object.entries(flatten(detail)),
      ...stackSections([
        ["Phases", phases],
        ["Participants", participants],
      ]),
    ];
  });
}

/**
 * List mining sites with production and strip ratio.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} [province] Province (exact).
 * @param {string} [commodityType] e.g. "Coal", "Nickel".
 * @param {string} [company] Company slug.
 * @param {number} [year] Reporting year.
 * @param {string} [orderBy] e.g. "-production_volume", "-year".
 * @param {number} [minProduction] Minimum production volume.
 * @param {number} [limit] Results per page (default 20, max 30).
 * @param {number} [offset] Results to skip.
 * @returns {string[][]} Mining sites.
 */
async function MINING_SITES(province, commodityType, company, year, orderBy, minProduction, limit, offset) {
  return run(async () => {
    const d = await apiFetch("/mining/sites/", {
      province,
      commodity_type: commodityType,
      company,
      year,
      order_by: orderBy,
      min_production: minProduction,
      limit,
      offset,
    });
    return autoTable(rowsOf(d));
  });
}

/**
 * Get one mining site's detail, reserves and location.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} slug Site slug from MINING_SITES (e.g. "batubara-benhes-3").
 * @returns {string[][]} Key-value site detail.
 */
async function MINING_SITE(slug) {
  return run(async () => Object.entries(flatten(await apiFetch(`/mining/sites/${enc(slug)}/`))));
}

/**
 * List provinces, commodities and years with resources & reserves data.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @returns {string[][]} Province, commodity, years.
 */
async function MINING_RESERVES_INDEX() {
  return run(async () => {
    const d = await apiFetch("/mining/resources-reserves/");
    const rows = [["Province", "Commodity", "Years"]];
    for (const [province, commodities] of Object.entries(d || {})) {
      for (const [commodity, years] of Object.entries(commodities || {})) rows.push([province, commodity, years]);
    }
    return rows;
  });
}

/**
 * Get resources and reserves for a province, by year and commodity.
 * @customfunction
 * @helpurl https://sectors.app/api
 * @param {string} province Province (e.g. "Kalimantan Timur").
 * @param {string} [commodityType] e.g. "Coal", "Nickel".
 * @param {number} [year] Year.
 * @returns {string[][]} Resources and reserves table.
 */
async function MINING_RESERVES(province, commodityType, year) {
  return run(async () => {
    const d = await apiFetch(`/mining/resources-reserves/${enc(province)}/`, {
      commodity_type: commodityType,
      year,
    });
    const items = [];
    for (const [y, commodities] of Object.entries(d.data || {})) {
      for (const [commodity, v] of Object.entries(commodities || {})) {
        items.push({ year: Number(y), commodity, ...v });
      }
    }
    return autoTable(items);
  });
}

/* ────────── FUNCTION REGISTRATION ────────── */
const FUNCTIONS = {
  SCREEN,
  SCREEN_NL,
  FREE_FLOAT,
  COMPANY_OVERVIEW,
  COMPANY_VALUATION,
  COMPANY_FINANCIALS,
  COMPANY_FINANCIAL_RATIOS,
  COMPANY_DIVIDEND,
  COMPANY_OWNERSHIP,
  COMPANY_INSTITUTIONAL_FLOW,
  COMPANY_MANAGEMENT,
  COMPANY_PEERS,
  COMPANY_FORECAST,
  COMPANY_CORPORATE_ACTIONS,
  SHAREHOLDERS_COMPOSITION,
  SUBSECTOR_STATISTICS,
  SUBSECTOR_MARKET_CAP,
  SUBSECTOR_VALUATION,
  SUBSECTOR_GROWTH,
  SUBSECTOR_STABILITY,
  SUBSECTOR_TOP_COMPANIES,
  QUARTERLY_FINANCIALS,
  QUARTERLY_FINANCIAL_DATES,
  LATEST_QUARTERLY_DATES,
  COMPANY_SEGMENTS,
  COMPANIES_WITH_SEGMENTS,
  DAILY_PRICE,
  DAILY_CLOSE_ALL,
  IDX_MARKET_CAP,
  INDEX_DAILY,
  INDEX_DAILY_ALL,
  MOST_TRADED,
  TOP_MOVERS,
  IPO_PERFORMANCE,
  FOREIGN_FLOW,
  FOREIGN_FLOW_ALL,
  FILINGS,
  NEWS,
  SUSPENSIONS,
  CORPORATE_ACTIONS_CALENDAR,
  BROKERS,
  TOP_BROKERS,
  BROKER_ACTIVITY,
  BROKER_TOP_STOCKS,
  BROKER_SUMMARY,
  BROKER_SUMMARY_TOP,
  SUBSECTORS,
  INDUSTRIES,
  SUBINDUSTRIES,
  NEWS_TAGS,
  KLSE_SECTORS,
  KLSE_COMPANIES,
  KLSE_TOP_COMPANIES,
  KLSE_OVERVIEW,
  KLSE_VALUATION,
  KLSE_FINANCIALS,
  KLSE_DIVIDEND,
  SGX_SECTORS,
  SGX_SUBSECTORS,
  SGX_COMPANIES,
  SGX_SCREEN,
  SGX_SCREEN_NL,
  SGX_TOP_COMPANIES,
  SGX_OVERVIEW,
  SGX_VALUATION,
  SGX_FINANCIALS,
  SGX_DIVIDEND,
  SGX_MANAGEMENT,
  SGX_OWNERSHIP,
  SGX_DAILY_PRICE,
  SGX_DAILY_CLOSE_ALL,
  SGX_CORPORATE_ACTIONS,
  SGX_FILINGS,
  SGX_NEWS,
  SGX_NEWS_TAGS,
  SGX_BUYBACKS,
  SGX_SHORT_SELL,
  SGX_REIT_SCREEN,
  SGX_REIT_SCREEN_NL,
  SGX_REIT_PROFILE,
  SGX_REIT_PERFORMANCE,
  SGX_REIT_PROPERTIES,
  SGX_REIT_TENANTS,
  SGX_REIT_TRADE_MIX,
  SGX_REIT_TRANSACTIONS,
  MINING_COMMODITIES,
  MINING_COMMODITY_PRICE,
  MINING_COMPANIES,
  MINING_COMPANY,
  MINING_COMPANY_FINANCIALS,
  MINING_COMPANY_OWNERSHIP,
  MINING_COMPANY_PERFORMANCE,
  MINING_SALES_DESTINATION,
  MINING_CONTRACTS,
  MINING_EXPORTS,
  MINING_GLOBAL_COMMODITY,
  MINING_TOTAL_PRODUCTION,
  MINING_LICENSES,
  MINING_LICENSE_AUCTIONS,
  MINING_LICENSE_AUCTION,
  MINING_SITES,
  MINING_SITE,
  MINING_RESERVES_INDEX,
  MINING_RESERVES,
};

for (const [name, fn] of Object.entries(FUNCTIONS)) {
  CustomFunctions.associate(name, fn);
}
