# 插图资源清单

源数据：`manifest.json`（机器读）+ `assets/*.svg`（可预览）+ `snippets/*.json`（脚本嵌入 Excalidraw）。

## 分配规则

- 每个 `id` **全局唯一**
- 每个 `usedBy` 对应一张配图文件名（如 `skill-react-harness`）
- 每张配图 **2 个**角标插图，**不与其他配图复用**同一 `id`
- 查询：按 `tags` / `description` 在 `manifest.json` 搜索；生成时用 `usedBy` 自动加载

## 一览

| id | 描述 | 用于配图 | 文件 |
| --- | --- | --- | --- |
| illus-gear-puzzle | Q 版齿轮机器人 + 拼图 | skill-react-harness | assets/gear-puzzle.svg |
| illus-chat-spark | Q 版角色 + 对话气泡与星星 | skill-react-harness | assets/chat-spark.svg |
| illus-layer-stack | 三层叠放：Skill 分层 | skill-layers | assets/layer-stack.svg |
| illus-folder-tree | 文件夹树：路径口径 | skill-layers | assets/folder-tree.svg |
| illus-loop-arrow | 环形箭头：多轮循环 | react-loop | assets/loop-arrow.svg |
| illus-magnifier | 放大镜：观测 | react-loop | assets/magnifier.svg |
| illus-globe-search | 地球与搜索 | search-fetch | assets/globe-search.svg |
| illus-doc-pull | 文档拉出：Fetch | search-fetch | assets/doc-pull.svg |
| illus-handshake | 握手：人机协作 | collaboration | assets/handshake.svg |
| illus-laptop-ide | 笔记本 IDE：运行时 | collaboration | assets/laptop-ide.svg |

## 维护

```bash
cd tools/excalidraw/library
node build-library.mjs          # 重新生成 svg + snippets
node ../validate-manifest.mjs   # 检查 usedBy 不冲突
```

新增插图：在 `manifest.json` 增加条目 → 补 `assets/` 与 `snippets/` → 指定**未占用**的 `usedBy`。
