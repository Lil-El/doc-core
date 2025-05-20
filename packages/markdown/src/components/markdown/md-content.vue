<template>
  <div class="@container flex-auto break-words px-10">
    <div class="m-auto @sm:w-sm @md:w-[480px] @xl:w-[500px] @2xl:w-[600px] @3xl:w-[736px]">
      <!-- 静态class: prose-yellow-green -->
      <article
        class="prose dark:prose-invert max-w-full"
        :style="{
          '--tw-prose-bullets': theme.color,
          '--tw-prose-blockquote-bg-color': `${theme.color}30`,
          '--tw-prose-code': theme.color,
          '--tw-prose-headings': theme.color,
          '--tw-prose-hr': theme.color,
          '--tw-prose-links': theme.color,
          '--tw-prose-quote-borders': theme.color,
        }"
        v-html="data"
      ></article>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: String,
});

const theme = inject("color-theme");
</script>
