// ============================================================
// api.ts — Platform-agnostic API utilities.
// HTTP calls are handled by the platform adapter (adapter.ts).
// This module provides: buildQuery, formatData, cleanStringify.
// ============================================================

/**
 * Build a query string from an object of parameters.
 * Skips undefined, null, or empty-string values.
 */
export function buildQuery(params: Record<string, unknown>): string {
  const qs: string[] = [];
  for (const key in params) {
    const val = params[key];
    if (val !== undefined && val !== null && val !== "") {
      qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
    }
  }
  return qs.length ? `?${qs.join("&")}` : "";
}
