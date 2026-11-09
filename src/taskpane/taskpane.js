/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, window, fetch, Excel, Office */

const API_KEY_SETTING = "SECTORS_API_KEY";
const NAMESPACE = window.location.hostname === "localhost" ? "SECTORS" : "SECTORSPROD";
const GROUPS = [
  ["IDX & market", /^(?!SGX_|KLSE_|MINING_|BROKER_)/],
  ["SGX (Singapore)", /^SGX_(?!REIT_)/],
  ["SGX REITs", /^SGX_REIT_/],
  ["KLSE (Malaysia)", /^KLSE_/],
  ["Broker flow", /^BROKER_/],
  ["Mining", /^MINING_/],
];

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
  applyTheme();
  document.getElementById("sideload-msg").style.display = "none";
  document.getElementById("app-body").style.display = "flex";
  document.getElementById("save-api-key").onclick = saveApiKey;
  document.getElementById("clear-api-key").onclick = clearApiKey;
  renderCurrentKey();
  document.querySelectorAll(".fn-ns").forEach((el) => (el.textContent = NAMESPACE));
  loadCatalog();
});

function isDark(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 128;
}

function applyTheme() {
  const officeDark = isDark(Office.context.officeTheme?.bodyBackgroundColor);
  const dark = officeDark ?? window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

async function loadCatalog() {
  try {
    const res = await fetch("functions.json");
    const { functions } = await res.json();
    const groups = GROUPS.map(([title, re]) => renderGroup(title, functions.filter((f) => re.test(f.id))));
    document.getElementById("fn-list").append(...groups);
    const search = document.getElementById("fn-search");
    search.placeholder = `Search ${functions.length} functions`;
    search.oninput = () => filterCatalog(search.value.trim().toLowerCase());
  } catch (e) {
    setStatus(`Could not load the function list: ${e.message}`, true, "fn-status");
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderGroup(title, functions) {
  const group = el("details", "fn-group");
  group.append(el("summary", "fn-group-title", `${title} (${functions.length})`), ...functions.map(renderFunction));
  return group;
}

function renderFunction(f) {
  const item = el("details", "fn-item");
  item.dataset.search = `${f.id} ${f.description}`.toLowerCase();

  const summary = el("summary");
  summary.append(el("span", "fn-name", f.id), el("span", "fn-desc", f.description));

  const params = el("ul", "fn-params");
  for (const p of f.parameters) {
    const li = el("li");
    li.append(el("code", null, p.optional ? `[${p.name}]` : p.name), ` ${p.description}`);
    params.append(li);
  }
  if (!f.parameters.length) params.append(el("li", null, "No inputs."));

  const formula = el("input", "fn-formula");
  formula.value = exampleFormula(f);
  formula.setAttribute("aria-label", `${f.id} formula`);
  const insert = el("button", "btn btn-primary", "Insert");
  insert.type = "button";
  insert.onclick = () => insertFormula(formula.value);
  const row = el("div", "fn-insert");
  row.append(formula, insert);

  item.append(summary, params, row);
  return item;
}

function exampleValue(p) {
  const m = p.description.match(/e\.g\.\s*(?:"([^"]*)"|([^\s,)]+))/);
  const v = m ? m[1] ?? m[2] : p.name;
  return p.type === "number" && m ? v : `"${v}"`;
}

function exampleFormula(f) {
  let params = f.parameters.filter((p) => !p.optional);
  if (!params.length) params = f.parameters.filter((p) => /required if/i.test(p.description)).slice(0, 1);
  const args = params.map(exampleValue);
  return `=${NAMESPACE}.${f.id}(${args.join(", ")})`;
}

function filterCatalog(query) {
  for (const group of document.querySelectorAll(".fn-group")) {
    let shown = 0;
    for (const item of group.querySelectorAll(".fn-item")) {
      const match = !query || item.dataset.search.includes(query);
      item.hidden = !match;
      shown += match;
    }
    group.hidden = shown === 0;
    group.open = Boolean(query) && shown > 0;
  }
}

async function insertFormula(formula) {
  try {
    await Excel.run(async (context) => {
      const cell = context.workbook.getActiveCell();
      cell.formulas = [[formula]];
      cell.load("address");
      await context.sync();
      setStatus(`Inserted into ${cell.address.split("!").pop()}.`, false, "fn-status");
    });
  } catch (e) {
    setStatus(`Could not insert: ${e.message}`, true, "fn-status");
  }
}

function saveApiKey() {
  const input = document.getElementById("api-key-input");
  const apiKey = (input.value || "").trim();

  if (!apiKey) {
    setStatus("Please enter an API key.", true);
    return;
  }

  Office.context.document.settings.set(API_KEY_SETTING, apiKey);
  Office.context.document.settings.saveAsync((result) => {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      input.value = "";
      renderCurrentKey();
      setStatus("API key saved for this workbook.", false);
      return;
    }

    const errMsg = result.error && result.error.message ? result.error.message : "Unknown error";
    setStatus(`Failed to save key: ${errMsg}`, true);
  });
}

function clearApiKey() {
  Office.context.document.settings.set(API_KEY_SETTING, "");
  Office.context.document.settings.saveAsync((result) => {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      renderCurrentKey();
      setStatus("API key cleared.", false);
      return;
    }

    const errMsg = result.error && result.error.message ? result.error.message : "Unknown error";
    setStatus(`Failed to clear key: ${errMsg}`, true);
  });
}

function renderCurrentKey() {
  const currentKey = Office.context.document.settings.get(API_KEY_SETTING) || "";
  document.getElementById("current-key-value").textContent = maskApiKey(currentKey);
}

function maskApiKey(key) {
  if (!key) {
    return "Not set";
  }

  if (key.length <= 6) {
    return "*".repeat(key.length);
  }

  return `${key.slice(0, 3)}...${key.slice(-3)}`;
}

function setStatus(message, isError, id = "api-key-status") {
  const status = document.getElementById(id);
  status.textContent = message;
  status.className = `status-message ${isError ? "error" : "success"}`;
}
