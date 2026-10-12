import { Matrix4, type BufferGeometry } from "three";
import type { MeshBuilder, V3 } from "../../render/mesh-builder";
import type { Realm } from "../types";
import { bull, deity, kala, linggaYoni, makara, ratna, seatedBuddha, stupa } from "./ornaments";
import { type Direction, DIRECTIONS, type Vec2, bayOutline, edgeNormal, offsetLoop, placement, rectOutline } from "./plan";
import { type Part, Parts } from "./site";

/**
 * Parametric Javanese candi. Every temple in the kit is the same three-part body: a foot (kaki) on
 * optional stepped plinths, a body (tubuh) with a chamber, and a stepped roof (atap) of shrinking
 * replicas of the body crowned by a ratna or stupa. Modelled at the origin with its front facing
 * +x (east) and its foot on y = 0; place it with `placement()`.
 */

/** Width of one carved panel along a relief wall, as on Borobudur. */
const PANEL_WIDTH = 2.4;
/** Stair proportions: steep, as Javanese stairs are (about 39°). */
const RISER = 0.24;
const TREAD = 0.3;
const LANDING = 1.2;

/** Horizontal run of a stair flight for a given rise. */
export function stairRun(rise: number): number {
  return Math.ceil(rise / RISER) * TREAD;
}

export interface Plinth {
  half: number;
  height: number;
  /** Balustrade on the outer edge of its floor (Prambanan's gallery), metres high. */
  balustrade?: number;
  /** Narrative panels on the balustrade's inner face. */
  balustradeRelief?: boolean;
  /** Carved panels on the plinth's own wall. */
  relief?: boolean;
}

export interface ShrineSpec {
  /** Stepped platforms under the foot, bottom first. */
  plinths?: Plinth[];
  foot: { half: number; height: number; relief?: boolean };
  /** `wall` is the masonry thickness around the chamber. */
  body: { half: number; height: number; wall: number };
  door: { width: number; height: number };
  /** Faces (local: front is east) with a doorway into the chamber; the others carry niches. */
  doors: Direction[];
  /** Faces with a stairway from the ground to the body; defaults to the door faces. */
  stairs?: Direction[];
  stairWidth: number;
  /** Projecting central bay on every face, as fractions of the level's half width. */
  bay?: { width: number; depth: number };
  /**
   * North–south half width as a multiple of the east–west one, for oblong temples (Sari,
   * Plaosan). Default 1 (square).
   */
  aspect?: number;
  roof: {
    tiers: number;
    /** Height of the first (largest) tier; each next tier shrinks by `shrink`. */
    first: number;
    shrink: number;
    finial: "ratna" | "stupa" | "none";
  };
  crown: { kind: "ratna" | "stupa" | "none"; height: number };
  /** Image in the chamber, facing the front door. */
  image?: { kind: ImageKind; height: number };
  /** What stands in the outer niches. */
  niches?: "deity" | "buddha" | "empty";
}

export type ImageKind = "lingga" | "deity" | "buddha" | "bull";

/** Chamber images, each with its modelled height (they are scaled to the requested height). */
const IMAGES: Record<ImageKind, { geometry: () => BufferGeometry; height: number }> = {
  lingga: { geometry: linggaYoni, height: 1 },
  deity: { geometry: deity, height: 1 },
  buddha: { geometry: () => seatedBuddha(), height: 1.05 },
  bull: { geometry: bull, height: 1 },
};

export interface ShrineLevel {
  half: number;
  bottom: number;
  top: number;
}

export interface ShrineLayout {
  /** Plinths then the foot, bottom first. */
  levels: ShrineLevel[];
  footTop: number;
  bodyTop: number;
  /** Top of each roof tier. */
  tiers: ShrineLevel[];
  /** Tip of the crown. */
  height: number;
  /** Stair flights on the east and west faces, bottom first. */
  flights: Flight[];
  /** The same on the north and south faces (differs only on oblong plans). */
  flightsNS: Flight[];
  /** Outer end of the bottom east stair flight, measured from the centre. */
  stairReach: number;
  chamberHalf: number;
  chamberHalfZ: number;
}

