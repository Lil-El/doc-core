<template>
  <div class="size-full bg-[#555] box-border text-white text-sm" v-bind="attrs">
    <div class="w-full h-7.5 flex justify-between items-center px-3.5 leading-7.5 border-b border-[#666]">
      <div class="flex items-center gap-3.5" :title="state.name">
        <slot name="header" v-bind="state">
          <img :src="getSVG(state.icon)" width="16" draggable="false" />
          <span>{{ state.name }}</span>
        </slot>
      </div>
      <div class="flex items-center gap-2 cursor-pointer">
        <img
          v-show="cache"
          :src="getSVG('refresh')"
          width="15"
          draggable="false"
          title="重置"
          @click="
            reset();
            emit('run');
          "
        />
      </div>
    </div>
    <div class="w-full h-[calc(100%-30px)] bg-[#1e1f1c] p-2 box-border relative">
      <div ref="editorRef" class="size-full"></div>
    </div>
  </div>
</template>

<script setup>
import { getSVG } from "@lil-el/ui";

import { cloneDeep } from "lodash";
import * as monaco from "monaco-editor";

const attrs = useAttrs();

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["run"]);

const cache = ref(false);

// id, name, icon, suffix, language, code
const state = reactive({
  ...(localStorage.getItem(props.data.id) ? JSON.parse(localStorage.getItem(props.data.id)) : cloneDeep(props.data)),
});

let editor = null;

const editorRef = ref(null);

onMounted(() => {
  updateCache();

  // #region 自定义代码补全
  // monaco.languages.registerCompletionItemProvider("javascript", {
  //   provideCompletionItems: function (model, position) {
  //     return {
  //       suggestions: [
  //         {
  //           label: {
  //             label: '"my-third-party-library"',
  //             detail: "description",
  //             description: "ssssdddffff",
  //           },
  //           kind: monaco.languages.CompletionItemKind.Function,
  //           documentation: "Describe your library here",
  //           insertText: "my-third-party-library /n    abcde /n    123123123123",
  //           preselect: true,
  //         },
  //       ],
  //     };
  //   },
  //   resolveCompletionItem(item, token) {
  //     item.documentation = "documentation";
  //     return item;
  //   },
  // });
  // #endregion

  // 自定义主题
  monaco.editor.defineTheme("monokai", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", fontStyle: "italic" },
      { token: "number", foreground: "#ae81ff" },
      { token: "type", foreground: "#ffffff" },
      { token: "delimiter", foreground: "#ffffff" },
      { token: "delimiter.html", foreground: "#ffffff" },
      { token: "tag", foreground: "#f92672" },
      { token: "attribute.name", foreground: "#a6e22e" },
      { token: "attribute.value", foreground: "#e6db74" },
      { token: "attribute.value.number.css", foreground: "#ae81f8" },
      { token: "attribute.value.unit.css", foreground: "#de2822" },
      { token: "string", foreground: "#e6db74" },
      { token: "keyword", foreground: "#66d9ef" },
      { token: "identifier", foreground: "#ffffff" },
    ],
    colors: {},
  });

  // 创建编辑器实例
  editor = monaco.editor.create(editorRef.value, {
    language: state.language,
    theme: "monokai",
    // theme: "vs-dark",
    // fontFamily: "MapleMono",
    lineNumbersMinChars: 3,
    tabSize: 2,
    fontLigatures: true,
    automaticLayout: true, // 自动布局
    wordWrap: "on", // 自动换行
    scrollBeyondLastLine: false, // 滚动超过最后一行时，是否继续滚动
    readOnly: false,
    minimap: {
      enabled: true,
    },
    value: state.code,
  });

  // 自动格式化代码
  editor.getAction("editor.action.formatDocument").run();

  // focus 事件
  editor.onDidFocusEditorWidget(() => {});

  // blur 事件
  editor.onDidBlurEditorWidget(() => {});

  // #region
  // addCommand 会覆盖所有, 只有最后一个editor的command生效
  // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
  //   console.log(state.id); // 每次输出的都是最后一个的id
  //   emit("saveAndRun");
  // });
  // #endregion

  // addAction 不会覆盖, 每个都是独立的
  editor.addAction({
    id: `save-${state.id}`,
    label: `Save-${state.id}`,
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: () => {
      save(state.id, getData());
      emit("run");
    },
  });

  // 运行：快捷键（会覆盖所有 editor）
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
    emit("run");
  });
});

function reset() {
  localStorage.removeItem(state.id);
  editor.setValue(props.data.code);
  updateCache();
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  updateCache();
}

function getData() {
  return {
    ...state,
    code: editor.getValue(),
  };
}

function updateCache() {
  cache.value = !!localStorage.getItem(state.id);
}

onUnmounted(() => {
  editor?.dispose();
});

defineExpose({
  getData,
  reset,
  updateCache,
});
</script>
