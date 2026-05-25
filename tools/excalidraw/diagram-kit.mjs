/**
 * Excalidraw diagram builders with selectable style presets.
 * Use setStyle('sketch' | 'flat' | 'comic') before generating.
 */
import { routeArrowAvoid, rectsFromAnchors } from "./layout-geometry.mjs";
import { arrowPolyline, labelOnPath, port } from "./arrow-router.mjs";

let seed = 1;
const now = () => Date.now();

export function resetSeed(n = 1) {
  seed = n;
}

export function nid(prefix = "el") {
  return `${prefix}-${seed++}`;
}

/** @type {Record<string, { x: number; y: number; w: number; h: number; cx: number; cy: number }>} */
export const anchors = {};

export function registerAnchor(id, x, y, w, h) {
  anchors[id] = { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

const palette = {
  stroke: "#334155",
  strokeMuted: "#64748b",
  fillBlue: "#dbeafe",
  fillGreen: "#dcfce7",
  fillOrange: "#ffedd5",
  fillPink: "#fce7f3",
  fillPurple: "#f3e8ff",
  fillYellow: "#fef9c3",
  fillGray: "#f8fafc",
};

/** Excalidraw 字体：1 = Virgil 手绘，5 = Excalifont 规范 */
export const FONT_HAND = 1;
export const FONT_UI = 5;

/** 默认：方框略手绘；字号用规范体，讲述旁白另用 narration() */
export const SKETCH = {
  id: "sketch",
  label: "温和手绘",
  roughness: 1,
  arrowRoughness: 1,
  textRoughness: 0,
  narrationRoughness: 3,
  strokeWidth: 2,
  fontFamily: FONT_UI,
  narrationFont: FONT_HAND,
  fontSize: 22,
  labelSize: 16,
  noteSize: 14,
  narrationSize: 13,
  narrationColor: "#a16207",
  fillStyle: "solid",
  bg: "#fffef8",
  nodeShape: "rectangle",
  ...palette,
};

/** 扁平海报（偏 PPT，几乎无笔触） */
export const FLAT = {
  id: "flat",
  label: "扁平海报",
  roughness: 0,
  arrowRoughness: 0,
  textRoughness: 0,
  narrationRoughness: 1,
  strokeWidth: 2,
  fontFamily: FONT_UI,
  narrationFont: FONT_HAND,
  fontSize: 22,
  labelSize: 16,
  noteSize: 14,
  fillStyle: "solid",
  bg: "#ffffff",
  nodeShape: "rectangle",
  ...palette,
};

/** 漫画脏手绘（不推荐：hachure + 高 roughness，易显乱） */
export const COMIC = {
  id: "comic",
  label: "漫画脏手绘",
  roughness: 3,
  arrowRoughness: 2,
  textRoughness: 2,
  strokeWidth: 2,
  fontFamily: 1,
  fontSize: 20,
  labelSize: 15,
  noteSize: 14,
  fillStyle: "hachure",
  bg: "#fffef8",
  nodeShape: "ellipse",
  ...palette,
};

export const STYLES = { sketch: SKETCH, flat: FLAT, comic: COMIC };

/** Active preset (default sketch). */
export let S = SKETCH;

export function setStyle(name) {
  const key = String(name ?? "sketch").toLowerCase();
  S = STYLES[key] ?? SKETCH;
  return S;
}

export function appState(extra = {}) {
  return {
    viewBackgroundColor: S.bg,
    currentItemRoughness: S.roughness,
    currentItemFontFamily: S.fontFamily,
    currentItemStrokeWidth: S.strokeWidth,
    gridSize: null,
    ...extra,
  };
}

export function scene(elements, extraApp = {}) {
  return {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements,
    appState: appState(extraApp),
    files: {},
  };
}

function base(id, type, x, y, w, h, opts = {}) {
  const s = S;
  return {
    id,
    type,
    x,
    y,
    width: w,
    height: h,
    angle: opts.angle ?? 0,
    strokeColor: opts.stroke ?? s.stroke,
    backgroundColor: opts.bg ?? "transparent",
    fillStyle: opts.fillStyle ?? s.fillStyle,
    strokeWidth: opts.strokeWidth ?? s.strokeWidth,
    roughness: opts.roughness ?? s.roughness,
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

/** 单行/多行文字外框高度 */
export function textHeight(fs, lines = 1, lineHeight = 1.35) {
  return Math.ceil(fs * lineHeight * lines + 4);
}

/** 窄框内自动换行后的视觉行数（中英混排粗算） */
export function estimateWrappedLines(text, width, fs) {
  const units = (ch) => (/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/.test(ch) ? 1 : 0.58);
  let total = 0;
  for (const para of String(text).split("\n")) {
    let lineW = 0;
    let visual = 1;
    for (const ch of para) {
      lineW += units(ch) * fs;
      if (lineW > width - 4) {
        visual++;
        lineW = units(ch) * fs;
      }
    }
    total += Math.max(1, visual);
  }
  return total;
}

/** 单行讲述字外框高度 */
export function narrationLineBoxHeight(fs, lineHeight = 1.2) {
  return Math.ceil(fs * lineHeight + 4);
}

/** 多行同元素：按换行 + 自动换行估算总高 */
export function narrationTextHeight(fs, text, width, lineHeight = 1.5) {
  const lines = estimateWrappedLines(text, width, fs);
  return Math.ceil(fs * lineHeight * lines + 14 + lines * 8);
}

/** 讲述旁白相邻两行之间的步进（单行框高 + 约 2px 间隙） */
export function narrationLineStep(fs) {
  return narrationLineBoxHeight(fs) + 2;
}

/**
 * 讲述旁白：按 \\n 拆成多个独立 text，避免同框多行在导出时叠字。
 */
export function narrationBlock(x, y, w, text, opts = {}) {
  const fs = opts.fontSize ?? S.narrationSize ?? 13;
  const step = opts.lineStep ?? narrationLineStep(fs);
  const lineH = narrationLineBoxHeight(fs, 1.35);
  const els = [];
  let cy = y;
  for (const line of String(text).split("\n")) {
    if (!line) continue;
    els.push(
      narration(nid("nar"), x, cy, w, line, {
        ...opts,
        height: lineH,
        lineHeight: 1.25,
      }),
    );
    cy += step;
  }
  return els;
}

/** PNG 导出时字形略偏上：框内顶对齐时向下偏移（约 0.14×字号） */
export const TEXT_OPTICAL_DOWN = (fs) => Math.round(fs * 0.14);

/** 框内顶对齐的 y（勿用 verticalAlign middle，导出更稳） */
export function textYInBox(boxY, boxH, fs, lines = 1, lineHeight = 1.25) {
  const th = textHeight(fs, lines, lineHeight);
  return boxY + Math.round((boxH - th) * 0.52 + TEXT_OPTICAL_DOWN(fs));
}

export function label(id, x, y, w, text, opts = {}) {
  const s = S;
  const fs = opts.fontSize ?? s.labelSize;
  const lines = String(text).split("\n").length;
  const lh = opts.lineHeight ?? 1.35;
  const h = opts.height ?? textHeight(fs, lines, lh);
  const align = opts.align ?? "left";
  const vAlign = opts.verticalAlign ?? "top";
  const yPos =
    vAlign === "top" && !opts.skipOpticalY ? y + TEXT_OPTICAL_DOWN(fs) : y;
  return {
    id,
    type: "text",
    x,
    y: yPos,
    width: w,
    height: h,
    angle: opts.angle ?? 0,
    strokeColor: opts.stroke ?? s.stroke,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    roughness: opts.roughness ?? s.textRoughness,
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
    text,
    fontSize: fs,
    fontFamily: opts.fontFamily ?? s.fontFamily,
    textAlign: align,
    verticalAlign: vAlign,
    containerId: opts.containerId ?? null,
    originalText: text,
    lineHeight: lh,
  };
}

/**
 * 讲述者旁白（讲义正文不写、现场口头展开的内容），手绘 Virgil。
 * 与节点名、箭头标注等规范字（label / node）区分。
 */
export function narration(id, x, y, w, text, opts = {}) {
  const s = S;
  const fs = opts.fontSize ?? s.narrationSize ?? 13;
  const lh = opts.lineHeight ?? 1.35;
  const h = opts.height ?? narrationTextHeight(fs, text, w, lh);
  return label(id, x, y, w, text, {
    fontSize: fs,
    fontFamily: opts.fontFamily ?? s.narrationFont ?? FONT_HAND,
    roughness: opts.roughness ?? s.narrationRoughness ?? 3,
    stroke: opts.stroke ?? s.narrationColor ?? "#a16207",
    align: opts.align ?? "left",
    verticalAlign: "top",
    height: h,
    lineHeight: lh,
    skipOpticalY: true,
  });
}

export function panel(id, x, y, w, h, title, opts = {}) {
  registerAnchor(id, x, y, w, h);
  const els = [
    base(id, "rectangle", x, y, w, h, {
      bg: opts.bg ?? S.fillGray,
      stroke: opts.stroke ?? S.strokeMuted,
      strokeWidth: opts.strokeWidth ?? 2,
    }),
  ];
  if (title) {
    els.push(
      label(nid("pt"), x, textYInBox(y, Math.min(36, h), opts.titleSize ?? 20), w, title, {
        fontSize: opts.titleSize ?? 20,
        align: "center",
        verticalAlign: "top",
        height: textHeight(opts.titleSize ?? 20, 1, 1.25),
        stroke: opts.stroke ?? S.stroke,
        skipOpticalY: true,
      }),
    );
  }
  return els;
}

export function node(id, x, y, w, h, caption, opts = {}) {
  registerAnchor(id, x, y, w, h);
  const textId = nid("nt");
  const shape = opts.shape ?? S.nodeShape ?? "rectangle";
  const el = base(id, shape, x, y, w, h, {
    bg: opts.bg ?? S.fillBlue,
    stroke: opts.stroke ?? "#2563eb",
    boundElements: [{ type: "text", id: textId }],
    ...opts,
  });
  const fs = opts.fontSize ?? S.fontSize;
  const th = textHeight(fs, 1, 1.25);
  const yText = textYInBox(y, h, fs);
  return [
    el,
    label(textId, x, yText, w, caption, {
      align: "center",
      verticalAlign: "top",
      fontSize: fs,
      height: th,
      containerId: id,
      stroke: opts.stroke ?? "#2563eb",
      skipOpticalY: true,
    }),
  ];
}

/** Note block placed to the right of a registered anchor (no overlap with node). */
export function noteRight(anchorId, text, opts = {}) {
  const a = anchors[anchorId];
  if (!a) throw new Error(`unknown anchor: ${anchorId}`);
  const gap = opts.gap ?? 16;
  const w = opts.width ?? 200;
  return label(nid("note"), a.x + a.w + gap, a.y + (opts.dy ?? 8), w, text, {
    fontSize: opts.fontSize ?? S.noteSize,
    stroke: opts.stroke ?? S.strokeMuted,
  });
}

/** Note block below anchor (centered, clear of border). */
export function noteBelow(anchorId, text, opts = {}) {
  const a = anchors[anchorId];
  const gap = opts.gap ?? 20;
  const w = opts.width ?? Math.max(a.w, 80);
  const x = a.x + (a.w - w) / 2;
  const fs = opts.fontSize ?? S.noteSize;
  const th = textHeight(fs, 1);
  const boxY = a.y + a.h + gap;
  return label(nid("note"), x, textYInBox(boxY, th + 4, fs), w, text, {
    fontSize: fs,
    align: "center",
    verticalAlign: "top",
    height: th,
    stroke: opts.stroke ?? S.strokeMuted,
    skipOpticalY: true,
  });
}

export function arrowDelta(id, x, y, dw, dh, opts = {}) {
  return {
    id,
    type: "arrow",
    x,
    y,
    width: dw,
    height: dh,
    angle: 0,
    strokeColor: opts.stroke ?? S.strokeMuted,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: opts.strokeWidth ?? S.strokeWidth,
    roughness: opts.roughness ?? S.arrowRoughness,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    points: [
      [0, 0],
      [dw, dh],
    ],
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
  };
}

/** Arrow between anchors; orthogonal path avoids crossing other boxes. */
export function arrowBetween(fromId, toId, opts = {}) {
  const f = anchors[fromId];
  const t = anchors[toId];
  if (!f || !t) throw new Error(`arrowBetween: missing anchor ${fromId} or ${toId}`);
  const pad = opts.pad ?? 8;
  const start = port(f, opts.fromSide ?? "right", opts.fromAlong ?? 0.5, pad);
  const end = port(t, opts.toSide ?? "left", opts.toAlong ?? 0.5, pad);
  const path = routeArrowAvoid(start, end, rectsFromAnchors(anchors, [fromId, toId]), {
    padding: opts.padding ?? 14,
  });
  const els = [arrowPolyline(path, S, opts)];
  if (opts.label) {
    els.push(
      labelOnPath(opts.label, path, S, {
        dy: opts.labelDy ?? -18,
        dx: opts.labelDx ?? 0,
        segment: opts.labelSegment,
      }),
    );
  }
  return els;
}

/** 任意两点间连线：先直连，重叠再加航点。 */
export function arrowRouteAbs(start, end, excludeIds = [], opts = {}) {
  const path = routeArrowAvoid(start, end, rectsFromAnchors(anchors, excludeIds), {
    padding: opts.padding ?? 14,
  });
  const els = [arrowPolyline(path, S, opts)];
  if (opts.label) {
    els.push(
      labelOnPath(opts.label, path, S, {
        dy: opts.labelDy ?? -18,
        dx: opts.labelDx ?? 0,
        segment: opts.labelSegment,
      }),
    );
  }
  return els;
}

// --- Bold corner illustrations ---

export function doodleBook(x, y, scale = 1) {
  const s = scale;
  const els = [
    base(nid("bk"), "rectangle", x, y, 72 * s, 92 * s, {
      bg: "#fef3c7",
      stroke: "#d97706",
      strokeWidth: 3,
    }),
    label(nid("bk-t"), x + 6 * s, y + 28 * s, 60 * s, "Skill\n笔记", {
      fontSize: 14 * s,
      align: "center",
      stroke: "#b45309",
    }),
  ];
  for (const dy of [18, 32, 46]) {
    els.push({
      id: nid("bl"),
      type: "line",
      x: x + 14 * s,
      y: y + dy * s,
      width: 44 * s,
      height: 0,
      angle: 0,
      strokeColor: "#d97706",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: S.arrowRoughness,
      opacity: 100,
      groupIds: [],
      roundness: { type: 2 },
      seed: seed++,
      version: 1,
      versionNonce: seed++,
      isDeleted: false,
      boundElements: null,
      updated: now(),
      link: null,
      locked: false,
      points: [
        [0, 0],
        [44 * s, 0],
      ],
      lastCommittedPoint: [44 * s, 0],
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: null,
    });
  }
  return els;
}

export function doodleBolt(x, y, scale = 1) {
  const s = scale;
  const pts = [
    [0, 0],
    [18 * s, 0],
    [8 * s, 28 * s],
    [32 * s, 28 * s],
    [4 * s, 72 * s],
    [14 * s, 40 * s],
    [0, 40 * s],
  ];
  const xs = pts.map((p) => x + p[0]);
  const ys = pts.map((p) => y + p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const rel = pts.map((p) => [p[0] + x - minX, p[1] + y - minY]);
  return {
    id: nid("bolt"),
    type: "line",
    x: minX,
    y: minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
    angle: 0,
    strokeColor: "#f59e0b",
    backgroundColor: "#fef08a",
    fillStyle: "solid",
    strokeWidth: 4,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    points: rel,
    lastCommittedPoint: rel[rel.length - 1],
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: null,
  };
}

export function doodleStar(x, y, r = 28, opts = {}) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    pts.push([x + Math.cos(a) * rad, y + Math.sin(a) * rad]);
  }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const rel = pts.map((p) => [p[0] - minX, p[1] - minY]);
  return {
    id: nid("star"),
    type: "line",
    x: minX,
    y: minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
    angle: 0,
    strokeColor: opts.stroke ?? "#ec4899",
    backgroundColor: opts.fill ?? "#fce7f3",
    fillStyle: "solid",
    strokeWidth: 3,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    points: rel,
    lastCommittedPoint: rel[rel.length - 1],
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: null,
  };
}

export function doodleRocket(x, y) {
  return [
    ...ellipse(nid("rk"), x + 20, y, 50, 70, "", {
      bg: "#fecdd3",
      stroke: "#e11d48",
      fillStyle: "solid",
    }),
    triangleFlame(x + 35, y + 68),
    label(nid("rk-t"), x, y + 95, 90, "冲！", {
      fontSize: 18,
      align: "center",
      stroke: "#e11d48",
    }),
  ];
}

function triangleFlame(x, y) {
  const pts = [
    [0, 0],
    [20, 0],
    [10, 28],
    [0, 0],
  ];
  return {
    id: nid("fl"),
    type: "line",
    x,
    y,
    width: 20,
    height: 28,
    angle: 0,
    strokeColor: "#f97316",
    backgroundColor: "#fdba74",
    fillStyle: "solid",
    strokeWidth: 3,
    roughness: 1,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: seed++,
    version: 1,
    versionNonce: seed++,
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    points: pts,
    lastCommittedPoint: pts[2],
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: null,
  };
}

export function doodleMagnifier(x, y) {
  return [
    ...ellipse(nid("mg"), x, y, 55, 55, "", {
      bg: "#e0f2fe",
      stroke: "#0284c7",
      fillStyle: "solid",
      strokeWidth: 3,
    }),
    {
      id: nid("mgh"),
      type: "line",
      x: x + 42,
      y: y + 42,
      width: 36,
      height: 36,
      angle: 0,
      strokeColor: "#0284c7",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 5,
      roughness: 0,
      opacity: 100,
      groupIds: [],
      roundness: { type: 2 },
      seed: seed++,
      version: 1,
      versionNonce: seed++,
      isDeleted: false,
      boundElements: null,
      updated: now(),
      link: null,
      locked: false,
      points: [
        [0, 0],
        [36, 36],
      ],
      lastCommittedPoint: [36, 36],
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: null,
    },
  ];
}

function ellipse(id, x, y, w, h, caption, opts = {}) {
  const textId = caption ? nid("et") : null;
  const el = base(id, "ellipse", x, y, w, h, {
    bg: opts.bg ?? "transparent",
    stroke: opts.stroke ?? S.stroke,
    boundElements: caption ? [{ type: "text", id: textId }] : null,
    ...opts,
  });
  if (!caption) return [el];
  const fs = opts.fontSize ?? S.fontSize;
  return [
    el,
    label(textId, x, textYInBox(y, h, fs), w, caption, {
      align: "center",
      verticalAlign: "top",
      fontSize: fs,
      height: textHeight(fs, 1, 1.25),
      containerId: id,
      stroke: opts.stroke ?? S.stroke,
      skipOpticalY: true,
    }),
  ];
}

export function clearAnchors() {
  for (const k of Object.keys(anchors)) delete anchors[k];
}
