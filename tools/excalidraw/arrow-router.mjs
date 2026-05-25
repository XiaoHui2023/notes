/**
 * Polyline arrows and path labels (no diagram-kit import — avoids cycles).
 */
import { nid } from "./diagram-kit.mjs";

const now = () => Date.now();

export function port(anchor, side, along = 0.5, pad = 8) {
  const { x, y, w, h } = anchor;
  switch (side) {
    case "right":
      return { x: x + w + pad, y: y + h * along };
    case "left":
      return { x: x - pad, y: y + h * along };
    case "top":
      return { x: x + w * along, y: y - pad };
    case "bottom":
      return { x: x + w * along, y: y + h + pad };
    default:
      return { x: x + w / 2, y: y + h / 2 };
  }
}

export function arrowPolyline(absPoints, style, opts = {}) {
  if (absPoints.length < 2) throw new Error("arrowPolyline needs ≥2 points");
  const x0 = absPoints[0].x;
  const y0 = absPoints[0].y;
  const rel = absPoints.map((p) => [p.x - x0, p.y - y0]);
  const last = rel[rel.length - 1];
  return {
    id: opts.id ?? nid("ar"),
    type: "arrow",
    x: x0,
    y: y0,
    width: last[0],
    height: last[1],
    angle: 0,
    strokeColor: opts.stroke ?? style.strokeMuted,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: opts.strokeWidth ?? style.strokeWidth,
    roughness: opts.roughness ?? style.arrowRoughness,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 1e9),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e9),
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    points: rel,
    lastCommittedPoint: last,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
  };
}

export function labelOnPath(text, absPoints, style, opts = {}) {
  const seg = opts.segment ?? Math.floor((absPoints.length - 1) / 2);
  const a = absPoints[seg];
  const b = absPoints[seg + 1];
  const mx = (a.x + b.x) / 2 + (opts.dx ?? 0);
  const my = (a.y + b.y) / 2 + (opts.dy ?? 0);
  const w = opts.width ?? 100;
  const fs = opts.fontSize ?? 13;
  const h = Math.ceil(fs * 1.35) + 4;
  return {
    id: nid("al"),
    type: "text",
    x: mx - w / 2,
    y: my - h / 2 + Math.round(fs * 0.12),
    width: w,
    height: h,
    angle: 0,
    strokeColor: opts.stroke ?? style.strokeMuted,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    roughness: style.textRoughness,
    opacity: 100,
    groupIds: [],
    roundness: null,
    seed: Math.floor(Math.random() * 1e9),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e9),
    isDeleted: false,
    boundElements: null,
    updated: now(),
    link: null,
    locked: false,
    text,
    fontSize: fs,
    fontFamily: opts.fontFamily ?? style.fontFamily,
    textAlign: "center",
    verticalAlign: "top",
    containerId: null,
    originalText: text,
    lineHeight: 1.35,
  };
}
