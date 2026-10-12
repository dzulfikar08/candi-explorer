/**
 * Plan geometry for Borobudur, in metres. World axes: +x east, +z south, +y up.
 *
 * Published figures (Wikipedia, citing Dumarçay/Soekmono): base 123 m square with 4 m walls, first
 * terrace set back 7 m, main stupa top 35 m above ground, five balustrades with 104/104/88/72/64
 * niched Buddhas, three circular terraces with 32/24/16 perforated stupas.
 * Deviation: the real upper terraces step back ~2 m each; we use 3 m so the corridors stay walkable
 * next to the steep axial stairways.
 */

export interface Vec2 {
  x: number;
  z: number;
}

export interface SquareLevel {
  /** 0 = base (Kamadhatu), 1-5 = terraces (Rupadhatu). */
  index: number;
  /** Distance from centre to the outer face of the central projection. */
  half: number;
  bottom: number;
  top: number;
  /** Buddha niches on this level's balustrade (0 for the base, which has none). */
  niches: number;
}

export interface CircularTerrace {
  radius: number;
  bottom: number;
  top: number;
  stupas: number;
  ringRadius: number;
  lattice: "diamond" | "square";
}

export const SQUARE_LEVELS: readonly SquareLevel[] = [
  { index: 0, half: 61.5, bottom: 0, top: 4.0, niches: 0 },
  { index: 1, half: 54.5, bottom: 4.0, top: 7.2, niches: 104 },
  { index: 2, half: 51.5, bottom: 7.2, top: 10.2, niches: 104 },
  { index: 3, half: 48.5, bottom: 10.2, top: 13.0, niches: 88 },
  { index: 4, half: 45.5, bottom: 13.0, top: 15.6, niches: 72 },
  { index: 5, half: 42.5, bottom: 15.6, top: 18.0, niches: 64 },
];

export const CIRCULAR_TERRACES: readonly CircularTerrace[] = [
  { radius: 26.5, bottom: 18.0, top: 19.4, stupas: 32, ringRadius: 24.4, lattice: "diamond" },
  { radius: 20.0, bottom: 19.4, top: 20.8, stupas: 24, ringRadius: 17.9, lattice: "diamond" },
  { radius: 13.6, bottom: 20.8, top: 22.2, stupas: 16, ringRadius: 11.6, lattice: "square" },
];

export const MAIN_STUPA_TOP = 35;

export const BALUSTRADE = { thickness: 0.7, height: 2.2 } as const;

/** Half width of every axial stairway; balustrades and terrace walls are opened to this width. */
export const STAIR_HALF_WIDTH = 1.3;

/** Landing kept clear on each corridor where the stair axis crosses it. */
export const LANDING_DEPTH = 1.2;

/** Stairways cut this far into each square level, through the balustrade line. */
export const STAIR_NOTCH_DEPTH = BALUSTRADE.thickness;

/**
 * Central projection half width shrinks one-for-one with the level half, so every level's outline
 * is an exact orthogonal offset of the one below and corridors keep a constant width.
 */
const PROJECTION_INSET = 31.5;
const PROJECTION_DEPTH = 1.2;
const CORNER_STEPS = 3;
const CORNER_STEP = 1.4;

/** Cardinal stair axes as outward unit vectors, in pradaksina order starting from the east. */
export const AXES: readonly Vec2[] = [
  { x: 1, z: 0 },
  { x: 0, z: 1 },
  { x: -1, z: 0 },
  { x: 0, z: -1 },
];

export type Direction = "east" | "south" | "west" | "north";

export function facingDirection(normal: Vec2): Direction {
  if (Math.abs(normal.x) >= Math.abs(normal.z)) return normal.x > 0 ? "east" : "west";
  return normal.z > 0 ? "south" : "north";
}

/**
 * Redented (stepped-corner) square outline with a projecting centre on each side.
 * The loop starts on the south axis and runs south → east → north → west, so every axis point is a
 * vertex (a stair notch replaces the axis vertex with the notch floor).
 */
