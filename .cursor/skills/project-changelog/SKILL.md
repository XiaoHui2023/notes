---
name: project-changelog
description: notes 仓库根：全库级要求与决议；最新在上；矛盾以最新为准。
---

# 变更记录

（规则见 `~/.cursor/skills/agent-project-changelog/SKILL.md`。）

## 2026-05-24

- **决议**：**`tools/`** 放在 **git 仓库根**（`notes/tools/excalidraw/`），不再放在仓库外 `Project/tools/`。
- **要求**：**`notes-convention`**、**`project-design-notes`**、小仓库配图链接与 **`~/.cursor/skills/excalidraw`** 已改路径；`.gitignore` 忽略 `tools/excalidraw/node_modules/`。

- **决议**：**文档内容**在 **`src/`**（如 `src/ai/instruction/`）；git 仓库根不设 `index.md`。
- **要求**：小仓库内不建 `tools/`。

- **决议**：小仓库配图仅 **`assets/*.png`** + **`diagrams/*.excalidraw`**；**不用 Mermaid** 默认配图。
- **要求**：Excalidraw 说明在 **`tools/excalidraw/README.md`**。

## 2026-05-23

- **决议**：**小仓库 skill 分层**：末端小仓库可在目录内建 **`.cursor/skills/`** 三件套；用 AI 修改某小仓库时 Read 该目录预加载，若无则当场初始化。首例：**`ai/instruction/.cursor/skills/`**。
- **要求**：仓库根 **`project-preload-skills`** 增加「小仓库会话」节；**`notes-convention`** 增加「小仓库 skill」节。单小仓库 **`index.md`** 相关变更迁入各小仓库 **changelog**（如 **`instruction-changelog`**）。

- **决议**：用户根 **`forbidden-doc-comment-vocabulary`** 新增 **收口**、**交付**（用户向文档）、**自推进**；全库预加载纳入 **`markdown-authoring-zh`**、**`agent-codegen-self-review`**。
- **要求**：所有中文笔记小仓库成稿遵循上述 skill；禁用词真源只在用户根维护。

- **决议**：新增 **`notes-convention`**：笔记可多层嵌套；末端为小仓库，目录名英文，必有 `index.md`；一级标题为显示名，可与目录名不同。
- **要求**：整理或新建笔记前须 Read **`notes-convention`**。

- **决议**：仓库根按 Agent 协作三件套初始化（`project-preload-skills`、`project-design-notes`、`project-changelog`）。
- **要求**：中文笔记遵循 **`forbidden-doc-comment-vocabulary`**。
