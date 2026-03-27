/******/ (function() { // webpackBootstrap
/*!************************************!*\
  !*** ./src/functions/functions.js ***!
  \************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var BASE_URL = "https://api.sectors.app/v2";

/* ────────── API KEY MANAGEMENT ────────── */
function getApiKey() {
  return Office.context.document.settings.get("SECTORS_API_KEY") || "";
}

/* ────────── FETCH UTILITY ────────── */
function apiFetch(_x) {
  return _apiFetch.apply(this, arguments);
}
/* ────────── OUTPUT SANITIZER ────────── */
/**
 * Normalise a 2-D array so every cell is a string and every row has the
 * same number of columns. Removes zero-length "separator" rows.
 * Excel custom functions REQUIRE this — any undefined / null / ragged row
 * causes #VALUE!.
 */
function _apiFetch() {
  _apiFetch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(endpoint) {
    var params,
      apiKey,
      url,
      _i,
      _Object$entries,
      _Object$entries$_i,
      k,
      v,
      res,
      body,
      _args = arguments;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          params = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          apiKey = getApiKey();
          if (apiKey) {
            _context.n = 1;
            break;
          }
          throw new Error("No API key. Open the Sectors task pane and save your API key first.");
        case 1:
          url = new URL(BASE_URL + endpoint);
          for (_i = 0, _Object$entries = Object.entries(params); _i < _Object$entries.length; _i++) {
            _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), k = _Object$entries$_i[0], v = _Object$entries$_i[1];
            if (v !== undefined && v !== null && v !== "") {
              url.searchParams.append(k, v);
            }
          }
          _context.n = 2;
          return fetch(url.toString(), {
            headers: {
              Authorization: apiKey
            }
          });
        case 2:
          res = _context.v;
          if (!(res.status === 429)) {
            _context.n = 3;
            break;
          }
          throw new Error("Rate limit exceeded. Please wait.");
        case 3:
          if (res.ok) {
            _context.n = 5;
            break;
          }
          _context.n = 4;
          return res.json().catch(function () {
            return {};
          });
        case 4:
          body = _context.v;
          throw new Error(body.error || body.message || "HTTP ".concat(res.status));
        case 5:
          return _context.a(2, res.json());
      }
    }, _callee);
  }));
  return _apiFetch.apply(this, arguments);
}
function sanitize(rows) {
  // 1. Drop completely empty separator rows
  var filtered = rows.filter(function (r) {
    return r.length > 0;
  });
  // 2. Find the widest row
  var cols = filtered.reduce(function (max, r) {
    return Math.max(max, r.length);
  }, 0);
  // 3. Pad + stringify every cell
  return filtered.map(function (r) {
    var row = [];
    for (var i = 0; i < cols; i++) {
      var v = r[i];
      row.push(v === undefined || v === null ? "" : String(v));
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
function SCREEN(_x2, _x3, _x4) {
  return _SCREEN.apply(this, arguments);
}
/**
 * Screen IDX companies using natural language.
 * @customfunction
 * @param {string} query Plain English query (e.g. "top 10 banks by market cap").
 * @returns {string[][]} Matching companies.
 */
function _SCREEN() {
  _SCREEN = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(where, orderBy, limit) {
    var data, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return apiFetch("/companies/", {
            where: where,
            order_by: orderBy,
            limit: limit
          });
        case 1:
          data = _context2.v;
          return _context2.a(2, sanitize([["Symbol", "Company Name"]].concat(_toConsumableArray(data.results.map(function (c) {
            return [c.symbol, c.company_name];
          })))));
        case 2:
          _context2.p = 2;
          _t = _context2.v;
          return _context2.a(2, [["Error", _t.message]]);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return _SCREEN.apply(this, arguments);
}
function SCREEN_NL(_x5) {
  return _SCREEN_NL.apply(this, arguments);
}
/**
 * Get free float percentage for companies.
 * @customfunction
 * @param {string} [subSector] Filter by subsector (e.g. "banks").
 * @returns {string[][]} Companies with free float percentages.
 */
function _SCREEN_NL() {
  _SCREEN_NL = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(query) {
    var data, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return apiFetch("/companies/", {
            q: query
          });
        case 1:
          data = _context3.v;
          return _context3.a(2, sanitize([["Symbol", "Company Name"]].concat(_toConsumableArray(data.results.map(function (c) {
            return [c.symbol, c.company_name];
          })))));
        case 2:
          _context3.p = 2;
          _t2 = _context3.v;
          return _context3.a(2, [["Error", _t2.message]]);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return _SCREEN_NL.apply(this, arguments);
}
function FREE_FLOAT(_x6) {
  return _FREE_FLOAT.apply(this, arguments);
}
/* ────────── COMPANY REPORT FUNCTIONS ────────── */
/**
 * Get company overview: market cap, sector, ESG, price, listing info.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Key-value overview data.
 */
function _FREE_FLOAT() {
  _FREE_FLOAT = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(subSector) {
    var params, data, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          params = {};
          if (subSector) params.sub_sector = subSector;
          _context4.n = 1;
          return apiFetch("/free-float/", params);
        case 1:
          data = _context4.v;
          return _context4.a(2, sanitize([["Symbol", "Company Name", "Free Float %"]].concat(_toConsumableArray(data.map(function (c) {
            return [c.symbol, c.company_name, c.free_float];
          })))));
        case 2:
          _context4.p = 2;
          _t3 = _context4.v;
          return _context4.a(2, [["Error", _t3.message]]);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return _FREE_FLOAT.apply(this, arguments);
}
function COMPANY_OVERVIEW(_x7) {
  return _COMPANY_OVERVIEW.apply(this, arguments);
}
/**
 * Get company valuation: PE, PB, PS, PCF ratios over time.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Valuation metrics table.
 */
function _COMPANY_OVERVIEW() {
  _COMPANY_OVERVIEW = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(ticker) {
    var d, o, _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return apiFetch("/company/report/".concat(ticker, "/"), {
            sections: "overview"
          });
        case 1:
          d = _context5.v;
          o = d.overview;
          return _context5.a(2, sanitize([["Company Name", d.company_name], ["Sector", o.sector], ["Sub Sector", o.sub_sector], ["Industry", o.industry], ["Market Cap", o.market_cap], ["Market Cap Rank", o.market_cap_rank], ["Last Close Price", o.last_close_price], ["Daily Change", o.daily_close_change], ["Listing Date", o.listing_date], ["Employee Count", o.employee_num], ["ESG Score", o.esg_score], ["Website", o.website]]));
        case 2:
          _context5.p = 2;
          _t4 = _context5.v;
          return _context5.a(2, [["Error", _t4.message]]);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return _COMPANY_OVERVIEW.apply(this, arguments);
}
function COMPANY_VALUATION(_x8) {
  return _COMPANY_VALUATION.apply(this, arguments);
}
/**
 * Get company financials: income stmt, balance sheet, ratios by year.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Historical financial data table.
 */
function _COMPANY_VALUATION() {
  _COMPANY_VALUATION = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(ticker) {
    var d, v, rows, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return apiFetch("/company/report/".concat(ticker, "/"), {
            sections: "valuation"
          });
        case 1:
          d = _context6.v;
          v = d.valuation;
          rows = [["Last Close Price", v.last_close_price], ["Forward PE", v.forward_pe], ["Intrinsic Value", v.intrinsic_value], [], ["Year", "PE", "PB", "PS", "PCF", "PEG", "EV/EBITDA", "EV/Revenue"]];
          (v.historical_valuation || []).forEach(function (h) {
            rows.push([h.year, h.pe, h.pb, h.ps, h.pcf, h.peg, h.enterprise_to_ebitda, h.enterprise_to_revenue]);
          });
          return _context6.a(2, sanitize(rows));
        case 2:
          _context6.p = 2;
          _t5 = _context6.v;
          return _context6.a(2, [["Error", _t5.message]]);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return _COMPANY_VALUATION.apply(this, arguments);
}
function COMPANY_FINANCIALS(_x9) {
  return _COMPANY_FINANCIALS.apply(this, arguments);
}
/**
 * Get company dividend history, yield, and payout ratio.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Dividend metrics and history.
 */
function _COMPANY_FINANCIALS() {
  _COMPANY_FINANCIALS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(ticker) {
    var d, f, rows, _t6;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          _context7.n = 1;
          return apiFetch("/company/report/".concat(ticker, "/"), {
            sections: "financials"
          });
        case 1:
          d = _context7.v;
          f = d.financials;
          rows = [["EPS", f.eps], ["YoY Qtr Earnings Growth", f.yoy_quarter_earnings_growth], ["YoY Qtr Revenue Growth", f.yoy_quarter_revenue_growth], [], ["Year", "Revenue", "Earnings", "EBITDA", "EBIT", "Total Assets", "Total Equity", "Total Debt", "Free Cash Flow", "Operating Cash Flow"]];
          (f.historical_financials || []).forEach(function (h) {
            rows.push([h.year, h.revenue, h.earnings, h.ebitda, h.ebit, h.total_assets, h.total_equity, h.total_debt, h.free_cash_flow, h.operating_cash_flow]);
          });
          return _context7.a(2, sanitize(rows));
        case 2:
          _context7.p = 2;
          _t6 = _context7.v;
          return _context7.a(2, [["Error", _t6.message]]);
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return _COMPANY_FINANCIALS.apply(this, arguments);
}
function COMPANY_DIVIDEND(_x0) {
  return _COMPANY_DIVIDEND.apply(this, arguments);
}
/**
 * Get company major shareholders and institutional transaction flow.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @returns {string[][]} Ownership breakdown table.
 */
function _COMPANY_DIVIDEND() {
  _COMPANY_DIVIDEND = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(ticker) {
    var d, div, rows, _i2, _Object$entries2, _Object$entries2$_i, year, info, _t7;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return apiFetch("/company/report/".concat(ticker, "/"), {
            sections: "dividend"
          });
        case 1:
          d = _context8.v;
          div = d.dividend;
          rows = [["Yield TTM", div.yield_ttm], ["Dividend TTM", div.dividend_ttm], ["Payout Ratio", div.payout_ratio], ["Cash Payout Ratio", div.cash_payout_ratio], ["Last Ex-Dividend Date", div.last_ex_dividend_date], [], ["Year", "Total Dividend", "Total Yield"]];
          for (_i2 = 0, _Object$entries2 = Object.entries(div.historical_dividends || {}); _i2 < _Object$entries2.length; _i2++) {
            _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2), year = _Object$entries2$_i[0], info = _Object$entries2$_i[1];
            rows.push([year, info.total_dividend, info.total_yield]);
          }
          return _context8.a(2, sanitize(rows));
        case 2:
          _context8.p = 2;
          _t7 = _context8.v;
          return _context8.a(2, [["Error", _t7.message]]);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return _COMPANY_DIVIDEND.apply(this, arguments);
}
function COMPANY_OWNERSHIP(_x1) {
  return _COMPANY_OWNERSHIP.apply(this, arguments);
}
/* ────────── SUBSECTOR REPORT FUNCTIONS ────────── */
/**
 * Get subsector statistics: company count, PE distribution.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Subsector statistics.
 */
function _COMPANY_OWNERSHIP() {
  _COMPANY_OWNERSHIP = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(ticker) {
    var d, o, rows, _t8;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          _context9.n = 1;
          return apiFetch("/company/report/".concat(ticker, "/"), {
            sections: "ownership"
          });
        case 1:
          d = _context9.v;
          o = d.ownership;
          rows = [["Shareholder", "Share %", "Share Amount", "Share Value"]];
          (o.major_shareholders || []).forEach(function (s) {
            return rows.push([s.name, s.share_percentage, s.share_amount, s.share_value]);
          });
          return _context9.a(2, sanitize(rows));
        case 2:
          _context9.p = 2;
          _t8 = _context9.v;
          return _context9.a(2, [["Error", _t8.message]]);
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return _COMPANY_OWNERSHIP.apply(this, arguments);
}
function SUBSECTOR_STATISTICS(_x10) {
  return _SUBSECTOR_STATISTICS.apply(this, arguments);
}
/**
 * Get subsector market cap data and performance.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Market cap metrics and changes.
 */
function _SUBSECTOR_STATISTICS() {
  _SUBSECTOR_STATISTICS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(subSector) {
    var d, s, _t9;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          _context0.n = 1;
          return apiFetch("/subsector/report/".concat(subSector, "/"), {
            sections: "statistics"
          });
        case 1:
          d = _context0.v;
          s = d.statistics;
          return _context0.a(2, sanitize([["Total Companies", s.total_companies], ["Filtered Median PE", s.filtered_median_pe], ["Filtered Weighted Avg PE", s.filtered_weighted_avg_pe], ["Min Company PE", s.min_company_pe], ["Max Company PE", s.max_company_pe]]));
        case 2:
          _context0.p = 2;
          _t9 = _context0.v;
          return _context0.a(2, [["Error", _t9.message]]);
      }
    }, _callee0, null, [[0, 2]]);
  }));
  return _SUBSECTOR_STATISTICS.apply(this, arguments);
}
function SUBSECTOR_MARKET_CAP(_x11) {
  return _SUBSECTOR_MARKET_CAP.apply(this, arguments);
}
/**
 * Get subsector valuation: historical PE/PB/PS/PCF with percentile rank.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Valuation table by year.
 */
function _SUBSECTOR_MARKET_CAP() {
  _SUBSECTOR_MARKET_CAP = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(subSector) {
    var _m$mcap_summary, _m$mcap_summary2, _m$mcap_summary3, d, m, _t0;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          _context1.n = 1;
          return apiFetch("/subsector/report/".concat(subSector, "/"), {
            sections: "market_cap"
          });
        case 1:
          d = _context1.v;
          m = d.market_cap;
          return _context1.a(2, sanitize([["Total Market Cap", m.total_market_cap], ["Avg Market Cap", m.avg_market_cap], ["1W Change", (_m$mcap_summary = m.mcap_summary) === null || _m$mcap_summary === void 0 || (_m$mcap_summary = _m$mcap_summary.mcap_change) === null || _m$mcap_summary === void 0 ? void 0 : _m$mcap_summary["1w"]], ["1Y Change", (_m$mcap_summary2 = m.mcap_summary) === null || _m$mcap_summary2 === void 0 || (_m$mcap_summary2 = _m$mcap_summary2.mcap_change) === null || _m$mcap_summary2 === void 0 ? void 0 : _m$mcap_summary2["1y"]], ["YTD Change", (_m$mcap_summary3 = m.mcap_summary) === null || _m$mcap_summary3 === void 0 || (_m$mcap_summary3 = _m$mcap_summary3.mcap_change) === null || _m$mcap_summary3 === void 0 ? void 0 : _m$mcap_summary3.ytd]]));
        case 2:
          _context1.p = 2;
          _t0 = _context1.v;
          return _context1.a(2, [["Error", _t0.message]]);
      }
    }, _callee1, null, [[0, 2]]);
  }));
  return _SUBSECTOR_MARKET_CAP.apply(this, arguments);
}
function SUBSECTOR_VALUATION(_x12) {
  return _SUBSECTOR_VALUATION.apply(this, arguments);
}
/**
 * Get subsector growth metrics and forecasts.
 * @customfunction
 * @param {string} subSector Subsector slug (e.g. "banks").
 * @returns {string[][]} Growth data by year.
 */
function _SUBSECTOR_VALUATION() {
  _SUBSECTOR_VALUATION = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(subSector) {
    var d, rows, _i3, _Object$entries3, _d$valuation, _Object$entries3$_i, year, v, _t1;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          _context10.n = 1;
          return apiFetch("/subsector/report/".concat(subSector, "/"), {
            sections: "valuation"
          });
        case 1:
          d = _context10.v;
          rows = [["Year", "PE", "PB", "PS", "PCF"]];
          for (_i3 = 0, _Object$entries3 = Object.entries(((_d$valuation = d.valuation) === null || _d$valuation === void 0 ? void 0 : _d$valuation.historical_valuation) || {}); _i3 < _Object$entries3.length; _i3++) {
            _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2), year = _Object$entries3$_i[0], v = _Object$entries3$_i[1];
            rows.push([year, v.pe, v.pb, v.ps, v.pcf]);
          }
          return _context10.a(2, sanitize(rows));
        case 2:
          _context10.p = 2;
          _t1 = _context10.v;
          return _context10.a(2, [["Error", _t1.message]]);
      }
    }, _callee10, null, [[0, 2]]);
  }));
  return _SUBSECTOR_VALUATION.apply(this, arguments);
}
function SUBSECTOR_GROWTH(_x13) {
  return _SUBSECTOR_GROWTH.apply(this, arguments);
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
function _SUBSECTOR_GROWTH() {
  _SUBSECTOR_GROWTH = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(subSector) {
    var d, rows, _i4, _Object$entries4, _d$growth, _Object$entries4$_i, year, g, _t10;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _context11.p = 0;
          _context11.n = 1;
          return apiFetch("/subsector/report/".concat(subSector, "/"), {
            sections: "growth"
          });
        case 1:
          d = _context11.v;
          rows = [["Year", "Avg Earnings Growth", "Avg Revenue Growth"]];
          for (_i4 = 0, _Object$entries4 = Object.entries(((_d$growth = d.growth) === null || _d$growth === void 0 ? void 0 : _d$growth.weighted_avg_growth_data) || {}); _i4 < _Object$entries4.length; _i4++) {
            _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2), year = _Object$entries4$_i[0], g = _Object$entries4$_i[1];
            rows.push([year, g.avg_annual_earning_growth, g.avg_annual_revenue_growth]);
          }
          return _context11.a(2, sanitize(rows));
        case 2:
          _context11.p = 2;
          _t10 = _context11.v;
          return _context11.a(2, [["Error", _t10.message]]);
      }
    }, _callee11, null, [[0, 2]]);
  }));
  return _SUBSECTOR_GROWTH.apply(this, arguments);
}
function QUARTERLY_FINANCIALS(_x14, _x15, _x16) {
  return _QUARTERLY_FINANCIALS.apply(this, arguments);
}
/**
 * Get revenue/cost breakdown by business segment.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "ASII").
 * @param {number} [financialYear] Year (defaults to latest).
 * @returns {string[][]} Revenue segment breakdown.
 */
