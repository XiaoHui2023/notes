---
name: notes-convention
description: 本仓库：笔记层级、小仓库目录与 index.md 入口规范。
---

# 笔记规范

## 仓库与文档根

- **Git 仓库根**（如 `…/notes/` 克隆目录）：放 **`.cursor/skills/`** 三件套、**`.gitignore`**；**不设** `index.md`。
- **文档内容**在仓库内 **`src/`**（或约定的文档子目录）：其下为主题分组与小仓库（如 **`src/ai/instruction/`**）。

```
<git 仓库根>/
  .cursor/skills/
  src/                   ← 文档内容根（当前布局）
    <分组>/              ← 如 ai/
      <english-name>/    ← 小仓库
        index.md
        *.md
```

## 小仓库

| 项 | 规则 |
| --- | --- |
| **目录名** | **英文**（小写、连字符或单词均可） |
| **入口** | 目录内必须有 **`index.md`** |
| **显示名** | `index.md` **第一个一级标题**（`# …`） |
| **目录名与显示名** | **可以不同** |

## index.md

- 仅**小仓库**需要 `index.md`；**git 仓库根** 与 **内容根 `src/`** 均**不需要** `index.md`。
- 文首第一个 `#` 标题即小仓库名称；中文成稿见 **`markdown-authoring-zh`**；禁用词见 **`forbidden-doc-comment-vocabulary`**。

## 示例

小仓库：`src/ai/instruction/index.md`（一级标题可为「介绍」，目录名 `instruction`）。

## 图示

- 结构用标题、列表、目录树；需图时用外链或后续另定方案。
- 默认**不用 Mermaid**；成稿规范见 **`markdown-authoring-zh`**。

## 小仓库 skill

- 末端小仓库内**可**建 **`.cursor/skills/`** 三件套；**修改该小仓库前** Read 小仓库预加载。
- 小仓库 **design-notes / changelog** 只记本目录；**全库**规则写 git 仓库根 **project-design-notes** / **project-changelog**。
- 小仓库预加载须链回 **`.cursor/skills/notes-convention/SKILL.md`**（路径自 git 仓库根）。

## Agent 义务

- 改文档前 Read **notes-convention**；改某小仓库前 Read 该目录预加载。
- 新主题新建英文目录小仓库，按需初始化小仓库三件套。
