import { Matrix4, Vector3 } from "three";
import type { MeshBuilder } from "../../render/mesh-builder";
import type { StoneTextures } from "../../render/stone";
import { court } from "../kit/enclosure";
import { deity, kala, linggaYoni } from "../kit/ornaments";
import { bayOutline, type Direction, DIRECTIONS, edgeNormal, offsetLoop, placement, rectOutline, type Vec2 } from "../kit/plan";
import { block, stairFlight, stairRun, walls, type Flight } from "../kit/shrine";
import { Site } from "../kit/site";
import { eye, loop, path } from "../kit/tour";
import type { CandiModel, Realm, TourSection } from "../types";

/**
 * Sources: Wikipedia "Singhasari temple" (funerary temple of Kertanegara per the Nagarakretagama
 * cantos 37:7 and 38:3 and the 1351 Gajah Mada inscription; orientation north-west toward Mount
 * Arjuno; elevation 512 m; 7°53′16″S 112°39′50″E), Indonesian Wikipedia "Candi Singasari"
 * (andesite, facing west, base 14 × 14 m, remaining height 14.1 m, built about 1300; chamber held
 * a lingga-yoni with Ganesha, Agastya and Durga on its sides, only Agastya surviving; statues
 * shipped to the Netherlands 1804/1819; Prajnaparamita now in Jakarta), Kepustakaan Candi
 * (Perpustakaan Nasional RI, candi.perpusnas.go.id: batur ~1.5 m high without relief, stairs
 * without makara cheeks, plain unfinished carving with an incomplete kala over the entrance,
 * two-storey look with empty niches and kala heads over the upper ones, partly collapsed meru
 * top, 1930s restoration leaving piles of stone in the yard; the Dvarapala pair ~300 m west of
 * the temple, 3.7 m tall, ~40 t each, ~20 m apart, originally facing east toward the temple and
 * thought to guard the gate of Kertanegara's palace to their west), and Indonesian Wikipedia
 * "Dwarapala" (the largest dvarapala in Java: a single andesite block 3.7 m tall). Volcano
 * heights: Arjuno 3339 m, Welirang 3156 m, Bromo 2329 m, Semeru 3676 m; the site sits at 512 m.
 *
 * Simplifications: the kit's shrine puts the chamber in the body, so the tower is assembled here
 * from kit primitives: a walk-in chamber at gallery level inside the lower storey (the real
 * temple's most distinctive trait — its sacred rooms sit in the foot), with empty niches on the
 * lower storey and the upper band. The two Dvarapalas stand in the plaza ~40 m west of the temple
 * (in reality ~300 m away, flanking the road to the alun-alun) and the kit's standing deity
 * stands in for their stocky, club-down crouch. Unfinished carving is not modelled; the roof is
 * three plain tiers to the surviving ~14.1 m with no finial. The temple faces west (Indonesian
 * Wikipedia: "menghadap ke barat"); English Wikipedia describes the orientation as north-west.
 */

// Vertical scheme (metres): batur 0 → 1.5, lower storey (chamber level) 1.5 → 8.0, upper storey
// band 8.0 → 11.4, meru tiers to 14.1 — matching the ~14.1 m standing height on a 14 m square.
const BATUR = { half1: 8.4, half2: 8.0 };
const LOWER = { half: 6.5, bayHalf: 2.73, bayDepth: 0.75, top: 8.0 };
const UPPER = { half: 4.7, y0: 8.0, top: 11.4 };
const DOOR = { width: 1.7, height: 3.2 };
const CHAMBER = { half: 2.2, ceiling: 5.0 };
/** Outer face of the projecting entrance bay (penampil). */
const BAY_FRONT = LOWER.half + LOWER.bayDepth;

/** Face-local coordinates (s outward along the face axis, u lateral) to world x/z/y. */
function facePoint(d: Direction, s: number, u: number, y: number): [number, number, number] {
  const v = DIRECTIONS[d];
  return v.x !== 0 ? [v.x * s, y, u] : [u, y, v.z * s];
}

