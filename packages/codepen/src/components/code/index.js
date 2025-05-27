import { defineAsyncComponent } from "vue";

export const codepen = defineAsyncComponent(() => import("./code-pen.vue"));