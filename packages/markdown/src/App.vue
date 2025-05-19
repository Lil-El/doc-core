<template>
  <button @click="toggle" class="absolute bg-amber-200">toggle</button>
  <div class="w-screen h-screen overflow-auto p-10">
    <m-markdown :md-text="mdStr"></m-markdown>
  </div>
</template>

<script setup>
/*
TODO: md 解析展示；
组件 代码预览 组件；
<!--  TODO:bg-green-200 sm:bg-pink-100 md:bg-yellow-100 lg:bg-purple-100 xl:bg-blue-100 2xl:bg-cyan-100 -->
网站首页使用termino.js，界面参考floating-ui.com
Termino.js
// TODO: 改为动态读取 md 文件
以后打包的时候，应该直接把对应docs下的md转成html文件，然后直接引入
包放在-D 和没有-D尝试
*/
import { readonly } from "vue";
import MMarkdown from "./components/markdown/index.vue";
import testMdText from "./doc/test.md?raw";

const mdStr = readonly(testMdText);

function toggle() {
  const curr = document.documentElement.getAttribute("data-theme");
  if (curr === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}
</script>
