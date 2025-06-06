import { visit } from "unist-util-visit";
import { heading } from "hast-util-heading";

const TocHideReg = /\[!toc hide\]$/;

export default function (done) {
  return function (ast, file) {
    const headings = [];

    visit(ast, "element", (node) => {
      if (heading(node)) {
        let innerText = "";

        visit(node, "text", (textNode) => {
          innerText += textNode.value;
        });

        if (TocHideReg.test(innerText)) {
          node.properties.id = null;
          innerText = innerText.replace(TocHideReg, "").trim();
          node.children = [{ type: "text", value: innerText }];
        } else {
          node.properties["data-text"] = innerText;
          headings.push(node);
        }
      }
    });

    done(buildHeadingTree(headings));
  };
}

function buildHeadingTree(headings) {
  const tree = [];
  const stack = [{ level: 0, node: { children: tree } }];

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
