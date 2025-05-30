<template>
  <div ref="scrollRef" class="flex-1/2 border-r border-gray-300 overflow-y-auto">
    <div id="md-editor" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script setup>
import { inject, readonly, ref, watch, onMounted, onUnmounted } from "vue";
import useSyncScroll from "@/hooks/useSyncScroll.js";
import useMonaco from "@/hooks/useMonaco";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const theme = inject("theme");

const monacoLoaded = useMonaco();

const lineHeight = readonly(24);

const scrollRef = ref(null);

let editor = null;

let timer = null;

const height = ref(0);

useSyncScroll(scrollRef, "md-editor");

watch(theme, () => {
  if (theme.mode === "dark") {
    editor.updateOptions({ theme: "vs-dark" });
  } else {
    editor.updateOptions({ theme: "vs" });
  }
});

onMounted(async () => {
  await monacoLoaded;
  editor = createEditor();
});

function createEditor() {
  const container = document.getElementById("md-editor");
  const editor = monaco.editor.create(container, {
    language: "markdown",
    theme: "vs",
    fontSize: 16,
    contextmenu: false,
    quickSuggestions: false,
    automaticLayout: true,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    occurrencesHighlight: "off",
    renderLineHighlight: "none",
    lineHeight,
    lineNumbers: "off",
    wordWrap: "on",
    padding: {
      top: 40,
      bottom: 40,
    },
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
      alwaysConsumeMouseWheel: false,
    },
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    value: props.modelValue,
  });

  editor.getAction("editor.action.formatDocument").run();

  editor.onDidChangeModelContent(() => {
    height.value = editor.getContentHeight() + lineHeight;

    clearTimeout(timer);
    timer = setTimeout(() => {
      emit("update:modelValue", editor.getValue());
    }, 1000);
  });

  height.value = editor.getContentHeight() + lineHeight;

  editor.addAction({
    id: "SAVE",
    label: "SAVE",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: () => {
      save(editor.getValue());
    },
  });

  return editor;
}

function save(code) {
  emit("update:modelValue", code);
}

onUnmounted(() => {
  clearTimeout(timer);
  editor.dispose();
});
</script>
