<template>
  <div class="@container flex flex-1/2 size-full py-10 overflow-y-auto">
    <div class="@container h-max flex-1/2 break-words px-10 overflow-y-auto">
      <div class="m-auto @3xl:w-[740px]">
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
          v-html="content"
        ></article>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  content: String,
});

const theme = inject("color-theme");
</script>
