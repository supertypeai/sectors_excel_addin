// ============================================================
// adapter-registry.ts
// Each deployment entry point calls setAdapter() once at startup.
// All core functions then call getAdapter() to get the platform impl.
// ============================================================

import type { PlatformAdapter } from "./adapter";

let _adapter: PlatformAdapter | undefined;

export function setAdapter(adapter: PlatformAdapter): void {
  _adapter = adapter;
}

export function getAdapter(): PlatformAdapter {
  if (!_adapter) {
    throw new Error(
      "Platform adapter not set. Call setAdapter() in your deployment entry point before using any SECTORS_* function.",
    );
  }
  return _adapter;
}
