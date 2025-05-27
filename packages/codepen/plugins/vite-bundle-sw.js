import { readFileSync, writeFileSync } from "node:fs";
import { transform } from "@babel/core";
import { minify } from "terser";

export default () => {
  return {
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
  };
};
