import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copy() {
  const swPath = resolve(__dirname, "./sw.js");
  const appPublicPath = resolve(process.cwd(), "public/sw.js");
  const swCode = readFileSync(swPath, "utf-8");
  writeFileSync(appPublicPath, swCode);
}

export default function viteCopySw() {
  return {
    name: "vite-plugin-copy-sw",
    configureServer: copy,
    buildStart: copy,
  };
}
