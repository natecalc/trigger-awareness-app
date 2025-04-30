import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import vercel from "vite-plugin-vercel";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
      react(),
      tailwindcss(),
      vercel(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: "/",
    build: {
      manifest: true,
      outDir: "dist",
      copyPublicDir: true,
    },
    logLevel: "info",
    envDir: "../",
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
