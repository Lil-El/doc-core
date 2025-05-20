<template>
  <div class="@container flex size-full py-10">
    <md-content>
      <!-- 静态class: prose-yellow-green -->
      <article
        class="prose dark:prose-invert max-w-full"
        :style="{
          '--tw-prose-hr': theme.color,
          '--tw-prose-code': theme.color,
          '--tw-prose-bullets': theme.color,
          '--tw-prose-links': theme.color,
          '--tw-prose-quote-borders': theme.color,
          '--tw-prose-blockquote-bg-color': `${theme.color}30`,
        }"
        v-html="content"
      ></article>
    </md-content>

    <md-toc class="hidden @4xl:flex" :data="toc"></md-toc>
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
import { visit } from "unist-util-visit";
// import rehypeVue from "rehype-vue";

const { mdText: markdownText } = defineProps({
  mdText: String,
});

const theme = inject("color-theme");

const content = ref("");

// .use(rehypeVue, {
//   h,
//   components: {
//     MyComponent,
//   },
// });

const toc = ref([]);

onMounted(async () => {
  const processor = unified()
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
    })
    .use(() => {
      return (tree) => {
        const headings = [];
        visit(tree, "element", (node) => {
          if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
            visit(node, "text", (textNode) => {
              node.properties["data-text"] = textNode.value;
            });
            headings.push(node);
          }
        });
        toc.value = buildHeadingTree(headings);
      };
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

function buildHeadingTree(headings) {
  const tree = [];
  const stack = [{ level: 0, node: { children: tree } }]; // 哨兵节点

  for (const heading of headings) {
    const level = parseInt(heading.tagName.substring(1));

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const newNode = { id: heading.properties.id, title: heading.properties["data-text"], children: [] };

    const parent = stack[stack.length - 1];
    parent.node.children.push(newNode);

    stack.push({ level, node: newNode });
  }

  return tree;
}
</script>
