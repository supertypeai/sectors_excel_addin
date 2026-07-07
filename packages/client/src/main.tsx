import { createRoot } from "react-dom/client";
import App from "./App";

function mount() {
  createRoot(document.getElementById("root")!).render(<App />);
}

// In Excel: wait for Office.js. In browser: mount immediately.
if (typeof Office !== "undefined" && Office.onReady) {
  Office.onReady(mount);
} else {
  mount();
}
