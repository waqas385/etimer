/*Other imports*/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    /*something*/
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
