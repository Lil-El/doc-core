# @lil-el/markdown

![npm version](https://img.shields.io/npm/v/@lil-el/markdown?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

> ⚠️ **注意**：此 npm 包仅供**个人学习和测试**使用，请勿用于任何商业用途。

## Guide

基于 `vue3`，`@lil-el/codepen` 的 `Markdown解析` 组件。

### features

- 自动生成 `toc`，自定义 tip 解析等；
- 基于 `unified` 实现 `Markdown` 解析，并基于 `shiki` 实现代码高亮；
- 支持编辑、导出功能；
- 支持 `tailwindcss` 的 `dark` 主题（.drak, [data-theme="dark"]），以及不同的主题配色 `--markdown-color`;

  ```html
  <div class="h-[900px]">
    <markdown style="--markdown-color: pink;" />
  </div>

  <script setup>
    const theme = reactive({
      isDark: false,
    });

    provide("theme", theme);
  </script>
  ```

  > 在 editable 状态下，需要提供 theme.isDark

[更多查看](./src/doc/demo.md)

## Usage

**为避免 `tailwindcss` 样式覆盖问题，在你的项目/应用中安装 `tailwindcss` 并配置；**

需要安装 `@tailwindcss/typography`, `@tailwindcss/vite`, `tailwindcss`;

### Install

```bash
pnpm i @tailwindcss/typography @tailwindcss/vite tailwindcss -D
```

### Vite Config

需要配置 `tailwindcss` 插件。

```javascript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Tailwind Config

`tailwind.config.js` 中的 content 需要配置依赖包的路径。

`tailwind.config.js` 中的 theme 需要配置 `typography-options`。

**tailwind.config.js**

```js
import typographyOptions from "@lil-el/markdown/typography-options";

export default {
  content: [
    "./node_modules/@lil-el/markdown/dist/**/*.{js}",
    "./node_modules/@lil-el/codepen/dist/**/*.{js}",
    "./node_modules/@lil-el/ui/dist/**/*.{js}",
  ],
  theme: {
    extend: {
      typography: () => typographyOptions,
    },
  },
};
```

### Import

在入口的样式文件中，引入 `@lil-el/markdown/css` 样式。

> 不应该在 main.js 中引入 `@lil-el/markdown/css` 样式；

**style.css:**

```javascript
@import "tailwindcss";
@import "@lil-el/markdown/css";
@config "../tailwind.config.js";
```

**your vue file:**

````html
<div class="h-screen">
  <markdown editable :tutorial="false" :text="mdContent" :components="components" />
</div>

<script setup>
  import { markdown } from "@lil-el/markdown";

  const mdContent = `
  # Hello World

  ```json [!vue:helloworld]
  {
    "msg": "点我试试...",
    "style": "color: red; cursor: pointer;"
  }
  ```

`;

  const components = {
    helloworld: () => import("component path"), // 需要具名到处 helloworld
  };
</script>
````

# markdown

## props

- editable: Boolean 是否可编辑，默认为 `false`
- text: String `Markdown` 文本内容
- components: `Markdown` 内部引用的组件 (具名到处，name 与 key 保持一致)