function _QUARTERLY_FINANCIALS() {
  _QUARTERLY_FINANCIALS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(ticker, nQuarters, reportDate) {
    var params, data, rows, _t11;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          params = {};
          if (nQuarters) params.n_quarters = nQuarters;
          if (reportDate) params.report_date = reportDate;
          _context12.n = 1;
          return apiFetch("/financials/quarterly/".concat(ticker, "/"), params);
        case 1:
          data = _context12.v;
          rows = [["Date", "Revenue", "Earnings", "Total Assets", "Total Equity", "Total Liabilities", "Operating Cash Flow"]];
          data.forEach(function (q) {
            return rows.push([q.date, q.revenue, q.earnings, q.total_assets, q.total_equity, q.total_liabilities, q.operating_cash_flow]);
          });
          return _context12.a(2, sanitize(rows));
        case 2:
          _context12.p = 2;
          _t11 = _context12.v;
          return _context12.a(2, [["Error", _t11.message]]);
      }
    }, _callee12, null, [[0, 2]]);
  }));
  return _QUARTERLY_FINANCIALS.apply(this, arguments);
}
function COMPANY_SEGMENTS(_x17, _x18) {
  return _COMPANY_SEGMENTS.apply(this, arguments);
}
/**
 * Get daily close price, volume, and market cap for a ticker.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "BBCA").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Daily price/volume data.
 */
