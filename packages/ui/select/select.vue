<template>
  <div
    class="select flex justify-center items-center size-9 cursor-pointer hover:rounded-sm hover:bg-[#ffffff1f]"
    ref="selectRef"
    @click.stop="toggle"
  >
    <img :src="getSVG(icon)" alt="" />

    <transition
      :enter-active-class="`select-animate-${popup}__enter`"
      :leave-active-class="`select-animate-${popup}__leave`"
    >
      <div
        v-show="active"
        class="select__options absolute flex top-14 p-1.5 rounded-sm bg-[#555] z-10 text-sm border border-gray-500"
        :class="[type === 'cell' ? 'cell items-center gap-2' : 'list size-max flex-col gap-1']"
        ref="optionsRef"
        :style="{ left: left + 'px', top: top + 'px' }"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, provide } from "vue";
import { getSVG } from "../utils";

const props = defineProps({
  type: String, // cell | list
  icon: String,
  popup: String, // bottom | right
  modelValue: [String, Number, Boolean],
});

const emit = defineEmits(["update:modelValue", "change"]);

const active = ref(false);

const selectRef = ref(null);
const optionsRef = ref(null);

const left = ref(0);
const top = ref(0);

provide("getCurrent", () => props.modelValue);
provide("onUpdate", (value) => {
  emit("update:modelValue", value);
  emit("change", value);
});

watch(active, () => {
  if (active.value) {
    setPosition();
  }
});

onMounted(() => {
  window.addEventListener("resize", setPosition);

  if (!window._currentSelectComponentFlag) {
    window._currentSelectComponentFlag = active;

    document.body.addEventListener("click", (e) => {
      if (window._currentSelectComponentFlag.value) window._currentSelectComponentFlag.value = false;
    });
  }
});

function toggle() {
  if (window._currentSelectComponentFlag !== active && window._currentSelectComponentFlag.value)
    window._currentSelectComponentFlag.value = false;

  active.value = !active.value;

  if (active.value) {
    window._currentSelectComponentFlag = active;
  }
}

function setPosition() {
  if (!active.value) return void 0;

  nextTick(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const sBound = selectRef.value?.getBoundingClientRect();
    const oBound = optionsRef.value?.getBoundingClientRect();

    if (props.popup === "bottom") {
      const oLeft = sBound.left + sBound.width / 2 - oBound.width / 2;
      const oTop = sBound.bottom + 4;

      if (oLeft + oBound.width > width) {
        left.value = width - oBound.width - 4;
        top.value = oTop;
      } else {
        left.value = oLeft;
        top.value = oTop;
      }
    } else if (props.popup === "right") {
      const oLeft = sBound.right + 4;
      const oTop = sBound.top + sBound.height / 2 - oBound.height / 2;

      if (oTop + oBound.height > height) {
        left.value = oLeft;
        top.value = height - oBound.height - 4;
      } else {
        left.value = oLeft;
        top.value = oTop;
      }
    }
  });
}

onUnmounted(() => {
  window.removeEventListener("resize", setPosition);
});
</script>

<style scoped>
.select {
  .select__options.list :deep(.select-option) {
    border-radius: 4px;
    padding: 2px 4px;
    justify-content: start;

    &:hover {
      background-color: rgb(60, 60, 60);
    }

    &.active {
      background-color: #1e1f1c;
    }
  }
}

.select-animate-bottom__enter {
  animation: select-animate-bottom__enter 0.2s ease-in-out;
}
.select-animate-bottom__leave {
  animation: select-animate-bottom__leave 0.2s ease-in-out;
}
.select-animate-right__enter {
  animation: select-animate-right__enter 0.2s ease-in-out;
}
.select-animate-right__leave {
  animation: select-animate-right__leave 0.2s ease-in-out;
}

@keyframes select-animate-bottom__enter {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes select-animate-bottom__leave {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
@keyframes select-animate-right__enter {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes select-animate-right__leave {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-10px);
  }
}
</style>
