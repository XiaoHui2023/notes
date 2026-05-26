---
name: instruction-changelog
description: notes/ai/instruction 小仓库：按时间记录要求与决议；最新在上。
---

# 变更记录

（规则见 `~/.cursor/skills/agent-project-changelog/SKILL.md`。）

## 2026-05-26

- **决议**：**`harness.md`** 的 **Tool** 小节补充 tool 也有 `name`、描述和参数；ai 会像判断 SKILL 一样决定是否使用某个 tool。

- **决议**：**`harness.md`** 的 **MCP** 小节补充 `mcpServers` 配置示例，展示如何把图片、音频服务脚本接成 tool。

- **决议**：**`harness.md`** 新增 **MCP** 小节，说明本机脚本类 tool 的边界，以及生成图片、处理音频视频等外部模型能力如何通过 MCP 作为 tool 接入；**instruction-design-notes** 同步改为允许 **`harness.md`** 写 MCP。

- **决议**：**`harness.md`** 将 **Excel** 改名为 **自制SKILL**，并把复杂 skill 目录并入该小节；`xlrd` / `xlwt` 示例改为 SKILL 内教学文本，补充如何在 `SKILL.md` 中用 Markdown 链接引用参考文件。

- **决议**：**`harness.md`** 改写为 harness、tool、Excel 复杂 skill 三段：说明读写文件、shell、Python、网页类 tool；用 `xlrd` / `xlwt` 示例教 ai 读取 Excel、写值、样式、公式，并用渐进式披露组织参考文件。

- **决议**：**`react.md`** 将 **写代码** 小节改名为 **lint**，并移动到 **agent 模式** 前面。

- **决议**：**`react.md`** 新增 **agent 模式** 小节，说明 ReAct 相比 chat 模式会反复执行并消耗更多 token；可用更强模型对话、用便宜模型跑任务，必要时重开对话保持上下文较短。

- **决议**：**`react.md`** 改写为三段讲义：ReAct 与一轮对话的区别、写代码后 linter 检查与重写、Debug 模式中运行命令并读取结果。

- **决议**：**`skill.md`** 新增 **记忆** 小节，用 `日期.md`、`短期记忆.md`、`长期记忆.md` 说明聊天记录如何按时间远近逐步压缩与更新。

- **决议**：**`skill.md`** 将 **preload**、**design-notes**、**changelog**、**违禁词** 等后续小节合并为 **记录手稿**，用 `preload.md`、`design.md`、`changelog.md`、`forbidden_word.md` 说明项目维护时要同步维护的 SKILL 信息。

- **决议**：**`skill.md`** 将 **嵌套加载** 改为 **渐进式披露**；用 Markdown 链接示例说明入口 SKILL 如何按任务继续加载参考文件或其它 SKILL。

- **决议**：**`skill.md`** 将 **分层存放** 改为 **作用域**；目录树只写用户根目录、项目根目录、模块目录，不写具体工具路径。

## 2026-05-25

- **决议**：**`skill.md`** 合并 **YAML 元数据** 与 **按需加载** 为 **加载SKILL**；用 `name` / `description` 示例说明 ai 如何先看摘要再决定是否加载全文。

- **决议**：**`skill.md`** **提示词** 按作者口述改写（SV 场景叙事、三段）；口径写入用户根 **`user-markdown-habits-zh`**（场景先行、段间空行、少拆 `###`）。
- **要求**：改本小仓库讲义且用户要求「按我的习惯」时 Read **`~/.cursor/skills/user-markdown-habits-zh/SKILL.md`**。

- **决议**：删除 **`index.md`**；本小仓库不以目录页作入口，四篇正文直接阅读。
- **要求**：**instruction-design-notes** 已改；全库 **`notes-convention`** 仍默认小仓库可有 `index.md`，本目录为例外。

- **决议**：**`context.md`** 增 **OpenClaw（龙虾）** 节：分层记忆（日志 / `MEMORY.md` / transcript）与按时间 compaction、memory flush、检索衰减。
- **要求**：与官方 [Memory](https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory.md) 口径一致；讲义不写插件细节。

- **决议**：新增 **`context.md`**；**`harness.md`** / **`react.md`** 中上下文、新开会话相关内容迁入此文；补充「解不出、反复改又退回旧错」时新开会话。

- **决议**：移除 Excalidraw 配图：**`diagrams/`**、**`assets/`**、**`library-showcase.md`**；讲义 **`skill.md`** / **`react.md`** 去掉嵌入 PNG。
- **要求**：图示改表/列表/目录树或外链；**instruction-design-notes** 删除配图约定节。

- **决议**：**skill-purpose** 插图改为 Storytelling + 便签；`illus-loader` 归零 bbox 并按 `maxWidth`/`maxHeight` 缩放（修复贴图过小）。**（上条已撤销 Excalidraw 方案。）**
- **决议**：**skill-purpose** 四步换社区库插图（`purpose-*.json`）。
- **决议**：**配图约定**从 **`skill.md`** 移入 **instruction-design-notes**；讲义只保留图与正文小节。
- **要求**：改 **`skill-purpose`** 构图/选图/旁白时 Read 设计笔记配图节，勿把流程写回 **`skill.md`**。

## 2026-05-24

- **决议**：正文拆为 **`skill.md`**、**`react.md`**、**`harness.md`**；**`index.md`** 仅目录链；删文首三者总述、**三者配合**、**MCP** 与文末配图说明节。
- **要求**：单篇内配图路径仍用 **`./assets/`**；协作关系图 **`collaboration.png`** 暂不入正文。

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
