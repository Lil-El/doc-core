# @lil-el/ui

![npm version](https://img.shields.io/npm/v/@lil-el/ui?color=green)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-lil--el.github.io-00bcff?logo=github)](https://lil-el.github.io)
[![CSDN](https://img.shields.io/badge/CSDN-Mino吖-f00?logo=csdn&logoColor=f2522f)](https://blog.csdn.net/qq_36157085)

> ⚠️ **注意**：此 npm 包仅供**个人学习和测试**使用，请勿用于任何商业用途。

## Guide

- `--data-theme-color` 配色

### export

- select
- select-option

### utils

- getSVG

## Usage

### Install

```bash
pnpm i @lil-el/ui
```

### Import

**main.js:**

```javascript
import "@lil-el/ui/css";
```

**your vue file:**

```html
<select type="list" icon="copy" popup="right" v-model="active">
  <select-option v-for="t in arr" :key="t.title" :value="t.title">
    <img :src="getSVG(t.icon)" width="16" />&nbsp;{{ t.title }}
  </select-option>
</select>

<script setup>
  import { Select, SelectOption, getSVG } from "@lil-el/ui";

  const arr = ref([
    { title: "Option 1", icon: "copy" },
    { title: "Option 2", icon: "copy" },
  ]);

  const active = ref("Option 1");
</script>
```

# Select

## props

- type: String, // cell | list
- icon: String, // [getSVG icons]
- popup: String, // bottom | right
- modelValue: [String, Number, Boolean],

## emits

- update:modelValue
- change

## slots

- default

# SelectOption

## props

- value: [String, Number, Boolean],

## slots

- default

# getSVG

## icons

- run
- refresh
- setting
- theme
- info
- folder
- layout
- html
- css
- javascript
- java
- json
- txt
- vue
- markdown
- copy
- close
