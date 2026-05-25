/**
 * Obstacle-aware routing: straight first; bends only when segment midpoints hit obstacles.
 */

export function inflateRect(r, pad = 12) {
  return { id: r.id, x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2 };
}

export function rectsFromAnchors(anchorMap, excludeIds = []) {
  const skip = new Set(excludeIds);
  return Object.entries(anchorMap)
    .filter(([id]) => !skip.has(id))
    .map(([id, a]) => ({ id, x: a.x, y: a.y, w: a.w, h: a.h }));
}

export function arrowAbsPoints(el) {
  const pts = el.points ?? [
    [0, 0],
    [el.width, el.height],
  ];
  return pts.map((p) => ({ x: el.x + p[0], y: el.y + p[1] }));
}

function onSegment(pi, p, q) {
  return (
    pi.x >= Math.min(p.x, q.x) - 0.5 &&
    pi.x <= Math.max(p.x, q.x) + 0.5 &&
    pi.y >= Math.min(p.y, q.y) - 0.5 &&
    pi.y <= Math.max(p.y, q.y) + 0.5
  );
}

function segIntersectRect(p1, p2, r) {
  const rx1 = r.x;
  const ry1 = r.y;
  const rx2 = r.x + r.w;
  const ry2 = r.y + r.h;

  if (p1.x >= rx1 && p1.x <= rx2 && p1.y >= ry1 && p1.y <= ry2) return true;
  if (p2.x >= rx1 && p2.x <= rx2 && p2.y >= ry1 && p2.y <= ry2) return true;

  const edges = [
    [
      { x: rx1, y: ry1 },
      { x: rx2, y: ry1 },
    ],
    [
      { x: rx2, y: ry1 },
      { x: rx2, y: ry2 },
    ],
    [
      { x: rx2, y: ry2 },
      { x: rx1, y: ry2 },
    ],
    [
      { x: rx1, y: ry2 },
      { x: rx1, y: ry1 },
    ],
  ];

  for (const [a, b] of edges) {
    if (segmentsIntersect(p1, p2, a, b)) return true;
  }
  return false;
}

function cross(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentsIntersect(p1, p2, p3, p4) {
  const d1 = cross(p1, p2, p3);
  const d2 = cross(p1, p2, p4);
  const d3 = cross(p3, p4, p1);
  const d4 = cross(p3, p4, p2);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }
  if (d1 === 0 && onSegment(p3, p1, p2)) return true;
  if (d2 === 0 && onSegment(p4, p1, p2)) return true;
  if (d3 === 0 && onSegment(p1, p3, p4)) return true;
  if (d4 === 0 && onSegment(p2, p3, p4)) return true;
  return false;
}

/** 线段是否穿过障碍内部（用中点，避免端口贴边误判） */
export function pathCrossesRectsInterior(points, rects, pad = 6) {
  for (let i = 0; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    for (const r of rects) {
      const ir = inflateRect(r, pad);
      if (mx > ir.x && mx < ir.x + ir.w && my > ir.y && my < ir.y + ir.h) {
        return { hit: true, rectId: r.id, segment: i };
      }
    }
  }
  return { hit: false };
}

export function pathCrossesRects(points, rects) {
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    for (const r of rects) {
      if (segIntersectRect(p1, p2, r)) return { hit: true, rectId: r.id, segment: i };
    }
  }
  return { hit: false };
}

function dedupePoints(points) {
  const out = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 2) out.push(p);
  }
  return out;
}

function simplifyOrtho(points) {
  const d = dedupePoints(points);
  if (d.length <= 2) return d;
  const out = [d[0]];
  for (let i = 1; i < d.length - 1; i++) {
    const prev = out[out.length - 1];
    const cur = d[i];
    const next = d[i + 1];
    const collinearX = Math.abs(prev.x - cur.x) < 1 && Math.abs(cur.x - next.x) < 1;
    const collinearY = Math.abs(prev.y - cur.y) < 1 && Math.abs(cur.y - next.y) < 1;
    if (!collinearX && !collinearY) out.push(cur);
  }
  out.push(d[d.length - 1]);
  return dedupePoints(out);
}

function isOrthoSeg(p1, p2) {
  return Math.abs(p1.x - p2.x) < 1 || Math.abs(p1.y - p2.y) < 1;
}

/**
 * 先 2 点直连 / 单折，仅当中点穿障才加通道；返回折点尽量少的路径。
 */
export function routeArrowAvoid(start, end, obstacles, opts = {}) {
  const pad = opts.padding ?? 12;
  const obs = obstacles.map((o) => inflateRect(o, pad));

  const tryPath = (pts) => {
    const simplified = simplifyOrtho(pts);
    if (simplified.length < 2) return null;
    for (let i = 0; i < simplified.length - 1; i++) {
      if (!isOrthoSeg(simplified[i], simplified[i + 1])) return null;
    }
    const hit = pathCrossesRectsInterior(simplified, obs, 4);
    return hit.hit ? null : simplified;
  };

  const minimal = [
    [start, end],
    [start, { x: end.x, y: start.y }, end],
    [start, { x: start.x, y: end.y }, end],
  ];

  for (const pts of minimal) {
    const ok = tryPath(pts);
    if (ok) return ok;
  }

  const xMin = Math.min(start.x, end.x);
  const xMax = Math.max(start.x, end.x);
  const blocking = obs.filter((r) => r.x + r.w > xMin && r.x < xMax);
  const yAbove =
    blocking.length > 0 ? Math.min(...blocking.map((r) => r.y)) - 32 : null;
  const yBelow =
    blocking.length > 0 ? Math.max(...blocking.map((r) => r.y + r.h)) + 32 : null;

  const detour = [];
  if (yAbove != null) {
    detour.push([start, { x: start.x, y: yAbove }, { x: end.x, y: yAbove }, end]);
  }
  if (yBelow != null) {
    detour.push([start, { x: start.x, y: yBelow }, { x: end.x, y: yBelow }, end]);
  }
  const gutterX = xMin - 40;
  if (yAbove != null) {
    detour.push([
      start,
      { x: gutterX, y: start.y },
      { x: gutterX, y: yAbove },
      { x: end.x, y: yAbove },
      end,
    ]);
  }

  detour.sort((a, b) => a.length - b.length);
  for (const pts of detour) {
    const ok = tryPath(pts);
    if (ok) return ok;
  }

  const elbowH = tryPath([start, { x: end.x, y: start.y }, end]);
  if (elbowH) return elbowH;
  const elbowV = tryPath([start, { x: start.x, y: end.y }, end]);
  if (elbowV) return elbowV;
  return [start, { x: end.x, y: start.y }, end];
}

export function routeOrthoAvoid(start, end, obstacles, opts = {}) {
  return routeArrowAvoid(start, end, obstacles, opts);
}
