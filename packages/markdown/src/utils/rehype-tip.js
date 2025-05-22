import { visit } from "unist-util-visit";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";

const tipReg = /^\[!tip:(.*)\]$/;

export default function (options) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug);

  return function (ast, file) {
    const codeNodes = getAllTipCodeNode(ast);

    codeNodes.forEach((node) => {
      const type = node.properties.tip;
      delete node.properties.tip;

      const innerNode = processor.parse(node.children[0].children[0].value);
      const innerRoot = processor.runSync(innerNode);

      node.tagName = "figure";
      node.properties.className = `tip tip-${type}`;
      node.children = [innerRoot];
    });
  };
}

function getAllTipCodeNode(ast) {
  const nodes = [];

  visit(ast, "element", (node) => {
    if (node.tagName === "pre" && node.children[0].tagName === "code" && tipReg.test(node.children[0].data?.meta)) {
      const [, tip] = node.children[0].data?.meta?.match(tipReg);
      node.properties.tip = tip;

      nodes.push(node);
    }
  });

  return nodes;
}
