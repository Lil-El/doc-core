import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import autoImport from "unplugin-auto-import/vite";
import { readFileSync, writeFileSync } from "node:fs";
import { transform } from "@babel/core";
import { minify } from "terser";

// 当 package.json 设置为 type module 时，无法下面引入，该插件只允许使用 commonjs 规范引入；
// import monacoEditorPlugin from "vite-plugin-monaco-editor";

// 使用 require 引入 monaco-editor-webpack-plugin
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
    autoImport({
      imports: ["vue"],
    }),
    tailwindcss(),
    monacoEditorPlugin({}),
    {
      name: "compile-public-js",
      enforce: "post",
      async closeBundle() {
        const publicJsFiles = ["./dist/sw.js"];

        for (const file of publicJsFiles) {
          const code = readFileSync(file, "utf-8");
          const result = await transform(code, {
            presets: ["@babel/preset-env"],
            comments: false,
            minified: true,
          });

          const mini = await minify(result.code, {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            mangle: true,
            toplevel: true,
          });

          writeFileSync(file, mini.code);
        }
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 500,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          "@lil-el/ui": ["@lil-el/ui"],
        },
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
          } else if (assetInfo.name?.endsWith(".ttf")) {
            return "assets/fonts/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
    emptyOutDir: true,
  },
});
