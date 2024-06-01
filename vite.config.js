import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  esbuild: { legalComments: 'none' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      // '@': './src/',
      // components: './src/components',
      // layouts: './src/layouts',
      // pages: './src/pages',
    },
  },
});
