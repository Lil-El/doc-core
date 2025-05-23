<template>
  <div ref="scrollRef" class="flex-1/2 border-r border-gray-300 py-10 overflow-y-auto">
    <div id="md-editor" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script setup>
import * as monaco from "monaco-editor";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const theme = inject("color-theme");

const lineHeight = readonly(24);

const scrollRef = ref(null);

let editor = null;

let timer = null;

const height = ref(0);

watch(theme, () => {
  if (theme.mode === "dark") {
    editor.updateOptions({ theme: "vs-dark" });
  } else {
    editor.updateOptions({ theme: "vs" });
  }
});

onMounted(() => {
  editor = createEditor();

  // TODO: 同步滚动
  // scrollRef.value.addEventListener("scroll", (e) => {
  //   const line = getLineNumberAt(scrollRef.value.scrollTop);
  //   console.log(line);
  // });
});

function createEditor() {
  const editor = monaco.editor.create(document.getElementById("md-editor"), {
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

  console.log(editor.getTopForLineNumber(6));


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

function getLineNumberAt(scrollTop) {
  const top = scrollTop < 40 ? 0 : scrollTop - 40;
  return Math.floor(top / lineHeight);
}

function getContentAt(lineNumber) {}
</script>
