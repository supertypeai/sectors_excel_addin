// Excel output type — custom-functions-metadata requires string[][]
export type ExcelRow = string[];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

export function toExcelDateSerial(value: string): number {
  const [y, m, d] = value.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d);
  const excelEpochUtc = Date.UTC(1899, 11, 30);
  return (utc - excelEpochUtc) / 86400000;
}

export function coerceValueType(
  value: unknown,
  type: "number" | "date",
): unknown {
  if (value === undefined || value === null || value === "") return value;

  if (type === "number") {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (NUMBER_REGEX.test(trimmed)) {
        const parsed = Number(trimmed);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
    return value;
  }

  if (type === "date") {
    if (value instanceof Date) {
      return (value.getTime() - Date.UTC(1899, 11, 30)) / 86400000;
    }
    if (typeof value === "string" && ISO_DATE_REGEX.test(value)) {
      return toExcelDateSerial(value);
    }
    return value;
  }

  return value;
}

export function applyColumnTypes(
  rows: unknown[][],
  columnTypeMap: Record<number, "number" | "date">,
  startRow = 1,
): unknown[][] {
  const entries = Object.entries(columnTypeMap).map(([k, t]) => [
    Number(k),
    t,
  ]) as [number, "number" | "date"][];
  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length === 0) continue;
    for (const [columnIndex, type] of entries) {
      if (columnIndex >= 0 && columnIndex < row.length) {
        row[columnIndex] = coerceValueType(row[columnIndex], type);
      }
    }
  }
  return rows;
}

export function applyKeyValueTypes(
  rows: unknown[][],
  keyTypeMap: Record<string, "number" | "date">,
): unknown[][] {
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 2) continue;
    const type = keyTypeMap[String(row[0])];
    if (type) {
      row[1] = coerceValueType(row[1], type);
    }
  }
  return rows;
}

/**
 * Normalise a 2-D array so every row has the same number of columns while
 * preserving native scalar types for Excel (number/boolean/date serial/string).
 * Removes zero-length "separator" rows.
 * Excel custom functions REQUIRE rectangular output — ragged rows can cause
 * #VALUE!.
 */
export function sanitize(rows: unknown[][]): ExcelRow[] {
  function sanitizeCell(v: unknown): string {
    if (v === undefined || v === null) return "";
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return String(v);
  }

  // 1. Drop completely empty separator rows
  const filtered = rows.filter((r) => r.length > 0);
  // 2. Find the widest row
  const cols = filtered.reduce((max, r) => Math.max(max, r.length), 0);
  // 3. Pad + sanitize every cell
  return filtered.map((r) => {
    const row: string[] = [];
    for (let i = 0; i < cols; i++) {
      row.push(sanitizeCell(r[i]));
    }
    return row;
  });
}

/**
 * Smart stringifier for generic formatting — strips JSON brackets from basic arrays,
 * pretty-prints objects, formats yield averages.
 */
export function cleanStringify(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val !== "object") return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return "";
    if (typeof val[0] !== "object") return val.join(", ");
    return JSON.stringify(val);
  }

  const obj = val as Record<string, unknown>;
  if ("avg_yield" in obj && "period" in obj) {
    return `${((obj.avg_yield as number) * 100).toFixed(2)}% (${obj.period}Y Avg)`;
  }

  const parts: string[] = [];
  for (const k in obj) {
    const v = obj[k];
    if (typeof v === "object" && v !== null) {
      if (Array.isArray(v)) {
        parts.push(`${k}: ${JSON.stringify(v)}`);
      } else {
        parts.push(`${k}: { ${cleanStringify(v)} }`);
      }
    } else {
      parts.push(`${k}: ${v}`);
    }
  }
  return parts.join(", ");
}

function flattenNestedArrays(
  data: Record<string, unknown>[],
): Record<string, unknown>[] {
  const hasNested = data.some((row) =>
    Object.values(row).some(
      (val) =>
        Array.isArray(val) &&
        val.length > 0 &&
        typeof val[0] === "object" &&
        val[0] !== null,
    ),
  );

  if (!hasNested) return data;

  const result: Record<string, unknown>[] = [];

  for (const row of data) {
    let nestedField: string | null = null;
    let nestedArray: Record<string, unknown>[] = [];

    for (const [key, val] of Object.entries(row)) {
      if (
        Array.isArray(val) &&
        val.length > 0 &&
        typeof val[0] === "object" &&
        val[0] !== null
      ) {
        nestedField = key;
        nestedArray = val as Record<string, unknown>[];
        break;
      }
    }

    if (nestedField === null) {
      result.push(row);
      continue;
    }

    const parentFields: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(row)) {
      if (key !== nestedField) {
        parentFields[key] = val;
      }
    }

    for (const nestedItem of nestedArray) {
      result.push({ ...parentFields, ...nestedItem });
    }
  }

  return result;
}

/**
 * Generic fallback formatter: flattens API response into a 2D array.
 */
export function formatData(payload: unknown): ExcelRow[] {
  if (!payload) return [["No Data Found"]];

  let data = payload;

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const obj = payload as Record<string, unknown>;
    if (obj.results && Array.isArray(obj.results)) data = obj.results;
    else if (obj.data && Array.isArray(obj.data)) data = obj.data;
  }

  if (Array.isArray(data)) {
    data = data.map((item) => {
      if (item && item.query_values) {
        const { query_values, ...rest } = item as Record<string, unknown> & {
          query_values: Record<string, unknown>;
        };
        return { ...rest, ...query_values };
      }
      return item;
    });
  }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    data = flattenNestedArrays(data as Record<string, unknown>[]);
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return [["No Results"]];
    if (typeof data[0] !== "object")
      return sanitize(data.map((item) => [String(item)]));

    const arrData = data as Record<string, unknown>[];
    const headers = Object.keys(arrData[0]);
    const rows = arrData.map((item) =>
      headers.map((h) => cleanStringify(item[h])),
    );
    return sanitize([headers, ...rows]);
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return [["Empty Data"]];
    const rows = keys.map((k) => [k, cleanStringify(obj[k])]);
    return sanitize([["Metric", "Value"], ...rows]);
  }

  return [[String(data)]];
}
