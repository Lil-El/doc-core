<template>
  <div ref="scrollRef" class="@container flex flex-1/2 size-full py-10 overflow-y-auto">
    <div class="@container h-max flex-1/2 break-words px-10 overflow-y-auto">
      <div class="m-auto @3xl:w-[756px]">
        <!-- 静态class: prose-yellow-green -->
        <article
          class="prose dark:prose-invert max-w-full"
          :style="{
            '--tw-prose-custom-color': cssColorVar,
            '--tw-prose-bullets': cssColorVar,
            '--tw-prose-blockquote-bg-color': `${cssColorVar}30`,
            '--tw-prose-code': theme.color,
            '--tw-prose-headings': cssColorVar,
            '--tw-prose-hr': cssColorVar,
            '--tw-prose-links': cssColorVar,
            '--tw-prose-quote-borders': cssColorVar,
          }"
          v-html="content"
        ></article>
      </div>
    </div>

    <slot :scrollToTop="scrollToTop"></slot>
  </div>
</template>

<script setup>
import useSyncScroll from "@/hooks/useSyncScroll.js";

defineProps({
  content: String,
});

const theme = inject("color-theme");

const scrollRef = ref(null);

let timer = null;

const hash = location.hash.match(/^#(.*?)$/)?.[1] || "";

const disable = ref(!!hash);

const active = ref(decodeURIComponent(hash));

provide("active-toc", active);

provide("handleTOCClick", handleTOCClick);

useSyncScroll(scrollRef, "md-content");

const cssColorVar = computed(() => {
  return theme.mode === "dark" && theme.name === "stone" ? "#ffffff" : theme.color;
});

onMounted(() => {
  if (active.value) {
    let tmpTimer = setInterval(() => {
      if (document.getElementById(`${active.value}`)) {
        handleTOCClick(active.value);
        clearInterval(tmpTimer);
      }
    }, 50);
  }

  scrollRef.value.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  scrollRef.value.removeEventListener("scroll", handleScroll);
});

function handleTOCClick(ID) {
  disable.value = true;

  active.value = ID;

  document.getElementById(`${ID}`).scrollIntoView({
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

  const headings = scrollRef.value.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect();
    if (rect.top <= 50) {
      active.value = heading.id;
    }
  });
}

function scrollToTop() {
  scrollRef.value.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>
