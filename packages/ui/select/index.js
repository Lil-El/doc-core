import { defineAsyncComponent } from "vue";

export const Select = defineAsyncComponent(() => import("./select.vue"));
export const SelectOption = defineAsyncComponent(() => import("./select-option.vue"));
