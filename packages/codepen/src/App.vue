<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <codepen style="--codepen-color: red" />
  </div>
</template>

<script setup>
import { reactive } from "vue";
import codepen from "@/components/code/code-pen.vue";

const editors = reactive({
  html: {
    id: 1,
    code: "<div id='hello'>Hello world!</div>",
  },
  css: {
    id: 2,
    code: "#hello { color: red; }",
  },
  javascript: {
    id: 3,
    code: `
      function hello() {
        alert('Hello world!');
      }

      const ele = document.getElementById('hello');
      ele.addEventListener('click', hello);
    `,
  },
});
</script>
