<template>
  <div
    class="w-screen h-screen flex justify-center items-center"
    :style="{
      '--codepen-color': 'white',
    }"
  >
    <codepen />
  </div>
</template>

<script setup>
import { reactive } from "vue";
import codepen from "@/components/code/code-pen.vue";

const editors = reactive([
  {
    id: 1,
    name: "HTML",
    icon: "html",
    suffix: "html",
    language: "html",
    code: "<div id='hello'>Hello world!</div>",
  },
  {
    id: 2,
    name: "CSS",
    icon: "css",
    suffix: "css",
    language: "css",
    code: "#hello { color: red; }",
  },
  {
    id: 3,
    name: "JS",
    icon: "javascript",
    suffix: "javascript",
    language: "javascript",
    code: `
      function hello() {
        alert('Hello world!');
      }

      const ele = document.getElementById('hello');
      ele.addEventListener('click', hello);
    `,
  },
]);
</script>
