---
name: instruction-design-notes
description: ai/instruction 小仓库：当前有效的设计意图与硬性要求；变更见 instruction-changelog。
---

# 设计笔记（当前有效）

> 变更记录见 `src/ai/instruction/.cursor/skills/instruction-changelog/SKILL.md`；矛盾以 changelog 最新条目为准。

## 设计意图

- 本小仓库**不设** **`index.md`**；正文为 **`skill.md`**、**`react.md`**、**`harness.md`**、**`context.md`** 四篇并列；不写总述；**`harness.md`** 可写 MCP。
- 读者面向本人与同事查阅；成稿为**讲义型**中文技术说明：**正文极简**，口语现场补；叙述习惯见用户根 **`user-markdown-habits-zh`**（先场景、一段一意、段间空行）；结构用**标题、列表、目录树**；**表格仅**用于 YAML 字段等同规格列举（见 **`markdown-authoring-zh`**）。
- **不用 Mermaid**；图示用表、列表或外链。**`notes-convention`** 管仓库布局；本目录路径 **`src/ai/instruction/`**。

## 硬性要求

- 中文成稿遵循 **`forbidden-doc-comment-vocabulary`**、**`markdown-authoring-zh`**（经本目录预加载 Read）。
- 正文不出现 **Agent** 一词；不用 **收口**、**交付**、**自推进** 等禁用词。
- 结构自述、标题序号、meta 小节（**是什么** 等）、流程伪代码块等按 **`markdown-authoring-zh`** 自检。
- 约定变更当轮更新本文件与 **instruction-changelog**（最新在上）。

## 备忘与待定

（暂无。）
