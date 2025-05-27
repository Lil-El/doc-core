import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import importToCDN from "vite-plugin-cdn-import";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const monacoEditorPlugin = require("vite-plugin-monaco-editor").default;

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    ...(process.env.NODE_ENV === "development" ? [monacoEditorPlugin({})] : []),
    importToCDN({
      modules: [
        {
          name: "@babel/standalone",
          var: "Babel",
          path: "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.5/babel.min.js",
        },
        {
          name: "loader",
          var: "loader",
          path: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js",
        },
        {
          name: "vue",
          var: "Vue",
          path: "https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.13/vue.global.prod.min.js",
        },
      ],
      enableInDevMode: true,
    }),
  ],
});
