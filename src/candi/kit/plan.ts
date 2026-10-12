import { Matrix4 } from "three";

/** Plan coordinates in metres: +x east, +z south. */
export interface Vec2 {
  x: number;
  z: number;
}

export type Direction = "east" | "south" | "west" | "north";

/** Outward unit vectors, in pradaksina (clockwise from above) order starting from the east. */
export const DIRECTIONS: Record<Direction, Vec2> = {
  east: { x: 1, z: 0 },
  south: { x: 0, z: 1 },
  west: { x: -1, z: 0 },
  north: { x: 0, z: -1 },
};

export const ALL_DIRECTIONS: readonly Direction[] = ["east", "south", "west", "north"];

export const OPPOSITE: Record<Direction, Direction> = { east: "west", west: "east", north: "south", south: "north" };

/** Yaw that turns a piece modelled facing +x (east) to face `d`. */
export function yawFor(d: Direction | Vec2): number {
  const v = typeof d === "string" ? DIRECTIONS[d] : d;
  return -Math.atan2(v.z, v.x);
}

/** Direction a piece facing `local` points to once the whole piece is turned to face `front`. */
export function turn(local: Direction, front: Direction): Direction {
  const order = ALL_DIRECTIONS;
  return order[(order.indexOf(local) + order.indexOf(front)) % 4];
}

/** Place a piece modelled at the origin facing east: at (x, y, z), facing `front`, scaled `s`. */
export function placement(x: number, y: number, z: number, front: Direction | Vec2 = "east", s = 1): Matrix4 {
  return new Matrix4()
    .makeTranslation(x, y, z)
    .multiply(new Matrix4().makeRotationY(yawFor(front)))
    .multiply(new Matrix4().makeScale(s, s, s));
}

/**
 * Square plan with a projecting central bay (penampil) on each face: the outline every candi foot,
 * body and roof tier follows. `half`/`halfZ` reach the bay faces; corners sit `depth` further in.
 * `bayHalf` is the bay's half width on the north and south faces, `bayHalfZ` on east and west.
 * Runs counter-clockwise seen from above (east → north → west → south), so normals point out.
 */
export function bayOutline(half: number, bayHalf: number, depth: number, halfZ = half, bayHalfZ = bayHalf): Vec2[] {
  if (depth <= 0) return rectOutline(half, halfZ);
  const c = half - depth;
  const cz = halfZ - depth;
  const bx = Math.min(bayHalf, c);
  const bz = Math.min(bayHalfZ, cz);
  return [
    { x: c, z: cz },
    { x: c, z: bz },
    { x: half, z: bz },
    { x: half, z: -bz },
    { x: c, z: -bz },
    { x: c, z: -cz },
    { x: bx, z: -cz },
    { x: bx, z: -halfZ },
    { x: -bx, z: -halfZ },
    { x: -bx, z: -cz },
    { x: -c, z: -cz },
    { x: -c, z: -bz },
    { x: -half, z: -bz },
    { x: -half, z: bz },
    { x: -c, z: bz },
    { x: -c, z: cz },
    { x: -bx, z: cz },
    { x: -bx, z: halfZ },
    { x: bx, z: halfZ },
    { x: bx, z: cz },
  ];
}

/** Axis-aligned rectangle centred at (cx, cz), same winding as `bayOutline`. */
export function rectOutline(halfX: number, halfZ: number, cx = 0, cz = 0): Vec2[] {
  return [
    { x: cx + halfX, z: cz + halfZ },
    { x: cx + halfX, z: cz - halfZ },
    { x: cx - halfX, z: cz - halfZ },
    { x: cx - halfX, z: cz + halfZ },
  ];
}

/** Outward unit normal of edge i (loop[i] → loop[i + 1]) of a counter-clockwise loop. */
export function edgeNormal(loop: readonly Vec2[], i: number): Vec2 {
  const p = loop[i];
  const q = loop[(i + 1) % loop.length];
  const len = Math.hypot(q.x - p.x, q.z - p.z);
  // Counter-clockwise on a north-up map (x east, z south): outward is (-dz, dx).
  return { x: -(q.z - p.z) / len, z: (q.x - p.x) / len };
}

/** Grow (or with negative distance shrink) an axis-aligned loop. */
export function offsetLoop(loop: readonly Vec2[], distance: number): Vec2[] {
  const n = loop.length;
  return loop.map((p, i) => {
    const a = edgeNormal(loop, (i - 1 + n) % n);
    const b = edgeNormal(loop, i);
    return { x: p.x + (a.x + b.x) * distance, z: p.z + (a.z + b.z) * distance };
  });
}

/** Loop scaled about the origin; used for shrinking roof tiers. */
export function scaleLoop(loop: readonly Vec2[], s: number): Vec2[] {
  return loop.map((p) => ({ x: p.x * s, z: p.z * s }));
}

/** Evenly spaced points along a straight row from a to b inclusive. */
export function row(a: Vec2, b: Vec2, count: number): Vec2[] {
  if (count === 1) return [{ x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 }];
  return Array.from({ length: count }, (_, i) => ({
    x: a.x + ((b.x - a.x) * i) / (count - 1),
    z: a.z + ((b.z - a.z) * i) / (count - 1),
  }));
}

/**
 * Items around a rectangular ring (corners shared), each with the outward direction of its side:
 * `perSide` along the north and south sides, `perSideZ` along the east and west sides. Corner
 * items face along the side they start. Total = 2 × (perSide + perSideZ) − 4.
 */
export function squareRing(half: number, perSide: number, halfZ = half, perSideZ = perSide): { position: Vec2; facing: Direction }[] {
  const out: { position: Vec2; facing: Direction }[] = [];
  const stepX = (2 * half) / (perSide - 1);
  const stepZ = (2 * halfZ) / (perSideZ - 1);
  for (let i = 0; i < perSideZ - 1; i++) {
    out.push({ position: { x: half, z: -halfZ + i * stepZ }, facing: "east" });
    out.push({ position: { x: -half, z: halfZ - i * stepZ }, facing: "west" });
  }
  for (let i = 0; i < perSide - 1; i++) {
    out.push({ position: { x: half - i * stepX, z: halfZ }, facing: "south" });
    out.push({ position: { x: -half + i * stepX, z: -halfZ }, facing: "north" });
  }
  return out;
}
