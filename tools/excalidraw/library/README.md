# 共用插图库（notes 仓库）

机器读清单：`manifest.json`  
人类读一览：`MANIFEST.md`

## 用法

1. **查资源**：在 `manifest.json` 按 `description` / `tags` 搜索；每张配图用 `usedBy` 绑定，**同一 `id` 不重复分配**。
2. **生成嵌入**：`generate-instruction-diagrams.mjs` 调用 `illustrationsFor("<配图名>")` 按 `placement` 贴角标。
3. **预览 SVG**：`library/assets/*.svg` 可在浏览器中单独查看。

## 维护

```bash
cd tools/excalidraw
node library/build-library.mjs
node validate-manifest.mjs
```

新增插图：在 `manifest.json` 增加条目（指定未占用的 `usedBy`）→ 运行 `build-library.mjs` 生成 `assets/` 与 `snippets/`。

## 与 Excalidraw 素材库的关系

- **本库**：脚本自动角标，五张 instruction 图各 2 个，不互相复用。
- **应用内书架**（libraries.excalidraw.com）：复杂人物/场景仍建议在 Excalidraw 内挑选后保存源稿。
