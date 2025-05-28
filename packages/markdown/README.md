# @lil-el/markdown

## Guide

自动生成 `toc`，内置了 `codepen` 组件，以及自定义 tip 解析等；

基于 `unified` 实现 `Markdown` 解析，并基于 `shiki` 实现代码高亮；

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

- editable: Boolean
- text: String
