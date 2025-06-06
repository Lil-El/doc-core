import { defineAsyncComponent } from "vue";

export const helloworld = defineAsyncComponent(() => import("./helloworld/index.vue"))

export * from "@lil-el/codepen";