const DEFAULT_BAY = { width: 0.42, depth: 0.08 };

function bayOf(spec: ShrineSpec) {
  return spec.bay ?? DEFAULT_BAY;
}

export function outlineFor(spec: ShrineSpec, half: number): Vec2[] {
  const bay = bayOf(spec);
  const halfZ = half * (spec.aspect ?? 1);
  return bayOutline(half, half * bay.width, half * bay.depth, halfZ, halfZ * bay.width);
}

export interface Flight {
  /** Top step edge and bottom end, distance from the centre along the face's axis. */
  sTop: number;
  sBottom: number;
  yLow: number;
  yHigh: number;
  /** Landing between the level's own edge and `sTop`, when the flight above pushed it out. */
  landingFrom: number;
}

/**
 * Flights from the ground to the foot top, computed top-down so every flight lands on a floor.
 * `scale` turns east–west half widths into those of the face climbed.
 */
function flights(levels: ShrineLevel[], scale = 1): Flight[] {
  const out: Flight[] = [];
  let reach = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    const half = level.half * scale;
    const rise = level.top - level.bottom;
    const run = stairRun(rise);
    const sTop = Math.max(half, reach + (i === levels.length - 1 ? 0 : LANDING));
    out.unshift({ sTop, sBottom: sTop + run, yLow: level.bottom, yHigh: level.top, landingFrom: half });
    reach = sTop + run;
  }
  return out;
}

export function shrineLayout(spec: ShrineSpec): ShrineLayout {
  const levels: ShrineLevel[] = [];
  let y = 0;
  for (const l of [...(spec.plinths ?? []), spec.foot]) {
    levels.push({ half: l.half, bottom: y, top: y + l.height });
    y += l.height;
  }
  const footTop = y;
  const bodyTop = footTop + spec.body.height;
  const tiers: ShrineLevel[] = [];
  y = bodyTop;
  for (let k = 1; k <= spec.roof.tiers; k++) {
    const h = spec.roof.first * spec.roof.shrink ** (k - 1);
    tiers.push({ half: spec.body.half * spec.roof.shrink ** k, bottom: y, top: y + h });
    y += h;
  }
  const bay = bayOf(spec);
  const f = flights(levels);
  return {
    levels,
    footTop,
    bodyTop,
    tiers,
    height: y + (spec.crown.kind === "none" ? 0 : spec.crown.height),
    flights: f,
    flightsNS: flights(levels, spec.aspect ?? 1),
    stairReach: (spec.stairs ?? spec.doors).length ? f[0].sBottom : levels[0].half,
    chamberHalf: spec.body.half * (1 - bay.depth) - spec.body.wall,
    chamberHalfZ: spec.body.half * ((spec.aspect ?? 1) - bay.depth) - spec.body.wall,
  };
}

/** Map face-local coordinates (s outward along the face axis, u lateral) to the shrine frame. */
function axis(d: Direction, s: number, u: number, y: number): V3 {
  const v = DIRECTIONS[d];
  return v.x !== 0 ? [v.x * s, y, u] : [u, y, v.z * s];
}

function axisBox(b: MeshBuilder, d: Direction, s: [number, number], u: [number, number], y: [number, number], top = true): void {
  const p = axis(d, s[0], u[0], y[0]);
  const q = axis(d, s[1], u[1], y[1]);
  b.box(
    [Math.min(p[0], q[0]), y[0], Math.min(p[2], q[2])],
    [Math.max(p[0], q[0]), y[1], Math.max(p[2], q[2])],
    { bottom: true, top: !top },
  );
}

/**
 * Vertical walls around a loop. `panel` lays explicit relief UVs (one panel per PANEL_WIDTH along
 * the wall, the full height in v). `inward` flips normals for chamber walls. `openings` cuts a
 * centred doorway into the listed edges.
 */
