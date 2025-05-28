<template>
  <div @click="hello">{{ msg }}</div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: "Hello World",
  },
});
function hello() {
  alert("hello world");
}
</script>
