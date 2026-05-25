#!/usr/bin/env node
/**
 * Regenerate instruction diagrams using coleam00/excalidraw-diagram-skill methodology.
 * Skill: .cursor/skills/excalidraw-diagram/SKILL.md
 * Render: uv run python .cursor/skills/excalidraw-diagram/references/render_excalidraw.py
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  resetSeed,
  nid,
  scene,
  clearAnchors,
  C,
  boxNode,
  region,
  floatLabel,
  arrowBetween,
  narrationBlock,
  arrowPolyline,
  port,
  anchors,
} from "./coleam-diagram-kit.mjs";
import { instructionNarration } from "./instruction-narration.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dir, "../..");
const diagramsDir = resolve(process.argv[2] ?? `${repoRoot}/src/ai/instruction/diagrams`);
const assetsDir = resolve(process.argv[3] ?? `${repoRoot}/src/ai/instruction/assets`);

mkdirSync(diagramsDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

function narrate(name) {
  const cfg = instructionNarration[name];
  if (!cfg) return [];
  return narrationBlock(cfg.x, cfg.y, cfg.w, cfg.text);
}

function write(name, elements) {
  const flat = elements.flat(Infinity).filter(Boolean);
  writeFileSync(`${diagramsDir}/${name}.excalidraw`, JSON.stringify(scene(flat), null, 2), "utf8");
  console.log(`wrote ${diagramsDir}/${name}.excalidraw (${flat.length} elements)`);
}

// --- skill-react-harness: 装配线（规范 → 推理/Tool → 执行）---
{
  resetSeed(100);
  clearAnchors();
  write("skill-react-harness", [
    floatLabel(80, 24, 400, "规范 → 多步推理 → 真实环境", {
      fontSize: 20,
      stroke: C.title,
    }),
    ...boxNode("skill", 80, 120, 160, 88, "Skill", {
      bg: C.aiFill,
      stroke: C.aiStroke,
      textStroke: C.aiStroke,
    }),
    ...boxNode("react", 300, 120, 160, 88, "ReAct", {
      bg: C.startFill,
      stroke: C.startStroke,
      textStroke: C.startStroke,
    }),
    ...boxNode("harness", 520, 120, 170, 88, "Harness", {
      bg: C.endFill,
      stroke: C.endStroke,
      textStroke: C.endStroke,
    }),
    floatLabel(88, 96, 144, "清单与口径", { fontSize: 13, stroke: C.body, align: "center" }),
    floatLabel(308, 96, 144, "推理 ↔ Tool", { fontSize: 13, stroke: C.body, align: "center" }),
    floatLabel(528, 96, 154, "真实环境执行", { fontSize: 13, stroke: C.body, align: "center" }),
    ...arrowBetween("skill", "react", { label: "Read" }),
    ...arrowBetween("react", "harness"),
    ...narrate("skill-react-harness"),
  ]);
}

// --- skill-layers: 收敛栈（全局 → 项目 → 小仓库）---
{
  resetSeed(200);
  clearAnchors();
  write("skill-layers", [
    floatLabel(180, 24, 360, "越靠近任务，口径越细", { fontSize: 18, stroke: C.subtitle, align: "center" }),
    ...boxNode("g", 140, 64, 440, 72, "全局 skills", {
      bg: C.primaryFill,
      stroke: C.primaryStroke,
    }),
    ...boxNode("p", 140, 192, 440, 72, "项目 skills", {
      bg: "#e0e7ff",
      stroke: "#4338ca",
    }),
    ...boxNode("l", 140, 320, 440, 72, "小仓库 skills", {
      bg: C.aiFill,
      stroke: C.aiStroke,
      textStroke: C.aiStroke,
    }),
    floatLabel(600, 84, 240, "~/.cursor/skills/", { fontSize: 14, stroke: C.body }),
    floatLabel(600, 196, 240, ".cursor/skills/", { fontSize: 14, stroke: C.body }),
    floatLabel(600, 308, 260, "子目录 .cursor/skills/", { fontSize: 14, stroke: C.body }),
    ...arrowBetween("g", "p", { fromSide: "bottom", toSide: "top" }),
    ...arrowBetween("p", "l", { fromSide: "bottom", toSide: "top" }),
    ...narrate("skill-layers"),
  ]);
}

// --- react-loop: 闭环 ---
{
  resetSeed(300);
  clearAnchors();
  write("react-loop", [
    floatLabel(280, 24, 280, "未满足则继续转圈", { fontSize: 18, stroke: C.title, align: "center" }),
    ...boxNode("plan", 60, 140, 130, 76, "规划", {
      bg: C.endFill,
      stroke: C.endStroke,
      textStroke: C.endStroke,
    }),
    ...boxNode("act", 230, 140, 130, 76, "行动", {
      bg: C.startFill,
      stroke: C.startStroke,
      textStroke: C.startStroke,
    }),
    ...boxNode("obs", 400, 140, 130, 76, "观测", {
      bg: C.primaryFill,
      stroke: C.primaryStroke,
    }),
    ...boxNode("replan", 570, 140, 130, 76, "再规划", {
      bg: C.aiFill,
      stroke: C.aiStroke,
      textStroke: C.aiStroke,
    }),
    ...arrowBetween("plan", "act"),
    ...arrowBetween("act", "obs"),
    ...arrowBetween("obs", "replan"),
    arrowPolyline(
      (() => {
        const s = port(anchors.replan, "bottom", 0.5, 10);
        const e = port(anchors.plan, "bottom", 0.5, 10);
        const lane = 268;
        return [s, { x: s.x, y: lane }, { x: e.x, y: lane }, e];
      })(),
      { strokeMuted: C.arrow, arrowRoughness: 0 },
    ),
    ...narrate("react-loop"),
  ]);
}

// --- search-fetch: 分叉流（模型 → Search / Fetch）---
{
  resetSeed(400);
  clearAnchors();
  write("search-fetch", [
    ...boxNode("user", 48, 100, 108, 200, "用户", {
      bg: "#f1f5f9",
      stroke: C.body,
      textStroke: C.onLight,
    }),
    ...boxNode("model", 200, 100, 108, 200, "模型", {
      bg: C.primaryFill,
      stroke: C.primaryStroke,
    }),
    ...boxNode("search", 360, 100, 118, 200, "Search", {
      bg: C.aiFill,
      stroke: C.aiStroke,
      textStroke: C.aiStroke,
    }),
    ...boxNode("fetch", 520, 100, 118, 200, "Fetch", {
      bg: C.endFill,
      stroke: C.endStroke,
      textStroke: C.endStroke,
    }),
    ...arrowBetween("user", "model", { fromAlong: 0.35, toAlong: 0.35 }),
    ...arrowBetween("model", "search", {
      fromAlong: 0.35,
      toAlong: 0.35,
      label: "检索",
    }),
    ...arrowBetween("model", "fetch", {
      fromAlong: 0.65,
      toAlong: 0.65,
      label: "拉全文",
    }),
    ...arrowBetween("model", "user", {
      fromSide: "left",
      toSide: "right",
      fromAlong: 0.85,
      toAlong: 0.85,
      label: "回答",
    }),
    ...narrate("search-fetch"),
  ]);
}

// --- collaboration: 并排对比（人 | 运行时）---
{
  resetSeed(500);
  clearAnchors();
  write("collaboration", [
    ...region("human", 40, 72, 240, 320, "人", { bg: "#f8fafc", stroke: C.title }),
    floatLabel(68, 128, 200, "写 Skill", { fontSize: 16, stroke: C.onLight }),
    floatLabel(68, 172, 200, "给目标", { fontSize: 16, stroke: C.onLight }),
    floatLabel(68, 216, 200, "验收结果", { fontSize: 16, stroke: C.onLight }),
    ...region("runtime", 320, 72, 540, 320, "运行时", { bg: "#eff6ff", stroke: C.subtitle }),
    ...boxNode("sk", 360, 160, 130, 80, "Skill", {
      bg: C.aiFill,
      stroke: C.aiStroke,
      textStroke: C.aiStroke,
    }),
    ...boxNode("rc", 520, 160, 130, 80, "ReAct", {
      bg: C.startFill,
      stroke: C.startStroke,
      textStroke: C.startStroke,
    }),
    ...boxNode("ha", 680, 160, 130, 80, "Harness", {
      bg: C.endFill,
      stroke: C.endStroke,
      textStroke: C.endStroke,
    }),
    floatLabel(360, 252, 130, "按 Skill 口径", { fontSize: 12, stroke: C.body, align: "center" }),
    floatLabel(520, 252, 130, "多步循环", { fontSize: 12, stroke: C.body, align: "center" }),
    floatLabel(680, 252, 130, "真实读写", { fontSize: 12, stroke: C.body, align: "center" }),
    ...arrowBetween("human", "sk", { fromAlong: 0.15, toAlong: 0.1, label: "规范" }),
    arrowPolyline(
      (() => {
        const s = port(anchors.human, "right", 0.5, 10);
        const e = port(anchors.rc, "left", 0.5, 10);
        const lane = 118;
        return [s, { x: s.x, y: lane }, { x: e.x, y: lane }, e];
      })(),
      { strokeMuted: C.arrow, arrowRoughness: 0 },
    ),
    floatLabel(448, 128, 56, "目标", { fontSize: 12, stroke: C.body, align: "center" }),
    ...arrowBetween("sk", "rc"),
    ...arrowBetween("rc", "ha"),
    arrowPolyline(
      (() => {
        const s = port(anchors.ha, "left", 0.5, 10);
        const e = port(anchors.human, "right", 0.88, 10);
        const lane = 368;
        return [s, { x: s.x, y: lane }, { x: e.x, y: lane }, e];
      })(),
      { strokeMuted: C.arrow, arrowRoughness: 0 },
    ),
    floatLabel(480, 348, 56, "汇报", { fontSize: 12, stroke: C.body, align: "center" }),
    ...narrate("collaboration"),
  ]);
}

console.log("done — render with tools/excalidraw/render-instruction-coleam.mjs or skill render_excalidraw.py");
