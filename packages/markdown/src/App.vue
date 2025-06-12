<template>
  <button @click="toggle" class="absolute z-10 bg-amber-200">toggle</button>
  <select class="absolute z-10 left-16 bg-amber-200" @change="change">
    <option v-for="theme in colorsProxy" :key="theme.name" :value="theme.color">{{ theme.name }}</option>
  </select>

  <div class="h-screen">
    <m-markdown style="--markdown-color: var(--data-theme-color)"  tutorial :text="mdStr"></m-markdown>
  </div>
</template>

<script setup>
import { provide, reactive, readonly, ref } from "vue";
import MMarkdown from "@/components/markdown/index.vue";
import colors from "./utils/color.js";

const colorsProxy = readonly(Object.entries(colors).map((i) => ({ name: i[0], color: i[1] })));

const mdStr = ref("# Hello World");

const theme = reactive({
  isDark: false,
});
provide("theme", theme);

function toggle() {
  const mode = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", mode);
  theme.isDark = mode === "dark";
}

function change(e) {
  document.documentElement.style.setProperty("--data-theme-color", e.target.value);
}
</script>
