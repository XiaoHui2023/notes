# Excalidraw 插图库（推荐）

脚本内置的 `comic-snippets` 角标较简，默认已关闭（`EXCALIDRAW_ILLUS=1` 可恢复）。**更丰富的手绘插图**请用官方社区库，在 Excalidraw 里 **More tools → Add to favorites** 后从侧栏拖入，再保存 `.excalidraw`。

## 入口

- [libraries.excalidraw.com](https://libraries.excalidraw.com) — 搜索并一键安装

## 常用关键词（站内搜索）

| 用途 | 搜索词 |
|------|--------|
| 人物 / 讲解 | `characters`, `people`, `stick figures` |
| 可爱装饰 | `cute`, `doodles`, `hand-drawn icons` |
| 技术示意 | `software`, `cloud`, `aws`, `kubernetes` |
| 箭头与标注 | `arrows`, `callouts`, `sticky notes` |

## 社区高人气库（示例）

在 [libraries.excalidraw.com](https://libraries.excalidraw.com) 打开对应条目后点 **Install**，或复制页面上的 **library link** 在 Excalidraw 中导入：

- **Awesome Icons** — 通用手绘图标
- **Software Logos** — 品牌与工具 logo（扁平手绘风）
- **Stick Figures Collaboration** — 多人协作小人
- **Cloud / Tech** 类合集 — 架构图装饰

（库名与链接会随社区更新；以站点当前列表为准。）

## 与本仓库工作流

1. `node generate-instruction-diagrams.mjs … sketch` — 生成结构、连线、旁白字
2. 用 Excalidraw 打开 `src/ai/instruction/diagrams/*.excalidraw`，从收藏库拖插图到空白角或讲解旁
3. `node validate-layout.mjs …` → `node export-png.mjs …` — 校验并导出 PNG

结构字与讲述旁白仍由脚本生成（Excalifont / Virgil）；**角标插图以手贴社区库为主**，质量通常优于脚本简笔画。
