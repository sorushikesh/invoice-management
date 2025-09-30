import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Build a multi-service proxy from env variables:
  // - VITE_PROXY_DEFAULT=http://localhost:8081/api/v1  -> maps /api -> target origin + base path
  // - VITE_PROXY_AUTH=http://localhost:8081/api/v1     -> maps /api/auth -> target origin + base path
  // - VITE_PROXY_BILLING=http://localhost:8082/api/v1  -> maps /api/billing -> ...
  const proxy: Record<string, any> = {};

  const setProxy = (name: string, targetUrl: string) => {
    try {
      const u = new URL(targetUrl);
      const origin = `${u.protocol}//${u.host}`;
      const basePath = u.pathname.replace(/\/$/, "");
      const prefix = name ? `/api/${name}` : "/api";
      proxy[prefix] = {
        target: origin,
        changeOrigin: true,
        secure: false,
        rewrite: (p: string) => p.replace(new RegExp(`^${prefix}`), basePath || "/"),
      };
    } catch (err) {
      // ignore invalid URLs
    }
  };

  if (env.VITE_PROXY_DEFAULT) {
    setProxy("", env.VITE_PROXY_DEFAULT);
  }

  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith("VITE_PROXY_") || key === "VITE_PROXY_DEFAULT") continue;
    const name = key.replace(/^VITE_PROXY_/, "").toLowerCase().replace(/_/g, "-");
    if (typeof value === "string" && value) setProxy(name, value);
  }

  return {
    server: {
      host: "localhost",
      port: 5173,
      proxy,
    },
    preview: {
      host: "localhost",
      port: 4173,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
