export default {
  DEFAULT: {
    css: [
      {
        "--default-mono-font-family": "MapleMono, monospace",
      },
      {
        blockquote: {
          "border-radius": "0 0.5rem 0.5rem 0",
          "font-style": "normal",
          padding: "4px 10px",
          p: {
            "margin-top": 0,
            "margin-bottom": 0,
            "&::before, &::after": {
              content: "none",
            },
          },
        },
        code: {
          color: "var(--tw-prose-code)!important",
          "&::before, &::after": {
            display: "none",
          },
          "&:not([data-language])": {
            padding: "0.2rem 0.5rem",
            "background-color": "#ffffff",
            "border-radius": "0.5rem",
            // "font-style": "italic",
            "box-shadow": "0 1px 3px rgb(0 0 0 / 0.15)",
          },
        },
        ":not(:where(h1, h2, h3, h4, h5, h6)) a": {
          "&:hover": {
            "text-decoration-thickness": "2px",
          },
        },
        ":where(h1, h2, h3, h4, h5, h6) a": {
          "text-decoration": "none",
          "font-weight": "bold",
        },
      },
    ],
  },
  // 静态class,配置不同主题样式;但是v4不支持safelist,所以主题无法设置为动态的class(prose-${name})
  // 所以改为style中设置css变量
  "yellow-green": {
    css: [
      {
        // "h1 a": {
        //   color: "red!important",
        // },
      },
    ],
  },
};
