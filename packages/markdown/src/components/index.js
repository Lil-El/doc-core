import { defineAsyncComponent } from "vue";
import "@lil-el/codepen/css";

export const helloworld = defineAsyncComponent(() => import("./helloworld/index.vue"))

export * from "@lil-el/codepen";
