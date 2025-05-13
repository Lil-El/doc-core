import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoImport from "unplugin-auto-import/vite";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

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
  ],
  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          "@lil-el/ui": ["@lil-el/ui"],
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
