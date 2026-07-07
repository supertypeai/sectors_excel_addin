import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { copyFileSync, cpSync, mkdirSync, readFileSync } from "fs";
import type { Connect, ServerOptions } from "vite";

const DEPLOYMENT_DIR = __dirname;
const PROJECT_ROOT = resolve(DEPLOYMENT_DIR, "../..");
const DIST_DIR = resolve(PROJECT_ROOT, "dist");

function copyStaticPlugin() {
  return {
    name: "copy-static",
    closeBundle() {
      const distAssets = resolve(DIST_DIR, "assets");
      mkdirSync(distAssets, { recursive: true });
      copyFileSync(
        resolve(DEPLOYMENT_DIR, "src/functions/functions.json"),
        resolve(DIST_DIR, "functions.json"),
      );
      cpSync(resolve(DEPLOYMENT_DIR, "assets"), distAssets, { recursive: true });
    },
  };
}

// Serves /functions.js, /functions.json, /commands.js, /assets/* in dev.
// functions.js + commands.js are build-only — run `npm run build` first.
function serveStaticBuiltPlugin() {
  const fileMap: Record<string, { path: string; type: string }> = {
    "/functions.js":  { path: resolve(DIST_DIR, "functions.js"),  type: "application/javascript" },
    "/functions.json":{ path: resolve(DEPLOYMENT_DIR, "src/functions/functions.json"), type: "application/json" },
    "/commands.js":   { path: resolve(DIST_DIR, "commands.js"),   type: "application/javascript" },
  };

  return {
    name: "serve-static-built",
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";

        if (fileMap[url]) {
          const { path, type } = fileMap[url];
          try {
            res.setHeader("Content-Type", type);
            res.end(readFileSync(path));
            return;
          } catch { next(); return; }
        }

        if (url.startsWith("/assets/")) {
          try { res.end(readFileSync(resolve(DEPLOYMENT_DIR, url.slice(1)))); }
          catch { next(); }
          return;
        }

        next();
      });
    },
  };
}

const devCerts = await import("office-addin-dev-certs");
const httpsOptions: ServerOptions["https"] = await devCerts.getHttpsServerOptions();

export default defineConfig(({ command }) => ({
  root: DEPLOYMENT_DIR,
  publicDir: false,

  plugins: [
    tailwindcss(),
    react(),
    serveStaticBuiltPlugin(),
    ...(command === "build" ? [copyStaticPlugin()] : []),
  ],

  resolve: {
    alias: {
      "@sectors/core":          resolve(PROJECT_ROOT, "packages/core/src"),
      "@sectors/adapter-excel": resolve(PROJECT_ROOT, "packages/adapter-excel/src"),
      "@sectors/client":        resolve(PROJECT_ROOT, "packages/client/src"),
    },
  },

  build: {
    outDir: DIST_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        taskpane:  resolve(DEPLOYMENT_DIR, "taskpane.html"),
        commands:  resolve(DEPLOYMENT_DIR, "src/commands.ts"),
        main:      resolve(DEPLOYMENT_DIR, "src/main.tsx"),
        functions: resolve(DEPLOYMENT_DIR, "src/functions/index.ts"),
      },
      output: { entryFileNames: "[name].js" },
    },
  },

  server: {
    port: 3000,
    https: httpsOptions,
    proxy: {
      "/api": {
        target: "https://api.sectors.app/v2",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
        secure: true,
      },
    },
  },
}));
