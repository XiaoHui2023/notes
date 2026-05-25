/**
 * Diagram kit aligned with .cursor/skills/excalidraw-diagram (coleam00).
 * Palette: references/color-palette.md — roughness 0, fontFamily 3 for structure.
 */
import { routeArrowAvoid, rectsFromAnchors } from "./layout-geometry.mjs";
import { arrowPolyline, port } from "./arrow-router.mjs";

let seed = 1;
const now = () => Date.now();

export function resetSeed(n = 1) {
  seed = n;
}

export function nid(prefix = "el") {
  return `${prefix}-${seed++}`;
}

export const anchors = {};

export function registerAnchor(id, x, y, w, h) {
  anchors[id] = { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

export function clearAnchors() {
  for (const k of Object.keys(anchors)) delete anchors[k];
}

/** @see .cursor/skills/excalidraw-diagram/references/color-palette.md */
export const C = {
  bg: "#ffffff",
  title: "#1e40af",
  subtitle: "#3b82f6",
  body: "#64748b",
  onLight: "#374151",
  primaryFill: "#dbeafe",
  primaryStroke: "#1e40af",
  aiFill: "#ddd6fe",
  aiStroke: "#6d28d9",
  startFill: "#fed7aa",
  startStroke: "#c2410c",
  endFill: "#a7f3d0",
  endStroke: "#047857",
  decisionFill: "#fef3c7",
  decisionStroke: "#b45309",
  arrow: "#64748b",
  narrate: "#b45309",
};

export function scene(elements, extra = {}) {
  return {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements,
    appState: {
      viewBackgroundColor: C.bg,
      gridSize: 20,
      currentItemRoughness: 0,
      currentItemFontFamily: 3,
      ...extra,
    },
    files: {},
  };
}

function base(id, type, x, y, w, h, opts = {}) {
  return {
    id,
    type,
    x,
    y,
    width: w,
    height: h,
    angle: opts.angle ?? 0,
    strokeColor: opts.stroke ?? C.primaryStroke,
    backgroundColor: opts.bg ?? "transparent",
    fillStyle: "solid",
    strokeWidth: opts.strokeWidth ?? 2,
    roughness: opts.roughness ?? 0,
    opacity: 100,
    groupIds: [],
    roundness:
      opts.roundness ??
      (type === "rectangle" ? { type: 3 } : type === "ellipse" ? { type: 2 } : null),
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: opts.boundElements ?? null,
    updated: now(),
    link: null,
    locked: false,
    ...opts.extra,
  };
}

export function textEl(id, x, y, w, h, content, opts = {}) {
  return {
    id,
    type: "text",
    x,
    y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: opts.stroke ?? C.onLight,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    roughness: opts.roughness ?? 0,
    opacity: 100,
    groupIds: [],
    roundness: null,
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    text: content,
    originalText: content,
    fontSize: opts.fontSize ?? 16,
    fontFamily: opts.fontFamily ?? 3,
    textAlign: opts.align ?? "left",
    verticalAlign: opts.verticalAlign ?? "middle",
    containerId: opts.containerId ?? null,
    lineHeight: opts.lineHeight ?? 1.25,
  };
}

function lineH(fs, lines = 1) {
  return Math.ceil(fs * 1.25 * lines + 4);
}

export function floatLabel(x, y, w, content, opts = {}) {
  const fs = opts.fontSize ?? 14;
  const h = lineH(fs, 1);
  return textEl(nid("lbl"), x, y, w, h, content, {
    fontSize: fs,
    stroke: opts.stroke ?? C.body,
    align: opts.align ?? "left",
    verticalAlign: "top",
    ...opts,
  });
}

export function narrLine(x, y, w, content, opts = {}) {
  const fs = opts.fontSize ?? 13;
  const h = Math.ceil(fs * 1.2 + 4);
  return textEl(nid("nar"), x, y, w, h, content, {
    fontSize: fs,
    fontFamily: 1,
    roughness: 1,
    stroke: C.narrate,
    align: "left",
    verticalAlign: "top",
    lineHeight: 1.2,
  });
}

export function narrationBlock(x, y, w, text) {
  const fs = 13;
  const step = Math.ceil(fs * 1.2 + 4) + 2;
  const lines = String(text).split("\n").filter(Boolean);
  const els = [];
  let cy = y;
  for (const line of lines) {
    els.push(narrLine(x, cy, w, line));
    cy += step;
  }
  return els;
}

export function boxNode(id, x, y, w, h, caption, opts = {}) {
  registerAnchor(id, x, y, w, h);
  const textId = nid("nt");
  const el = base(id, "rectangle", x, y, w, h, {
    bg: opts.bg ?? C.primaryFill,
    stroke: opts.stroke ?? C.primaryStroke,
    boundElements: [{ type: "text", id: textId }],
  });
  const fs = opts.fontSize ?? 18;
  const th = lineH(fs, 1);
  const ty = y + Math.round((h - th) / 2);
  return [
    el,
    textEl(textId, x, ty, w, th, caption, {
      fontSize: fs,
      stroke: opts.textStroke ?? opts.stroke ?? C.onLight,
      align: "center",
      verticalAlign: "middle",
      containerId: id,
    }),
  ];
}

export function region(id, x, y, w, h, title, opts = {}) {
  registerAnchor(id, x, y, w, h);
  const els = [
    base(id, "rectangle", x, y, w, h, {
      bg: opts.bg ?? "#f8fafc",
      stroke: opts.stroke ?? C.subtitle,
      strokeWidth: 1,
    }),
  ];
  if (title) {
    els.push(
      floatLabel(x + 12, y + 10, w - 24, title, {
        fontSize: opts.titleSize ?? 18,
        stroke: opts.stroke ?? C.title,
        align: "left",
      }),
    );
  }
  return els;
}

export function arrowBetween(fromId, toId, opts = {}) {
  const f = anchors[fromId];
  const t = anchors[toId];
  const pad = opts.pad ?? 10;
  const start = port(f, opts.fromSide ?? "right", opts.fromAlong ?? 0.5, pad);
  const end = port(t, opts.toSide ?? "left", opts.toAlong ?? 0.5, pad);
  const obs = Object.entries(anchors)
    .filter(([k]) => k !== fromId && k !== toId)
    .map(([k, a]) => ({ id: k, x: a.x, y: a.y, w: a.w, h: a.h }))
    .filter((r) => {
      if (opts.fromSide === "bottom" && opts.toSide === "top") {
        return r.y >= f.y + f.h - 4;
      }
      return true;
    });
  const path = routeArrowAvoid(start, end, obs, { padding: opts.padding ?? 12 });
  const els = [
    arrowPolyline(path, { strokeMuted: opts.stroke ?? C.arrow, strokeWidth: 2, arrowRoughness: 0 }, opts),
  ];
  if (opts.label) {
    const seg = Math.floor((path.length - 1) / 2);
    const a = path[seg];
    const b = path[seg + 1];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    els.push(
      floatLabel(mx - 28, my - 22, 56, opts.label, {
        fontSize: 12,
        align: "center",
        stroke: C.body,
      }),
    );
  }
  return els;
}

export { arrowPolyline, port, anchors as anchorMap };
