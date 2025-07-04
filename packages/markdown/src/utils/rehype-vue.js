import { visit } from "unist-util-visit";
import { h, render } from "vue";

const reg = /^\[!vue:.*\]$/;
const compNameReg = /\[!vue:(\w+)(?::(\d+))?\]/;

export default function (options = {}) {
  return function (ast, file) {
    const codeNodes = getAllRunningCodeNode(ast);

    codeNodes.forEach(async (node) => {
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

      if (!options.mounted) {
        console.error("[rehype-vue] options.mounted is not defined");
      } else {
        if (options.components[compName]) {
          options.mounted(() => {
            handleCompile(
              document.querySelector(`[data-scope-id="${scopeId}"]`),
              options.components[compName],
              compName,
              params
            );
          });
        } else {
          node.children[0].properties.className = ["component-404"];
          node.children[0].children.push({
            type: "text",
            value: `组件 ${compName} 不存在`,
          });
        }
      }
    });
  };
}

function handleCompile(root, component, name, params) {
  component().then((module) => {
    render(h(module[name], params), root);
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

function codepenHTML(props) {
  const ele = document.querySelector("#md-content-article");
  const color = getComputedStyle(ele).getPropertyValue("--codepen-color");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Code Pen</title>
      <style>
        @import url("https://unpkg.com/@lil-el/codepen@latest/css");
      </style>
    </head>
    <body>
      <div id="app" style="--codepen-color: ${color};"></div>

      <script type="importmap">
        {
          "imports": {
            "vue": "https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.js",
            "@lil-el/codepen": "https://unpkg.com/@lil-el/codepen@latest/dist/index.js"
          }
        }
      </script>
      <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      <script type="module">
        import { createApp, h } from "vue";
        import { codepen } from "@lil-el/codepen";

        const App = h(codepen, ${props});

        createApp(App).mount("#app");
      </script>
    </body>
    </html>
  `.replaceAll(/\n\s+/g, "");
}