export function walls(
  b: MeshBuilder,
  loop: readonly Vec2[],
  y0: number,
  y1: number,
  opts: { panel?: boolean; inward?: boolean; openings?: Map<number, { width: number; height: number }> } = {},
): void {
  let along = 0;
  loop.forEach((p, i) => {
    const q = loop[(i + 1) % loop.length];
    const n = edgeNormal(loop, i);
    const nx = opts.inward ? -n.x : n.x;
    const nz = opts.inward ? -n.z : n.z;
    const len = Math.hypot(q.x - p.x, q.z - p.z);
    const segment = (t0: number, t1: number, ya: number, yb: number) => {
      const a = { x: p.x + (q.x - p.x) * t0, z: p.z + (q.z - p.z) * t0 };
      const c = { x: p.x + (q.x - p.x) * t1, z: p.z + (q.z - p.z) * t1 };
      const u0 = (along + t0 * len) / PANEL_WIDTH;
      const u1 = (along + t1 * len) / PANEL_WIDTH;
      const v0 = (ya - y0) / (y1 - y0);
      const v1 = (yb - y0) / (y1 - y0);
      b.quad(
        [a.x, ya, a.z],
        [c.x, ya, c.z],
        [c.x, yb, c.z],
        [a.x, yb, a.z],
        [nx, 0, nz],
        opts.panel
          ? [
              [u0, v0],
              [u1, v0],
              [u1, v1],
              [u0, v1],
            ]
          : undefined,
      );
    };
    const opening = opts.openings?.get(i);
    if (opening) {
      const half = opening.width / 2 / len;
      const top = Math.min(y1, y0 + opening.height);
      segment(0, 0.5 - half, y0, y1);
      segment(0.5 + half, 1, y0, y1);
      if (top < y1) segment(0.5 - half, 0.5 + half, top, y1);
    } else {
      segment(0, 1, y0, y1);
    }
    along += len;
  });
}

/** Ring between two loops at height y (ledges, the underside of cornices). */
function ring(b: MeshBuilder, outer: Vec2[], inner: Vec2[], y: number, up: boolean): void {
  b.cap(outer, y, [inner], up);
}

/**
 * A moulded block: plinth band, plain or carved dado, projecting cornice, floor on top. The
 * profile Javanese temple feet share (simplified from the ogee mouldings).
 */
export function block(
  parts: Parts,
  realm: Realm,
  loop: Vec2[],
  y0: number,
  y1: number,
  opts: { relief?: boolean; scale?: number } = {},
): void {
  const masonry = parts.get(realm, "masonry");
  const h = y1 - y0;
  const s = opts.scale ?? 1;
  const band = Math.min(0.5 * s, h * 0.16);
  const out = Math.min(0.28 * s, h * 0.07);
  const grown = offsetLoop(loop, out);
  walls(masonry, grown, y0, y0 + band);
  ring(masonry, grown, loop, y0 + band, true);
  walls(opts.relief ? parts.get(realm, "reliefSingle") : masonry, loop, y0 + band, y1 - band, { panel: opts.relief });
  walls(masonry, grown, y1 - band, y1);
  ring(masonry, grown, loop, y1 - band, false);
  parts.get(realm, "floor").cap(grown, y1);
}

