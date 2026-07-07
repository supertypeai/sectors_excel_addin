// ============================================================
// functions/index.ts — Excel deployment functions entry point.
// Re-exports all facade functions from @sectors/core/functions
// and registers them with Excel's CustomFunctions runtime.
// ============================================================

// Re-export all core functions (platform-agnostic facades)
export * from "@sectors/core/functions";

// Wire the Excel platform adapter before any function is called
import { setAdapter } from "@sectors/core/adapter-registry";
import { ExcelAdapter } from "@sectors/adapter-excel";
setAdapter(ExcelAdapter);

// Register all functions with Excel for ribbon/cell use
import * as ALL from "@sectors/core/functions";

Office.onReady(() => {
  for (const [name, fn] of Object.entries(ALL)) {
    if (typeof fn === "function") {
      CustomFunctions.associate(name, fn);
    }
  }
});
