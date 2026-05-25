#!/usr/bin/env node
/**
 * Export instruction PNGs via coleam skill renderer (Python) or fallback Node exporter.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dir, "../..");
const diagramsDir = resolve(process.argv[2] ?? `${repoRoot}/src/ai/instruction/diagrams`);
const assetsDir = resolve(process.argv[3] ?? `${repoRoot}/src/ai/instruction/assets`);
const skillRender = resolve(
  repoRoot,
  ".cursor/skills/excalidraw-diagram/references/render_excalidraw.py",
);

const names = readdirSync(diagramsDir)
  .filter((f) => f.endsWith(".excalidraw"))
  .map((f) => f.replace(/\.excalidraw$/, ""));

function trySkillRender(name) {
  const input = `${diagramsDir}/${name}.excalidraw`;
  const output = `${assetsDir}/${name}.png`;
  const r = spawnSync(
    "uv",
    ["run", "python", skillRender, input, "--output", output, "--scale", "2"],
    {
      cwd: resolve(repoRoot, ".cursor/skills/excalidraw-diagram/references"),
      encoding: "utf8",
      timeout: 120000,
    },
  );
  if (r.status === 0) {
    console.log(`exported ${output} (coleam renderer)`);
    return true;
  }
  return false;
}

let usedFallback = false;
for (const name of names) {
  if (!trySkillRender(name)) {
    usedFallback = true;
    break;
  }
}

if (usedFallback) {
  console.warn("coleam renderer unavailable — falling back to export-png.mjs");
  const r = spawnSync("node", ["export-png.mjs", diagramsDir, assetsDir], {
    cwd: __dir,
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
}
