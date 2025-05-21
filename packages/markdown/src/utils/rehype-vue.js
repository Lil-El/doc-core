import { visit } from "unist-util-visit";
import { createApp } from "vue";

export default function (options) {
  return function (ast, file) {
    const codeNodes = getAllRunningCodeNode(ast);

    codeNodes.forEach((node) => {
      const scopeId = Math.random().toString(36).substring(2, 10);

      node.tagName = "figure";
      const objString = node.children[0].children[0].value;
      const obj = JSON.parse(objString)
      console.log(obj);
      // TODO: 获取参数等对象，然后渲染成组件

      node.children = [
        {
          type: "element",
          tagName: "div",
          properties: { className: "code-runner", "data-scope-id": scopeId },
          children: [],
        },
      ];

      let tmpTimer = setInterval(() => {
        if (document.querySelector(`[data-scope-id="${scopeId}"]`)) {
          handleCompile(document.querySelector(`[data-scope-id="${scopeId}"]`));
          clearInterval(tmpTimer);
        }
      }, 50);
    });
  };
}

function handleCompile(root) {
  import("@/components/HelloWorld.vue").then((module) => {
    const app = createApp(module.default);
    app.mount(root);
  });
}

function getAllRunningCodeNode(ast) {
  const nodes = [];

  visit(ast, "element", (node) => {
    if (
      node.tagName === "pre" &&
      node.children[0].tagName === "code" &&
      node.children[0].data?.meta === "[!code run]"
    ) {
      console.log(node);

      nodes.push(node);
    }
  });

  return nodes;
}
