import "./src/style.css";

import { defineAsyncComponent } from "vue";
export const markdown = defineAsyncComponent(() => import("./src/components/markdown/index.vue"));
