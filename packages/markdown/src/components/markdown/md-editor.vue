<template>
  <div ref="scrollRef" class="flex-1/2 border-r border-gray-300 overflow-y-auto md-scrollbar">
    <div id="md-editor" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script setup>
import { readonly, ref, onMounted, onUnmounted, inject, watch } from "vue";
import useSyncScroll from "@/hooks/useSyncScroll.js";
import useMonaco from "@/hooks/useMonaco";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const monacoLoaded = useMonaco();

const lineHeight = readonly(24);

const scrollRef = ref(null);

let editor = null;

let timer = null;

const height = ref(0);

const theme = inject("theme");

if (theme) {
  watch(
    () => theme.isDark,
    (dark) => {
      editor.updateOptions({
        theme: dark ? "vs-dark" : "vs",
      });
    }
  );
}

useSyncScroll(scrollRef, "md-editor");

onMounted(async () => {
  await monacoLoaded;
  editor = createEditor();
});

function createEditor() {
  const container = document.getElementById("md-editor");
  const editor = monaco.editor.create(container, {
    language: "markdown",
    theme: theme.isDark ? "vs-dark" : "vs",
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
