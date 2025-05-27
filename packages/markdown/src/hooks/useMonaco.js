const { promise, resolve } = Promise.withResolvers();

let isLoad = false;

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
  }
  return promise;
}

export default function useMonaco() {
  if (isLoad) return promise;

  isLoad = true;

  initCDNEditor();

  return promise;
}
