import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: './src/widget.ts',
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
