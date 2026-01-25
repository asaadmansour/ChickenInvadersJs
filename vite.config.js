import { defineConfig } from 'vite';
import { resolve } from 'path';

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
    // Multi-page app configuration
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'pages/game.html'),
        gameover: resolve(__dirname, 'pages/gameover.html'),
        instructions: resolve(__dirname, 'pages/instructions.html'),
        legal: resolve(__dirname, 'pages/legal.html'),
        privacy: resolve(__dirname, 'pages/privacy.html'),
        privacyAndTerms: resolve(__dirname, 'pages/privacyAndTerms.html'),
        scoreboard: resolve(__dirname, 'pages/scoreboard.html'),
        settings: resolve(__dirname, 'pages/settings.html'),
      },
    },
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