function _COMPANY_SEGMENTS() {
  _COMPANY_SEGMENTS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(ticker, financialYear) {
    var params, data, rows, _t12;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          _context13.p = 0;
          params = {};
          if (financialYear) params.financial_year = financialYear;
          _context13.n = 1;
          return apiFetch("/company/get-segments/".concat(ticker, "/"), params);
        case 1:
          data = _context13.v;
          rows = [["Source", "Target", "Value (IDR)"]];
          (data.revenue_breakdown || []).forEach(function (r) {
            return rows.push([r.source, r.target, r.value]);
          });
          return _context13.a(2, sanitize(rows));
        case 2:
          _context13.p = 2;
          _t12 = _context13.v;
          return _context13.a(2, [["Error", _t12.message]]);
      }
    }, _callee13, null, [[0, 2]]);
  }));
  return _COMPANY_SEGMENTS.apply(this, arguments);
}
function DAILY_PRICE(_x19, _x20, _x21) {
  return _DAILY_PRICE.apply(this, arguments);
}
/**
 * Get IDX total market capitalization over time.
 * @customfunction
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} IDX total market cap by date.
 */
function _DAILY_PRICE() {
  _DAILY_PRICE = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(ticker, start, end) {
    var data, rows, _t13;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          _context14.p = 0;
          _context14.n = 1;
          return apiFetch("/daily/".concat(ticker, "/"), {
            start: start,
            end: end
          });
        case 1:
          data = _context14.v;
          rows = [["Date", "Close", "Volume", "Market Cap"]];
          data.forEach(function (d) {
            return rows.push([d.date, d.close, d.volume, d.market_cap]);
          });
          return _context14.a(2, sanitize(rows));
        case 2:
          _context14.p = 2;
          _t13 = _context14.v;
          return _context14.a(2, [["Error", _t13.message]]);
      }
    }, _callee14, null, [[0, 2]]);
  }));
  return _DAILY_PRICE.apply(this, arguments);
}
function IDX_MARKET_CAP(_x22, _x23) {
  return _IDX_MARKET_CAP.apply(this, arguments);
}
/**
 * Get daily closing prices for a stock index.
 * @customfunction
 * @param {string} indexCode Index code (e.g. "ihsg", "lq45", "idx30").
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @returns {string[][]} Index daily price data.
 */
