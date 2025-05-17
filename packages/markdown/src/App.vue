<template>
  <div
    class="w-screen h-screen overflow-auto p-10 bg-green-200 sm:bg-pink-100 md:bg-yellow-100 lg:bg-purple-100 xl:bg-blue-100 2xl:bg-cyan-100"
  >
    <m-markdown :md-text="mdStr"></m-markdown>
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
// TODO: 改为动态读取 md 文件
以后打包的时候，应该直接把对应docs下的md转成html文件，然后直接引入
shiki/rehype这些包放在-D 和没有-D尝试
*/
import { readonly } from "vue";
import MMarkdown from "./components/markdown/index.vue";

const mdStr = readonly(`# Heading

---

## Heading2

> 这是一个<span style="color: yellowgreen;">文档</span> By \`呵呵\`

这是一个[<span style="color: yellowgreen;">文档</span>][1] By \`Mino\`

## Heading3

- md-content: **文档内容**
- md-toc: *文档大纲*

## Heading4

\`\`\`js
function hello() { // [!code ++]
  console.log('hello world'); // [!code highlight]
  return 'hello world'; // [!code --]
}
\`\`\`

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 \`<script setup>\` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


[1]: https://marxi.co/

`);
</script>
