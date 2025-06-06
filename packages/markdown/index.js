import "./src/assets/index.css";

import { defineAsyncComponent } from "vue";
export const markdown = defineAsyncComponent(() => import("./src/components/markdown/index.vue"));