export function redentedOutline(half: number, notchDepth = 0): Vec2[] {
  const c = half - PROJECTION_INSET;
  const e = half - PROJECTION_DEPTH;
  const k = CORNER_STEPS;
  const s = CORNER_STEP;
  if (e - k * s <= c) throw new Error(`outline half ${half} too small for its redents`);

  const quadrant: Vec2[] = [];
  if (notchDepth > 0) {
    quadrant.push({ x: 0, z: half - notchDepth }, { x: STAIR_HALF_WIDTH, z: half - notchDepth });
    quadrant.push({ x: STAIR_HALF_WIDTH, z: half });
  } else {
    quadrant.push({ x: 0, z: half });
  }
  quadrant.push({ x: c, z: half }, { x: c, z: e });
  quadrant.push({ x: e - k * s, z: e });
  for (let j = 0; j < k; j++) {
    const x = e - (k - j) * s;
    quadrant.push({ x, z: e - (j + 1) * s }, { x: x + s, z: e - (j + 1) * s });
  }
  quadrant.push({ x: e, z: c }, { x: half, z: c });
  if (notchDepth > 0) {
    quadrant.push({ x: half, z: STAIR_HALF_WIDTH }, { x: half - notchDepth, z: STAIR_HALF_WIDTH });
  }
  quadrant.push({ x: half - notchDepth, z: 0 });
  // Each quadrant's last point (on the next axis) is the following quadrant's first point.
  const loop: Vec2[] = [];
  for (let q = 0; q < 4; q++) {
    for (let i = 0; i < quadrant.length - 1; i++) {
      let { x, z } = quadrant[i];
      // Quarter turn in loop direction: (x, z) → (z, -x). `+ 0` normalises -0.
      for (let r = 0; r < q; r++) [x, z] = [z, -x + 0];
      loop.push({ x, z });
    }
  }
  return loop;
}

export interface WallWindow {
  from: Vec2;
  to: Vec2;
  normal: Vec2;
}

/**
 * The south-east corner of the base, where the encasement is left open to show a few
 * Karmavibhangga panels of the hidden foot: one 8 m stretch on each face next to the corner steps.
 */
export function hiddenFootWindows(): WallWindow[] {
  const e = SQUARE_LEVELS[0].half - PROJECTION_DEPTH;
  const cornerStart = e - CORNER_STEPS * CORNER_STEP;
  return [
    { from: { x: cornerStart - 8, z: e }, to: { x: cornerStart, z: e }, normal: { x: 0, z: 1 } },
    { from: { x: e, z: cornerStart }, to: { x: e, z: cornerStart - 8 }, normal: { x: 1, z: 0 } },
  ];
}

export function signedArea(loop: readonly Vec2[]): number {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const p = loop[i];
    const q = loop[(i + 1) % loop.length];
    a += p.x * q.z - q.x * p.z;
  }
  return a / 2;
}

/** Outward unit normal of edge i (from loop[i] to loop[i+1]). */
export function edgeNormal(loop: readonly Vec2[], i: number): Vec2 {
  const p = loop[i];
  const q = loop[(i + 1) % loop.length];
  const len = Math.hypot(q.x - p.x, q.z - p.z);
  const dx = (q.x - p.x) / len;
  const dz = (q.z - p.z) / len;
  return signedArea(loop) > 0 ? { x: dz, z: -dx } : { x: -dz, z: dx };
}

/** Offset an axis-aligned loop; positive distance grows it outward. */
export function offsetOrthogonal(loop: readonly Vec2[], distance: number): Vec2[] {
  const n = loop.length;
  return loop.map((p, i) => {
    const n1 = edgeNormal(loop, (i - 1 + n) % n);
    const n2 = edgeNormal(loop, i);
    const same = Math.abs(n1.x - n2.x) < 1e-9 && Math.abs(n1.z - n2.z) < 1e-9;
    const ox = same ? n1.x : n1.x + n2.x;
    const oz = same ? n1.z : n1.z + n2.z;
    return { x: p.x + ox * distance, z: p.z + oz * distance };
  });
}

export interface Run {
  points: Vec2[];
  /** Outward normal of segment i (points[i] → points[i + 1]). */
  normals: Vec2[];
}

/**
 * Split an un-notched loop into its four corner runs (axis to axis), with `gap` metres trimmed at
 * both ends where the stairway passes. Run 0 is the south-east corner; runs follow the loop order.
 */
