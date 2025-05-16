<template>
  <div class="code-pen size-full flex flex-col bg-[#1e1f1c] select-none">
    <header class="w-full h-16 shrink-0 bg-[#1e1f1c] flex justify-between items-center px-4 border-b border-[#666666]">
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
    <main class="w-full flex h-[calc(100%-64px)]">
      <code-sidebar :class="{ hidden: pure }" :init="!editors?.length" @change="handleCodeChange" />
      <div class="flex flex-col bg-[#333] p-2" :class="[pure ? 'w-full' : 'w-[calc(100%-48px)]']" id="code-pen-main">
        <splitpanes :key="layout" class="default-theme" :horizontal="layout" :vertical="!layout">
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
                          :style="{ color: name === h.name ? `var(--theme-color)` : 'white', cursor: 'pointer' }"
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
              class="size-full border border-[#666] rounded-sm bg-white relative"
              :class="[
                loading
                  ? `after:flex after:items-center after:justify-center after:text-(--theme-color) after:content-['加载中...'] after:size-full after:bg-neutral-700 after:absolute after:z-10 after:top-0 after:left-0`
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
  editors: Array,
});

const pure = computed(() => !!props.editors?.length);

const configs = toRef(props.editors || []);

// single: 是否合并编辑器；pure 时必须合并；
const { layout, single, top, mobile } = useLayout("code-pen-main", pure.value);

const { title, author, date, setData } = useTitle(props);

const { editorRef, reset, run, loading } = useEditors("preview");

function handleCodeChange(data) {
  if (!data) data = props;

  const { editors, ...info } = data;

  setData(info);
  configs.value = editors;
  nextTick(run);

  top.value = 0;
}
</script>

<style scoped>
:deep() {
  .splitpanes.default-theme .splitpanes__splitter {
    background-color: transparent;
    border: transparent;
  }

  .splitpanes.default-theme .splitpanes__splitter:before,
  .splitpanes.default-theme .splitpanes__splitter:after {
    background-color: #666666;
  }

  .splitpanes.default-theme .splitpanes__pane {
    background-color: transparent;
  }
}
</style>
