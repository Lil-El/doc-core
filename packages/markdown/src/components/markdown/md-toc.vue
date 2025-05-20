<template>
  <div class="flex flex-col gap-2 h-max sticky top-25 border-l-1 border-gray-300 dark:border-gray-600">
    <md-toc-item v-for="(item, i) in toc" :key="item.title + '*' + i" :level="1" :data="item"></md-toc-item>
  </div>
</template>

<script setup>
import MdTocItem from "./md-toc-item.vue";

const props = defineProps({ data: Array });

const toc = toRef(props, "data");

const active = ref("");

provide("active-toc", active);

const disable = ref(false);

provide("handleTOCClick", handleTOCClick);

let timer = null;

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  window.removeEventListener("scroll", handleScroll);
});

function handleTOCClick(ID) {
  disable.value = true;

  active.value = ID;

  document.querySelector(`#${ID}`).scrollIntoView({
    behavior: "smooth",
  });

  history.pushState(null, "", `#${ID}`);
}

function handleScroll() {
  if (disable.value) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      disable.value = false;
    }, 100);
    return void 0;
  }

  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect();
    if (rect.top <= 50) {
      active.value = heading.id;
    }
  });
}
</script>
