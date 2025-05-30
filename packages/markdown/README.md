# @lil-el/markdown

![npm version](https://img.shields.io/npm/v/@lil-el/markdown?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

> ⚠️ **注意**：此 npm 包仅供**个人学习和测试**使用，请勿用于任何商业用途。

## Guide

### features

- 自动生成 `toc`，内置了 `codepen` 组件，以及自定义 tip 解析等；
- 基于 `unified` 实现 `Markdown` 解析，并基于 `shiki` 实现代码高亮；
- 支持编辑、导出功能；
- 支持 `light/dark` 主题，以及不同的主题配色 `--markdown-color`;

  ```html
  <markdown style="--markdown-color: var(--data-theme-color);" />

  <script setup>
    const colors = {
      purple: "#a948ff",
      cyan: "#00d0ff",
      "yellow-green": "#99cd32",
      amber: "#ffb300",
      pink: "#ff00c6",
    };

    const colorsProxy = readonly(Object.entries(colors).map((i) => ({ name: i[0], color: i[1] })));

    function toggle() {
      const mode = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", mode);
    }

    function change(e) {
      document.documentElement.style.setProperty("--data-theme-color", color);
    }
  </script>
  ```

[更多查看](./src/doc/demo.md)

### export

- markdown

## Usage

### Install

```bash
pnpm i @lil-el/markdown
```

### Vite Config

需要将 `codepen` 的 `sw.js` 文件拷贝到 `public` 目录下

```javascript
import { resolve } from "path";
import { readFileSync, writeFileSync } from "node:fs";

export default function viteCopySw() {
  const swPath = resolve(__dirname, "node_modules/@lil-el/codepen/dist/sw.js");
  const swCode = readFileSync(swPath, "utf-8");
  const targetPath = resolve(__dirname, "public/sw.js");
  writeFileSync(targetPath, swCode);
}
```

### Import

**main.js:**

```javascript
import "@lil-el/markdown/css";
```

**your vue file:**

```html
<markdown editable :tutorial="false" :text="mdContent" />

<script setup>
  import { markdown } from "@lil-el/markdown";

  const mdContent = ref(`# Hello World`);
</script>
```

# markdown

## props

- editable: Boolean 是否可编辑，默认为 `false`
- tutorial: Boolean 查看示例文档，默认为 `false`
- text: String `Markdown` 文本内容
