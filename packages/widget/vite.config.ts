import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  },
  build: {
    lib: {
      entry: './src/widget.tsx',
      name: 'FeedbackWidget',
      fileName: 'widget',
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      output: {
        globals: {
          preact: 'Preact',
        },
      },
    },
  },
})
