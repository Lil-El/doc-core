import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import viteBundleSw from "./plugins/vite-bundle-sw";
import { resolve } from "path";
import { analyzer } from "vite-bundle-analyzer";

// 当 package.json 设置为 type module 时，无法下面引入，该插件只允许使用 commonjs 规范引入；
// import monacoEditorPlugin from "vite-plugin-monaco-editor";

// 使用 require 引入 monaco-editor-webpack-plugin
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const monacoEditorPlugin = require("vite-plugin-monaco-editor").default;

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    define: {
      __MONACO_CDN__: JSON.stringify("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"),
      __BABEL_CDN__: JSON.stringify("https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.5/babel.min.js"),
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
      ...(process.env.NODE_ENV === "development" ? [monacoEditorPlugin({})] : [viteBundleSw()]),
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
        // 作为库打包时，排除以下依赖；如果是应用打包，则不需要排除这些依赖
        external: ["vue", "monaco-editor", "@babel/standalone"],
        output: {
          globals: {
            vue: "Vue",
          },
          manualChunks: {
            "vue-code-compiler": ["vue/compiler-sfc"],
          },
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
            } else if (assetInfo.name?.endsWith(".ttf")) {
              return "assets/fonts/[name][extname]";
            }
            return "assets/[name][extname]";
          },
        },
      },
      emptyOutDir: true,
    },
  };
});
