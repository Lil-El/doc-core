# @lil-el/codepen

![npm version](https://img.shields.io/npm/v/@lil-el/codepen?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

> ⚠️ **注意**：此 npm 包仅供**个人学习和测试**使用，请勿用于任何商业用途。

## Guide

基于 `vue3` 的 `代码编辑器` 组件。

### features

- 代码运行效果页面的 `iframe` 默认采用 `esm` 方式加载脚本；
- 支持主题配色，设置主题配色 `--codepen-color`；
- 默认使用 `Service Worker` 缓存编译后的资源，当 `Service Worker` 失败时会降级为 `srcdoc` 方式；

## Usage

**为避免 `tailwindcss` 样式覆盖问题，在你的项目/应用中安装 `tailwindcss` 并配置；**

需要安装 `@tailwindcss/vite`, `tailwindcss`;

### Install

```bash
pnpm i @tailwindcss/vite tailwindcss -D
```

```bash
pnpm i @lil-el/codepen
```

### Vite Config

需要配置 `tailwindcss` 插件。

同时由于该组件默认使用 `Service Worker` 缓存编译后的资源，所以需要在 `vite.config.js` 中配置如下代码来拷贝 `sw.js` 文件：

```javascript
import tailwindcss from "@tailwindcss/vite";
import viteCopySw from "@lil-el/codepen/vite-copy-sw";

export default defineConfig({
  plugins: [viteCopySw(), tailwindcss()],
});
```

### Tailwind Config

`tailwind.config.js` 中的 content 需要配置依赖包的路径。

**tailwind.config.js**

```js
export default {
  content: [
    "./node_modules/@lil-el/codepen/dist/**/*.{js}",
    "./node_modules/@lil-el/ui/dist/**/*.{js}"
  ],
};
```

### Import

在入口的样式文件中，引入 `@lil-el/code/css` 样式。

> 不应该在 main.js 中引入 `@lil-el/code/css` 样式；

**style.css:**

```javascript
@import "tailwindcss";
@import "@lil-el/codepen/css";
@config "../tailwind.config.js";
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
