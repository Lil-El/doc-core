import { visit } from "unist-util-visit";
import { h, render } from "vue";

const reg = /^\[!vue:.*\]$/;
const compNameReg = /\[!vue:(\w+)(?::(\d+))?\]/;

export default function (options) {
  return function (ast, file) {
    const codeNodes = getAllRunningCodeNode(ast);

    codeNodes.forEach((node) => {
      const scopeId = Math.random().toString(36).substring(2, 10);

      node.tagName = "figure";
      const { compName, height } = node.properties;
      const objString = node.children[0].children[0].value;
      const params = JSON.parse(objString);

      delete node.properties.compName;
      delete node.properties.height;

      node.children = [
        {
          type: "element",
          tagName: "div",
          properties: { "data-scope-id": scopeId, style: height ? `height: ${height}px` : "" },
          children: [],
        },
      ];

      let tmpTimer = setInterval(() => {
        if (document.querySelector(`[data-scope-id="${scopeId}"]`)) {
          handleCompile(document.querySelector(`[data-scope-id="${scopeId}"]`), {
            params,
            name: compName,
          });
          clearInterval(tmpTimer);
        }
      }, 50);
    });
  };
}

function handleCompile(root, component) {
  import(`/src/components/index.js`).then((module) => {
    render(h(module[component.name], component.params), root);
  });
}

function getAllRunningCodeNode(ast) {
  const nodes = [];

  visit(ast, "element", (node) => {
    if (node.tagName === "pre" && node.children[0].tagName === "code" && reg.test(node.children[0].data?.meta)) {
      const [, compName, height] = node.children[0].data?.meta?.match(compNameReg);

      node.properties.compName = compName.toLowerCase();
      node.properties.height = height;

      nodes.push(node);
    }
  });

  return nodes;
}
