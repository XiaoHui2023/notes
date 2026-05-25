---
name: instruction-changelog
description: notes/ai/instruction 小仓库：按时间记录要求与决议；最新在上。
---

# 变更记录

（规则见 `~/.cursor/skills/agent-project-changelog/SKILL.md`。）

## 2026-05-24

- **决议**：配图文字垂直：**框内** `verticalAlign: middle` 且与容器同框；居中标签用 `textHeight` + `middle`；`validate-layout` 检查框内字。
- **要求**：勿用手写 `y + h/2 - fontSize/2`；技巧见用户根 **`excalidraw`**「文字垂直」节。

- **决议**：配图**双字体**：结构字 **Excalifont (5)**；讲述旁白 **Virgil (1)**，文案 **`instruction-narration.mjs`**，API **`narration()`**。
- **要求**：改旁白只改 **`instruction-narration.mjs`** 后重跑 generate / export；**`index.md`** 不写口语长句。

- **决议**：**`tools/`** 迁入 **notes 仓库根**（`tools/excalidraw/`），不再使用仓库外 `Project/tools/`。
- **要求**：配图说明链 **`../../../tools/excalidraw/README.md`**（自本小仓库）。

- **决议**：配图风格改为**扁平海报**（solid、roughness 0、框外旁注）；四角插画加大；新增用户根 **`excalidraw`** skill。
- **要求**：改图后跑 `validate-layout.mjs` 与 `export-png.mjs` 或应用内导出；箭头禁止 binding 指空。

- **决议**：五张配图改为手绘风（后由扁平海报取代）；`collaboration` 箭头修正；`index.md` 去掉非规格表。
- **要求**：源稿 `diagrams/*.excalidraw` 更新后跑 **`tools/excalidraw/export-png.mjs`** 或 Excalidraw 内导出覆盖 `assets/`。

- **决议**：本小仓库路径 **`src/ai/instruction/`**；共用 **`tools/`** 在 git 仓库根；无仓库级 **`index.md`**。
- **要求**：配图说明链到 **`../../../tools/excalidraw/README.md`**。

- **决议**：删除小仓库内 **`tools/`**、**`assets/*.svg`**、draw.io；配图 **PNG + Excalidraw**。
- **要求**：`diagrams/*.excalidraw` 手绘风；在 Excalidraw 导出 PNG 覆盖 `assets/`（当前 PNG 仍为旧版框图时可重导）。

- **决议**：配图改为 **`assets/*.png`** 供 Markdown 预览（已取代 SVG 嵌入）。
- **要求**：**`index.md`** 引用 `.png`；勿仅用 `.svg` 嵌入预览。

- **决议**：新增 **`assets/`** 五张图、**`diagrams/src/`** 源稿、**`tools/export-diagrams.mjs`**；**`index.md`** 嵌入图片引用。
- **要求**：配图以 SVG 为主；Excalidraw 在应用内导出；draw.io 可选装桌面版后 `npm run export`。

- **决议**：**`index.md`** **移除全部 Mermaid**；改用表、列表、目录树；增 **配图与可读文档** 工具表。本小仓库**不用 Mermaid**。
- **要求**：复杂图用 draw.io / Excalidraw → SVG/PNG；用户根 **`markdown-authoring-zh`** 以 **图示与结构表达** 取代 Mermaid 图种选型（默认不依赖 Mermaid）。

- **决议**：**`index.md`** 混用多种 **Mermaid** 图种；**已被上条取代**。
- **要求**：讲义成稿按图种表达信息形态 — **已废弃**，改表/列表/外链图。

- **决议**：**`index.md`** 按讲义型大幅精简：增总览与分层、三者配合等 **Mermaid**；删长段复述。
- **要求**：成稿遵守 **`markdown-authoring-zh`** **讲义与演讲提纲**（正文锚点级、图承担结构）；用户根 **`markdown-authoring-zh`**、**`module-readme`** 已增对应条文。

## 2026-05-23

- **决议**：本小仓库初始化 **`.cursor/skills/`** 三件套（`instruction-preload-skills`、`instruction-design-notes`、`instruction-changelog`）；子仓库级变更从此记入本 changelog，不再堆在仓库根 **`project-changelog`**。
- **要求**：修改 **`ai/instruction/`** 内 Markdown 前 Read 本目录 **instruction-preload-skills**；口径变更同步 **instruction-design-notes**。

- **决议**：**`index.md`** 扩写 ReAct（联网 Search/Fetch、代码审查循环、上下文与 token）；去掉 **Agent** 表述。
- **要求**：成稿用语符合 **`forbidden-doc-comment-vocabulary`**（含 **收口**、**交付**、**自推进** 等禁用词）。

- **决议**：**`index.md`** 按 **`markdown-authoring-zh`** 重写：去 meta 小节与不当表格；流程改 Mermaid / 分节；去掉 **一、二、三** 标题序号。
- **要求**：保留 **excel-ops/** 目录树 code block；去掉箭头流程 code block。

- **决议**：**`index.md`** 去掉过程草稿口吻（面向同事、讲给听众等）；去掉直角引号 **「」**。
