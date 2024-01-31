/*Other imports*/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    /*something*/
    alias: {
      /* Added '/@sounds' resolved alias problem for sounds */ 
      '/@sounds': 'assets/sounds', 
      '@components': '/assets/components'
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  assetsInclude: ['**/*.m4a'],
});
