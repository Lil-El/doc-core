import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoImport from "unplugin-auto-import/vite";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import { readFileSync, writeFileSync } from "node:fs";
import { transform } from "@babel/core";
import { minify } from "terser";

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
    minify: true,
    chunkSizeWarningLimit: 500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      toplevel: true,
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
