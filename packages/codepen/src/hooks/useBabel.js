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
    const script = document.createElement("script");
    script.src = __Babel_CDN__;
    script.onload = () => resolve(window.Babel);
    document.body.appendChild(script);
  }

  if (import.meta.env.DEV) {
    initLocal();
  } else {
    initCDN();
  }

  return promise;
}
