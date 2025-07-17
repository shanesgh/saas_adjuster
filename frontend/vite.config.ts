import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Already ESM — avoid pre-bundling
  },
  build: {
    chunkSizeWarningLimit: 1000, // Allow larger bundles if needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-pdf') || id.includes('jspdf')) return 'pdf';
            if (id.includes('@clerk')) return 'clerk';
            if (id.includes('react-dropzone')) return 'dropzone';
            if (
              id.includes('@tanstack') ||
              id.includes('react-hook-form') ||
              id.includes('zod') ||
              id.includes('@hookform')
            )
              return 'forms';
            if (
              id.includes('framer-motion') ||
              id.includes('@radix-ui') ||
              id.includes('lucide-react')
            )
              return 'ui';
            if (id.includes('date-fns')) return 'date';
            return 'vendor';
          }
        },
      },
    },
  },
});