function _IDX_MARKET_CAP() {
  _IDX_MARKET_CAP = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(start, end) {
    var data, rows, _t14;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          _context15.p = 0;
          _context15.n = 1;
          return apiFetch("/idx-total/", {
            start: start,
            end: end
          });
        case 1:
          data = _context15.v;
          rows = [["Date", "IDX Total Market Cap"]];
          data.forEach(function (d) {
            return rows.push([d.date, d.idx_total_market_cap]);
          });
          return _context15.a(2, sanitize(rows));
        case 2:
          _context15.p = 2;
          _t14 = _context15.v;
          return _context15.a(2, [["Error", _t14.message]]);
      }
    }, _callee15, null, [[0, 2]]);
  }));
  return _IDX_MARKET_CAP.apply(this, arguments);
}
function INDEX_DAILY(_x24, _x25, _x26) {
  return _INDEX_DAILY.apply(this, arguments);
}
/**
 * Get most traded stocks by volume in a date range.
 * @customfunction
 * @param {string} [start] Start date (YYYY-MM-DD).
 * @param {string} [end] End date (YYYY-MM-DD).
 * @param {number} [nStock] Number of stocks (default 5, max 10).
 * @returns {string[][]} Most traded stocks per date.
 */
function _INDEX_DAILY() {
  _INDEX_DAILY = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(indexCode, start, end) {
    var data, rows, _t15;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          _context16.p = 0;
          _context16.n = 1;
          return apiFetch("/index-daily/".concat(indexCode, "/"), {
            start: start,
            end: end
          });
        case 1:
          data = _context16.v;
          rows = [["Date", "Index", "Price"]];
          data.forEach(function (d) {
            return rows.push([d.date, d.index_code, d.price]);
          });
          return _context16.a(2, sanitize(rows));
        case 2:
          _context16.p = 2;
          _t15 = _context16.v;
          return _context16.a(2, [["Error", _t15.message]]);
      }
    }, _callee16, null, [[0, 2]]);
  }));
  return _INDEX_DAILY.apply(this, arguments);
}
function MOST_TRADED(_x27, _x28, _x29) {
  return _MOST_TRADED.apply(this, arguments);
}
/**
 * Get top stock price movers (gainers and losers).
 * @customfunction
 * @param {string} [classifications] "top_gainers", "top_losers", or both.
 * @param {string} [periods] "1d", "7d", "14d", "30d", "365d".
 * @param {number} [nStock] Number of stocks (default 5, max 10).
 * @returns {string[][]} Top movers table.
 */
