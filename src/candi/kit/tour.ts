import { Vector3 } from "three";
import { type Direction, DIRECTIONS } from "./plan";
import type { ShrineLayout } from "./shrine";

/** Eye height of the walking pilgrim. */
export const EYE = 1.65;

export function eye(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y + EYE, z);
}

const CLOCKWISE: readonly Direction[] = ["east", "south", "west", "north"];

/**
 * Pradaksina loop around a rectangle: starts and ends at the middle of the `start` side and walks
 * clockwise seen from above, keeping the centre on the pilgrim's right.
 */
export function loop(halfX: number, y: number, opts: { halfZ?: number; cx?: number; cz?: number; start?: Direction } = {}): Vector3[] {
  const hz = opts.halfZ ?? halfX;
  const cx = opts.cx ?? 0;
  const cz = opts.cz ?? 0;
  const startIndex = CLOCKWISE.indexOf(opts.start ?? "east");
  // Corner reached after walking each side clockwise: east side ends at SE, south at SW, ...
  const corners: Record<Direction, [number, number]> = {
    east: [halfX, hz],
    south: [-halfX, hz],
    west: [-halfX, -hz],
    north: [halfX, -hz],
  };
  const mid = (d: Direction) => {
    const v = DIRECTIONS[d];
    return eye(cx + v.x * halfX, y, cz + v.z * hz);
  };
  const out = [mid(CLOCKWISE[startIndex])];
  for (let k = 0; k < 4; k++) {
    const d = CLOCKWISE[(startIndex + k) % 4];
    const [x, z] = corners[d];
    out.push(eye(cx + x, y, cz + z));
  }
  out.push(mid(CLOCKWISE[startIndex]));
  return out;
}

/** Walk in from `lead` metres beyond the stairs and climb every flight of a shrine's `face`. */
export function ascend(layout: ShrineLayout, face: Direction, opts: { cx?: number; cz?: number; lead?: number } = {}): Vector3[] {
  const v = DIRECTIONS[face];
  const cx = opts.cx ?? 0;
  const cz = opts.cz ?? 0;
  const at = (s: number, y: number) => eye(cx + v.x * s, y, cz + v.z * s);
  const out = [at(layout.stairReach + (opts.lead ?? 6), 0)];
  for (const f of layout.flights) out.push(at(f.sBottom + 0.3, f.yLow), at(f.sTop - 0.4, f.yHigh));
  return out;
}

/** Straight walk between plan points at one level. */
export function path(y: number, ...points: [number, number][]): Vector3[] {
  return points.map(([x, z]) => eye(x, y, z));
}
