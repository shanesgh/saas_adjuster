import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [react(), tanstackRouter()],
  resolve: {
    alias: {
      "@": "/src",
      "@worker": "/worker",
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-pdf") || id.includes("jspdf")) return "pdf";
            if (id.includes("pdfjs-dist")) return "pdfdist";

            if (id.includes("@clerk")) return "clerk";
            if (id.includes("html2canvas")) return "html2canvas";
            if (id.includes("react-dropzone")) return "dropzone";
            if (
              id.includes("@tanstack") ||
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform")
            )
              return "forms";
            if (id.includes("recharts")) return "recharts";

            if (
              id.includes("framer-motion") ||
              id.includes("@radix-ui") ||
              id.includes("lucide-react")
            )
              return "ui";
            if (id.includes("date-fns")) return "date";
            return "vendor";
          }
        },
      },
    },
  },
});