/** Balustrade along a plinth's edge, opened where stairs arrive. */
function balustrade(parts: Parts, loop: Vec2[], y: number, height: number, gaps: Direction[], gapHalf: number, relief: boolean): void {
  const t = 0.5;
  const centre = offsetLoop(loop, -t / 2);
  const masonry = parts.get("lower", "masonry");
  const carved = parts.get("lower", "reliefSingle");
  centre.forEach((p, i) => {
    const q = centre[(i + 1) % centre.length];
    const n = edgeNormal(centre, i);
    const len = Math.hypot(q.x - p.x, q.z - p.z);
    const dx = (q.x - p.x) / len;
    const dz = (q.z - p.z) / len;
    // Stairs cut the edge whose midpoint sits on their axis.
    const mid = { x: (p.x + q.x) / 2, z: (p.z + q.z) / 2 };
    const cut = gaps.some((d) => {
      const v = DIRECTIONS[d];
      return n.x === v.x && n.z === v.z && Math.abs(v.x !== 0 ? mid.z : mid.x) < 1e-6;
    });
    const pieces: [number, number][] = cut ? [[-t / 2, len / 2 - gapHalf], [len / 2 + gapHalf, len + t / 2]] : [[-t / 2, len + t / 2]];
    for (const [a, c] of pieces) {
      if (c - a < 0.05) continue;
      const pa = { x: p.x + dx * a, z: p.z + dz * a };
      const pc = { x: p.x + dx * c, z: p.z + dz * c };
      const xs = [pa.x + n.x * (t / 2), pa.x - n.x * (t / 2), pc.x + n.x * (t / 2), pc.x - n.x * (t / 2)];
      const zs = [pa.z + n.z * (t / 2), pa.z - n.z * (t / 2), pc.z + n.z * (t / 2), pc.z - n.z * (t / 2)];
      masonry.box([Math.min(...xs), y, Math.min(...zs)], [Math.max(...xs), y + height, Math.max(...zs)], {});
      if (relief && c - a > 1) {
        const o = t / 2 + 0.02;
        const ia = { x: pa.x - n.x * o, z: pa.z - n.z * o };
        const ic = { x: pc.x - n.x * o, z: pc.z - n.z * o };
        carved.quad([ia.x, y + 0.15, ia.z], [ic.x, y + 0.15, ic.z], [ic.x, y + height - 0.2, ic.z], [ia.x, y + height - 0.2, ia.z], [-n.x, 0, -n.z], [
          [0, 0],
          [(c - a) / PANEL_WIDTH, 0],
          [(c - a) / PANEL_WIDTH, 1],
          [0, 1],
        ]);
      }
    }
  });
}

/** Solid stepped flight with stepped cheek walls and makara at the foot. */
export function stairFlight(parts: Parts, realm: Realm, d: Direction, f: Flight, width: number, cheek = 0.45): void {
  const floor = parts.get(realm, "floor");
  const masonry = parts.get(realm, "masonry");
  const rise = f.yHigh - f.yLow;
  const n = Math.max(1, Math.ceil(rise / RISER));
  const riser = rise / n;
  const tread = (f.sBottom - f.sTop) / n;
  const w = width / 2;
  // Overlap into the wall behind so no gap shows at the top step.
  const back = f.sTop - 0.3;
  if (f.sTop > f.landingFrom + 1e-6) axisBox(masonry, d, [f.landingFrom - 0.3, f.sTop], [-w - cheek, w + cheek], [f.yLow, f.yHigh]);
  for (let j = 1; j <= n; j++) {
    const s1 = f.sTop + (n - j + 1) * tread;
    const top = f.yLow + j * riser;
    axisBox(floor, d, [back, s1], [-w, w], [f.yLow, top]);
    for (const side of [-1, 1]) {
      const u: [number, number] = side < 0 ? [-w - cheek, -w] : [w, w + cheek];
      axisBox(masonry, d, [back, s1], u, [f.yLow, Math.min(top + 0.75, f.yHigh + 0.75)]);
    }
  }
  if (rise > 1) {
    for (const side of [-1, 1]) {
      const m = makara();
      const [x, , z] = axis(d, f.sBottom + 0.15, side * (w + cheek / 2), 0);
      const k = Math.min(1.4, 0.5 + rise * 0.2);
      parts.get(realm, "statue").geometry(m, placement(x, f.yLow, z, d).multiply(new Matrix4().makeScale(k, k, cheek * 1.6)));
    }
  }
}

function crownGeometry(kind: "ratna" | "stupa") {
  return kind === "ratna" ? ratna() : stupa();
}

export interface BuiltShrine {
  parts: Part[];
  layout: ShrineLayout;
}