export function cornerRuns(loop: readonly Vec2[], gap: number): Run[] {
  const axisIdx = loop
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => Math.abs(p.x) < 1e-9 || Math.abs(p.z) < 1e-9)
    .map(({ i }) => i);
  if (axisIdx.length !== 4) throw new Error("expected four axis vertices");
  return axisIdx.map((start, r) => {
    const end = axisIdx[(r + 1) % 4];
    const points: Vec2[] = [];
    const normals: Vec2[] = [];
    for (let i = start; ; i = (i + 1) % loop.length) {
      points.push({ ...loop[i] });
      if (i === end) break;
      normals.push(edgeNormal(loop, i));
    }
    // Axis-adjacent segments are the straight central projections, longer than any stair gap.
    const last = points.length - 1;
    points[0] = moveToward(points[0], points[1], gap);
    points[last] = moveToward(points[last], points[last - 1], gap);
    return { points, normals };
  });
}

function moveToward(from: Vec2, to: Vec2, dist: number): Vec2 {
  const len = Math.hypot(to.x - from.x, to.z - from.z);
  if (dist >= len) throw new Error("gap longer than the axis segment");
  return { x: from.x + ((to.x - from.x) * dist) / len, z: from.z + ((to.z - from.z) * dist) / len };
}

export function polylineLength(points: readonly Vec2[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z);
  }
  return len;
}

export interface Placement {
  position: Vec2;
  /** Outward normal of the wall the item sits on. */
  normal: Vec2;
}

/**
 * Place `count` items evenly along a run, keeping each one at least `margin` from a wall corner
 * when the segment is long enough, so niches never straddle a redent.
 */
export function distributeAlongRun(run: Run, count: number, margin: number): Placement[] {
  const { points, normals } = run;
  const total = polylineLength(points);
  const out: Placement[] = [];
  for (let k = 0; k < count; k++) {
    const target = ((k + 0.5) * total) / count;
    let acc = 0;
    for (let i = 1; i < points.length; i++) {
      const p = points[i - 1];
      const q = points[i];
      const len = Math.hypot(q.x - p.x, q.z - p.z);
      if (acc + len >= target || i === points.length - 1) {
        const m = Math.min(margin, len / 2);
        const t = Math.min(Math.max(target - acc, m), len - m) / len;
        out.push({
          position: { x: p.x + (q.x - p.x) * t, z: p.z + (q.z - p.z) * t },
          normal: normals[i - 1],
        });
        break;
      }
      acc += len;
    }
  }
  return out;
}

/** Niche placements for one balustrade, on the outer face of the wall. */
export function nichePlacements(level: SquareLevel): Placement[] {
  if (level.niches === 0) return [];
  const runs = cornerRuns(redentedOutline(level.half), STAIR_HALF_WIDTH + 0.6);
  return runs.flatMap((run) => distributeAlongRun(run, level.niches / 4, 0.8));
}

export interface RingPlacement {
  angle: number;
  position: Vec2;
}

/** Ring stupas, offset half a step so each stair axis passes between two stupas. */
export function ringPlacements(terrace: CircularTerrace): RingPlacement[] {
  const out: RingPlacement[] = [];
  for (let i = 0; i < terrace.stupas; i++) {
    const angle = ((i + 0.5) / terrace.stupas) * Math.PI * 2;
    out.push({
      angle,
      position: { x: Math.cos(angle) * terrace.ringRadius, z: Math.sin(angle) * terrace.ringRadius },
    });
  }
  return out;
}

export interface Flight {
  axis: Vec2;
  /** Distance from centre along the axis of the top and bottom step edges. */
  sTop: number;
  sBottom: number;
  yLow: number;
  yHigh: number;
}

/** Flights for one axis: ground → base → five terraces → three circular terraces. */
export function flightsForAxis(axis: Vec2): Flight[] {
  const flights: Flight[] = [];
  const t = STAIR_NOTCH_DEPTH;
  const [base, ...terraces] = SQUARE_LEVELS;
  flights.push({ axis, sTop: base.half - t, sBottom: base.half + 3.6, yLow: 0, yHigh: base.top });
  let previous = base;
  for (const level of terraces) {
    const sTop = level.half - t;
    // The base terrace is wide; upper corridors keep a landing next to their balustrade.
    const sBottom = previous.index === 0 ? level.half + 2.4 : previous.half - t - LANDING_DEPTH;
    flights.push({ axis, sTop, sBottom, yLow: previous.top, yHigh: level.top });
    previous = level;
  }
  for (const terrace of CIRCULAR_TERRACES) {
    flights.push({
      axis,
      sTop: terrace.radius - 0.3,
      sBottom: terrace.radius + 1.5,
      yLow: terrace.bottom,
      yHigh: terrace.top,
    });
  }
  return flights;
}
