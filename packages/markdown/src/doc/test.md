# Markdown

---

## 使用

> 这是一个默认 [<span style="color: yellowgreen;">Markdown 文档</span>][1] 的解析示例 By `Mino`

文档正文默认使用 `MapleMono` 字体，默认开启字符连体：`a Hello !== \\ <= #{ -> ~@ |>`

## 组件

- md-content: **文档内容**
- md-toc: _文档大纲_

## 代码

```js
function hello() { // [!code ++]
  alert("hello world"); // [!code highlight]
}
```

```vue
<template>
  <div @click="hello">Hello World</div>
</template>

<script setup>
function hello() {
  alert("hello world");
}
</script>
```

### 运行效果

```runner
  TODO: Demo Component
```

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

[1]: https://marxi.co/
