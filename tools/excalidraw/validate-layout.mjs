#!/usr/bin/env node
/**
 * Layout checks: text overlap, text on shapes, arrow endpoints, path vs obstacles.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";
import { arrowAbsPoints, inflateRect } from "./layout-geometry.mjs";

const dir = resolve(process.argv[2] ?? "diagrams");
let issues = 0;

function flatten(elements) {
  const out = [];
  for (const e of elements) {
    if (Array.isArray(e)) out.push(...flatten(e));
    else if (e) out.push(e);
  }
  return out;
}

function box(el) {
  if (el.type === "text") {
    return { x: el.x, y: el.y, w: el.width, h: el.height, id: el.id, kind: "text", text: el.text };
  }
  if (["rectangle", "ellipse", "diamond"].includes(el.type)) {
    return { x: el.x, y: el.y, w: el.width, h: el.height, id: el.id, kind: el.type };
  }
  return null;
}

function overlaps(a, b, pad = 6) {
  return (
    a.x < b.x + b.w - pad &&
    a.x + a.w > b.x + pad &&
    a.y < b.y + b.h - pad &&
    a.y + a.h > b.y + pad
  );
}

function textInsideShape(t, s, margin = 10) {
  return (
    t.x >= s.x + margin &&
    t.x + t.w <= s.x + s.w - margin &&
    t.y >= s.y + margin &&
    t.y + t.h <= s.y + s.h - margin
  );
}

function isNarrationEl(el) {
  return el?.id?.includes("nar") || el?.strokeColor === "#a16207";
}

function isPanelShape(s) {
  return s.w * s.h >= 18000;
}

function arrowTip(el) {
  const pts = el.points ?? [[0, 0], [el.width, el.height]];
  const last = pts[pts.length - 1];
  return { x: el.x + last[0], y: el.y + last[1] };
}

function arrowStart(el) {
  return { x: el.x, y: el.y };
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function nearShape(pt, shapes, maxD = 28) {
  for (const s of shapes) {
    const cx = Math.max(s.x, Math.min(pt.x, s.x + s.w));
    const cy = Math.max(s.y, Math.min(pt.y, s.y + s.h));
    if (dist(pt, { x: cx, y: cy }) <= maxD) return true;
    if (pt.x >= s.x - maxD && pt.x <= s.x + s.w + maxD && pt.y >= s.y - maxD && pt.y <= s.y + s.h + maxD) {
      return true;
    }
  }
  return false;
}

function midpointInRectInterior(p, r, pad = 4) {
  const ir = inflateRect(r, pad);
  return p.x > ir.x && p.x < ir.x + ir.w && p.y > ir.y && p.y < ir.y + ir.h;
}

function pointNearRectEdge(p, r, tol = 18) {
  const onX = p.x >= r.x - tol && p.x <= r.x + r.w + tol;
  const onY = p.y >= r.y - tol && p.y <= r.y + r.h + tol;
  const nearLeft = Math.abs(p.x - r.x) <= tol;
  const nearRight = Math.abs(p.x - (r.x + r.w)) <= tol;
  const nearTop = Math.abs(p.y - r.y) <= tol;
  const nearBottom = Math.abs(p.y - (r.y + r.h)) <= tol;
  return onX && onY && (nearLeft || nearRight || nearTop || nearBottom);
}

/** 用线段中点是否落在障碍内部判断穿框（首末段贴端口不计）。 */
function arrowCrossesObstacles(el, obstacles) {
  const pts = arrowAbsPoints(el);
  if (pts.length < 2) return null;
  const start = pts[0];
  const end = pts[pts.length - 1];
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    for (const r of obstacles) {
      if (!midpointInRectInterior({ x: mx, y: my }, r)) continue;
      if (i === 0 && pointNearRectEdge(start, r)) continue;
      if (i === pts.length - 2 && pointNearRectEdge(end, r)) continue;
      return { rectId: r.id, segment: i };
    }
  }
  return null;
}

