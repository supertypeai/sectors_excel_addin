// ============================================================
// factory.ts — Shared executor for all schema-defined endpoints.
// Uses the platform adapter set via setAdapter() at startup.
// ============================================================
import { getAdapter } from "./adapter-registry";
import { buildQuery } from "./api";
import { formatData } from "./formatter";
import type { EndpointDef } from "./types";
import { BASE_URL } from "./config";

const NO_KEY_MSG: string[][] = [
  ["Sectors API key not set up."],
  ["Open the Sectors task pane and go to the API Key tab to save your key."],
  ["Get your key at https://sectors.app/api"],
];

/**
 * Execute an API endpoint defined in the schema.
 *
 * 1. Substitutes {param} placeholders in the path.
 * 2. Collects remaining args as query string parameters.
 * 3. Builds full URL and calls the API through the adapter.
 * 4. Returns a formatted 2D array.
 */
export async function executeEndpoint(
  def: EndpointDef,
  args: Record<string, unknown>,
  extraQueryParams?: Record<string, unknown>,
): Promise<string[][]> {
  const adapter = getAdapter();

  let path: string = def.path;
  const query: Record<string, unknown> = {};
  const consumed = new Set<string>();

  // 1. Substitute path parameters
  for (const param of def.params) {
    const value = args[param.name];
    const placeholder = `{${param.name}}`;

    if (path.includes(placeholder)) {
      consumed.add(param.name);
      if (value == null || value === "") {
        throw new Error(`${def.functionName}: "${param.name}" is required.`);
      }
      path = path.replace(placeholder, encodeURIComponent(String(value)));
    }
  }

  // 2. Remaining non-null args → query string
  for (const key in args) {
    if (!consumed.has(key)) {
      const val = args[key];
      if (val != null && val !== "") {
        query[key] = val;
      }
    }
  }

  // 3. Merge extra query params
  if (extraQueryParams) Object.assign(query, extraQueryParams);
  if (def.extraQueryParams) Object.assign(query, def.extraQueryParams);

  // 4. Build full URL and call API via adapter
  const cleanPath = path.endsWith("/") ? path : path + "/";
  const qs = buildQuery(query);
  const url = BASE_URL + cleanPath + qs;

  let payload: unknown;
  try {
    payload = await adapter.callAPI(url);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes("api key") ||
      msg.toLowerCase().includes("no api")
    ) {
      return NO_KEY_MSG;
    }
    throw err;
  }

  // 5. Format: generic flatten (formatter-config lookup added later)
  return formatData(payload);
}
