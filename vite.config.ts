import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // The 'base' must only be used in production for the subfolder to work
  base: mode === "production" ? "/subscription-tracker/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  // The 'as any' prevents the 6 TypeScript errors in VS Code
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean) as any,
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
}));
