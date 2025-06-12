<template>
  <div
    class="code-pen w-full flex flex-col bg-[#1e1f1c] select-none overflow-hidden"
    :style="{
      height: pure ? '430px' : '100%',
      borderRadius: pure ? '8px' : '0',
    }"
  >
    <header
      class="w-full shrink-0 bg-[#1e1f1c] flex justify-between items-center px-4 border-b border-[#666666]"
      :style="{ height: pure ? '48px' : '64px' }"
    >
      <code-info :title="title" :author="author" :date="date" />
      <code-opt
        :show-opt="!pure && !mobile"
        v-model:layout="layout"
        @run="run"
        @reset="
          reset();
          run();
        "
      />
    </header>
    <main
      class="w-full flex"
      :style="{
        height: pure ? 'calc(100% - 48px)' : 'calc(100% - 64px)',
      }"
    >
      <code-sidebar v-if="!pure" :init="!editors?.length" @change="handleCodeChange" />
      <div class="flex flex-col bg-[#333] p-2" :class="[pure ? 'w-full' : 'w-[calc(100%-48px)]']" id="code-pen-main">
        <splitpanes class="default-theme" :horizontal="layout" :vertical="!layout">
          <pane min-size="3">
            <splitpanes :key="configs[0]?.id" class="default-theme" :horizontal="!layout" :vertical="layout">
              <template v-if="configs.length === 1 || !single">
                <pane v-for="e in configs" :key="e.id" min-size="3">
                  <editor ref="editorRef" :data="e" @run="run" />
                </pane>
              </template>
              <template v-else>
                <pane min-size="3" style="display: flex">
                  <div class="flex w-full flex-wrap">
                    <editor
                      v-for="(e, i) in configs"
                      :key="e.id"
                      ref="editorRef"
                      :data="e"
                      :style="{ order: top === i ? 0 : 1 }"
                      @run="run"
                    >
                      <template #header="{ name }">
                        <span
                          v-for="(h, j) in configs"
                          :key="h.name"
                          :style="{
                            color: name === h.name ? `var(--codepen-color, #6f94fe)` : 'white',
                            cursor: 'pointer',
                          }"
                          @click="top = j"
                          >{{ h.name }}</span
                        >
                      </template>
                    </editor>
                  </div>
                </pane>
              </template>
            </splitpanes>
          </pane>
          <pane>
            <div
              class="size-full bg-white relative"
              :class="[
                loading
                  ? `after:flex after:items-center after:justify-center after:text-(--codepen-color) after:content-['加载中...'] after:size-full after:bg-neutral-700 after:absolute after:z-10 after:top-0 after:left-0`
                  : '',
              ]"
            >
              <iframe id="preview" style="width: 100%; height: 100%; border: none" />
            </div>
          </pane>
        </splitpanes>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, toRef, nextTick } from "vue";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import editor from "../editor/editor.vue";
import codeSidebar from "./code-sidebar.vue";
import codeInfo from "./code-info.vue";
import codeOpt from "./code-opt.vue";

import useLayout from "@/hooks/useLayout";
import useEditors from "@/hooks/useEditors";
import useTitle from "@/hooks/useTitle";

const props = defineProps({
  title: String,
  author: String,
  date: String,
  project: String, // html vue3 react
  editors: Array,
});

const pure = computed(() => !!props.editors);

const configs = toRef(withProjectType(props.project, props.editors) || []);

// single: 是否合并编辑器；pure 时必须合并；
const { layout, single, top, mobile } = useLayout("code-pen-main", pure.value);

const { title, author, date, setData } = useTitle(props, pure.value);

const { editorRef, reset, run, loading, setProjectType } = useEditors("preview", pure.value, props.project);

function handleCodeChange(data) {
  if (!data) data = props;

  const { editors, ...info } = data;

  setData(info);
  setProjectType(info.project);
  configs.value = withProjectType(info.project, editors);
  nextTick(run);

  top.value = 0;
}

function withProjectType(projectType, editors) {
  if (!["html", "vue3", "react"].includes(projectType)) {
    return void console.error("暂不支持类型：", projectType);
  }

  const files = Object.keys(editors);

  let results = [];

  if (projectType === "html") {
    if (!files.includes("html")) {
      return void console.error(`html 类型必须包含 html`);
    }

    if (files.some((f) => !["html", "css", "javascript"].includes(f))) {
      return void console.error(`html 类型只允许: html, css, javascript`);
    }
    results = [
      {
        id: editors.html.id,
        name: "HTML",
        icon: "html",
        type: "html",
        language: "html",
        code: editors.html.code,
      },
    ];
    if (editors.css) {
      results.push({
        id: editors.css.id,
        name: "CSS",
        icon: "css",
        type: "css",
        language: "css",
        code: editors.css.code,
      });
    }
    if (editors.javascript) {
      results.push({
        id: editors.javascript.id,
        name: "JavaScript",
        icon: "javascript",
        type: "javascript",
        language: "javascript",
        code: editors.javascript.code,
      });
    }
  } else if (projectType === "vue3") {
    if (files.some((f) => !["mainJs", "appVue"].includes(f))) {
      return void console.error("vue3 类型只允许 mainJs 和 appVue, 接收的是:", files.join(","));
    }

    results = [
      {
        id: editors.mainJs.id,
        name: "main.js",
        icon: "javascript",
        type: "mainJs",
        language: "javascript",
        code: editors.mainJs.code,
      },
      {
        id: editors.appVue.id,
        name: "App.vue",
        icon: "vue",
        type: "appVue",
        language: "html",
        code: editors.appVue.code,
      },
    ];
  } else if (projectType === "react") {
    if (files.some((f) => !["mainJs", "appJs"].includes(f))) {
      return void console.error("vue3 类型只允许 mainJs 和 appJs, 接收的是:", files.join(","));
    }

    results = [
      {
        id: editors.mainJs.id,
        name: "main.js",
        icon: "javascript",
        type: "mainJs",
        language: "javascript",
        code: editors.mainJs.code,
      },
      {
        id: editors.appJs.id,
        name: "app.js",
        icon: "javascript",
        type: "appJs",
        language: "javascript",
        code: editors.appJs.code,
      },
    ];
  }

  return results;
}
</script>

<style scoped>
:deep() {
  .splitpanes.default-theme .splitpanes__splitter {
    background-color: transparent;
    border: transparent;
  }

  .splitpanes.default-theme .splitpanes__splitter::before,
  .splitpanes.default-theme .splitpanes__splitter::after {
    background-color: #666666;
  }

  .splitpanes.default-theme .splitpanes__pane {
    background-color: transparent;
  }
}
</style>
