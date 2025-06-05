# @lil-el/codepen

![npm version](https://img.shields.io/npm/v/@lil-el/codepen?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

> ⚠️ **注意**：此 npm 包仅供**个人学习和测试**使用，请勿用于任何商业用途。

## Guide

`peerDependencies: vue 3.5.0+`;

### features

- 代码运行效果页面的 `iframe` 默认采用 `esm` 方式加载脚本；
- 支持主题配色，设置主题配色 `--codepen-color`；
- 默认使用 `ServiceWorker` 方式缓存编译后的资源；

### support

- javascript
- vue3
- react

### export

- codepen

## Usage

### Install

```bash
pnpm i @lil-el/codepen
```

### Vite Config

将 `codepen` 的 `sw.js` 文件拷贝到 `public` 目录下

需要在 `vite.config.js` 中配置如下代码：

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
import "@lil-el/codepen/css";
```

**在线编辑器 App**

```html
<codepen />

<script setup>
  import { codepen } from "@lil-el/codepen";
</script>
```

**单个代码片段 App**

```html
<codepen title="Hello" author="Mino" date="2025-05-30" :editors="editors" />

<script setup>
  import { codepen } from "@lil-el/codepen";

  const editors = reactive([
    {
      id: 1,
      name: "HTML",
      icon: "html",
      suffix: "html",
      language: "html",
      code: "<div id='hello'>Hello world!</div>",
    },
    {
      id: 2,
      name: "CSS",
      icon: "css",
      suffix: "css",
      language: "css",
      code: "#hello { color: red; }",
    },
    {
      id: 3,
      name: "JS",
      icon: "javascript",
      suffix: "javascript",
      language: "javascript",
      code: `
        function hello() {
          alert('Hello world!');
        }

        const ele = document.getElementById('hello');
        ele.addEventListener('click', hello);
      `,
    },
  ]);
</script>
```

# codepen

## props

- title: String
- author: String
- date: String
- editors: Array

**editor format:**

```json
{
  "id": "unique-id",
  "name": "HTML",
  "icon": "html",
  "suffix": "html",
  "language": "html",
  "code": "<div>Hello World</div>"
}
```
