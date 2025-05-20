import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-avatar',
      'framer-motion'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Bundle React and ReactDOM together
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Bundle Radix UI components together
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-vendor';
          }
          // Bundle other UI related packages
          if (id.includes('node_modules/framer-motion/') || 
              id.includes('node_modules/@heroicons/') ||
              id.includes('node_modules/lucide-react/')) {
            return 'ui-vendor';
          }
          // Bundle other common dependencies
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
