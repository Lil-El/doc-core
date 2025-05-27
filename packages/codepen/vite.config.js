import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import viteBundleSw from "./plugins/vite-bundle-sw";
import { resolve } from "path";
import importToCDN from "vite-plugin-cdn-import";
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
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    plugins: [
      vue(),
      // autoImport({
      //   imports: ["vue"],
      // }),
      tailwindcss(),
      ...(process.env.NODE_ENV === "development" ? [monacoEditorPlugin({})] : [viteBundleSw()]),
      // 不需要 external 和 globals 配置，因为 importToCDN 插件会自动处理
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
          // 配置 vue cdn 会和 autoImport 冲突
          {
            name: "vue",
            var: "Vue",
            path: "https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.13/vue.global.prod.min.js",
          },
        ],
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
        // external: ["vue", "monaco-editor", "@babel/standalone"],
        output: {
          // globals: {
          //   vue: "Vue",
          //   monaco: "monaco",
          //   "@babel/standalone": "Babel",
          // },
          /**
           * manualChunks 将 [] 内的多个包分离为独立的 chunk
           *
           * 配置 manualChunks："@lil-el/ui": ["@lil-el/ui"]
           *    App.vue 的（reactive和defineAsyncComponent）被打包进了 lil-el/ui 中
           * 配置 manualChunks：vue: ["vue"] 则单独打包成一个 chunk
           */
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
