<template>
  <div class="flex flex-col gap-2 h-max sticky top-25 text-sm">
    <div class="text-xs text-neutral-500 cursor-pointer" @click="scrollToTop">ON THIS PAGE</div>
    <div class="flex flex-col gap-1 border-l-3 border-gray-200 dark:border-gray-600">
      <md-toc-item v-for="item in toc" :key="item.id" :level="1" :data="item"></md-toc-item>
    </div>
  </div>
</template>

<script setup>
import MdTocItem from "./md-toc-item.vue";

defineProps({ toc: Array, scrollToTop: Function });
</script>
