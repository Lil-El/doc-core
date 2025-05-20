<template>
  <div class="flex flex-col gap-2">
    <div
      class="md-toc-item shrink-0 w-72.5 h-max border-[transparent] text-gray-500 dark:text-gray-300 border-l-3 -translate-x-[1.5px] cursor-pointer hover:bg-(--toc-bg-color)"
      :class="{ 'md-toc-item__active': active === data.title }"
      :style="{
        '--toc-color': theme.color,
        '--toc-bg-color': theme.color + '30',
        'padding-left': `${level}rem`,
      }"
      @click.prevent="handleTOCClick(data.title)"
    >
      <a :href="`#${data.title}`">{{ data.title }}</a>
    </div>

    <div v-if="data.children?.length" class="flex flex-col gap-2">
      <md-toc-item
        v-for="(item, i) in data.children"
        :key="item.title + '-' + i"
        :level="level + 1"
        :data="item"
      ></md-toc-item>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ data: Object, level: Number });

const data = toRef(props, "data");

const level = toRef(props, "level");

const theme = inject("color-theme");

const active = inject("active-toc");

const handleTOCClick = inject("handleTOCClick");
</script>
