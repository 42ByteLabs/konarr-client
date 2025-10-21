import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
// Export a base config object for consumers that need a plain config (e.g. Vitest).
export const viteBaseConfig = {
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
};

export default defineConfig(({ mode }) => {
  // Default base URL for the server when not provided via environment files.
  // Use localhost in development, and '/api' in production. This replacement
  // is applied at build time so it's safe to stringify here.
  const defaultServerBase =
    mode === "development" ? "http://localhost:8000/api" : "/api";

  return {
    ...viteBaseConfig,
    // Provide a build-time default for import.meta.env.VITE_SERVER_BASE_URL so the
    // app has a sensible value even if no .env file is present.
    define: {
      "import.meta.env.VITE_SERVER_BASE_URL": JSON.stringify(defaultServerBase),
    },
  };
});
