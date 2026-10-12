import type { MeshBuilder, V3 } from "../../render/mesh-builder";
import type { Realm } from "../types";
import { ratna } from "./ornaments";
import { type Direction, DIRECTIONS, OPPOSITE, placement, rectOutline } from "./plan";
import { block, stairFlight, stairRun, walls } from "./shrine";
import { type Part, Parts } from "./site";

/**
 * Courtyard walls with gates, and rectangular stepped terraces: the pieces that frame temples in a
 * compound. Gates come in the two Javanese forms: the roofed paduraksa and the split candi bentar.
 */

export interface EnclosureSpec {
  halfX: number;
  halfZ: number;
  cx?: number;
  cz?: number;
  /** Ground level the wall stands on. */
  y?: number;
  height: number;
  thickness: number;
  gates: Direction[];
  gateWidth: number;
  gate: "paduraksa" | "bentar" | "none";
  realm?: Realm;
}

function sideFrame(e: EnclosureSpec, d: Direction) {
  const v = DIRECTIONS[d];
  const s = v.x !== 0 ? e.halfX : e.halfZ;
  const lateral = v.x !== 0 ? e.halfZ : e.halfX;
  const cx = e.cx ?? 0;
  const cz = e.cz ?? 0;
  const at = (sv: number, u: number, y: number): V3 => (v.x !== 0 ? [cx + v.x * sv, y, cz + u] : [cx + u, y, cz + v.z * sv]);
  const box = (b: MeshBuilder, sr: [number, number], ur: [number, number], yr: [number, number]) => {
    const p = at(sr[0], ur[0], yr[0]);
    const q = at(sr[1], ur[1], yr[1]);
    b.box([Math.min(p[0], q[0]), yr[0], Math.min(p[2], q[2])], [Math.max(p[0], q[0]), yr[1], Math.max(p[2], q[2])], {});
  };
  return { s, lateral, at, box };
}

/** Enclosure wall with coping, broken by gates at the middle of the listed sides. */
export function enclosure(parts: Parts, e: EnclosureSpec): void {
  const b = parts.get(e.realm ?? "lower", "masonry");
  const y = e.y ?? 0;
  const t = e.thickness / 2;
  for (const d of ["east", "south", "west", "north"] as const) {
    const { s, lateral, at, box } = sideFrame(e, d);
    const gap = e.gates.includes(d) ? e.gateWidth / 2 : 0;
    const runs: [number, number][] = gap ? [[-lateral - t, -gap], [gap, lateral + t]] : [[-lateral - t, lateral + t]];
    for (const r of runs) {
      box(b, [s - t, s + t], r, [y, y + e.height]);
      box(b, [s - t - 0.12, s + t + 0.12], r, [y + e.height, y + e.height + 0.25]);
    }
    if (!gap || e.gate === "none") continue;
    // Gate pylons either side of the passage.
    const pw = Math.max(1.2, e.gateWidth * 0.45);
    const depth = Math.max(e.thickness * 2.5, 2);
    const ph = e.gate === "bentar" ? e.height * 2.8 : e.height * 1.9;
    for (const side of [-1, 1]) {
      const u: [number, number] = side < 0 ? [-gap - pw, -gap] : [gap, gap + pw];
      box(b, [s - depth / 2, s + depth / 2], u, [y, y + ph * 0.55]);
      // Stepped tiers on each pylon (the halves of a split gate each carry a full roof).
      let yy = y + ph * 0.55;
      let inset = 0;
      for (let k = 0; k < 4; k++) {
        const h = ph * (0.13 - k * 0.02);
        inset += pw * 0.08;
        const uu: [number, number] = side < 0 ? [u[0] + inset, u[1] - (e.gate === "bentar" ? 0 : inset)] : [u[0] + (e.gate === "bentar" ? 0 : inset), u[1] - inset];
        box(b, [s - depth / 2 + inset, s + depth / 2 - inset], uu, [yy, yy + h]);
        yy += h;
      }
    }
    if (e.gate === "paduraksa") {
      // Lintel and a stepped roof over the passage, crowned with a ratna.
      const lintel = y + ph * 0.55;
      box(b, [s - depth / 2, s + depth / 2], [-gap, gap], [lintel - 0.6, lintel]);
      let yy = lintel;
      let half = gap + pw;
      for (let k = 0; k < 5; k++) {
        const h = ph * 0.1 * (1 - k * 0.1);
        half *= 0.82;
        box(b, [s - depth / 2 + k * 0.15, s + depth / 2 - k * 0.15], [-half, half], [yy, yy + h]);
        yy += h;
      }
      const [x, , z] = at(s, 0, 0);
      b.geometry(ratna(), placement(x, yy, z, "east", Math.max(1, half)));
    }
  }
}

/** Paved court floor, lifted a little above the ground plane. */
export function court(parts: Parts, halfX: number, halfZ: number, cx = 0, cz = 0, y = 0.06): void {
  parts.get("lower", "floor").cap(rectOutline(halfX, halfZ, cx, cz), y);
}

export interface TerraceSpec {
  halfX: number;
  halfZ: number;
  height: number;
  /** Ground level under this terrace. */
  y?: number;
  stairs: Direction[];
  stairWidth: number;
  relief?: boolean;
  realm?: Realm;
}

/**
 * Rectangular moulded terrace with stairs on the listed sides, at the origin (place it with
 * `Parts.place`). Stairs project outward from the terrace edge.
 */
export function terrace(t: TerraceSpec): Part[] {
  const parts = new Parts();
  const realm = t.realm ?? "lower";
  const y0 = t.y ?? 0;
  block(parts, realm, rectOutline(t.halfX, t.halfZ), y0, y0 + t.height, { relief: t.relief, scale: Math.min(1, t.height / 2) });
  const run = stairRun(t.height);
  for (const d of t.stairs) {
    const s = DIRECTIONS[d].x !== 0 ? t.halfX : t.halfZ;
    stairFlight(parts, realm, d, { sTop: s, sBottom: s + run, yLow: y0, yHigh: y0 + t.height, landingFrom: s }, t.stairWidth);
  }
  return parts.build();
}

/**
 * Sunken court centred on the origin: retaining walls from the floor up to ground level, a kerb,
 * and the paved floor. Pair it with `setting.pit` (same half sizes) so the terrain opens. Stairs
 * on the listed sides run down the wall faces into the court.
 */
export function sunkenCourt(parts: Parts, p: { halfX: number; halfZ: number; depth: number; stairs: Direction[]; stairWidth: number }): void {
  const wall = parts.get("lower", "masonry");
  const loop = rectOutline(p.halfX, p.halfZ);
  walls(wall, loop, -p.depth, 0, { inward: true });
  parts.get("lower", "floor").cap(loop, -p.depth);
  // Coping: a kerb around the rim, its top flush with the lawn.
  wall.cap(rectOutline(p.halfX + 0.6, p.halfZ + 0.6), 0.02, [loop]);
  const run = stairRun(p.depth);
  for (const d of p.stairs) {
    const s = DIRECTIONS[d].x !== 0 ? p.halfX : p.halfZ;
    // A flight inside the pit against the wall, climbing outward to the rim.
    stairFlight(parts, "lower", OPPOSITE[d], { sTop: -s, sBottom: -s + run, yLow: -p.depth, yHigh: 0, landingFrom: -s }, p.stairWidth);
  }
}
