export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size limit (in kB)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'], // Example: vendor chunk
          ui: ['lucide-react', '@radix-ui/react-icons'],      // Example: UI libs
        },
      },
    },
  },
});