function _MOST_TRADED() {
  _MOST_TRADED = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(start, end, nStock) {
    var data, rows, _loop, _i5, _Object$entries5, _t16;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          _context18.p = 0;
          _context18.n = 1;
          return apiFetch("/most-traded/", {
            start: start,
            end: end,
            n_stock: nStock
          });
        case 1:
          data = _context18.v;
          rows = [["Date", "Symbol", "Company", "Volume", "Price"]];
          _loop = /*#__PURE__*/_regenerator().m(function _loop() {
            var _Object$entries5$_i, date, stocks;
            return _regenerator().w(function (_context17) {
              while (1) switch (_context17.n) {
                case 0:
                  _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2), date = _Object$entries5$_i[0], stocks = _Object$entries5$_i[1];
                  stocks.forEach(function (s) {
                    return rows.push([date, s.symbol, s.company_name, s.volume, s.price]);
                  });
                case 1:
                  return _context17.a(2);
              }
            }, _loop);
          });
          _i5 = 0, _Object$entries5 = Object.entries(data);
        case 2:
          if (!(_i5 < _Object$entries5.length)) {
            _context18.n = 4;
            break;
          }
          return _context18.d(_regeneratorValues(_loop()), 3);
        case 3:
          _i5++;
          _context18.n = 2;
          break;
        case 4:
          return _context18.a(2, sanitize(rows));
        case 5:
          _context18.p = 5;
          _t16 = _context18.v;
          return _context18.a(2, [["Error", _t16.message]]);
      }
    }, _callee17, null, [[0, 5]]);
  }));
  return _MOST_TRADED.apply(this, arguments);
}
function TOP_MOVERS(_x30, _x31, _x32) {
  return _TOP_MOVERS.apply(this, arguments);
}
/**
 * Get stock price performance since IPO listing.
 * @customfunction
 * @param {string} ticker IDX ticker (e.g. "GOTO").
 * @returns {string[][]} Price change since listing by period.
 */
function _TOP_MOVERS() {
  _TOP_MOVERS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(classifications, periods, nStock) {
    var data, rows, _loop2, _i6, _Object$entries6, _t17;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.p = _context21.n) {
        case 0:
          _context21.p = 0;
          _context21.n = 1;
          return apiFetch("/companies/top-changes/", {
            classifications: classifications,
            periods: periods,
            n_stock: nStock
          });
        case 1:
          data = _context21.v;
          rows = [["Type", "Period", "Symbol", "Name", "Price Change", "Last Price"]];
          _loop2 = /*#__PURE__*/_regenerator().m(function _loop2() {
            var _Object$entries6$_i, cls, periodData, _loop3, _i7, _Object$entries7;
            return _regenerator().w(function (_context20) {
              while (1) switch (_context20.n) {
                case 0:
                  _Object$entries6$_i = _slicedToArray(_Object$entries6[_i6], 2), cls = _Object$entries6$_i[0], periodData = _Object$entries6$_i[1];
                  _loop3 = /*#__PURE__*/_regenerator().m(function _loop3() {
                    var _Object$entries7$_i, period, stocks;
                    return _regenerator().w(function (_context19) {
                      while (1) switch (_context19.n) {
                        case 0:
                          _Object$entries7$_i = _slicedToArray(_Object$entries7[_i7], 2), period = _Object$entries7$_i[0], stocks = _Object$entries7$_i[1];
                          stocks.forEach(function (s) {
                            return rows.push([cls, period, s.symbol, s.name, s.price_change, s.last_close_price]);
                          });
                        case 1:
                          return _context19.a(2);
                      }
                    }, _loop3);
                  });
                  _i7 = 0, _Object$entries7 = Object.entries(periodData);
                case 1:
                  if (!(_i7 < _Object$entries7.length)) {
                    _context20.n = 3;
                    break;
                  }
                  return _context20.d(_regeneratorValues(_loop3()), 2);
                case 2:
                  _i7++;
                  _context20.n = 1;
                  break;
                case 3:
                  return _context20.a(2);
              }
            }, _loop2);
          });
          _i6 = 0, _Object$entries6 = Object.entries(data);
        case 2:
          if (!(_i6 < _Object$entries6.length)) {
            _context21.n = 4;
            break;
          }
          return _context21.d(_regeneratorValues(_loop2()), 3);
        case 3:
          _i6++;
          _context21.n = 2;
          break;
        case 4:
          return _context21.a(2, sanitize(rows));
        case 5:
          _context21.p = 5;
          _t17 = _context21.v;
          return _context21.a(2, [["Error", _t17.message]]);
      }
    }, _callee18, null, [[0, 5]]);
  }));
  return _TOP_MOVERS.apply(this, arguments);
}
function IPO_PERFORMANCE(_x33) {
  return _IPO_PERFORMANCE.apply(this, arguments);
}
/* ────────── MALAYSIA (KLSE) FUNCTIONS ────────── */
/**
 * Get available KLSE sectors.
 * @customfunction
 * @returns {string[][]} List of KLSE sectors.
 */
function _IPO_PERFORMANCE() {
  _IPO_PERFORMANCE = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(ticker) {
    var d, _t18;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          _context22.p = 0;
          _context22.n = 1;
          return apiFetch("/listing-performance/".concat(ticker, "/"));
        case 1:
          d = _context22.v;
          return _context22.a(2, sanitize([["Period", "Change"], ["7 Days", d.chg_7d], ["30 Days", d.chg_30d], ["90 Days", d.chg_90d], ["365 Days", d.chg_365d]]));
        case 2:
          _context22.p = 2;
          _t18 = _context22.v;
          return _context22.a(2, [["Error", _t18.message]]);
      }
    }, _callee19, null, [[0, 2]]);
  }));
  return _IPO_PERFORMANCE.apply(this, arguments);
}
function KLSE_SECTORS() {
  return _KLSE_SECTORS.apply(this, arguments);
}
/**
 * Get KLSE companies in a sector.
 * @customfunction
 * @param {string} sector KLSE sector slug (e.g. "financials").
 * @returns {string[][]} Companies list.
 */
function _KLSE_SECTORS() {
  _KLSE_SECTORS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
    var data, _t19;
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.p = _context23.n) {
        case 0:
          _context23.p = 0;
          _context23.n = 1;
          return apiFetch("/klse/sectors/");
        case 1:
          data = _context23.v;
          return _context23.a(2, sanitize([["Sector"]].concat(_toConsumableArray(data.map(function (s) {
            return [s];
          })))));
        case 2:
          _context23.p = 2;
          _t19 = _context23.v;
          return _context23.a(2, [["Error", _t19.message]]);
      }
    }, _callee20, null, [[0, 2]]);
  }));
  return _KLSE_SECTORS.apply(this, arguments);
}
function KLSE_COMPANIES(_x34) {
  return _KLSE_COMPANIES.apply(this, arguments);
}
/**
 * Get top KLSE companies by a classification metric.
 * @customfunction
 * @param {string} [classifications] "dividend_yield","revenue","earnings","market_cap","pe".
 * @param {string} [sector] KLSE sector slug.
 * @returns {string[][]} Top KLSE companies.
 */
