/**
 * 漫画可爱风角标：多元素组合（椭圆脸、腮红、四肢、道具），solid + roughness 1。
 */

function R(x, y, w, h, bg, stroke, rough = 1) {
  return {
    type: "rectangle",
    x,
    y,
    width: w,
    height: h,
    roughness: rough,
    roundness: { type: 3 },
    strokeColor: stroke,
    backgroundColor: bg,
    fillStyle: "solid",
    strokeWidth: 2,
    opacity: 100,
    angle: 0,
  };
}

function E(x, y, w, h, bg, stroke, rough = 1) {
  return {
    type: "ellipse",
    x,
    y,
    width: w,
    height: h,
    roughness: rough,
    strokeColor: stroke,
    backgroundColor: bg,
    fillStyle: "solid",
    strokeWidth: 2,
    opacity: 100,
    angle: 0,
  };
}

function T(x, y, w, text, size = 14, color = "#334155") {
  const h = Math.ceil(size * 1.35) + 4;
  return {
    type: "text",
    x,
    y,
    width: w,
    height: h,
    text,
    fontSize: size,
    fontFamily: 1,
    strokeColor: color,
    roughness: 1,
    textAlign: "center",
    verticalAlign: "middle",
  };
}

function L(x1, y1, x2, y2, stroke, w = 2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return {
    type: "arrow",
    x: x1,
    y: y1,
    width: dx,
    height: dy,
    points: [
      [0, 0],
      [dx, dy],
    ],
    strokeColor: stroke,
    roughness: 1,
    strokeWidth: w,
    startArrowhead: null,
    endArrowhead: null,
  };
}

/** 齿轮机器人：机制拼装 */
export function gearPuzzle() {
  return [
    E(8, 12, 52, 52, "#e0e7ff", "#4f46e5"),
    E(18, 22, 32, 32, "#fff", "#6366f1"),
    T(24, 32, 20, "◕‿◕", 12, "#4f46e5"),
    E(12, 48, 8, 8, "#fecaca", "#f87171"),
    E(44, 48, 8, 8, "#fecaca", "#f87171"),
    R(48, 8, 28, 28, "#fef3c7", "#d97706"),
    T(52, 16, 20, "⚙", 16, "#b45309"),
    R(58, 52, 22, 22, "#fce7f3", "#db2777"),
    T(60, 58, 18, "🧩", 14, "#be185d"),
    L(36, 64, 48, 72, "#4f46e5"),
    L(44, 64, 52, 72, "#4f46e5"),
    E(28, 66, 14, 10, "#c7d2fe", "#4f46e5"),
    E(40, 66, 14, 10, "#c7d2fe", "#4f46e5"),
  ];
}

/** 对话气泡 + Q 版小人 */
export function chatSpark() {
  return [
    E(2, 28, 36, 36, "#ffedd5", "#ea580c"),
    T(10, 38, 20, "★", 14, "#ea580c"),
    E(8, 48, 6, 6, "#fecaca", "#f87171"),
    E(26, 48, 6, 6, "#fecaca", "#f87171"),
    E(36, 4, 58, 38, "#dbeafe", "#2563eb"),
    T(48, 16, 36, "Hi~", 16, "#1d4ed8"),
    R(52, 38, 16, 12, "#dbeafe", "#2563eb"),
    E(62, 2, 20, 20, "#fef08a", "#ca8a04"),
    T(66, 8, 12, "✦", 14, "#a16207"),
    E(78, 18, 14, 14, "#fef08a", "#ca8a04"),
    T(80, 22, 10, "✧", 12, "#a16207"),
  ];
}

/** 三层叠放 + 小表情 */
export function layerStack() {
  return [
    R(0, 0, 76, 26, "#dbeafe", "#2563eb"),
    T(8, 6, 60, "全局 ~", 13, "#1d4ed8"),
    E(62, 4, 12, 12, "#fff", "#2563eb"),
    T(64, 6, 8, "◠", 10, "#2563eb"),
    R(10, 24, 76, 26, "#e0e7ff", "#4f46e5"),
    T(18, 30, 60, "项目", 13, "#4338ca"),
    E(72, 28, 12, 12, "#fff", "#4f46e5"),
    T(74, 30, 8, "◡", 10, "#4338ca"),
    R(20, 48, 76, 26, "#fce7f3", "#db2777"),
    T(28, 54, 60, "小仓库", 13, "#be185d"),
    E(82, 52, 12, 12, "#fff", "#db2777"),
    T(84, 54, 8, "◕", 10, "#be185d"),
  ];
}

/** 文件夹 + 可爱树状线 */
export function folderTree() {
  return [
    R(0, 8, 72, 58, "#fef9c3", "#ca8a04"),
    R(4, 4, 28, 14, "#fde047", "#ca8a04"),
    E(52, 6, 22, 22, "#fff", "#ca8a04"),
    T(56, 12, 14, "📁", 14, "#a16207"),
    L(16, 28, 16, 40, "#78716c"),
    L(16, 40, 36, 40, "#78716c"),
    L(16, 40, 16, 52, "#78716c"),
    L(16, 52, 48, 52, "#78716c"),
    E(10, 24, 8, 8, "#93c5fd", "#2563eb"),
    E(10, 36, 8, 8, "#a5b4fc", "#4f46e5"),
    E(10, 48, 8, 8, "#f9a8d4", "#db2777"),
    E(44, 48, 8, 8, "#86efac", "#16a34a"),
    E(58, 58, 18, 18, "#ffedd5", "#ea580c"),
    T(60, 62, 14, "◠ω◠", 10, "#c2410c"),
  ];
}

