#!/usr/bin/env node
/** 生成 library/assets/*.svg 与 snippets/*.json（漫画可爱复杂角标） */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { comicSnippets } from "./comic-snippets.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(root, "assets");
const snippetsDir = join(root, "snippets");
mkdirSync(assetsDir, { recursive: true });
mkdirSync(snippetsDir, { recursive: true });

const svgs = {
  "gear-puzzle": `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><ellipse cx="34" cy="38" rx="26" ry="26" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/><text x="24" y="42" font-size="14">◕‿◕</text><rect x="48" y="8" width="28" height="28" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><text x="54" y="28" font-size="16">⚙</text><rect x="58" y="52" width="22" height="22" rx="4" fill="#fce7f3" stroke="#db2777" stroke-width="2"/></svg>`,
  "chat-spark": `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="72" viewBox="0 0 96 72"><ellipse cx="20" cy="46" rx="18" ry="18" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/><ellipse cx="52" cy="24" rx="30" ry="20" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="42" y="28" font-size="14" fill="#1d4ed8">Hi~</text><polygon points="62,4 66,16 78,10 68,20 72,32" fill="#fef08a" stroke="#ca8a04"/></svg>`,
  "layer-stack": `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80"><rect x="0" y="0" width="76" height="26" rx="6" fill="#dbeafe" stroke="#2563eb"/><rect x="10" y="24" width="76" height="26" rx="6" fill="#e0e7ff" stroke="#4f46e5"/><rect x="20" y="48" width="76" height="26" rx="6" fill="#fce7f3" stroke="#db2777"/></svg>`,
  "folder-tree": `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88"><rect x="0" y="12" width="72" height="58" rx="4" fill="#fef9c3" stroke="#ca8a04"/><rect x="4" y="8" width="28" height="14" fill="#fde047" stroke="#ca8a04"/><circle cx="14" cy="28" r="4" fill="#93c5fd"/><circle cx="14" cy="40" r="4" fill="#a5b4fc"/><circle cx="14" cy="52" r="4" fill="#f9a8d4"/></svg>`,
  "loop-arrow": `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="72" viewBox="0 0 88 72"><ellipse cx="44" cy="32" rx="28" ry="28" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="32" y="36" font-size="12" fill="#166534">Run</text><text x="8" y="64" font-size="12" fill="#166534">loop~</text></svg>`,
  magnifier: `<svg xmlns="http://www.w3.org/2000/svg" width="92" height="80" viewBox="0 0 92 80"><ellipse cx="22" cy="40" rx="18" ry="18" fill="#ffedd5" stroke="#ea580c"/><circle cx="60" cy="28" r="22" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/><line x1="72" y1="52" x2="86" y2="66" stroke="#0284c7" stroke-width="4"/></svg>`,
  "globe-search": `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88"><circle cx="28" cy="28" r="24" fill="#e0f2fe" stroke="#0284c7"/><circle cx="60" cy="60" r="16" fill="#fff" stroke="#2563eb"/><line x1="72" y1="72" x2="82" y2="82" stroke="#2563eb" stroke-width="3"/></svg>`,
  "doc-pull": `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="72" viewBox="0 0 80 72"><ellipse cx="16" cy="40" rx="16" ry="16" fill="#fce7f3" stroke="#db2777"/><rect x="28" y="8" width="36" height="48" rx="4" fill="#fff" stroke="#16a34a"/><polygon points="58,28 68,36 58,44" fill="#bbf7d0" stroke="#16a34a"/></svg>`,
  handshake: `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="56" viewBox="0 0 88 56"><ellipse cx="14" cy="32" rx="14" ry="16" fill="#ffedd5" stroke="#ea580c"/><ellipse cx="66" cy="30" rx="14" ry="16" fill="#dbeafe" stroke="#2563eb"/><rect x="24" y="32" width="32" height="20" rx="8" fill="#fef9c3" stroke="#ca8a04"/></svg>`,
  "laptop-ide": `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="80" viewBox="0 0 96 80"><rect x="0" y="24" width="80" height="44" rx="4" fill="#cbd5e1" stroke="#475569"/><ellipse cx="40" cy="18" rx="22" ry="18" fill="#ffedd5" stroke="#ea580c"/><text x="28" y="22" font-size="12">=^.^=</text><rect x="-4" y="66" width="88" height="10" fill="#94a3b8"/></svg>`,
};

for (const [name, svg] of Object.entries(svgs)) {
  writeFileSync(join(assetsDir, `${name}.svg`), svg, "utf8");
  console.log("svg", name);
}

for (const [name, fn] of Object.entries(comicSnippets)) {
  const els = fn().map((el, i) => ({ ...el, id: `${name}-${i}` }));
  writeFileSync(join(snippetsDir, `${name}.json`), JSON.stringify(els, null, 2), "utf8");
  console.log("snippet", name, `(${els.length} elements)`);
}

console.log("library assets built (comic style)");
