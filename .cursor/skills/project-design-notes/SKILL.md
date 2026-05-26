---
name: project-design-notes
description: notes 仓库根：Agent 当前有效的设计意图与硬性要求；变更见 project-changelog。
---

# 设计笔记（当前有效）

> 变更记录见 `.cursor/skills/project-changelog/SKILL.md`；矛盾以 changelog 最新条目为准。

## 设计意图

- 个人笔记：**git 仓库根**放 **`.cursor/skills/`**；文档内容在 **`src/`** 下各小仓库（如 **`src/ai/instruction/`**）。
- **不设** git 仓库根或 **`src/`** 内容根的 `index.md`；入口仅各**小仓库** `index.md`。
- 讲义配图用表、列表、目录树或外链图；**不用 Mermaid** 作默认配图。目录细则见 **`notes-convention`**；小仓库可自带 `.cursor/skills/` 三件套。

## 硬性要求

- 中文成稿遵循 **`forbidden-doc-comment-vocabulary`**、**`markdown-authoring-zh`**。
- **修改某个小仓库**时 Read 该目录预加载；全库规则变更写根 **project-changelog** / **project-design-notes**。

## 备忘与待定

（暂无。）
