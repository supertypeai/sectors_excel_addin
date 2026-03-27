/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

const API_KEY_SETTING = "SECTORS_API_KEY";

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
  document.getElementById("sideload-msg").style.display = "none";
  document.getElementById("app-body").style.display = "flex";
  document.getElementById("save-api-key").onclick = saveApiKey;
  document.getElementById("clear-api-key").onclick = clearApiKey;
  renderCurrentKey();
});

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

function setStatus(message, isError) {
  const status = document.getElementById("api-key-status");
  status.textContent = message;
  status.className = isError
    ? "ms-font-s status-message error"
    : "ms-font-s status-message success";
}
