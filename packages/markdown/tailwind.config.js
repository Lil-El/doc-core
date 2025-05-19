export default {
  content: ["./**/*.{vue,js,html}"],
  theme: {
    extend: {
      // https://github.com/tailwindlabs/tailwindcss-typography/blob/main/src/styles.js#L19
      typography: () => ({
        DEFAULT: {
          css: [
            {
              "--default-mono-font-family": "MapleMono",
            },
            {
              "font-family": "MapleMono",
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
                "&::before, &::after": {
                  display: "none",
                },
                "&:not([data-language])": {
                  padding: "0.2rem 0.5rem",
                  "background-color": "#ffffff",
                  "border-radius": "0.5rem",
                  "font-style": "italic",
                  "box-shadow": "0 1px 3px rgb(0 0 0 / 0.15)",
                },
              },
              ":not(:where(h1, h2, h3)) a": {
                "&:hover": {
                  "text-decoration-thickness": "2px",
                },
              },
              ":where(h1, h2, h3) a": {
                "text-decoration": "none",
                "font-weight": "bold",
              },
            },
          ],
        },
        "yellow-green": {
          css: [
            {
              "--tw-prose-hr": "#99cd32",
              "--tw-prose-code": "#99cd32",
              "--tw-prose-bullets": "#99cd32",
              "--tw-prose-links": "#99cd32",
              "--tw-prose-quote-borders": "#99cd32",
              blockquote: {
                "background-color": "#99cd3230",
              },
            },
            {
              "[data-theme='dark'] &, [data-theme=dark] *, .dark &": {
                "--tw-prose-hr": "#99cd32",
                "--tw-prose-code": "#99cd32",
                "--tw-prose-bullets": "#99cd32",
                "--tw-prose-links": "#99cd32",
                "--tw-prose-quote-borders": "#99cd32",
                blockquote: {
                  "background-color": "#99cd3230",
                },
              },
            },
          ],
        },
      }),
    },
  },
  plugins: [],
};
