import { visit } from "unist-util-visit";

const notationReg = /!notation:([^:]+)(?::([^:]+))?$/;

export default function (options) {
  return function (ast, file) {
    const nodes = getAllCodeANode(ast);

    nodes.forEach((node, index) => {
      const type = node.properties.type;
      const color = node.properties.color;

      node.tagName = "span";

      node.properties.id = `notation-${index}`;

      delete node.properties.type;
      delete node.properties.color;
      delete node.properties.href;

      options.mounted(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadNotation().then((module) => {
                const { annotate } = module;
                const annotation = annotate(entry.target, { type, color });

                setTimeout(() => annotation.show(), 500);
              });

              observer.disconnect();
            }
          });
        });

        observer.observe(document.querySelector(`#notation-${index}`));
      });
    });
  };
}

function getAllCodeANode(ast) {
  const nodes = [];

  visit(ast, "element", (node) => {
    if (node.tagName === "a") {
      if (notationReg.test(node.properties.href)) {
        const [, type, color] = node.properties.href?.match(notationReg);
        node.properties.type = type;
        node.properties.color = color;

        nodes.push(node);
      }
    }
  });

  return nodes;
}

function loadNotation() {
  if (window["rough-notation"]) {
    return Promise.resolve(window["rough-notation"]);
  }

  return new Promise((resolve) => {
    import("https://unpkg.com/rough-notation?module").then((module) => {
      window["rough-notation"] = module;
      resolve(module);
    });
  });
}
