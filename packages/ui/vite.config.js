import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    ...(process.env.NODE_ENV === "development" ? [tailwindcss()] : []),
  ],
  build: {
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(__dirname, "index.js"),
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        preserveModules: true, // 保留模块结构
        preserveModulesRoot: ".", // 使用项目根目录作为基准
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          // 将 CSS 文件放入 assets/css 目录
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
    // CSS 提取为单独文件
    cssCodeSplit: false,
    // 清空输出目录
    emptyOutDir: true,
  },
});
