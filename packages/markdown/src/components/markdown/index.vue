<template>
  <div class="@container flex w-full h-full py-10 bg-[#ffffff80]">
    <md-content></md-content>
    <md-toc class="hidden @4xl:block"></md-toc>
  </div>
</template>

<script setup>
import MdContent from "./md-content.vue";
import mdToc from "./md-toc.vue";

defineProps({
  data: String,
});
</script>
