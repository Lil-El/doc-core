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
// import rehypeVue from "rehype-vue";
import rehypeShiki from "@shikijs/rehype";
import { transformerNotationDiff } from "@shikijs/transformers";
import { codeToHtml } from "shiki";

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
      inline: "tailing-curly-colon",
      themes: {
        light: "monokai",
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const parsed = await processor.process(markdownText);
  console.log(parsed);
  content.value = parsed.value;

  // https://shiki.tmrs.site/packages/transformers
  // const code = `console.log('hello')`;
  // const html = await codeToHtml(code, {
  //   lang: "ts",
  //   theme: "nord",
  //   transformers: [transformerNotationDiff()],
  // });
  // console.log(html);
});
</script>
