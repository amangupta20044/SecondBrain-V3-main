import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Helper plugin to copy manifest.json and icons to dist after build
function copyManifestAndAssets() {
  return {
    name: 'copy-manifest-and-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
      fs.copyFileSync(
        path.resolve(__dirname, 'manifest.json'),
        path.resolve(distDir, 'manifest.json')
      );

      const assetsDir = path.resolve(__dirname, 'src/assets');
      const distAssetsDir = path.resolve(distDir, 'assets');
      if (!fs.existsSync(distAssetsDir)) {
        fs.mkdirSync(distAssetsDir, { recursive: true });
      }
      if (fs.existsSync(assetsDir)) {
        fs.readdirSync(assetsDir).forEach(file => {
          fs.copyFileSync(
            path.resolve(assetsDir, file),
            path.resolve(distAssetsDir, file)
          );
        });
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyManifestAndAssets()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'index.html'),
        options: path.resolve(__dirname, 'options.html'),
        background: path.resolve(__dirname, 'src/background/serviceWorker.ts'),
        content: path.resolve(__dirname, 'src/content/contentScript.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
