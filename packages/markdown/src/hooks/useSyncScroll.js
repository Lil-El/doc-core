import { inject, onMounted, onBeforeUnmount, watch } from "vue";

export default function useSyncScroll(eleRef, name) {
  const scrollTopCtrl = inject("scrollTopCtrl");

  watch(
    () => scrollTopCtrl.top,
    () => {
      if (eleRef.value && scrollTopCtrl.ctrl !== name) {
        eleRef.value.scrollTop = scrollTopCtrl.top;
      }
    }
  );

  onMounted(() => {
    eleRef.value.addEventListener("scroll", handleScroll);
  });

  onBeforeUnmount(() => {
    eleRef.value.removeEventListener("scroll", handleScroll);
  });

  function handleScroll() {
    if (scrollTopCtrl.ctrl && scrollTopCtrl.ctrl !== name) return void 0;
    else {
      if (scrollTopCtrl.timer) {
        clearTimeout(scrollTopCtrl.timer);
        scrollTopCtrl.timer = null;
      }
      scrollTopCtrl.ctrl = name;
      scrollTopCtrl.top = eleRef.value.scrollTop;
      scrollTopCtrl.timer = setTimeout(() => {
        scrollTopCtrl.ctrl = null;
      }, 100);
    }
  }
}
