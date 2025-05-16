<template>
  <div class="w-screen h-screen overflow-auto p-10 bg-green-200 sm:bg-pink-100 md:bg-amber-100 xl:bg-blue-100">
    <m-markdown :data="mdStr"></m-markdown>
  </div>
</template>

<script setup>
/*
TODO: md 解析展示；
组件 代码预览 组件；
网站首页使用termino.js，界面参考floating-ui.com
Termino.js
https://github.com/GeoffSelby/tailwind-highlightjs
https://github.com/tailwindlabs/tailwindcss-typography
*/
import { readonly } from "vue";
import MMarkdown from "./components/markdown/index.vue";

const mdStr = readonly(`#Heading

---

## Heading2
> 这是一个文档 By \`Mino\`

## Heading3

- md-content: **文档内容**
- md-toc: *文档大纲*

`);
</script>
