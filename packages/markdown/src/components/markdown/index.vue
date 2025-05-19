<template>
  <div class="@container flex size-full py-10">
    <md-content>
      <article class="prose dark:prose-invert prose-yellow-green max-w-full" v-html="content"></article>
      <!-- prose-mypink  -->
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
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { transformerCopyButton } from "@rehype-pretty/transformers";
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
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
    })
    .use(rehypePrettyCode, {
      bypassInlineCode: !true,
      transformers: [
        transformerCopyButton({
          visibility: "hover",
          feedbackDuration: 3_000,
        }),
      ],
      theme: {
        light: "snazzy-light",
        dark: "monokai",
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const parsed = await processor.process(markdownText);
  content.value = parsed.value;
});
</script>
