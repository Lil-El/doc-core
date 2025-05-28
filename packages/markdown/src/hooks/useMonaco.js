const { promise, resolve } = Promise.withResolvers();

let isLoad = false;

function initLocalEditor() {
  if (!window.monaco)
    import("monaco-editor").then((monaco) => {
      window.monaco = monaco;
      resolve();
    });
  else resolve();
}

function initCDNEditor() {
  if (window.monaco) {
    resolve();
    return void 0;
  }

  const loadMonaco = () => {
    window.require.config({
      paths: { vs: __MONACO_CDN__ },
    });
    window.require(["vs/editor/editor.main"], () => {
      resolve();
    });
  };

  if (window.require) {
    loadMonaco();
  } else {
    const script = document.createElement("script");
    script.src = __MONACO_CDN__ + "/loader.min.js";
    script.onload = loadMonaco;
    document.body.appendChild(script);
  }

  return promise;
}

export default function useMonaco() {
  if (isLoad) return promise;

  isLoad = true;

  if (import.meta.env.DEV) {
    initLocalEditor();
  } else {
    initCDNEditor();
  }

  return promise;
}
