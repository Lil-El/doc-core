<template>
  <div class="flex h-screen overflow-hidden">
    <md-editor v-if="isEdit" v-model="copyText" />

    <md-content :content="content" :edit="isEdit" @export="handleExport">
      <template v-slot="{ scrollToTop }">
        <md-toc v-if="!isEdit" class="hidden @4xl:flex" :toc="toc" :scrollToTop="scrollToTop" />
      </template>
    </md-content>
  </div>
</template>

<script setup>
import { ref, reactive, provide, watchEffect } from "vue";
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
import demoMdText from "@/doc/demo.md?raw";

const {
  text: markdownText,
  about,
  editable,
} = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
  about: {
    type: Boolean,
    default: false,
  },
  text: String,
});

const isEdit = ref(editable);

const copyText = ref(about ? demoMdText : markdownText);

const content = ref("");

const toc = ref([]);

const scrollTopCtrl = reactive({
  ctrl: null,
  top: 0,
  timer: null,
});
provide("scrollTopCtrl", scrollTopCtrl);

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

function handleExport() {
  exportFile(copyText.value, "markdown.md");
}

function exportFile(text, name) {
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.download = name;
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}
</script>
