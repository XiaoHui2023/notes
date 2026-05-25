# Excalidraw 配图

位于 **git 仓库根** `tools/excalidraw/`。

## 小仓库布局

```
src/<分组>/<小仓库>/
  index.md
  assets/           ← 仅 *.png
  diagrams/         ← 仅 *.excalidraw
```

例：`src/ai/instruction/assets/skill-react-harness.png`

## coleam excalidraw-diagram skill（推荐）

已安装于 **`.cursor/skills/excalidraw-diagram/`**（[GitHub](https://github.com/coleam00/excalidraw-diagram-skill)）。instruction 五图用：

```bash
cd tools/excalidraw
node generate-instruction-coleam.mjs
node validate-layout.mjs ../../src/ai/instruction/diagrams
node render-instruction-coleam.mjs
```

详见 `.cursor/skills/excalidraw-diagram/INSTALL-notes.md`。

## 工作流

1. 用 [Excalidraw](https://excalidraw.com) 打开 `diagrams/<名>.excalidraw`。
2. 导出 PNG：
   - **应用内**：Export image → PNG
   - **脚本**（本目录）：`npm install` 后  
     `node export-png.mjs <diagrams-dir> <assets-dir>`
3. 可选：`node validate-layout.mjs <diagrams-dir>`
4. `index.md`：`![说明](./assets/<名>.png)`

## 风格

默认 **sketch（温和手绘）**：轻微笔触、solid 填充、无脏斜线。另有 **flat**、**comic** 可选 → 见 **[STYLES.md](./STYLES.md)**。

技巧见用户根 **`~/.cursor/skills/excalidraw/SKILL.md`**。

## 脚本

| 脚本 | 作用 |
| --- | --- |
| `diagram-kit.mjs` | 元素、样式预设、`narration()` 讲述旁白、`arrowBetween` 绕障 |
| `instruction-narration.mjs` | instruction 五图讲述者旁白文案（不进 index.md） |
| `layout-geometry.mjs` | 障碍矩形、正交绕障、相交检测 |
| `arrow-router.mjs` | `arrowPolyline`、`labelOnPath` |
| `library/manifest.json` | 共用插图清单（`MANIFEST.md` 表格式说明） |
| `library/CURATED.md` | 推荐 [libraries.excalidraw.com](https://libraries.excalidraw.com) 社区库；角标建议手贴 |
| `library/build-library.mjs` | 生成 `assets/*.svg` + `snippets/*.json` |
| `validate-manifest.mjs` | 检查 `usedBy` 不重复 |
| `generate-instruction-diagrams.mjs` | 重写 instruction 五张源稿 |
| `validate-layout.mjs` | 字叠、压框、穿框、框内字 verticalAlign |
| `export-png.mjs` | Playwright 导出 PNG |

在 **git 仓库根**（`notes/`）执行：

```bash
cd tools/excalidraw
npm install
node library/build-library.mjs
node validate-manifest.mjs
node generate-instruction-diagrams.mjs ../../src/ai/instruction/diagrams sketch
# 可选：恢复脚本角标插图
# set EXCALIDRAW_ILLUS=1   # Windows: $env:EXCALIDRAW_ILLUS=1
node validate-layout.mjs ../../src/ai/instruction/diagrams
node export-png.mjs ../../src/ai/instruction/diagrams ../../src/ai/instruction/assets
```

## Git

- 提交：脚本、`README`、`.excalidraw` 源稿、`assets/*.png`
- 不提交：`tools/excalidraw/node_modules/`（`npm install` 本地生成）
