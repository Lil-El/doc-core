<template>
  <div ref="scrollRef" class="@container flex flex-1/2 size-full py-10 overflow-y-auto">
    <div class="@container relative h-max flex-1/2 break-words px-10">
      <div class="absolute flex items-center top-2.5 right-2.5 dark:text-white dark:fill-white">
        <span v-show="edit" class="cursor-pointer" title="导出" @click="handleExport">
          <svg width="20" height="20" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M959.96952 415.997629a31.970084 31.970084 0 0 0-63.940169 0v393.141729a86.153056 86.153056 0 0 1-25.43157 61.368112c-16.41131 16.41131-38.230441 25.377383-61.436749 25.377384H214.85703c-23.20992 0-45.0724-8.966073-61.483711-25.377384S127.880338 832.349278 127.880338 809.14297V214.85703a86.900831 86.900831 0 0 1 86.911668-86.850257L607.893997 129.325314h0.104761a32.020659 32.020659 0 0 0 0.101149-64.041318L214.961791 63.940169h-0.104761A150.96021 150.96021 0 0 0 63.940169 214.85703v594.28594A150.613416 150.613416 0 0 0 214.85703 959.825022h594.28594a150.570067 150.570067 0 0 0 150.82655-150.692889V415.997629z"
            />
            <path
              d="M735.853809 128.241582h114.691324L233.392454 745.39426a31.970084 31.970084 0 0 0 45.213286 45.213286L895.884854 173.317595l0.057799 114.821371a31.944797 31.944797 0 0 0 31.970084 31.923123 31.937573 31.937573 0 0 0 31.955635-31.955635l-0.097536-191.849406a31.970084 31.970084 0 0 0-31.970085-31.952023H735.853809a31.970084 31.970084 0 0 0 0 63.936557z"
            />
          </svg>
        </span>
      </div>

      <div class="m-auto @3xl:w-[756px]">
        <!-- 静态class: prose-yellow-green -->
        <article
          class="prose dark:prose-invert max-w-full"
          :style="{
            '--codepen-color': `var(--markdown-color, #6f94f4)`,
            '--tw-prose-bullets': `var(--markdown-color, #6f94f4)`,
            '--tw-prose-blockquote-bg-color': `color-mix(in srgb, var(--markdown-color, #6f94f4) 10%, transparent)`,
            '--tw-prose-code': `var(--markdown-color, #6f94f4)`,
            '--tw-prose-headings': `var(--markdown-color, #6f94f4)`,
            '--tw-prose-hr': `var(--markdown-color, #6f94f4)`,
            '--tw-prose-links': `var(--markdown-color, #6f94f4)`,
            '--tw-prose-quote-borders': `var(--markdown-color, #6f94f4)`,
          }"
          v-html="content"
        ></article>
      </div>
    </div>

    <slot :scrollToTop="scrollToTop"></slot>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from "vue";
import useSyncScroll from "@/hooks/useSyncScroll.js";

defineProps({
  content: String,
  edit: Boolean,
});

const emits = defineEmits(["export"]);

const scrollRef = ref(null);

let timer = null;

const hash = location.hash.match(/^#(.*?)$/)?.[1] || "";

const disable = ref(!!hash);

const active = ref(decodeURIComponent(hash));

provide("active-toc", active);

provide("handleTOCClick", handleTOCClick);

useSyncScroll(scrollRef, "md-content");

const isHashRouter = location.href.includes("#/");

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

  const anchor = `#${ID}`;

  if (isHashRouter) {
    const res = location.hash.match(/^(#[^#]+)(#.+)$/);
    if (!res) {
      location.hash += anchor;
    } else {
      location.hash = res[1] + anchor;
    }
  } else {
    history.pushState(null, "", anchor);
  }
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

function handleExport() {
  emits("export");
}
</script>
