import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { analyzer } from "vite-bundle-analyzer";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
    ...(process.env.NODE_ENV === "development" ? [tailwindcss(), monacoEditorPlugin({})] : []),
    viteStaticCopy({
      targets: [
        {
          src: "typography-options.js",
          dest: "",
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
    minify: "esbuild",
    chunkSizeWarningLimit: 500, // 提高块大小警告阈值（默认 500KB）
    sourcemap: false, // 关闭 sourcemap 可减少内存占用
    rollupOptions: {
      // 作为库打包时，排除以下依赖；如果是应用打包，则不需要排除这些依赖
      external: ["vue", "monaco-editor"],
      output: {
        globals: {
          vue: "Vue",
        },
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
