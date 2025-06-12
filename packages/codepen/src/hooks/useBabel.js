export default function useBabel() {
  if (window.Babel) {
    return Promise.resolve(window.Babel);
  }

  const { promise, resolve } = Promise.withResolvers();

  function initLocal() {
    import("@babel/standalone").then((Babel) => {
      window.Babel = Babel;
      resolve(Babel);
    });
  }

  function initCDN() {
    if (window.require) {
      require.config({ paths: { babel: __BABEL_CDN__ } });

      require(["babel"], function (Babel) {
        resolve((window.Babel = Babel));
      });
    } else {
      const script = document.createElement("script");
      script.src = __BABEL_CDN__;
      script.onload = () => resolve(window.Babel);
      document.body.appendChild(script);
    }
  }

  if (import.meta.env.DEV) {
    initLocal();
  } else {
    initCDN();
  }

  return promise;
}
