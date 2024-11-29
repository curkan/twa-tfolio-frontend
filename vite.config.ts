import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        // additionalData: `
        //   @import "./src/styles/_animations.scss";
        //   @import "./src/styles/_variables.scss";
        //   @import "./src/styles/_mixins.scss";
        //   @import "./src/styles/_helpers.scss";
        // `
      },
    },
  },
})
