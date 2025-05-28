# @lil-el/markdown

![npm version](https://img.shields.io/npm/v/@lil-el/markdown?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

## Guide

### features

- 自动生成 `toc`，内置了 `codepen` 组件，以及自定义 tip 解析等；
- 基于 `unified` 实现 `Markdown` 解析，并基于 `shiki` 实现代码高亮；
- 支持编辑、导出功能；
- 支持 `light/dark` 主题，以及不同的主题配色 `color-theme`;

  ```html
  <markdown />

  <script setup>
    const theme = reactive({
      mode: "light",
      name: colorsProxy[0].name,
      color: colorsProxy[0].color,
    });
    provide("color-theme", theme);

    // 切换主题
    function toggle() {
      theme.mode = theme.mode === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme.mode);
    }

    // 切换配色
    function change(e) {
      theme.name = colorsProxy.find((c) => c.color === e.target.value).name;
      theme.color = e.target.value;
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

### Import

**main.js:**

```javascript
import "@lil-el/markdown/css";
```

**your vue file:**

```html
<markdown editable :text="mdContent" />

<script setup>
  import { markdown } from "@lil-el/markdown";

  const mdContent = ref(`# Hello World`);
</script>
```

# markdown

## props

- editable: Boolean 是否可编辑
- about: Boolean 查看示例文档
- text: String 文本内容
