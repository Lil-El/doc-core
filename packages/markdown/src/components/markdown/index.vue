<template>
  <div class="@container flex w-full h-full rounded-xl py-10 bg-[#ffffff80]">
    <md-content>
      <article class="prose max-w-full" v-html="content"></article>
    </md-content>
    <md-toc class="hidden @4xl:block"></md-toc>
  </div>
</template>

<script setup>
import MdContent from "./md-content.vue";
import mdToc from "./md-toc.vue";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
// import rehypeVue from "rehype-vue";

const { mdText: markdownText } = defineProps({
  mdText: String,
});

const content = ref("");

// .use(rehypeVue, {
//   h,
//   components: {
//     MyComponent,
//   },
// });

onMounted(async () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      themes: {
        light: "monokai",
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const parsed = await processor.process(markdownText);
  content.value = parsed.value;

  // https://unifiedjs.com/explore/project/rehypejs/
});
</script>
