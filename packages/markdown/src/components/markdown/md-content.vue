<template>
  <!-- scrollbar-hide -->
  <div class="@container overflow-auto flex-auto break-words px-10 scrollbar-transparent">
    <div class="m-auto @sm:w-sm @md:w-[480px] @xl:w-[500px] @2xl:w-[600px] @3xl:w-[736px]">
      <slot />
    </div>
  </div>
</template>
