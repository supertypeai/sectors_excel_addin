export type { PlatformAdapter } from "./adapter";
export { setAdapter, getAdapter } from "./adapter-registry";
export { buildQuery } from "./api";
export { formatData, cleanStringify } from "./formatter";
export { BASE_URL } from "./config";
export { executeEndpoint } from "./factory";
export type { EndpointDef, ParamDef } from "./types";
export { API_SCHEMA } from "./schema";
export * from "./functions";
