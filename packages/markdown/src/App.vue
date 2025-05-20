<template>
  <button @click="toggle" class="absolute bg-amber-200">toggle</button>
  <select class="absolute left-16 bg-amber-200" @change="change">
    <option v-for="theme in colorsProxy" :key="theme.name" :value="theme.color">{{ theme.name }}</option>
  </select>
  <div class="p-10">
    <m-markdown v-model="mdStr"></m-markdown>
  </div>
</template>

<script setup>
/*
组件 代码预览 组件；
lil-el/ui 设置 ui 前缀 tailwind
monaco editor
首页使用termino.js，界面参考floating-ui.com
Termino.js
以后打包的时候，应该直接把对应docs下的md转成html文件，然后直接引入
包放在-D 和没有-D尝试
app 读取目录生成左侧目录，点击目录跳转对应md文件
*/
import MMarkdown from "./components/markdown/index.vue";
import demoMdText from "./doc/demo.md?raw";
import colors from "./utils/color.js";

const colorsProxy = readonly(Object.entries(colors).map((i) => ({ name: i[0], color: i[1] })));

const colorTheme = reactive({
  name: colorsProxy[0].name,
  color: colorsProxy[0].color,
});
provide("color-theme", colorTheme);

const mdStr = demoMdText;

function toggle() {
  const curr = document.documentElement.getAttribute("data-theme");
  if (curr === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function change(e) {
  colorTheme.name = colorsProxy.find((c) => c.color === e.target.value).name;
  colorTheme.color = e.target.value;
}
</script>