/** Build a shrine's geometry parts (unplaced). */
export function shrine(spec: ShrineSpec): BuiltShrine {
  const parts = new Parts();
  const layout = shrineLayout(spec);
  const stairs = spec.stairs ?? spec.doors;
  const allPlinths = spec.plinths ?? [];

  // Plinths and foot.
  layout.levels.forEach((level, i) => {
    const relief = i < allPlinths.length ? allPlinths[i].relief : spec.foot.relief;
    block(parts, "lower", outlineFor(spec, level.half), level.bottom, level.top, { relief });
  });
  allPlinths.forEach((p, i) => {
    if (!p.balustrade) return;
    const level = layout.levels[i];
    balustrade(parts, outlineFor(spec, level.half), level.top, p.balustrade, stairs, spec.stairWidth / 2 + 0.6, !!p.balustradeRelief);
  });

  // Stairways.
  const ns = (d: Direction) => DIRECTIONS[d].z !== 0;
  for (const d of stairs) for (const f of ns(d) ? layout.flightsNS : layout.flights) stairFlight(parts, "lower", d, f, spec.stairWidth);

  // Body with chamber. `face` gives a face's distance from the centre on oblong plans.
  const aspect = spec.aspect ?? 1;
  const face = (d: Direction, s: number) => (ns(d) ? s * aspect : s);
  const bodyLoop = outlineFor(spec, spec.body.half);
  const y0 = layout.footTop;
  const y1 = layout.bodyTop;
  const masonry = parts.get("middle", "masonry");
  const chamber = rectOutline(layout.chamberHalf, layout.chamberHalfZ);
  const inner = (d: Direction) => (ns(d) ? layout.chamberHalfZ : layout.chamberHalf);
  const doorAt = (loop: Vec2[]) => {
    const map = new Map<number, { width: number; height: number }>();
    loop.forEach((p, i) => {
      const q = loop[(i + 1) % loop.length];
      const n = edgeNormal(loop, i);
      for (const d of spec.doors) {
        const v = DIRECTIONS[d];
        const mid = v.x !== 0 ? (p.z + q.z) / 2 : (p.x + q.x) / 2;
        if (n.x === v.x && n.z === v.z && Math.abs(mid) < 1e-6) map.set(i, spec.door);
      }
    });
    return map;
  };
  walls(masonry, bodyLoop, y0, y1, { openings: doorAt(bodyLoop) });
  walls(masonry, chamber, y0, y1, { inward: true, openings: doorAt(chamber) });
  const dw = spec.door.width / 2;
  const dh = Math.min(spec.door.height, spec.body.height - 0.3);
  for (const d of spec.doors) {
    const ci = inner(d);
    const bh = face(d, spec.body.half);
    // Reveal: jambs and soffit through the wall thickness.
    for (const side of [-1, 1]) {
      const a = axis(d, ci, side * dw, y0);
      const b = axis(d, bh, side * dw, y0);
      const c = axis(d, bh, side * dw, y0 + dh);
      const e = axis(d, ci, side * dw, y0 + dh);
      const lateral = DIRECTIONS[d].x !== 0 ? ([0, 0, -side] as const) : ([-side, 0, 0] as const);
      masonry.quad(a, b, c, e, lateral);
    }
    masonry.quad(axis(d, ci, -dw, y0 + dh), axis(d, bh, -dw, y0 + dh), axis(d, bh, dw, y0 + dh), axis(d, ci, dw, y0 + dh), [0, -1, 0]);
    // Door frame and Kala head.
    axisBox(masonry, d, [bh - 0.1, bh + 0.12], [-dw - 0.3, -dw], [y0, y0 + dh + 0.3]);
    axisBox(masonry, d, [bh - 0.1, bh + 0.12], [dw, dw + 0.3], [y0, y0 + dh + 0.3]);
    axisBox(masonry, d, [bh - 0.1, bh + 0.12], [-dw - 0.3, dw + 0.3], [y0 + dh, y0 + dh + 0.3]);
    const [kx, , kz] = axis(d, bh + 0.1, 0, 0);
    // The mask fills the wall between lintel and cornice, never wider than the door frame.
    const k = Math.min(spec.door.width + 0.5, (y1 - 0.45 - (y0 + dh + 0.3)) / 0.75);
    if (k > 0.2) parts.get("middle", "statue").geometry(kala(), placement(kx, y0 + dh + 0.3, kz, d, k));
  }
  parts.get("middle", "nicheShadow").cap(chamber, y1 - 0.01, [], false);

  // Niches on the faces without doors.
  const bay = bayOf(spec);
  const nw = Math.min(spec.door.width, spec.body.half * bay.width * 1.2) / 2;
  const nh = dh * 0.85;
  const sill = y0 + Math.max(0.3, (spec.body.height - nh) * 0.35);
  for (const d of ["east", "south", "west", "north"] as const) {
    if (spec.doors.includes(d) || spec.niches === undefined) continue;
    const s = face(d, spec.body.half);
    axisBox(masonry, d, [s - 0.1, s + 0.2], [-nw - 0.28, -nw], [sill - 0.15, sill + nh + 0.3]);
    axisBox(masonry, d, [s - 0.1, s + 0.2], [nw, nw + 0.28], [sill - 0.15, sill + nh + 0.3]);
    axisBox(masonry, d, [s - 0.1, s + 0.2], [-nw - 0.28, nw + 0.28], [sill + nh, sill + nh + 0.3]);
    axisBox(masonry, d, [s - 0.1, s + 0.2], [-nw - 0.28, nw + 0.28], [sill - 0.15, sill]);
    const shadow = parts.get("middle", "nicheShadow");
    shadow.quad(axis(d, s + 0.01, -nw, sill), axis(d, s + 0.01, nw, sill), axis(d, s + 0.01, nw, sill + nh), axis(d, s + 0.01, -nw, sill + nh), [
      DIRECTIONS[d].x,
      0,
      DIRECTIONS[d].z,
    ]);
    const [kx, , kz] = axis(d, s + 0.2, 0, 0);
    const kn = Math.min(nw * 2 + 0.5, (y1 - 0.45 - (sill + nh + 0.3)) / 0.75);
    if (kn > 0.2) parts.get("middle", "statue").geometry(kala(), placement(kx, sill + nh + 0.3, kz, d, kn));
    if (spec.niches !== "empty") {
      const [x, , z] = axis(d, s + 0.12, 0, 0);
      const geometry = spec.niches === "buddha" ? seatedBuddha() : deity();
      const scale = spec.niches === "buddha" ? nh * 0.75 : nh * 0.95;
      parts.get("middle", "statue").geometry(geometry, placement(x, sill, z, d, scale));
    }
  }

  // Cornice over the body.
  const corniceOut = Math.min(0.4, spec.body.half * 0.06);
  const cornice = offsetLoop(bodyLoop, corniceOut);
  walls(masonry, cornice, y1 - 0.45, y1);
  ring(masonry, cornice, bodyLoop, y1 - 0.45, false);
  parts.get("middle", "floor").cap(cornice, y1);

  // Chamber image.
  if (spec.image) {
    const image = IMAGES[spec.image.kind];
    parts.get("middle", "statue").geometry(image.geometry(), placement(0, y0, 0, spec.doors[0] ?? "east", spec.image.height / image.height));
  }

  // Roof tiers, each a shrinking replica of the body with finials at its corners and bay faces.
  const roof = parts.get("upper", "masonry");
  for (const tier of layout.tiers) {
    const loop = outlineFor(spec, tier.half);
    const h = tier.top - tier.bottom;
    walls(roof, loop, tier.bottom, tier.top - h * 0.18);
    const lip = offsetLoop(loop, tier.half * 0.05);
    walls(roof, lip, tier.top - h * 0.18, tier.top);
    ring(roof, lip, loop, tier.top - h * 0.18, false);
    parts.get("upper", "floor").cap(lip, tier.top);
    if (spec.roof.finial === "none") continue;
    const c = tier.half * (1 - bay.depth) * 0.92;
    const e = tier.half * 0.92;
    const spots = [
      [c, c],
      [c, -c],
      [-c, c],
      [-c, -c],
      [e, 0],
      [-e, 0],
      [0, e],
      [0, -e],
    ].map(([x, z]) => [x, z === 0 ? 0 : Math.sign(z) * (tier.half * aspect - (tier.half - Math.abs(z)))]);
    const size = Math.min(h * 0.95, tier.half * 0.42);
    const finial = crownGeometry(spec.roof.finial);
    for (const [x, z] of spots) roof.geometry(finial, placement(x, tier.top, z, "east", size));
  }
  if (spec.crown.kind !== "none") {
    const top = layout.tiers.at(-1)?.top ?? layout.bodyTop;
    roof.geometry(crownGeometry(spec.crown.kind), placement(0, top, 0, "east", spec.crown.height));
  }

  return { parts: parts.build(), layout };
}
