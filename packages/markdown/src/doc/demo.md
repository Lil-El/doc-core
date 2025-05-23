# Markdown 使用手册 [!toc hide]

[![npm](https://img.shields.io/npm/v/vue.svg)](https://www.npmjs.com/package/vue) [![lil-el](https://github.com/vuejs/core/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lil-el) [![Download](https://img.shields.io/npm/dm/vue)](https://www.npmjs.com/package/vue)

> 使用 `MapleMono` 字体，默认开启字符连体，例如：`Hello !== \\ <= #{ -> ~@ |>`

---

# Markdown

## 内置语法

**支持**

- 标题：使用 `#、##、###、...` 创建标题;
- 分割线：使用 `---` 创建分割线；
- 列表
  - 有序列表：使用 `1. 2. 3.` 创建有序列表；
  - 无序列表：使用 `-、*、+` 创建列表；
- 链接
  - 使用 `[text](url)` 创建链接；
  - 或者 `[text][id]`，需要定义参考式链接（`[marxi]: https://marxi.co`）;
  - 如果不需要文字代替，可以直接写 **url** 会自动创建链接，例如：https://marxi.co/
- 图片：使用 `![text](url)` 创建图片；
- 引用：使用 `>` 创建引用；
- 代码块：使用 ` ``` ` 创建代码块，额外支持 `vue`、`ts` 等;
- 文字
  - 粗体：使用 `**text**` 或 `__text__`；例如：**text**
  - 斜体：使用 `*text*` 或 `_text_`；例如：_text_
- 删除线：使用 `~~text~~`; 例如：~~text~~
- 脚注：使用 `[^id]: text` 创建脚注[^1];
- 任务列表
  - 使用 `- [ ]` 创建任务列表；
  - 使用 `- [x]` 创建已完成任务列表；
- 表格：使用 `|` 分割列，使用 `---` 分割表头和表体;.
- 动态徽章：使用 `[![text](url)](url)` 创建动态徽章；具体见 [shields.io](https://shields.io/)
- HTML: 支持 html 标签

**暂不支持**

- 数学公式
- 流程图
- TOC 目录

## 扩展语法

对 Markdown 进行自定义扩展

1. 文档目录：自动解析标题并生成目录。对于不想展示在目录中的标题，可以在标题后加 `[!toc hide]`;

   ```markdown
   # 标题 [!toc hide]
   ```

2. `tip` 提示块：使用 `[!tip:type]` 创建提示块；

3. `vue` 组件：使用 `[!vue:name]` 调用内置组件(**name** 不区分大小写)；目前的内置组件有：
   - helloworld：示例组件
   - codepen：在线代码编辑器

# 演示

## `vue` 组件

### 1. helloworld

**代码**

```vue
<template>
  <div @click="hello">{{ msg }}</div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: "Hello World",
  },
});
function hello() {
  alert("hello world");
}
</script>
```

**使用**

组件名称不区分大小写

````markdown
```json [!vue:HelloWorld]
{
  "msg": "点我试试...",
  "style": "color: red; cursor: pointer;"
}
```
````

**运行效果**

```json [!vue:HelloWorld]
{
  "msg": "点我试试...",
  "style": "color: red; cursor: pointer;"
}
```

### 2. codepen

```json [!vue:codepen]
{
  "style": "width: 100%; height: 430px; border-radius: 8px; overflow: hidden;",
  "editors": [
    {
      "id": 1,
      "name": "HTML",
      "icon": "html",
      "suffix": "html",
      "language": "html",
      "code": "<div id='hello'>Hello world!</div>"
    },
    {
      "id": 2,
      "name": "CSS",
      "icon": "css",
      "suffix": "css",
      "language": "css",
      "code": "#hello { color: red; }"
    },
    {
      "id": 3,
      "name": "JS",
      "icon": "javascript",
      "suffix": "javascript",
      "language": "javascript",
      "code": "function hello() {  alert('Hello world!');}const ele = document.getElementById('hello');ele.addEventListener('click', hello);"
    }
  ]
}
```

## `tip` 提示块

**类型：info、warning、danger、success、primary**

**使用**

````markdown
```markdown [!tip:warning]
这是一个 `tip` 提示块

[百度一下](https://www.baidu.com)
```
````

**运行效果**

```markdown [!tip:warning]
这是一个 `tip` 提示块

[百度一下](https://www.baidu.com)
```

[^1]: By Mino

[marxi]: https://marxi.co
