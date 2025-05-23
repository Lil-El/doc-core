<template>
  <div ref="scrollRef" class="@container flex flex-1/2 size-full py-10 overflow-y-auto">
    <div class="@container h-max flex-1/2 break-words px-10 overflow-y-auto">
      <div class="m-auto @3xl:w-[756px]">
        <!-- 静态class: prose-yellow-green -->
        <article
          class="prose dark:prose-invert max-w-full"
          :style="{
            '--tw-prose-custom-color': theme.color,
            '--tw-prose-bullets': theme.color,
            '--tw-prose-blockquote-bg-color': `${theme.color}30`,
            '--tw-prose-code': theme.color,
            '--tw-prose-headings': theme.color,
            '--tw-prose-hr': theme.color,
            '--tw-prose-links': theme.color,
            '--tw-prose-quote-borders': theme.color,
          }"
          v-html="content"
        ></article>
      </div>
    </div>

    <slot :scrollToTop="scrollToTop"></slot>
  </div>
</template>

<script setup>
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
