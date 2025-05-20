<template>
  <div class="@container flex size-full py-10">
    <md-content :data="content" />
    <md-toc class="hidden @4xl:flex" :data="toc" />
  </div>
</template>

<script setup>
import MdContent from "./md-content.vue";
import mdToc from "./md-toc.vue";
import MyComponent from "../HelloWorld.vue";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import rehypeToc from "@/utils/rehype-toc";
import rehypeVue from "@/utils/rehype-vue";

const { modelValue: markdownText } = defineProps({
  modelValue: String,
});

const content = ref("");

const toc = ref([]);

onMounted(async () => {
  const processor = unified()
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeToc, { target: toc })
    .use(rehypeVue, {})
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
