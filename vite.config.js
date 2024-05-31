import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  esbuild: { legalComments: 'none' },
  resolve: {
    alias: {
      // '@': './src/',
      // components: './src/components',
      // layouts: './src/layouts',
      // pages: './src/pages',
    },
  },
});