/** Axis-aligned box on a temple face, mirroring the kit shrine's `axisBox`. */
function faceBox(b: MeshBuilder, d: Direction, s: [number, number], u: [number, number], y: [number, number]): void {
  const a = facePoint(d, s[0], u[0], y[0]);
  const c = facePoint(d, s[1], u[1], y[1]);
  b.box([Math.min(a[0], c[0]), y[0], Math.min(a[2], c[2])], [Math.max(a[0], c[0]), y[1], Math.max(a[2], c[2])]);
}

/** Index of the loop edge centred on face `d`: where `walls()` cuts a doorway. */
function edgeFacing(loop: readonly Vec2[], d: Direction): number {
  const v = DIRECTIONS[d];
  let found = 0;
  loop.forEach((p, i) => {
    const q = loop[(i + 1) % loop.length];
    const n = edgeNormal(loop, i);
    const mid = v.x !== 0 ? (p.z + q.z) / 2 : (p.x + q.x) / 2;
    if (n.x === v.x && n.z === v.z && Math.abs(mid) < 1e-6) found = i;
  });
  return found;
}

/**
 * A recessed statue niche with a plain frame, as on Singosari's lower storey and upper band. All
 * niches stand empty today. `kalaSize` adds the kala head the sources place over the thresholds
 * of the big bay niches and the upper ones (none over the small niches flanking the door).
 */
function niche(site: Site, realm: Realm, d: Direction, s: number, u: number, sill: number, width: number, height: number, kalaSize: number): void {
  const masonry = site.get(realm, "masonry");
  const nw = width / 2;
  faceBox(masonry, d, [s - 0.1, s + 0.2], [u - nw - 0.28, u - nw], [sill - 0.15, sill + height + 0.3]);
  faceBox(masonry, d, [s - 0.1, s + 0.2], [u + nw, u + nw + 0.28], [sill - 0.15, sill + height + 0.3]);
  faceBox(masonry, d, [s - 0.1, s + 0.2], [u - nw - 0.28, u + nw + 0.28], [sill + height, sill + height + 0.3]);
  faceBox(masonry, d, [s - 0.1, s + 0.2], [u - nw - 0.28, u + nw + 0.28], [sill - 0.15, sill]);
  const v = DIRECTIONS[d];
  const a = facePoint(d, s + 0.01, u - nw, sill);
  const c = facePoint(d, s + 0.01, u + nw, sill + height);
  site.get(realm, "nicheShadow").quad([a[0], sill, a[2]], [c[0], sill, c[2]], [c[0], sill + height, c[2]], [a[0], sill + height, a[2]], [v.x, 0, v.z]);
  if (kalaSize > 0) {
    const [kx, , kz] = facePoint(d, s + 0.2, u, 0);
    site.get(realm, "statue").geometry(kala(), placement(kx, sill + height + 0.3, kz, d, kalaSize));
  }
}

/** One plain meru tier: banded wall with a slight flare and a flat top. */
function tier(site: Site, half: number, y0: number, y1: number): void {
  const roof = site.get("upper", "masonry");
  const t = rectOutline(half, half);
  const band = (y1 - y0) * 0.18;
  walls(roof, t, y0, y1 - band);
  const lip = offsetLoop(t, half * 0.05);
  walls(roof, lip, y1 - band, y1);
  roof.cap(lip, y1 - band, [t], false);
  site.get("upper", "floor").cap(lip, y1);
}

