import { inject, reactive } from "vue";

export default function useTheme() {
  let theme = inject("color-theme");

  if (!theme) {
    theme = reactive({
      color: "#000000",
    });
  }

  return theme;
}
