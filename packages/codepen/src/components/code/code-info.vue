<template>
  <div class="flex items-center gap-3.5">
    <svg
      t="1746282283426"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="26586"
      data-spm-anchor-id="a313x.search_index.0.i1.18633a81Xs7Bal"
      width="56"
    >
      <path
        d="M736.938667 370.56a42.666667 42.666667 0 1 1 62.122666-58.453333l170.666667 181.333333a42.666667 42.666667 0 0 1 0 58.453333l-170.666667 181.333334a42.666667 42.666667 0 0 1-62.122666-58.453334l143.146666-152.106666-143.146666-152.106667z m-449.877334 0L143.914667 522.666667l143.146666 152.106666a42.666667 42.666667 0 0 1-62.122666 58.453334l-170.666667-181.333334a42.666667 42.666667 0 0 1 0-58.453333l170.666667-181.333333a42.666667 42.666667 0 0 1 62.122666 58.453333z"
        fill="var(--codepen-color, #ffffff)"
        p-id="26587"
        data-spm-anchor-id="a313x.search_index.0.i3.18633a81Xs7Bal"
        class="selected"
      ></path>
      <path
        d="M559.130732 171.254372m41.212835 11.042946l0 0q41.212835 11.042946 30.16989 52.255781l-154.601243 576.979694q-11.042946 41.212835-52.255781 30.169889l0 0q-41.212835-11.042946-30.16989-52.255781l154.601243-576.979694q11.042946-41.212835 52.255781-30.169889Z"
        fill="var(--codepen-color, #ffffff)"
        opacity=".3"
        p-id="26588"
        data-spm-anchor-id="a313x.search_index.0.i2.18633a81Xs7Bal"
        class="selected"
      ></path>
    </svg>
    <div class="flex flex-col gap-1">
      <div class="text-base text-white">{{ title }}</div>
      <div class="text-xs flex gap-2 text-gray-500">
        <span
          >By <span style="color: var(--codepen-color, #ffffff)">{{ author }}</span></span
        >
        <span>{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  author: String,
  date: String,
});
</script>
