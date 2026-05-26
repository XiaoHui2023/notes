# Skill

## 提示词

跟 ai 对话时，比如让 ai 写 systemverilog 代码，ai 可能会写出根本不存在的函数或者错误语法。此时我们会加很多提示词，反复调教 ai，最终输出理想的回答。

假如我们要在另一个项目、另一个聊天对话中写 sv 代码，由于上下文变了，ai 又写出了错误回答，我们需要把之前的提示词再说一遍。

为了每次都让 ai 写出好的 sv 代码，我们把提示词预先写成 markdown，比如 `systemverilog.md`，在每次对话开头都让 ai 加载这个 `systemverilog.md`，这个文件就是 `SKILL`。

依此类推，写 C 代码的时候，也可以炼成 `c.md`，或者直接从别人那里下载。久而久之，形成一个 SKILL库。

## 加载SKILL

SKILL 多了以后，为了让 ai 在需要的时候加载合适的 SKILL，我们会在 SKILL 的开头写上元数据，包括 SKILL 名字和摘要。

```markdown
---
name: systemverilog
description: 写 SystemVerilog 代码时使用的语法和风格要求
---
```

有了这些元数据，ai 不需要加载全部内容，就知道这个 SKILL 是否是当前需要的。

## 作用域

不同 SKILL 的作用范围不同。总是要用到的 SKILL 放在用户根目录；项目约定放在项目根目录；具体子模块的规则放在模块目录内。

```
SKILL
├── 用户根目录
│   └── 总是要用到的 SKILL
├── 项目根目录
│   └── 项目约定
└── 模块目录
    └── 具体子模块的规则
```

## 渐进式披露

一个 SKILL 中可以嵌套其他 SKILL 或参考文件。这样每次只需要加载一个入口 SKILL，再根据这个 SKILL 判断是否继续加载更多内容。

```markdown
## 参考文件

- 写中文文档时，加载 [中文 Markdown 习惯](./reference/markdown-authoring-zh.md)
- 写 SystemVerilog 代码时，加载 [SystemVerilog 规则](./reference/systemverilog.md)
- 需要项目约定时，读取 [项目设计笔记](./project-design-notes.md)
```

## 记录手稿

维护项目的本质是维护 SKILL。让 ai 把信息记录到 SKILL 中，并且每次维护代码的同时都维护 SKILL。

- `preload.md`：每次 ai 对话开头需要加载的 SKILL 清单
- `design.md`：记录设计草稿，把每次对 ai 的要求都写进设计里，保证后续修改都遵守先前的设计
- `changelog.md`：记录什么时间修改了什么，帮助 ai 不做出与之前矛盾的修改
- `forbidden_word.md`：违禁词，不喜欢 ai 的某些表达词汇，在这里禁止

## 记忆

记忆系统也可以写成 SKILL。类似聊天记录这样的内容，可以按时间远近逐步压缩。

- `日期.md`：记录某一天的聊天记录
- `短期记忆.md`：记录最近几天的内容；超过一天的记录，整理成总结、经验和压缩后的信息
- `长期记忆.md`：记录重要的、需要记住的事情；内容多了，或者前后矛盾了，就更新长期记忆。越久远的信息越不重要，会逐渐消退
