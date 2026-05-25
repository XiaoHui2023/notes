#!/usr/bin/env node
/**
 * Export .excalidraw → PNG (Playwright + browser export harness).
 * Usage: node export-png.mjs <diagrams-dir> <assets-dir> [basename ...]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, basename, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const harnessUrl = pathToFileURL(resolve(__dirname, "export-harness.html")).href;

const diagramsDir = resolve(process.argv[2] ?? "diagrams");
const assetsDir = resolve(process.argv[3] ?? "assets");
const only = process.argv.slice(4);

function listNames() {
  if (only.length) return only.map((n) => n.replace(/\.excalidraw$/, ""));
  return readdirSync(diagramsDir)
    .filter((f) => f.endsWith(".excalidraw"))
    .map((f) => basename(f, ".excalidraw"));
}

async function launchBrowser() {
  for (const channel of ["msedge", "chrome", "chromium"]) {
    try {
      return await chromium.launch(channel === "chromium" ? {} : { channel });
    } catch {
      /* try next */
    }
  }
  throw new Error("No Chromium-based browser for Playwright. Run: npx playwright install chromium");
}

const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto(harnessUrl, { waitUntil: "load", timeout: 120000 });
await page.waitForFunction(() => typeof window.exportSceneToPngBase64 === "function", {
  timeout: 120000,
});

for (const name of listNames()) {
  const raw = readFileSync(`${diagramsDir}/${name}.excalidraw`, "utf8");
  const scene = JSON.parse(raw);
  const b64 = await page.evaluate(async (s) => window.exportSceneToPngBase64(s), scene);
  const out = `${assetsDir}/${name}.png`;
  writeFileSync(out, Buffer.from(b64, "base64"));
  console.log(`exported ${out}`);
}

await browser.close();
