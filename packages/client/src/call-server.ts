// ============================================================
// call-server.ts
// Adapter for the Excel addin — implements the same interface
// that components expect from the Google Sheets extension.
// Uses OfficeRuntime.storage and the Excel adapter.
// ============================================================
import { getAdapter } from "@sectors/core/adapter-registry";
import { BASE_URL } from "@sectors/core/config";
// ponytail: dashboard templates; re-import from ./dashboard-templates/company-dashboard when ready

const API_KEY_SETTING = "SECTORS_API_KEY";

function storage(): typeof OfficeRuntime.storage {
  return OfficeRuntime.storage;
}

export async function callServer<R>(fnName: string, ...args: unknown[]): Promise<R> {
  switch (fnName) {
    case "getApiKeyPreview": {
      const k = await storage().getItem(API_KEY_SETTING);
      if (!k) return null as R;
      if (k.length <= 6) return ("*".repeat(k.length)) as R;
      return (`${k.slice(0, 3)}...${k.slice(-3)}`) as R;
    }
    case "saveApiKey": {
      await getAdapter().setApiKey(args[0] as string);
      return undefined as R;
    }
    case "deleteApiKey": {
      await getAdapter().deleteApiKey();
      return undefined as R;
    }
    case "testConnection": {
      const key = await storage().getItem(API_KEY_SETTING);
      if (!key) throw new Error("API Key not set.");
      const res = await fetch(BASE_URL, { headers: { Authorization: key } });
      if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
      if (!res.ok) throw new Error(`Connection failed (HTTP ${res.status})`);
      return undefined as R;
    }
    case "syncDataCaches":
    case "generateDashboard": {
      // ponytail: dashboard not yet released; wire to company-dashboard.ts when ready
      return undefined as R;
    }
    case "applyFormulaToCell": {
      await getAdapter().applyFormulaToCell(args[0] as string);
      return undefined as R;
    }
    default:
      throw new Error(`Unknown call-server method: ${fnName}`);
  }
}
