export function parseVue3(code) {
  return import("vue/compiler-sfc").then((vueCompiler) => {
    const { parse, compileScript, compileStyle, compileTemplate } = vueCompiler;

    const { descriptor } = parse(code, {
      filename: "App.vue",
    });

    const scopeId = descriptor.styles.some((c) => c.scoped) ? Math.random().toString(36).substring(2, 10) : undefined;

    const styles = descriptor.styles.map((style) => {
      if (scopeId)
        return compileStyle({
          id: scopeId,
          source: style.content,
          scoped: !!style.scoped,
          sourceMap: false,
          isProd: true,
        }).code;
      else return style.content;
    });

    const { content: App } = compileScript(descriptor, {
      id: scopeId,
      genDefaultAs: false,
      inlineTemplate: !!descriptor.scriptSetup,
      transformAssetUrls: true,
      sourceMap: false,
      isProd: true,
    });

    let render = null;
    if (!descriptor.scriptSetup) {
      render = compileTemplate({
        id: scopeId,
        filename: descriptor.filename,
        source: descriptor.template.content,
        scoped: !!scopeId,
        slotted: descriptor.slotted,
        isProd: true,
      }).code;
    }

    return {
      __filename: descriptor.filename,
      __scopeId: scopeId,
      App: App,
      render: render ? render : null,
      styles,
    };
  });
}
export function parseReact(code, filename) {
  return import("@/hooks/useBabel").then((module) => {
    const useBabel = module.default;

    return useBabel().then((babel) => {
      const { code: compiled } = babel.transform(code, {
        presets: ["react"],
        filename,
      });
      return compiled;
    });
  });
}

export function btoaUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

export function atobUtf8(str) {
  const binary = atob(str).split("");
  const bytes = new Uint8Array(binary.length);
  binary.forEach((byte, i) => (bytes[i] = byte.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}