function _KLSE_COMPANIES() {
  _KLSE_COMPANIES = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(sector) {
    var data, _t20;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.p = _context24.n) {
        case 0:
          _context24.p = 0;
          _context24.n = 1;
          return apiFetch("/klse/companies/", {
            sector: sector
          });
        case 1:
          data = _context24.v;
          return _context24.a(2, sanitize([["Symbol", "Company Name"]].concat(_toConsumableArray(data.map(function (c) {
            return [c.symbol, c.company_name];
          })))));
        case 2:
          _context24.p = 2;
          _t20 = _context24.v;
          return _context24.a(2, [["Error", _t20.message]]);
      }
    }, _callee21, null, [[0, 2]]);
  }));
  return _KLSE_COMPANIES.apply(this, arguments);
}
function KLSE_TOP_COMPANIES(_x35, _x36) {
  return _KLSE_TOP_COMPANIES.apply(this, arguments);
}
/**
 * Get KLSE company overview: market cap, sector, price changes.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Overview data.
 */
function _KLSE_TOP_COMPANIES() {
  _KLSE_TOP_COMPANIES = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(classifications, sector) {
    var data, rows, _loop4, _i8, _Object$entries8, _t21;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.p = _context26.n) {
        case 0:
          _context26.p = 0;
          _context26.n = 1;
          return apiFetch("/klse/companies/top/", {
            classifications: classifications,
            sector: sector
          });
        case 1:
          data = _context26.v;
          rows = [["Classification", "Symbol", "Company", "Value"]];
          _loop4 = /*#__PURE__*/_regenerator().m(function _loop4() {
            var _Object$entries8$_i, cls, stocks;
            return _regenerator().w(function (_context25) {
              while (1) switch (_context25.n) {
                case 0:
                  _Object$entries8$_i = _slicedToArray(_Object$entries8[_i8], 2), cls = _Object$entries8$_i[0], stocks = _Object$entries8$_i[1];
                  stocks.forEach(function (s) {
                    var _ref, _s$cls;
                    var val = (_ref = (_s$cls = s[cls]) !== null && _s$cls !== void 0 ? _s$cls : s.forward_dividend_yield) !== null && _ref !== void 0 ? _ref : "";
                    rows.push([cls, s.symbol, s.company_name, val]);
                  });
                case 1:
                  return _context25.a(2);
              }
            }, _loop4);
          });
          _i8 = 0, _Object$entries8 = Object.entries(data);
        case 2:
          if (!(_i8 < _Object$entries8.length)) {
            _context26.n = 4;
            break;
          }
          return _context26.d(_regeneratorValues(_loop4()), 3);
        case 3:
          _i8++;
          _context26.n = 2;
          break;
        case 4:
          return _context26.a(2, sanitize(rows));
        case 5:
          _context26.p = 5;
          _t21 = _context26.v;
          return _context26.a(2, [["Error", _t21.message]]);
      }
    }, _callee22, null, [[0, 5]]);
  }));
  return _KLSE_TOP_COMPANIES.apply(this, arguments);
}
function KLSE_OVERVIEW(_x37) {
  return _KLSE_OVERVIEW.apply(this, arguments);
}
/**
 * Get KLSE company valuation ratios.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Valuation metrics.
 */
function _KLSE_OVERVIEW() {
  _KLSE_OVERVIEW = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(ticker) {
    var d, o, _t22;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.p = _context27.n) {
        case 0:
          _context27.p = 0;
          _context27.n = 1;
          return apiFetch("/klse/company/report/".concat(ticker, "/"));
        case 1:
          d = _context27.v;
          o = d.overview;
          return _context27.a(2, sanitize([["Name", d.name], ["Market Cap", o.market_cap], ["Sector", o.sector], ["Sub Sector", o.sub_sector], ["Volume", o.volume], ["1D Change", o.change_1d], ["7D Change", o.change_7d]]));
        case 2:
          _context27.p = 2;
          _t22 = _context27.v;
          return _context27.a(2, [["Error", _t22.message]]);
      }
    }, _callee23, null, [[0, 2]]);
  }));
  return _KLSE_OVERVIEW.apply(this, arguments);
}
function KLSE_VALUATION(_x38) {
  return _KLSE_VALUATION.apply(this, arguments);
}
/**
 * Get KLSE company financial data: earnings, revenue, ratios.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Financial data.
 */
function _KLSE_VALUATION() {
  _KLSE_VALUATION = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(ticker) {
    var d, v, _t23;
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.p = _context28.n) {
        case 0:
          _context28.p = 0;
          _context28.n = 1;
          return apiFetch("/klse/company/report/".concat(ticker, "/"));
        case 1:
          d = _context28.v;
          v = d.valuation;
          return _context28.a(2, sanitize([["PE", v.pe], ["PE TTM", v.pe_ttm], ["PB", v.pb], ["PS TTM", v.ps_ttm], ["PCF", v.pcf], ["PCF TTM", v.pcf_ttm]]));
        case 2:
          _context28.p = 2;
          _t23 = _context28.v;
          return _context28.a(2, [["Error", _t23.message]]);
      }
    }, _callee24, null, [[0, 2]]);
  }));
  return _KLSE_VALUATION.apply(this, arguments);
}
function KLSE_FINANCIALS(_x39) {
  return _KLSE_FINANCIALS.apply(this, arguments);
}
/**
 * Get KLSE company dividend data.
 * @customfunction
 * @param {string} ticker KLSE ticker (e.g. "1155").
 * @returns {string[][]} Dividend metrics.
 */
