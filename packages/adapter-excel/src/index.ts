// ============================================================
// Excel platform adapter.
// Uses OfficeRuntime.storage for key storage and fetch for API calls.
// ============================================================

import type { PlatformAdapter } from "@sectors/core/adapter";

const API_KEY_SETTING = "SECTORS_API_KEY";

export const ExcelAdapter: PlatformAdapter = {
  async callAPI(url: string): Promise<unknown> {
    const key = await OfficeRuntime.storage.getItem(API_KEY_SETTING);
    if (!key) throw new Error("API Key not set. Open the Sectors task pane and save your API key first.");

    const res = await fetch(url, {
      headers: { Authorization: key },
    });

    if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        (body as Record<string, string>).error ||
        (body as Record<string, string>).message ||
        `HTTP ${res.status}`,
      );
    }
    return res.json();
  },

  getApiKey(): string | null {
    return null;
  },

  async setApiKey(key: string): Promise<void> {
    await OfficeRuntime.storage.setItem(API_KEY_SETTING, key.trim());
  },

  async deleteApiKey(): Promise<void> {
    await OfficeRuntime.storage.removeItem(API_KEY_SETTING);
  },

  async applyFormulaToCell(formula: string): Promise<void> {
    await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.formulas = [[formula]];
      await context.sync();
    });
  },
};
