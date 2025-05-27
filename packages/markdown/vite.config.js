import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import importToCDN from "vite-plugin-cdn-import";
import { analyzer } from "vite-bundle-analyzer";
import { resolve } from "path";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const monacoEditorPlugin = require("vite-plugin-monaco-editor").default;

// https://vite.dev/config/
export default defineConfig({
  define: {
    __MONACO_CDN__: JSON.stringify("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"),
  },
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
    // analyzer(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "index.js"),
      formats: ["es"],
    },
    outDir: "dist",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    chunkSizeWarningLimit: 500, // 提高块大小警告阈值（默认 500KB）
    sourcemap: false, // 关闭 sourcemap 可减少内存占用
    rollupOptions: {
      output: {
        manualChunks: {},
        entryFileNames: "[name].js",
        chunkFileNames(assetInfo) {
          // 忽略以 _ 开头的文件：gh pages 对这类文件 404
          if (assetInfo.name.startsWith("_")) {
            return `js/${assetInfo.name.slice(1)}.js`;
          }

          return "js/[name]-[hash].js";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/[name][extname]";
          } else if (assetInfo.name?.endsWith(".ttf") || assetInfo.name?.endsWith(".woff2")) {
            return "assets/fonts/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
    emptyOutDir: true,
  },
});
