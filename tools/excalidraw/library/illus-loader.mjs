/**
 * Load illustrations from manifest.json — one asset per diagram (no duplicate usedBy).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { nid } from "../diagram-kit.mjs";

const libRoot = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(libRoot, "manifest.json"), "utf8"));

export function listAssets() {
  return manifest.assets;
}

export function findByTag(tag) {
  return manifest.assets.filter((a) => a.tags.includes(tag));
}

export function findByDiagram(diagramName) {
  return manifest.assets.filter((a) => a.usedBy === diagramName);
}

/** Validate: each usedBy at most once per id, each diagram gets its assigned assets. */
export function validateManifest() {
  const issues = [];
  const used = new Map();
  for (const a of manifest.assets) {
    if (!used.has(a.usedBy)) used.set(a.usedBy, []);
    used.get(a.usedBy).push(a.id);
  }
  for (const [diagram, ids] of used) {
    if (ids.length > 2) {
      issues.push(`${diagram}: 插图超过 2 个 (${ids.length})`);
    }
  }
  const ids = manifest.assets.map((a) => a.id);
  if (new Set(ids).size !== ids.length) issues.push("重复 id");
  return issues;
}

function hydrateSnippet(raw, placement) {
  const { x, y, scale = 1 } = placement;
  const now = Date.now();
  return raw.map((el) => {
    const copy = { ...el, id: nid("illus") };
    copy.x = (el.x ?? 0) * scale + x;
    copy.y = (el.y ?? 0) * scale + y;
    if (el.width) copy.width = el.width * scale;
    if (el.height) copy.height = el.height * scale;
    copy.updated = now;
    copy.seed = Math.floor(Math.random() * 1e9);
    copy.version = 1;
    copy.versionNonce = Math.floor(Math.random() * 1e9);
    if (el.points) {
      copy.points = el.points.map((p) => [p[0] * scale, p[1] * scale]);
      if (el.type === "arrow") {
        const last = copy.points[copy.points.length - 1];
        copy.width = last[0];
        copy.height = last[1];
      }
    }
    if (el.fontFamily == null) copy.fontFamily = 1;
    if (el.roughness == null && el.type !== "text") copy.roughness = 1;
    if (el.type === "text" && el.roughness == null) copy.roughness = 1;
    if (el.fillStyle == null && ["rectangle", "ellipse", "diamond"].includes(el.type)) {
      copy.fillStyle = "solid";
    }
    return copy;
  });
}

/** Illustration elements for a diagram (from manifest usedBy). */
export function illustrationsFor(diagramName) {
  const items = findByDiagram(diagramName);
  const out = [];
  for (const item of items) {
    const raw = JSON.parse(readFileSync(join(libRoot, item.snippet), "utf8"));
    out.push(...hydrateSnippet(raw, item.placement));
  }
  return out;
}
