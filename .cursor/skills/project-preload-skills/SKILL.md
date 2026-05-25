---
name: project-preload-skills
description: notes 仓库根：会话预加载顺序与用过的 skill 记录。
---

# 预加载

## 初始化加载（Session preload）

1. `~/.cursor/skills/project-skill-manifest-policy/SKILL.md`
2. `~/.cursor/skills/forbidden-doc-comment-vocabulary/SKILL.md`
3. `~/.cursor/skills/markdown-authoring-zh/SKILL.md`
4. `.cursor/skills/project-design-notes/SKILL.md`
5. `.cursor/skills/notes-convention/SKILL.md`
6. `.cursor/skills/project-changelog/SKILL.md`
7. `~/.cursor/skills/agent-codegen-self-review/SKILL.md`

## 小仓库会话（修改某个末端小仓库时）

当本轮工作**只改某一小仓库目录**（如 **`ai/instruction/`**）时：

1. 若该目录存在 **`.cursor/skills/<预加载>/SKILL.md`** → **改 Read 小仓库预加载**，按其中列表加载；**不要**仅用仓库根预加载代替。
2. 若不存在 → 按 **`notes-convention`**「小仓库 skill」**当场初始化**三件套，再 Read 小仓库预加载。
3. 小仓库预加载须链回仓库根 **`notes-convention`** 与必要的用户根 skill；**小仓库 design-notes / changelog** 只记该目录口径与变更。

## 用过的 skill（追加记录）

- `excalidraw-diagram` — instruction 配图（coleam 方法论 + `tools/excalidraw/generate-instruction-coleam.mjs`）

## 配图会话额外加载

修改 `src/ai/instruction/diagrams` 或 `assets` 时追加 Read：

1. `.cursor/skills/excalidraw-diagram/SKILL.md`
2. `.cursor/skills/excalidraw-diagram/references/color-palette.md`
3. `src/ai/instruction/.cursor/skills/instruction-design-notes/SKILL.md`
