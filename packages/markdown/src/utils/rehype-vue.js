import { visit } from "unist-util-visit";

export default function (options) {
  return function (tree) {
    // const headings = [];
    // visit(tree, "element", (node) => {
    //   if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
    //     visit(node, "text", (textNode) => {
    //       node.properties["data-text"] = textNode.value;
    //     });
    //     headings.push(node);
    //   }
    // });
    // options.target.value = buildHeadingTree(headings);
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
