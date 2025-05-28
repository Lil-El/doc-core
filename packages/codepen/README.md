# @lil-el/codepen

![npm version](https://img.shields.io/npm/v/@lil-el/codepen?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

## Guide

### features

- 运行效果区域，默认采用 esm 方式加载；
- 支持主题配色，继承主题配色 `--tw-prose-custom-color`；
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
import "@lil-el/codepen/css";
```

**your vue file:**

```html
<codepen />

<script setup>
  import { codepen } from "@lil-el/codepen";

  // 传入 editors 参数，展示对应的代码
  // 反之，是一个在线的任意的代码编辑器
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
