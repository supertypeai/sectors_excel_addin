// ============================================================
// build-function-tree.ts
// Builds the function tree (ExchangeGroup[]) from API_SCHEMA
// so FunctionsSection can consume it directly.
// ============================================================
import type { EndpointDef, ParamDef } from "@sectors/core/types";

export type { ParamDef };

export interface FunctionInfo {
  name: string;
  signature: string;
  description: string;
  example: string;
  params: ParamDef[];
  xMdxPath?: string;
}

export interface Category {
  name: string;
  functions: FunctionInfo[];
}

export interface ExchangeGroup {
  name: string;
  key: string;
  categories: Category[];
}

/** Convert SECTORS_FOO_BAR → SECTORS.FOO_BAR for Excel dot-notation. */
function toExcelName(functionName: string): string {
  return functionName.replace("SECTORS_", "SECTORS.");
}

/**
 * Derive a display signature from an EndpointDef.
 * Required params use plain name, optional params get [brackets].
 *
 *   SECTORS.BROKER_ACTIVITY_BY_CODE(broker_code, [symbol], [start], [end])
 */
function deriveSignature(def: EndpointDef): string {
  const params = def.params
    .map((p) => (p.optional ? `[${p.name}]` : p.name))
    .join(", ");

  const name = toExcelName(def.functionName);
  return params ? `${name}(${params})` : `${name}()`;
}

/**
 * Derive a type-aware example formula from an EndpointDef.
 * Strings are quoted, numbers/booleans are bare. Prefixed with `=`.
 *
 *   =SECTORS.BROKER_ACTIVITY_BY_CODE("MG", "BBCA", "2026-05-01", "2026-06-1")
 */
function deriveExample(def: EndpointDef): string {
  const params = def.params
    .map((p) => {
      if (p.example === undefined) return undefined;
      return p.type === "string" ? `"${p.example}"` : p.example;
    })
    .filter((e): e is string => e !== undefined);

  const name = toExcelName(def.functionName);
  return params.length > 0
    ? `=${name}(${params.join(", ")})`
    : `=${name}()`;
}

/**
 * Map a raw category tag to a display-friendly name.
 * - "SGX - Company Screener" → "Company Screener"
 * - "KLSE" → "Company Screener"
 * - Everything else stays as-is.
 */
function displayCategory(tag: string, exchange: string): string {
  // Strip exchange-specific prefixes
  if (exchange === "singapore" || exchange === "Singapore (SGX)") {
    return tag.replace(/^SGX - /, "");
  }
  // KLSE has a single tag, show as "Company Screener" for now
  if (tag === "KLSE") return "Company Screener";
  return tag;
}

/** Derive a lowercase key from an exchange name for tab selection. */
function exchangeKey(name: string): string {
  if (name.startsWith("Indonesia")) return "idx";
  if (name.startsWith("Singapore")) return "sgx";
  if (name.startsWith("Malaysia")) return "klse";
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

/**
 * Build the function tree from the schema's flat API_SCHEMA array.
 *
 * Groups endpoints by `exchange`, then within each exchange by `category`.
 * Returns the same shape as the old `function-data.ts` so the UI code
 * works without changes.
 */

export function renameExchange(name: string): string {
  if (name === "Indonesia (IDX)") return "IDX";
  if (name === "Singapore (SGX)") return "SGX";
  if (name === "Malaysia (KLSE)") return "KLSE";
  return name;
}

export function buildFunctionTree(schema: EndpointDef[]): ExchangeGroup[] {
  const groups = new Map<string, ExchangeGroup>();
  // Map from exchange+category → category index in the group
  const catIndices = new Map<string, number>();

  for (const def of schema) {
    if (!def.exchange || !def.category) continue;

    // Get or create exchange group
    let group = groups.get(def.exchange);
    if (!group) {
      group = {
        name: renameExchange(def.exchange),
        key: exchangeKey(def.exchange),
        categories: [],
      };
      groups.set(def.exchange, group);
    }

    // Get or create category within this exchange
    const catKey = `${def.exchange}\x00${def.category}`;
    let catIdx = catIndices.get(catKey);
    if (catIdx === undefined) {
      catIdx = group.categories.length;
      catIndices.set(catKey, catIdx);
      group.categories.push({
        name: displayCategory(def.category, def.exchange),
        functions: [],
      });
    }

    // Add the function
    group.categories[catIdx].functions.push({
      name: toExcelName(def.functionName),
      signature: deriveSignature(def),
      description: def.description,
      example: deriveExample(def),
      params: def.params,
      xMdxPath: def["x-mdx-path"],
    });
  }

  return Array.from(groups.values());
}