function _KLSE_FINANCIALS() {
  _KLSE_FINANCIALS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(ticker) {
    var d, f, rows, _t24;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.p = _context29.n) {
        case 0:
          _context29.p = 0;
          _context29.n = 1;
          return apiFetch("/klse/company/report/".concat(ticker, "/"));
        case 1:
          d = _context29.v;
          f = d.financials;
          rows = [["EPS", f.eps], ["Operating Margin", f.operating_margin], ["Net Profit Margin", f.net_profit_margin], ["Current Ratio", f.current_ratio], ["Debt to Equity", f.debt_to_equity], [], ["Period", "Revenue", "Earnings"]];
          (f.historical_revenue || []).forEach(function (r, i) {
            var e = (f.historical_earnings || [])[i];
            rows.push([r.period, r.revenue, e === null || e === void 0 ? void 0 : e.earnings]);
          });
          return _context29.a(2, sanitize(rows));
        case 2:
          _context29.p = 2;
          _t24 = _context29.v;
          return _context29.a(2, [["Error", _t24.message]]);
      }
    }, _callee25, null, [[0, 2]]);
  }));
  return _KLSE_FINANCIALS.apply(this, arguments);
}
function KLSE_DIVIDEND(_x40) {
  return _KLSE_DIVIDEND.apply(this, arguments);
}
/* ────────── SINGAPORE (SGX) FUNCTIONS ────────── */
/**
 * Get available SGX sectors.
 * @customfunction
 * @returns {string[][]} List of SGX sectors.
 */
function _KLSE_DIVIDEND() {
  _KLSE_DIVIDEND = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(ticker) {
    var d, div, _t25;
    return _regenerator().w(function (_context30) {
      while (1) switch (_context30.p = _context30.n) {
        case 0:
          _context30.p = 0;
          _context30.n = 1;
          return apiFetch("/klse/company/report/".concat(ticker, "/"));
        case 1:
          d = _context30.v;
          div = d.dividend;
          return _context30.a(2, sanitize([["5Y Avg Yield", div.dividend_yield_5y_avg], ["Growth Rate", div.dividend_growth_rate], ["Payout Ratio", div.payout_ratio], ["Forward Dividend", div.forward_dividend], ["Forward Div Yield", div.forward_dividend_yield], ["Dividend TTM", div.dividend_ttm]]));
        case 2:
          _context30.p = 2;
          _t25 = _context30.v;
          return _context30.a(2, [["Error", _t25.message]]);
      }
    }, _callee26, null, [[0, 2]]);
  }));
  return _KLSE_DIVIDEND.apply(this, arguments);
}
function SGX_SECTORS() {
  return _SGX_SECTORS.apply(this, arguments);
}
/**
 * Get SGX companies in a sector.
 * @customfunction
 * @param {string} sector SGX sector slug (e.g. "financial-services").
 * @returns {string[][]} Companies list.
 */
function _SGX_SECTORS() {
  _SGX_SECTORS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
    var data, _t26;
    return _regenerator().w(function (_context31) {
      while (1) switch (_context31.p = _context31.n) {
        case 0:
          _context31.p = 0;
          _context31.n = 1;
          return apiFetch("/sgx/sectors/");
        case 1:
          data = _context31.v;
          return _context31.a(2, sanitize([["Sector"]].concat(_toConsumableArray(data.map(function (s) {
            return [s];
          })))));
        case 2:
          _context31.p = 2;
          _t26 = _context31.v;
          return _context31.a(2, [["Error", _t26.message]]);
      }
    }, _callee27, null, [[0, 2]]);
  }));
  return _SGX_SECTORS.apply(this, arguments);
}
function SGX_COMPANIES(_x41) {
  return _SGX_COMPANIES.apply(this, arguments);
}
/**
 * Get top SGX companies by a classification metric.
 * @customfunction
 * @param {string} [classifications] "dividend_yield","revenue","earnings","market_cap","pe".
 * @param {string} [sector] SGX sector slug.
 * @returns {string[][]} Top SGX companies.
 */
function _SGX_COMPANIES() {
  _SGX_COMPANIES = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(sector) {
    var data, _t27;
    return _regenerator().w(function (_context32) {
      while (1) switch (_context32.p = _context32.n) {
        case 0:
          _context32.p = 0;
          _context32.n = 1;
          return apiFetch("/sgx/companies/", {
            sector: sector
          });
        case 1:
          data = _context32.v;
          return _context32.a(2, sanitize([["Symbol", "Company Name"]].concat(_toConsumableArray(data.map(function (c) {
            return [c.symbol, c.company_name];
          })))));
        case 2:
          _context32.p = 2;
          _t27 = _context32.v;
          return _context32.a(2, [["Error", _t27.message]]);
      }
    }, _callee28, null, [[0, 2]]);
  }));
  return _SGX_COMPANIES.apply(this, arguments);
}
function SGX_TOP_COMPANIES(_x42, _x43) {
  return _SGX_TOP_COMPANIES.apply(this, arguments);
}
/**
 * Get SGX company overview: market cap, sector, multi-period price changes.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Overview data.
 */
function _SGX_TOP_COMPANIES() {
  _SGX_TOP_COMPANIES = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(classifications, sector) {
    var data, rows, _loop5, _i9, _Object$entries9, _t28;
    return _regenerator().w(function (_context34) {
      while (1) switch (_context34.p = _context34.n) {
        case 0:
          _context34.p = 0;
          _context34.n = 1;
          return apiFetch("/sgx/companies/top/", {
            classifications: classifications,
            sector: sector
          });
        case 1:
          data = _context34.v;
          rows = [["Classification", "Symbol", "Company", "Value"]];
          _loop5 = /*#__PURE__*/_regenerator().m(function _loop5() {
            var _Object$entries9$_i, cls, stocks;
            return _regenerator().w(function (_context33) {
              while (1) switch (_context33.n) {
                case 0:
                  _Object$entries9$_i = _slicedToArray(_Object$entries9[_i9], 2), cls = _Object$entries9$_i[0], stocks = _Object$entries9$_i[1];
                  stocks.forEach(function (s) {
                    var _ref2, _s$cls2;
                    var val = (_ref2 = (_s$cls2 = s[cls]) !== null && _s$cls2 !== void 0 ? _s$cls2 : s.forward_dividend_yield) !== null && _ref2 !== void 0 ? _ref2 : "";
                    rows.push([cls, s.symbol, s.company_name, val]);
                  });
                case 1:
                  return _context33.a(2);
              }
            }, _loop5);
          });
          _i9 = 0, _Object$entries9 = Object.entries(data);
        case 2:
          if (!(_i9 < _Object$entries9.length)) {
            _context34.n = 4;
            break;
          }
          return _context34.d(_regeneratorValues(_loop5()), 3);
        case 3:
          _i9++;
          _context34.n = 2;
          break;
        case 4:
          return _context34.a(2, sanitize(rows));
        case 5:
          _context34.p = 5;
          _t28 = _context34.v;
          return _context34.a(2, [["Error", _t28.message]]);
      }
    }, _callee29, null, [[0, 5]]);
  }));
  return _SGX_TOP_COMPANIES.apply(this, arguments);
}
function SGX_OVERVIEW(_x44) {
  return _SGX_OVERVIEW.apply(this, arguments);
}
/**
 * Get SGX company valuation ratios.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Valuation metrics.
 */
