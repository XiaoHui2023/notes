#!/usr/bin/env node
/**
 * Regenerate instruction diagrams.
 * Usage: node generate-instruction-diagrams.mjs <diagrams-dir> [sketch|flat|comic]
 * 结构字：规范体（Excalifont）；讲述旁白：narration() 手绘 Virgil。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  resetSeed,
  nid,
  scene,
  label,
  narrationBlock,
  panel,
  node,
  noteBelow,
  arrowBetween,
  clearAnchors,
  anchors,
  setStyle,
  S,
} from "./diagram-kit.mjs";
import { arrowPolyline } from "./arrow-router.mjs";
import { port } from "./arrow-router.mjs";
import { illustrationsFor } from "./library/illus-loader.mjs";
import { instructionNarration } from "./instruction-narration.mjs";

/** 角标插图默认关闭；改用 Excalidraw 官方库手贴，见 library/CURATED.md。设 EXCALIDRAW_ILLUS=1 可恢复脚本角标。 */
const useCornerIllus = process.env.EXCALIDRAW_ILLUS === "1";

const styleName = process.argv[3] ?? process.env.EXCALIDRAW_STYLE ?? "sketch";
setStyle(styleName);
console.log(`style: ${S.id} (${S.label})`);

const outDir = resolve(process.argv[2] ?? "diagrams");
mkdirSync(outDir, { recursive: true });

function flattenElements(elements) {
  const out = [];
  for (const e of elements) {
    if (Array.isArray(e)) out.push(...flattenElements(e));
    else if (e) out.push(e);
  }
  return out;
}

function write(name, elements) {
  const flat = flattenElements(elements);
  writeFileSync(
    `${outDir}/${name}.excalidraw`,
    JSON.stringify(scene(flat), null, 2),
    "utf8",
  );
  console.log(`wrote ${outDir}/${name}.excalidraw (${flat.length} elements)`);
}

function narrate(name) {
  const cfg = instructionNarration[name];
  if (!cfg) return [];
  const text = typeof cfg === "string" ? cfg : cfg.text;
  const opts =
    typeof cfg === "string"
      ? {}
      : { align: cfg.align, fontSize: cfg.fontSize, stroke: cfg.stroke };
  const x = typeof cfg === "string" ? 0 : cfg.x;
  const y = typeof cfg === "string" ? 0 : cfg.y;
  const w = typeof cfg === "string" ? 400 : cfg.w;
  return narrationBlock(x, y, w, text, opts);
}

function cornerIllus(name) {
  return useCornerIllus ? illustrationsFor(name) : [];
}

// --- skill-react-harness ---
{
  resetSeed(100);
  clearAnchors();
  write("skill-react-harness", [
    ...cornerIllus("skill-react-harness"),
    narrate("skill-react-harness"),
    ...node("skill", 100, 150, 140, 76, "Skill", { bg: S.fillBlue, stroke: "#2563eb" }),
    ...node("react", 340, 150, 140, 76, "ReAct", { bg: S.fillGreen, stroke: "#16a34a" }),
    ...node("harness", 580, 150, 150, 76, "Harness", { bg: S.fillOrange, stroke: "#ea580c" }),
    label(nid("n1"), 95, 112, 150, "清单与口径", {
      fontSize: S.noteSize,
      align: "center",
      skipOpticalY: true,
    }),
    label(nid("n2"), 335, 112, 150, "推理 ↔ Tool", {
      fontSize: S.noteSize,
      align: "center",
      skipOpticalY: true,
    }),
    label(nid("n3"), 575, 112, 160, "真实环境执行", {
      fontSize: S.noteSize,
      align: "center",
      skipOpticalY: true,
    }),
    ...arrowBetween("skill", "react", { fromSide: "right", toSide: "left" }),
    label(nid("rd"), 248, 188, 72, "Read", {
      fontSize: 13,
      align: "center",
      stroke: S.strokeMuted,
      skipOpticalY: true,
    }),
    ...arrowBetween("react", "harness", { fromSide: "right", toSide: "left" }),
  ]);
}

// --- skill-layers ---
{
  resetSeed(200);
  clearAnchors();
  write("skill-layers", [
    ...cornerIllus("skill-layers"),
    narrate("skill-layers"),
    ...node("g", 160, 80, 420, 64, "全局 skills", { bg: S.fillBlue, stroke: "#2563eb" }),
    ...node("p", 160, 180, 420, 64, "项目 skills", { bg: "#e0e7ff", stroke: "#4f46e5" }),
    ...node("l", 160, 280, 420, 64, "小仓库 skills", { bg: S.fillPink, stroke: "#db2777" }),
    label(nid("p1"), 600, 98, 240, "~/.cursor/skills/", { fontSize: S.noteSize }),
    label(nid("p2"), 600, 198, 240, ".cursor/skills/", { fontSize: S.noteSize }),
    label(nid("p3"), 600, 298, 260, "子目录 .cursor/skills/", { fontSize: S.noteSize }),
    ...arrowBetween("g", "p", { fromSide: "bottom", toSide: "top" }),
    ...arrowBetween("p", "l", { fromSide: "bottom", toSide: "top" }),
  ]);
}