/** 环形跑道 + 跑步小人（无装饰箭头） */
export function loopArrow() {
  return [
    E(20, 8, 50, 50, "#dcfce7", "#16a34a"),
    E(30, 18, 30, 30, "#fff", "#22c55e"),
    T(36, 28, 18, "Run", 11, "#15803d"),
    E(26, 38, 6, 6, "#fecaca", "#f87171"),
    E(48, 38, 6, 6, "#fecaca", "#f87171"),
    E(8, 44, 16, 16, "#bbf7d0", "#16a34a"),
    E(62, 20, 14, 14, "#bbf7d0", "#16a34a"),
    E(62, 48, 14, 14, "#bbf7d0", "#16a34a"),
    T(4, 58, 40, "loop~", 12, "#166534"),
    L(38, 48, 32, 56, "#16a34a"),
    L(46, 48, 54, 56, "#16a34a"),
  ];
}

/** 侦探 Q 版 + 放大镜 */
export function magnifier() {
  return [
    E(4, 20, 38, 38, "#ffedd5", "#ea580c"),
    T(12, 32, 22, "◕‿◕", 12, "#c2410c"),
    E(8, 48, 6, 6, "#fecaca", "#f87171"),
    E(30, 48, 6, 6, "#fecaca", "#f87171"),
    E(44, 4, 40, 40, "#e0f2fe", "#0284c7"),
    E(52, 12, 24, 24, "#f0f9ff", "#38bdf8"),
    L(72, 52, 88, 68, "#0284c7", 4),
    E(78, 58, 12, 12, "#bae6fd", "#0284c7"),
    T(46, 52, 20, "🔍", 14, "#0369a1"),
  ];
}

/** 地球脸 + 搜索镜 */
export function globeSearch() {
  return [
    E(0, 4, 48, 48, "#e0f2fe", "#0284c7"),
    T(14, 22, 22, "🌏", 18, "#0369a1"),
    E(10, 32, 6, 6, "#fecaca", "#f87171"),
    E(30, 32, 6, 6, "#fecaca", "#f87171"),
    E(44, 44, 32, 32, "#fff", "#2563eb"),
    E(52, 52, 16, 16, "#dbeafe", "#2563eb"),
    L(68, 68, 78, 78, "#2563eb", 3),
    E(62, 2, 18, 18, "#fef08a", "#ca8a04"),
    T(66, 6, 10, "?", 14, "#a16207"),
  ];
}

/** 小怪兽拉文档 */
export function docPull() {
  return [
    E(0, 24, 32, 32, "#fce7f3", "#db2777"),
    T(6, 34, 20, "◕ω◕", 11, "#be185d"),
    R(28, 4, 36, 48, "#fff", "#16a34a"),
    R(32, 8, 28, 8, "#dcfce7", "#86efac"),
    R(32, 20, 24, 4, "#dcfce7", "#86efac"),
    R(32, 28, 20, 4, "#dcfce7", "#86efac"),
    E(58, 28, 18, 18, "#bbf7d0", "#16a34a"),
    T(60, 32, 14, "➜", 14, "#15803d"),
    L(20, 52, 28, 60, "#db2777"),
    L(28, 52, 36, 60, "#db2777"),
  ];
}

/** 两只 Q 版握手 */
export function handshake() {
  return [
    E(0, 16, 28, 32, "#ffedd5", "#ea580c"),
    T(6, 28, 16, "◠‿◠", 10, "#c2410c"),
    E(52, 14, 28, 32, "#dbeafe", "#2563eb"),
    T(58, 26, 16, "◠‿◠", 10, "#1d4ed8"),
    E(24, 32, 32, 20, "#fef9c3", "#ca8a04"),
    T(30, 36, 20, "🤝", 16, "#a16207"),
    E(4, 44, 8, 8, "#fecaca", "#f87171"),
    E(68, 42, 8, 8, "#fecaca", "#f87171"),
    E(12, 8, 12, 12, "#fef08a", "#ca8a04"),
    E(60, 6, 12, 12, "#fef08a", "#ca8a04"),
  ];
}

/** 猫咪趴笔记本 */
export function laptopIde() {
  return [
    R(0, 20, 80, 44, "#cbd5e1", "#475569"),
    R(6, 26, 68, 32, "#1e293b", "#0f172a"),
    T(18, 36, 44, "{ IDE }", 12, "#94a3b8"),
    R(-4, 62, 88, 10, "#94a3b8", "#64748b"),
    E(20, 0, 44, 36, "#ffedd5", "#ea580c"),
    T(28, 12, 28, "=^.^=", 13, "#c2410c"),
    E(16, 28, 8, 8, "#fecaca", "#f87171"),
    E(52, 28, 8, 8, "#fecaca", "#f87171"),
    E(8, 8, 14, 14, "#ffedd5", "#ea580c"),
    E(54, 8, 14, 14, "#ffedd5", "#ea580c"),
    L(28, 56, 20, 62, "#ea580c"),
    L(48, 56, 56, 62, "#ea580c"),
    E(62, 48, 16, 16, "#fef08a", "#ca8a04"),
    T(64, 52, 12, "★", 12, "#a16207"),
  ];
}

export const comicSnippets = {
  "gear-puzzle": gearPuzzle,
  "chat-spark": chatSpark,
  "layer-stack": layerStack,
  "folder-tree": folderTree,
  "loop-arrow": loopArrow,
  magnifier,
  "globe-search": globeSearch,
  "doc-pull": docPull,
  handshake,
  "laptop-ide": laptopIde,
};