function _SGX_OVERVIEW() {
  _SGX_OVERVIEW = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(ticker) {
    var d, o, _t29;
    return _regenerator().w(function (_context35) {
      while (1) switch (_context35.p = _context35.n) {
        case 0:
          _context35.p = 0;
          _context35.n = 1;
          return apiFetch("/sgx/company/report/".concat(ticker, "/"));
        case 1:
          d = _context35.v;
          o = d.overview;
          return _context35.a(2, sanitize([["Name", d.name], ["Market Cap", o.market_cap], ["Sector", o.sector], ["Sub Sector", o.sub_sector], ["Volume", o.volume], ["1D Change", o.change_1d], ["7D Change", o.change_7d], ["1M Change", o.change_1m], ["1Y Change", o.change_1y], ["YTD Change", o.change_ytd]]));
        case 2:
          _context35.p = 2;
          _t29 = _context35.v;
          return _context35.a(2, [["Error", _t29.message]]);
      }
    }, _callee30, null, [[0, 2]]);
  }));
  return _SGX_OVERVIEW.apply(this, arguments);
}
function SGX_VALUATION(_x45) {
  return _SGX_VALUATION.apply(this, arguments);
}
/**
 * Get SGX company financial data with income stmt and balance sheet.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Financial data table.
 */
function _SGX_VALUATION() {
  _SGX_VALUATION = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(ticker) {
    var d, v, _t30;
    return _regenerator().w(function (_context36) {
      while (1) switch (_context36.p = _context36.n) {
        case 0:
          _context36.p = 0;
          _context36.n = 1;
          return apiFetch("/sgx/company/report/".concat(ticker, "/"));
        case 1:
          d = _context36.v;
          v = d.valuation;
          return _context36.a(2, sanitize([["PE", v.pe], ["PB", v.pb], ["PS", v.ps], ["PCF", v.pcf]]));
        case 2:
          _context36.p = 2;
          _t30 = _context36.v;
          return _context36.a(2, [["Error", _t30.message]]);
      }
    }, _callee31, null, [[0, 2]]);
  }));
  return _SGX_VALUATION.apply(this, arguments);
}
function SGX_FINANCIALS(_x46) {
  return _SGX_FINANCIALS.apply(this, arguments);
}
/**
 * Get SGX company dividend data with full history.
 * @customfunction
 * @param {string} ticker SGX ticker (e.g. "D05").
 * @returns {string[][]} Dividend metrics and yearly history.
 */
function _SGX_FINANCIALS() {
  _SGX_FINANCIALS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(ticker) {
    var d, f, rows, _i0, _Object$entries0, _Object$entries0$_i, year, data, _t31;
    return _regenerator().w(function (_context37) {
      while (1) switch (_context37.p = _context37.n) {
        case 0:
          _context37.p = 0;
          _context37.n = 1;
          return apiFetch("/sgx/company/report/".concat(ticker, "/"));
        case 1:
          d = _context37.v;
          f = d.financials;
          rows = [["EPS", f.eps], ["Operating Margin", f.operating_margin], ["Net Profit Margin", f.net_profit_margin], [], ["Year", "Revenue", "Earnings"]];
          for (_i0 = 0, _Object$entries0 = Object.entries(f.historical_financials || {}); _i0 < _Object$entries0.length; _i0++) {
            _Object$entries0$_i = _slicedToArray(_Object$entries0[_i0], 2), year = _Object$entries0$_i[0], data = _Object$entries0$_i[1];
            rows.push([year, data.revenue, data.earnings]);
          }
          return _context37.a(2, sanitize(rows));
        case 2:
          _context37.p = 2;
          _t31 = _context37.v;
          return _context37.a(2, [["Error", _t31.message]]);
      }
    }, _callee32, null, [[0, 2]]);
  }));
  return _SGX_FINANCIALS.apply(this, arguments);
}
function SGX_DIVIDEND(_x47) {
  return _SGX_DIVIDEND.apply(this, arguments);
}
/* ────────── FUNCTION REGISTRATION ────────── */
function _SGX_DIVIDEND() {
  _SGX_DIVIDEND = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33(ticker) {
    var d, div, rows, _i1, _Object$entries1, _Object$entries1$_i, year, info, _t32;
    return _regenerator().w(function (_context38) {
      while (1) switch (_context38.p = _context38.n) {
        case 0:
          _context38.p = 0;
          _context38.n = 1;
          return apiFetch("/sgx/company/report/".concat(ticker, "/"));
        case 1:
          d = _context38.v;
          div = d.dividend;
          rows = [["5Y Avg Yield", div.dividend_yield_5y_avg], ["Growth Rate", div.dividend_growth_rate], ["Payout Ratio", div.payout_ratio], ["Forward Dividend", div.forward_dividend], ["Dividend TTM", div.dividend_ttm], [], ["Year", "Total Dividend", "Total Yield"]];
          for (_i1 = 0, _Object$entries1 = Object.entries(div.historical_dividends || {}); _i1 < _Object$entries1.length; _i1++) {
            _Object$entries1$_i = _slicedToArray(_Object$entries1[_i1], 2), year = _Object$entries1$_i[0], info = _Object$entries1$_i[1];
            rows.push([year, info.total_dividend, info.total_yield]);
          }
          return _context38.a(2, sanitize(rows));
        case 2:
          _context38.p = 2;
          _t32 = _context38.v;
          return _context38.a(2, [["Error", _t32.message]]);
      }
    }, _callee33, null, [[0, 2]]);
  }));
  return _SGX_DIVIDEND.apply(this, arguments);
}
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
/******/ })()
;
//# sourceMappingURL=functions.js.map