<template>
  <div class="flex h-screen overflow-hidden">
    <md-editor v-if="editable" v-model="copyText" />

    <md-content :content="content">
      <template v-slot="{ scrollToTop }">
        <md-toc v-if="!editable" class="hidden @4xl:flex" :toc="toc" :scrollToTop="scrollToTop" />
      </template>
    </md-content>
  </div>
</template>

<script setup>
import MdEditor from "./md-editor.vue";
import MdContent from "./md-content.vue";
import mdToc from "./md-toc.vue";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import rehypeToc from "@/utils/rehype-toc";
import rehypeVue from "@/utils/rehype-vue";
import rehypeTip from "@/utils/rehype-tip";
import rehypePatchFootnote from "@/utils/rehype-patch-footnote";

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

const processor = unified()
  .data("settings", { fragment: true })
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "wrap" })
  .use(rehypePatchFootnote)
  .use(rehypeToc, (result) => {
    toc.value = result;
  })
  .use(rehypeVue)
  .use(rehypeTip)
  // .use(() => (ast) => {
  //   console.log(ast);
  //   debugger;
  // })
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

watchEffect(() => {
  processor.process(copyText.value).then(({ value }) => {
    content.value = value;
  });
});
</script>
