import "./index.css";
import { setAdapter } from "@sectors/core/adapter-registry";
import { ExcelAdapter } from "@sectors/adapter-excel";
import * as functions from "./functions/index.ts";
import { createRoot } from "react-dom/client";
import App from "@sectors/client/App";

setAdapter(ExcelAdapter);

Office.onReady(() => {
  // Register custom functions in the shared runtime
  for (const [name, fn] of Object.entries(functions)) {
    if (typeof fn === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (CustomFunctions as any).associate(name, fn);
    }
  }

  // Mount the taskpane UI
  createRoot(document.getElementById("root")!).render(<App />);
});