// --- react-loop ---
{
  resetSeed(300);
  clearAnchors();
  write("react-loop", [
    ...cornerIllus("react-loop"),
    narrate("react-loop"),
    ...node("p", 80, 180, 120, 70, "规划", { bg: S.fillGreen, stroke: "#16a34a" }),
    ...node("a", 250, 180, 120, 70, "行动", { bg: S.fillYellow, stroke: "#ca8a04" }),
    ...node("o", 420, 180, 120, 70, "观测", { bg: "#e0f2fe", stroke: "#0284c7" }),
    ...node("r", 590, 180, 120, 70, "再规划", { bg: S.fillPurple, stroke: "#9333ea" }),
    ...arrowBetween("p", "a", { fromSide: "right", toSide: "left" }),
    ...arrowBetween("a", "o", { fromSide: "right", toSide: "left" }),
    ...arrowBetween("o", "r", { fromSide: "right", toSide: "left" }),
    ...arrowBetween("r", "p", { fromSide: "bottom", toSide: "bottom" }),
    label(nid("loop-t"), 320, 288, 200, "未结束则继续", {
      fontSize: S.noteSize,
      align: "center",
      skipOpticalY: true,
    }),
  ]);
}

// --- search-fetch ---
{
  resetSeed(400);
  clearAnchors();
  write("search-fetch", [
    ...cornerIllus("search-fetch"),
    narrate("search-fetch"),
    ...node("u", 60, 100, 100, 180, "用户", { bg: S.fillGray, stroke: S.strokeMuted }),
    ...node("m", 210, 100, 100, 180, "模型", { bg: S.fillGray, stroke: S.strokeMuted }),
    ...node("s", 360, 100, 110, 180, "Search", { bg: S.fillBlue, stroke: "#2563eb" }),
    ...node("f", 520, 100, 110, 180, "Fetch", { bg: S.fillGreen, stroke: "#16a34a" }),
    ...arrowBetween("u", "m", { fromSide: "right", toSide: "left", fromAlong: 0.35, toAlong: 0.35 }),
    ...arrowBetween("m", "s", {
      fromSide: "right",
      toSide: "left",
      fromAlong: 0.35,
      toAlong: 0.35,
    }),
    label(nid("lb-s"), 328, 72, 56, "检索", { fontSize: 13, align: "center" }),
    ...arrowBetween("m", "f", {
      fromSide: "right",
      toSide: "left",
      fromAlong: 0.65,
      toAlong: 0.65,
    }),
    label(nid("lb-f"), 432, 248, 56, "拉全文", {
      fontSize: 13,
      align: "center",
      skipOpticalY: true,
    }),
    ...arrowBetween("m", "u", {
      fromSide: "left",
      toSide: "right",
      fromAlong: 0.85,
      toAlong: 0.85,
    }),
    label(nid("lb-a"), 168, 318, 56, "回答", { fontSize: 13, align: "center" }),
  ]);
}

// --- collaboration ---
{
  resetSeed(500);
  clearAnchors();
  write("collaboration", [
    ...cornerIllus("collaboration"),
    ...panel("human", 40, 90, 220, 300, "", { bg: "#f8fafc" }),
    label(nid("ht"), 110, 112, 80, "人", { fontSize: 22, align: "center", skipOpticalY: true }),
    label(nid("h1"), 60, 158, 180, "写 Skill", { fontSize: 17, skipOpticalY: true }),
    label(nid("h2"), 60, 208, 180, "给目标", { fontSize: 17, skipOpticalY: true }),
    label(nid("h3"), 60, 258, 180, "验收结果", { fontSize: 17, skipOpticalY: true }),
    ...panel("runtime", 300, 90, 520, 300, "", { bg: "#eff6ff", stroke: "#3b82f6" }),
    label(nid("rtt"), 430, 102, 260, "运行时", { fontSize: 20, align: "center", stroke: "#3b82f6" }),
    ...node("sk", 330, 168, 120, 72, "Skill", { bg: S.fillBlue, stroke: "#2563eb" }),
    ...node("rc", 490, 168, 120, 72, "ReAct", { bg: S.fillGreen, stroke: "#16a34a" }),
    ...node("ha", 650, 168, 120, 72, "Harness", { bg: S.fillOrange, stroke: "#ea580c" }),
    noteBelow("sk", "按 Skill 口径", { gap: 22, width: 120 }),
    noteBelow("rc", "多步循环", { gap: 22, width: 120 }),
    noteBelow("ha", "真实读写", { gap: 22, width: 120 }),
    ...arrowBetween("human", "sk", {
      fromSide: "right",
      toSide: "left",
      fromAlong: 0.12,
      toAlong: 0.08,
    }),
    label(nid("lb1"), 278, 178, 56, "规范", { fontSize: 13, align: "center" }),
    arrowPolyline(
      (() => {
        const s = port(anchors.human, "right", 0.52, 8);
        const e = port(anchors.rc, "left", 0.52, 8);
        const laneY = 128;
        return [s, { x: s.x, y: laneY }, { x: e.x, y: laneY }, e];
      })(),
      S,
    ),
    label(nid("lb2"), 368, 118, 56, "目标", {
      fontSize: 13,
      align: "center",
      skipOpticalY: true,
    }),
    ...arrowBetween("sk", "rc", { fromSide: "right", toSide: "left" }),
    ...arrowBetween("rc", "ha", { fromSide: "right", toSide: "left" }),
    arrowPolyline(
      (() => {
        const s = port(anchors.ha, "left", 0.5, 8);
        const e = port(anchors.human, "right", 0.88, 8);
        const laneY = 402;
        return [
          s,
          { x: s.x, y: laneY },
          { x: e.x, y: laneY },
          e,
        ];
      })(),
      S,
    ),
    label(nid("lb3"), 420, 352, 56, "汇报", { fontSize: 13, align: "center" }),
    narrate("collaboration"),
  ]);
}

console.log("done — run validate-layout.mjs then export-png.mjs");
