<template>
  <div class="flex flex-col gap-1">
    <div
      class="md-toc-item shrink-0 w-72.5 h-max py-0.5 border-[transparent] text-gray-500 dark:text-gray-300 border-l-3 line-clamp-1 -translate-x-[3px] cursor-pointer hover:bg-(--toc-bg-color)"
      :class="{ 'md-toc-item__active': active === data.id }"
      :style="{
        '--toc-color': `var(--markdown-color, #6f94f4)`,
        '--toc-bg-color': `color-mix(in srgb, var(--markdown-color, #6f94f4) 30%, transparent)`,
        'padding-left': `${level * 0.75}rem`,
      }"
      :title="data.title"
      @click.prevent="handleTOCClick(data.id)"
    >
      <a :href="`#${data.id}`">{{ data.title }}</a>
    </div>

    <div v-if="data.children?.length" class="flex flex-col gap-1">
      <md-toc-item v-for="item in data.children" :key="item.id" :level="level + 1" :data="item"></md-toc-item>
    </div>
  </div>
</template>

<script setup>
import { toRef, inject } from "vue";
const props = defineProps({ data: Object, level: Number });

const data = toRef(props, "data");

const level = toRef(props, "level");

const active = inject("active-toc");

const handleTOCClick = inject("handleTOCClick");
</script>
