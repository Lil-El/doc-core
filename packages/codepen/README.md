# @lil-el/codepen

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
