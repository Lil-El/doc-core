<template>
  <div class="flex h-screen overflow-hidden">
    <md-editor v-if="editable" v-model="copyText" />

    <md-content :content="content">
      <md-toc v-if="!editable" class="hidden @4xl:flex" :data="toc" />
    </md-content>
  </div>
</template>

<script setup>
import MdEditor from "./md-editor.vue";
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
import { onMounted } from "vue";

const { text: markdownText } = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
  text: String,
});

const copyText = ref(markdownText);

const content = ref("");

const toc = ref([]);

watchEffect(async () => {
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

  const parsed = await processor.process(copyText.value);
  content.value = parsed.value;
});
</script>
