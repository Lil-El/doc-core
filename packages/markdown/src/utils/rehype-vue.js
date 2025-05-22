import { visit } from "unist-util-visit";
import { h, render } from "vue";

const compNameReg = /^\[!vue:(.*)\]$/;

export default function (options) {
  return function (ast, file) {
    const codeNodes = getAllRunningCodeNode(ast);

    codeNodes.forEach((node) => {
      const scopeId = Math.random().toString(36).substring(2, 10);

      node.tagName = "figure";
      const compName = node.properties.compName;
      const objString = node.children[0].children[0].value;
      const params = JSON.parse(objString);
      delete node.properties.compName;

      node.children = [
        {
          type: "element",
          tagName: "div",
          properties: { "data-scope-id": scopeId },
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
  import(`/src/components/${component.name}.vue`).then((module) => {
    render(h(module.default, component.params), root);
  });
}

function getAllRunningCodeNode(ast) {
  const nodes = [];

  visit(ast, "element", (node) => {
    if (
      node.tagName === "pre" &&
      node.children[0].tagName === "code" &&
      compNameReg.test(node.children[0].data?.meta)
    ) {
      const [, compName] = node.children[0].data?.meta?.match(compNameReg);
      node.properties.compName = compName.toLowerCase();

      nodes.push(node);
    }
  });

  return nodes;
}