/** Climb the west stair, walk the deep door passage into the foot chamber, circle the temple. */
function buildTour(): TourSection[] {
  const climb = [eye(-11.8, 0, 0), eye(-10.6, 0.75, 0), eye(-9.4, 0.75, 0), eye(-8.2, 1.5, 0)];
  return [
    { topic: "overview", label: "Approach from the west", points: path(0, [-70, 0], [-45, 0], [-30, 0]), lookRight: 0 },
    { topic: "dvarapala", label: "Between the gate giants", points: path(0, [-30, 0], [-40, 13.5], [-41.8, 0], [-40, -13.5]), lookRight: 0 },
    {
      topic: "chamber",
      label: "Into the foot chamber",
      points: [
        eye(-14, 0, 0),
        ...climb,
        eye(-7.1, 1.5, 0),
        eye(-5.5, 1.5, 0),
        eye(-1.5, 1.5, 0),
        eye(-5.5, 1.5, 0),
        eye(-7.1, 1.5, 0),
        ...[...climb].reverse(),
        eye(-12.5, 0, 0),
      ],
      lookRight: 0.3,
    },
    { topic: "unfinished", label: "Round the temple", points: [eye(-13, 0, 0), ...loop(11.5, 0, { start: "west" })], lookRight: -0.35 },
  ];
}

