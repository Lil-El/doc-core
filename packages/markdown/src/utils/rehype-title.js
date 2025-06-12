import { visit } from "unist-util-visit";

const titleReg = /^\[!title:(.*)\]$/;

export default function (options) {
  return function (ast, file) {
    const codeNodes = getAllCodeTitleNode(ast);

    codeNodes.forEach((node) => {
      const title = node.properties.title;
      node.properties.className = "code-with-title";
      delete node.properties.title;

      const titleNode = {
        type: "element",
        tagName: "div",
        children: [
          {
            type: "text",
            value: title,
          },
        ],
      };
      node.children = [titleNode, ...node.children];
    });
  };
}

function getAllCodeTitleNode(ast) {
  const nodes = [];

  visit(ast, "element", (node) => {
    if (
      node.tagName === "figure" &&
      node.children[0].tagName === "pre" &&
      node.children[0].children[0].tagName === "code"
    ) {
      if (titleReg.test(node.children[0].children[0].data?.meta)) {
        const [, title] = node.children[0].children[0].data?.meta?.match(titleReg);
        node.properties.title = title;

        nodes.push(node);
      }
    }
  });

  return nodes;
}
