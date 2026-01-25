import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for the app (root for most deployments)
  base: './',
  
  // Build output directory
  build: {
    outDir: 'dist',
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Ensure assets use relative paths
    assetsDir: 'assets',
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    open: true, // Auto-open browser on dev server start
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },
});
