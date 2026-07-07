export interface ParamDef {
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
  optional?: boolean;
  example?: string;
}

export interface EndpointDef {
  functionName: string;
  path: string;
  description: string;
  params: ParamDef[];
  extraQueryParams?: Record<string, unknown>;
  exchange?: string;
  category?: string;
  /** @see https://docs.sectors.app/api-references/ */
  "x-mdx-path"?: string;
}