export function buildSingosari(textures: StoneTextures): CandiModel {
  const site = new Site("Singosari", textures);
  const masonryL = site.get("lower", "masonry");

  // Paved apron around the temple; the rest of the yard is the flat plaza lawn.
  court(site, 16, 16);

  // Batur: two plain moulded steps about 1.5 m tall — the sources note the kaki carries no relief.
  block(site, "lower", rectOutline(BATUR.half1, BATUR.half1), 0, 0.75);
  block(site, "lower", rectOutline(BATUR.half2, BATUR.half2), 0.75, 1.5);

  // West stair in two short flights: each rise stays under a metre, which also keeps the kit from
  // adding makara cheeks — Singosari's stair famously has none.
  const run = stairRun(0.75);
  const bottomFlight: Flight = { sTop: BATUR.half1 + 2, sBottom: BATUR.half1 + 2 + run, yLow: 0, yHigh: 0.75, landingFrom: BATUR.half1 };
  const topFlight: Flight = { sTop: BATUR.half2, sBottom: BATUR.half2 + run, yLow: 0.75, yHigh: 1.5, landingFrom: BATUR.half2 };
  stairFlight(site, "lower", "west", bottomFlight, 2.6, 0.4);
  stairFlight(site, "lower", "west", topFlight, 2.6, 0.4);

  // Lower storey: a 14 m square mass with a projecting bay on each face. The carving that exists
  // is plain flowers and animals — one more sign the temple was never finished.
  const outline = bayOutline(LOWER.half, LOWER.bayHalf, LOWER.bayDepth);
  walls(site.get("lower", "reliefSingle"), outline, 1.5, 7.6, {
    panel: true,
    openings: new Map([[edgeFacing(outline, "west"), { width: DOOR.width, height: DOOR.height }]]),
  });

  // The chamber sits IN the foot, at gallery level: enter from the west through ~5 m of masonry.
  const chamber = rectOutline(CHAMBER.half, CHAMBER.half);
  walls(masonryL, chamber, 1.5, CHAMBER.ceiling, {
    inward: true,
    openings: new Map([[edgeFacing(chamber, "west"), { width: DOOR.width, height: DOOR.height }]]),
  });
  site.get("lower", "floor").cap(chamber, CHAMBER.ceiling);
  site.get("lower", "nicheShadow").cap(chamber, CHAMBER.ceiling - 0.01, [], false);

  // Door passage: jambs and soffit through the wall, frame and the simple (in reality incomplete)
  // kala head at the bay front.
  const dw = DOOR.width / 2;
  const dh = 1.5 + DOOR.height;
  masonryL.quad([-BAY_FRONT, 1.5, -dw], [-CHAMBER.half, 1.5, -dw], [-CHAMBER.half, dh, -dw], [-BAY_FRONT, dh, -dw], [0, 0, -1]);
  masonryL.quad([-BAY_FRONT, 1.5, dw], [-CHAMBER.half, 1.5, dw], [-CHAMBER.half, dh, dw], [-BAY_FRONT, dh, dw], [0, 0, 1]);
  masonryL.quad([-BAY_FRONT, dh, -dw], [-CHAMBER.half, dh, -dw], [-CHAMBER.half, dh, dw], [-BAY_FRONT, dh, dw], [0, -1, 0]);
  faceBox(masonryL, "west", [BAY_FRONT - 0.1, BAY_FRONT + 0.12], [-dw - 0.3, -dw], [1.5, dh + 0.3]);
  faceBox(masonryL, "west", [BAY_FRONT - 0.1, BAY_FRONT + 0.12], [dw, dw + 0.3], [1.5, dh + 0.3]);
  faceBox(masonryL, "west", [BAY_FRONT - 0.1, BAY_FRONT + 0.12], [-dw - 0.3, dw + 0.3], [dh, dh + 0.3]);
  site.get("lower", "statue").geometry(kala(), placement(-(BAY_FRONT + 0.15), dh + 0.3, 0, "west", 2.2));

  // Two small plain niches flanking the entrance, set back on the main wall without kala heads.
  niche(site, "lower", "west", LOWER.half, -4.0, 2.6, 1.1, 2.2, 0);
  niche(site, "lower", "west", LOWER.half, 4.0, 2.6, 1.1, 2.2, 0);
  // One large empty niche per remaining face, inside its projecting bay, kala above the threshold.
  for (const d of ["east", "south", "north"] as const) niche(site, "lower", d, BAY_FRONT, 0, 2.4, 2.0, 2.8, 1.6);

  // The chamber held a lingga on a yoni (spout north); the flanking images are gone.
  site.get("lower", "statue").geometry(linggaYoni(), placement(0, 1.5, 0, "east", 1.6));

  // Cornice closing the lower storey.
  const lipL = offsetLoop(outline, 0.3);
  walls(masonryL, lipL, 7.6, 8.0);
  masonryL.cap(lipL, 7.6, [outline], false);
  site.get("lower", "floor").cap(lipL, 8.0);

  // Upper storey: the square band with one empty niche and a kala head per face that makes the
  // temple read as two storeys.
  const upper = rectOutline(UPPER.half, UPPER.half);
  walls(site.get("middle", "masonry"), upper, UPPER.y0, 11.0);
  for (const d of ["east", "south", "west", "north"] as const) niche(site, "middle", d, UPPER.half, 0, 8.6, 1.6, 1.7, 0.7);
  const lipU = offsetLoop(upper, 0.28);
  walls(site.get("middle", "masonry"), lipU, 11.0, UPPER.top);
  site.get("middle", "masonry").cap(lipU, 11.0, [upper], false);
  site.get("middle", "floor").cap(lipU, UPPER.top);

  // Meru roof: plain receding tiers to the flat, unfinished top — no finial was ever carved.
  tier(site, 4.0, UPPER.top, 12.7);
  tier(site, 3.2, 12.7, 13.5);
  tier(site, 2.4, 13.5, 14.1);

  // The two giant Dvarapala gate guardians: single andesite blocks 3.7 m tall, ~40 t, facing east
  // toward the temple. They actually stand about 300 m further west, flanking the road to the
  // alun-alun; they are drawn here inside the plaza so the approach passes between them. The kit's
  // standing deity, widened, stands in for their stocky, club-down crouch.
  for (const z of [-10, 10]) {
    masonryL.box([-42.2, 0, z - 1.8], [-37.8, 0.6, z + 1.8]);
    site.get("lower", "statue").geometry(deity(), placement(-40, 0.6, z, "east").multiply(new Matrix4().makeScale(4.6, 3.7, 4.6)));
  }

  // Heaps of stone the 1930s restoration never got back into place.
  for (const [x, z, sx, sz, h] of [
    [26, 14, 3.2, 2.2, 0.8],
    [-20, 24, 2.6, 3.0, 0.7],
    [24, -20, 2.2, 2.6, 0.6],
    [-24, -18, 3.0, 2.4, 0.9],
  ] as const) {
    masonryL.box([x - sx / 2, 0, z - sz / 2], [x + sx / 2, h, z + sz / 2]);
    masonryL.box([x - sx / 4, 0, z - sz / 4], [x + sx / 4, h + 0.3, z + sz / 4]);
  }

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(-70, 0, 0), yaw: -Math.PI / 2 },
  };
}
