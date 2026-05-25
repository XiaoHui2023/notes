#!/usr/bin/env node
import { validateManifest } from "./library/illus-loader.mjs";

const issues = validateManifest();
if (issues.length === 0) {
  console.log("manifest OK");
} else {
  for (const m of issues) console.error(m);
  process.exit(1);
}
