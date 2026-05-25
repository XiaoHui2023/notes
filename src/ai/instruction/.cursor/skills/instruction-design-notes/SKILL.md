---
name: instruction-design-notes
description: ai/instruction 小仓库：当前有效的设计意图与硬性要求；变更见 instruction-changelog。
---

# 设计笔记（当前有效）

> 变更记录见 `src/ai/instruction/.cursor/skills/instruction-changelog/SKILL.md`；矛盾以 changelog 最新条目为准。

## 设计意图

- 本小仓库入口为 **`index.md`**（一级标题 **介绍**）；正文介绍 **Skill**、**ReAct**、**Harness** 三者的概念与协作关系。
- 读者面向本人与同事查阅；成稿为**讲义型**中文技术说明：**正文极简**，口语现场补；结构用**标题、列表、目录树**；**表格仅**用于 YAML 字段等同规格列举（见 **`markdown-authoring-zh`**）。
- 配图仅 **`assets/*.png`**；源稿 **`diagrams/*.excalidraw`**。默认 **sketch**（见 **`tools/excalidraw/STYLES.md`**）：**结构字规范体**，**讲述者旁白**（讲义正文不写、现场口头展开）写在图上 **手绘 Virgil**，文案真源 **`tools/excalidraw/instruction-narration.mjs`**。技巧见用户根 **`excalidraw`** skill。**不用 Mermaid**。
- **`notes-convention`** 管仓库布局；本目录路径 **`src/ai/instruction/`**。

## 硬性要求

- 中文成稿遵循 **`forbidden-doc-comment-vocabulary`**、**`markdown-authoring-zh`**（经本目录预加载 Read）。
- 正文不出现 **Agent** 一词；不用 **收口**、**交付**、**自推进** 等禁用词。
- 结构自述、标题序号、meta 小节（**是什么** 等）、流程伪代码块等按 **`markdown-authoring-zh`** 自检。
- 口径变更当轮更新本文件与 **instruction-changelog**（最新在上）。

## 备忘与待定

（暂无。）
