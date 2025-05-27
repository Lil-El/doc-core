<template>
  <div class="select-option flex items-center cursor-pointer text-white" :class="{ active: value !== undefined && getCurrent() === value }" @click="update(value)">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: undefined,
  },
});

const getCurrent = inject("getCurrent");

const update = inject("onUpdate");
</script>