for (const file of readdirSync(dir).filter((f) => f.endsWith(".excalidraw"))) {
  const raw = JSON.parse(readFileSync(`${dir}/${file}`, "utf8"));
  const name = basename(file);
  const elements = flatten(raw.elements ?? []);
  if (elements.length !== (raw.elements ?? []).length) {
    console.error(`[${name}] elements 含嵌套数组，应扁平化`);
    issues++;
  }

  const shapes = elements.map(box).filter((b) => b && b.kind !== "text");
  // 大面板当背景，不参与穿框检测；只检流程方框与角标插图
  const obstacles = shapes
    .filter((s) => s.w * s.h < 28000 && !String(s.id).includes("illus"))
    .map((s) => ({ id: s.id, x: s.x, y: s.y, w: s.w, h: s.h }));
  const bound = new Set(
    elements.filter((e) => e.type === "text" && e.containerId).map((e) => e.id),
  );
  const textById = new Map(
    elements.filter((e) => e.type === "text").map((e) => [e.id, e]),
  );
  const texts = elements
    .map(box)
    .filter((b) => b?.kind === "text" && !bound.has(b.id) && !String(b.id).includes("illus"));

  const narEls = elements.filter((e) => e.type === "text" && isNarrationEl(e));
  for (let i = 0; i < narEls.length; i++) {
    for (let j = i + 1; j < narEls.length; j++) {
      const a = box(narEls[i]);
      const b = box(narEls[j]);
      if (a && b && overlaps(a, b, 2)) {
        console.error(
          `[${name}] 讲述旁白重叠: "${a.text?.slice(0, 20)}" ↔ "${b.text?.slice(0, 20)}"`,
        );
        issues++;
      }
    }
  }

  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      if (overlaps(texts[i], texts[j])) {
        console.error(`[${name}] 文字重叠: "${texts[i].text?.slice(0, 24)}" ↔ "${texts[j].text?.slice(0, 24)}"`);
        issues++;
      }
    }
    for (const s of shapes) {
      if (String(s.id).includes("illus")) continue;
      const el = textById.get(texts[i].id);
      if (el?.containerId === s.id) continue;
      if (isPanelShape(s) && textInsideShape(texts[i], s)) continue;
      if (!isNarrationEl(el) && texts[i].w <= 72 && texts[i].h <= 28) continue;
      if (overlaps(texts[i], s, 8)) {
        console.error(`[${name}] 文字压组件: "${texts[i].text?.slice(0, 24)}" × ${s.id}`);
        issues++;
      }
    }
  }

  for (const el of elements.filter((e) => e.type === "text" && e.containerId)) {
    if (el.verticalAlign !== "top" && el.verticalAlign !== "middle") {
      console.error(
        `[${name}] 框内文字 verticalAlign 应为 top 或 middle: ${el.id}`,
      );
      issues++;
    }
    const parent = elements.find((p) => p.id === el.containerId);
    if (parent) {
      const bottom = el.y + el.height;
      const pBottom = parent.y + parent.height;
      if (el.y < parent.y - 4 || bottom > pBottom + 4) {
        console.error(
          `[${name}] 框内文字超出容器: ${el.id} y=${el.y} h=${el.height} 容器 h=${parent.height}`,
        );
        issues++;
      }
    }
  }

  for (const el of elements.filter((e) => e.type === "arrow")) {
    const len = Math.hypot(el.width, el.height);
    if (len < 8) {
      console.error(`[${name}] 箭头过短: ${el.id}`);
      issues++;
    }
    const tip = arrowTip(el);
    const start = arrowStart(el);
    const startNear = nearShape(start, shapes, 32);
    const endNear = nearShape(tip, shapes, 32);
    if (!startNear && !endNear) continue;
    if (!endNear) {
      console.error(`[${name}] 箭头终点未对准组件: ${el.id} → (${tip.x.toFixed(0)},${tip.y.toFixed(0)})`);
      issues++;
    }
    if (!startNear) {
      console.error(`[${name}] 箭头起点未对准组件: ${el.id} ← (${start.x.toFixed(0)},${start.y.toFixed(0)})`);
      issues++;
    }
    const cross = arrowCrossesObstacles(el, obstacles);
    if (cross) {
      console.error(
        `[${name}] 连线穿过组件: ${el.id} 段 ${cross.segment} × ${cross.rectId}`,
      );
      issues++;
    }
  }
}

if (issues === 0) {
  console.log("layout OK");
} else {
  console.error(`\n${issues} issue(s)`);
  process.exit(1);
}
