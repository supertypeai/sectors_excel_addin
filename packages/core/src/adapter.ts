// ============================================================
// adapter.ts — Platform adapter interface.
// Each deployment target (Excel, Google Sheets) implements this.
// ============================================================

export interface PlatformAdapter {
  /** Authenticated GET to the full Sectors API URL. Throws on HTTP error. */
  callAPI(url: string): Promise<unknown>;

  /** Return the stored API key, or null if not set. */
  getApiKey(): string | null;

  /** Persist the API key. */
  setApiKey(key: string): Promise<void>;

  /** Remove the stored API key. */
  deleteApiKey(): Promise<void>;

  /** Insert a formula into the active cell. */
  applyFormulaToCell(formula: string): Promise<void>;
}
