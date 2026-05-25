#!/usr/bin/env node
/**
 * Write sketch-style .excalidraw stubs into a small-repo diagrams/ folder.
 * Usage (from notes git root): node ../tools/excalidraw/scaffold-sources.mjs notes/ai/instruction/diagrams
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve(process.argv[2] ?? "diagrams");
mkdirSync(outDir, { recursive: true });

let seed = 1000;
const nid = () => `id-${++seed}`;
const now = Date.now();

function rect(id, x, y, w, h, stroke, bg, label) {
  const textId = nid();
  return [
    {
      id,
      type: "rectangle",
      x,
      y,
      width: w,
      height: h,
      angle: 0,
      strokeColor: stroke,
      backgroundColor: bg,
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 2,
      opacity: 100,
      groupIds: [],
      roundness: { type: 3 },
      seed: seed++,
      version: 1,
      versionNonce: seed++,
      isDeleted: false,
      boundElements: [{ type: "text", id: textId }],
      updated: now,
      link: null,
      locked: false,
    },
    {
      id: textId,
      type: "text",
      x: x + 8,
      y: y + h / 2 - 12,
      width: w - 16,
      height: 24,
      angle: 0,
      strokeColor: stroke,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 1,
      opacity: 100,
      groupIds: [],
      roundness: null,
      seed: seed++,
      version: 1,
      versionNonce: seed++,
      isDeleted: false,
      boundElements: null,
      updated: now,
      link: null,
      locked: false,
      text: label,
      fontSize: 20,
      fontFamily: 5,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: id,
      originalText: label,
      lineHeight: 1.25,
    },
  ];
}

function arrow(id, x, y, w, h, from, to) {
  return {
    id,
    type: "arrow",
    x,
    y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: "#64748b",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    roughness: 2,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: null,
    updated: now,
    link: null,
    locked: false,
    points: [
      [0, 0],
      [w, h],
    ],
    lastCommittedPoint: null,
    startBinding: from ? { elementId: from, focus: 0, gap: 8 } : null,
    endBinding: to ? { elementId: to, focus: 0, gap: 8 } : null,
    startArrowhead: null,
    endArrowhead: "arrow",
  };
}

function file(name, elements) {
  const body = {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements,
    appState: {
      viewBackgroundColor: "#ffffff",
      currentItemRoughness: 2,
      currentItemFontFamily: 5,
      gridSize: null,
    },
    files: {},
  };
  writeFileSync(`${outDir}/${name}.excalidraw`, JSON.stringify(body, null, 2), "utf8");
  console.log(`wrote ${name}.excalidraw`);
}

// skill-react-harness
{
  const s = "skill-box",
    r = "react-box",
    h = "harness-box";
  const els = [
    ...rect(s, 60, 140, 150, 70, "#2563eb", "#dbeafe", "Skill"),
    ...rect(r, 280, 140, 150, 70, "#16a34a", "#dcfce7", "ReAct"),
    ...rect(h, 500, 140, 150, 70, "#ea580c", "#ffedd5", "Harness"),
    arrow("a1", 210, 168, 70, 0, s, r),
    arrow("a2", 430, 168, 70, 0, r, h),
  ];
  file("skill-react-harness", els);
}

// skill-layers (stacked ellipses feel via offset rects)
{
  const g = "g",
    p = "p",
    l = "l";
  const els = [
    ...rect(g, 120, 80, 360, 56, "#2563eb", "#dbeafe", "全局 skills"),
    ...rect(p, 120, 160, 360, 56, "#4f46e5", "#e0e7ff", "项目 skills"),
    ...rect(l, 120, 240, 360, 56, "#db2777", "#fce7f3", "小仓库 skills"),
    arrow("d1", 300, 136, 0, 24, g, p),
    arrow("d2", 300, 216, 0, 24, p, l),
  ];
  file("skill-layers", els);
}

// react-loop
{
  const p = "p",
    a = "a",
    o = "o",
    r = "r";
  const els = [
    ...rect(p, 40, 160, 110, 60, "#16a34a", "#dcfce7", "规划"),
    ...rect(a, 190, 160, 110, 60, "#ca8a04", "#fef9c3", "行动"),
    ...rect(o, 340, 160, 110, 60, "#0284c7", "#e0f2fe", "观测"),
    ...rect(r, 490, 160, 110, 60, "#9333ea", "#f3e8ff", "再规划"),
    arrow("r1", 150, 185, 40, 0, p, a),
    arrow("r2", 300, 185, 40, 0, a, o),
    arrow("r3", 450, 185, 40, 0, o, r),
    arrow("r4", 545, 220, -450, 40, r, p),
  ];
  file("react-loop", els);
}

// search-fetch (loose columns + arrows)
{
  const els = [
    ...rect("u", 40, 60, 90, 200, "#64748b", "#f1f5f9", "用户"),
    ...rect("m", 180, 60, 90, 200, "#64748b", "#f1f5f9", "模型"),
    ...rect("s", 320, 60, 90, 200, "#64748b", "#f1f5f9", "Search"),
    ...rect("f", 460, 60, 90, 200, "#64748b", "#f1f5f9", "Fetch"),
    arrow("sf1", 130, 100, 50, 0, "u", "m"),
    arrow("sf2", 270, 140, 50, 0, "m", "s"),
    arrow("sf3", 410, 180, 50, 0, "m", "f"),
    arrow("sf4", 270, 220, -140, 0, "m", "u"),
  ];
  file("search-fetch", els);
}

// collaboration
{
  const els = [
    ...rect("human", 40, 80, 160, 220, "#94a3b8", "#f8fafc", "人"),
    ...rect("rt", 240, 80, 420, 220, "#3b82f6", "#eff6ff", "运行时"),
    ...rect("sk", 270, 120, 100, 50, "#2563eb", "#dbeafe", "Skill"),
    ...rect("rc", 400, 120, 100, 50, "#16a34a", "#dcfce7", "ReAct"),
    ...rect("ha", 530, 120, 100, 50, "#ea580c", "#ffedd5", "Harness"),
    arrow("c1", 200, 140, 70, 0, "human", "sk"),
    arrow("c2", 370, 145, 30, 0, "sk", "rc"),
    arrow("c3", 500, 145, 30, 0, "rc", "ha"),
  ];
  file("collaboration", els);
}
