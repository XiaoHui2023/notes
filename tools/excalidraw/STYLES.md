# 配图风格可选

脚本预设三种风格，在生成时指定第三参数或环境变量 `EXCALIDRAW_STYLE`。

| 预设 id | 名称 | 特点 | 建议 |
| --- | --- | --- | --- |
| **sketch** | 温和手绘 | 方框 roughness 1；**结构字 Excalifont (5)**；**讲述旁白 Virgil (1)** 见 `narration()` | **默认** |
| **flat** | 扁平海报 | roughness 0、Excalifont、几乎无笔触 | 偏 PPT / 宣讲幻灯 |
| **comic** | 漫画脏手绘 | roughness 3、hachure 斜线、椭圆主形 | 易显乱，**不推荐** |

## 命令

```bash
cd tools/excalidraw
node generate-instruction-diagrams.mjs src/ai/instruction/diagrams sketch
node generate-instruction-diagrams.mjs src/ai/instruction/diagrams flat
node export-png.mjs src/ai/instruction/diagrams src/ai/instruction/assets
```

或：

```bash
set EXCALIDRAW_STYLE=flat
node generate-instruction-diagrams.mjs src/ai/instruction/diagrams
```

## 在 Excalidraw 应用内对应

| 预设 | 笔触 / 风格 |
| --- | --- |
| sketch | **Architect** 或 **Sloppy**（别开太高）+ 手写字体 |
| flat | **Solid** + Excalifont |
| comic | **Sloppy** + 斜线填充（hachure） |

## 插图

共用角标见 **`library/manifest.json`** + **`MANIFEST.md`**（`illustrationsFor` 按 `usedBy` 加载，不重复）。人物/场景漫画仍可在 Excalidraw 内选库。

## 文字垂直

- 框内字：`verticalAlign: middle`，文字框与方框同 `x,y,w,h`。
- 居中旁白/标注：用 `textHeight()` + `middle`，勿用 `top` + `y - fontSize/2`。
- 详见用户根 **`excalidraw`** skill「文字垂直」节。

## 与「难看」那版的区别

早期 **comic** 预设：roughness 3 + 满屏 hachure + 字挤在框内 → 脏、糊。  
当前 **sketch**：方框轻微手绘；**节点名、路径、箭头标注**用规范字；**讲述旁白**（不进 `index.md` 的口语句）用 `instruction-narration.mjs` + `narration()` 手绘字写在图上。
