import { ref, onMounted, nextTick } from "vue";

import { parseVue3, parseReact, btoaUtf8 } from "@/core/parse";
import { register, putCache } from "@/core/service";

// 是否使用 ServiceWorker，否则使用 srcdoc 方式
let enableSW = import.meta.env.MODE === "development" ? false : "serviceWorker" in navigator;
const urlsToCache = {
  preview: "/preview?v=0",
  main: "/main.js?v=0",
  App: "/App.vue?v=0",
  render: "/render.js?v=0",
  app: "/app.js?v=0",
};

function handleJS(htmlCode, cssCode, jsCode, sw) {
  const htmlStr = `${htmlCode}\n${
    sw ? `<script type="module" src="${urlsToCache.main}"></script>` : `<script type="module">${jsCode}</script>`
  }`;
  const cssStr = `<style>${cssCode}</style>`;

  if (sw) {
    putCache(urlsToCache.main, new Response(jsCode, { headers: { "Content-Type": "text/javascript" } }));
  }

  return {
    htmlStr,
    cssStr,
  };
}

async function handleVue3(code, mainJS, sw) {
  const { __filename, __scopeId, App, render, styles } = await parseVue3(code);

  const jsStr = mainJS.replace(
    /import\s+App\s+from\s+(["'])(App\.vue)\1\s*?(?=[\r\n;]|$)/g,
    `import App from "${sw ? urlsToCache.App : `data:text/javascript;base64,${btoaUtf8(App)}`}";
App.__filename = "${__filename}";
${__scopeId ? `App.__scopeId = "data-v-${__scopeId}";` : ""}

${
  render
    ? `import { render } from "${sw ? urlsToCache.render : `data:text/javascript;base64,${btoaUtf8(render)}`}";
App.render = render;`
    : ""
}`
  );

  const htmlStr = `<div id="app"></div>
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.js"
    }
  }
</script>
${sw ? `<script type="module" src="${urlsToCache.main}"></script>` : `<script type="module">${jsStr}</script>`}
`;

  if (sw) {
    putCache(urlsToCache.main, new Response(jsStr, { headers: { "Content-Type": "text/javascript" } }));
    putCache(urlsToCache.App, new Response(App, { headers: { "Content-Type": "text/javascript" } }));
    if (render) putCache(urlsToCache.render, new Response(render, { headers: { "Content-Type": "text/javascript" } }));
  }

  return {
    htmlStr,
    cssStr: styles.map((style) => `<style>${style}</style>`).join("\n"),
  };
}
async function handleReact(appJS, mainJS, sw) {
  const app = await parseReact(appJS, "app.js");

  const jsStr = mainJS.replace(
    /import\s+App\s+from\s+(["'])(app\.js)\1\s*?(?=[\r\n;]|$)/g,
    `import App from "${sw ? urlsToCache.app : `data:text/javascript;base64,${btoaUtf8(app)}`}";`
  );

  const main = await parseReact(jsStr, "main.js");

  const htmlStr = `<div id="app"></div>
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom": "https://esm.sh/react-dom@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
      }
    }
  </script>
  ${sw ? `<script type="module" src="${urlsToCache.main}"></script>` : `<script type="module">${main}</script>`}
  `;

  if (sw) {
    putCache(urlsToCache.main, new Response(main, { headers: { "Content-Type": "text/javascript" } }));
    putCache(urlsToCache.app, new Response(app, { headers: { "Content-Type": "text/javascript" } }));
  }

  return {
    htmlStr,
    cssStr: "",
  };
}

function generateHTML(htmlStr, cssStr) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Code Preview</title>
      ${cssStr}
    </head>
    <body>
      ${htmlStr}
    </body>
    </html>
  `;
}

async function getEditorCode(editors, type) {
  for (const editor of editors) {
    const ins = await editor.getData();
    if (ins.type === type) {
      return ins.code;
    }
  }
}

export default function useEditors(previewID, pure, t) {
  let projectType = t;

  const editorRef = ref(null);

  const loading = ref(false);

  onMounted(() => {
    if (enableSW) {
      register().catch(() => {
        console.log("service worker 注册失败, 降级为普通模式");
        enableSW = false;
      });
    }

    // #region
    // setTimeout(() => {
    /**
     * TEST: 如果 url、sw.js 都没有变化，重复注册不会触发 updatefound、statechange 事件
     */
    // navigator.serviceWorker.register(`/sw.js?`);

    /**
     * TEST: 首次、非首次 重复注册测试（sw.js未变动，只有v变动），触发 updatefound、statechange 事件
     */
    // navigator.serviceWorker.register(`/sw.js?v=${Math.random()*10}`);

    /**
     * TEST: 首次、非首次 重复注册测试（sw.js 内容变化），手动触发 update 检查更新，触发 updatefound、statechange 事件
     */
    // navigator.serviceWorker.getRegistration().then((registration) => {
    //   registration.update();
    // });
    // }, 10000);
    // #endregion

    if (pure) nextTick(run);

    const previewFrame = document.getElementById(previewID);
    previewFrame.onload = () => {
      loading.value = false;
    };
  });

  async function run() {
    const editors = editorRef.value;
    if (!editors) return void 0;

    loading.value = true;

    let srcdoc;

    if (projectType === "html") {
      const htmlCode = await getEditorCode(editors, "html");
      const cssCode = await getEditorCode(editors, "css");
      const jsCode = await getEditorCode(editors, "javascript");
      const { htmlStr, cssStr } = handleJS(htmlCode, cssCode, jsCode, enableSW);
      srcdoc = generateHTML(htmlStr, cssStr);
    } else if (projectType === "vue3") {
      const jsCode = await getEditorCode(editors, "mainJs");
      const vueCode = await getEditorCode(editors, "appVue");
      const { htmlStr, cssStr } = await handleVue3(vueCode, jsCode, enableSW);
      srcdoc = generateHTML(htmlStr, cssStr);
    } else if (projectType === "react") {
      const jsCode = await getEditorCode(editors, "mainJs");
      const reactCode = await getEditorCode(editors, "appJs");
      const { htmlStr, cssStr } = await handleReact(reactCode, jsCode, enableSW);
      srcdoc = generateHTML(htmlStr, cssStr);
    }

    const previewFrame = document.getElementById(previewID);

    if (enableSW) {
      putCache(urlsToCache.preview, new Response(srcdoc, { headers: { "Content-Type": "text/html" } })).then(() => {
        previewFrame.src = urlsToCache.preview;
      });
    } else {
      previewFrame.srcdoc = srcdoc;
    }
  }

  function reset() {
    editorRef.value.forEach((editor) => {
      editor.reset();
    });
  }

  function setProjectType(type) {
    projectType = type;
  }

  return {
    editorRef,
    reset,
    run,
    loading,
    setProjectType,
  };
}
