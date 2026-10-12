import { Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court } from "../kit/enclosure";
import { kala, ratna } from "../kit/ornaments";
import { placement, rectOutline } from "../kit/plan";
import { block } from "../kit/shrine";
import { Parts, Site } from "../kit/site";
import type { CandiModel } from "../types";
import { buildTour } from "./tour";

/**
 * Gunung Kawi is carved, not built: the two gorge walls are treated as masses of rock with tall
 * corbel-arched niches recessed ~1 m into them, and each shrine is a shallow facade standing in
 * the back of its niche. The valley floor stays at ground level y = 0 — the real ~300-step descent
 * from the plateau is not modelled. The Pakerisan runs south at x ≈ -3.5; the east-bank five face
 * west, the west-bank four face east, as on the site.
 */

/** Carved face plane of each cliff, ±x; rock continues 23 m further out. */
const FACE = 11;
/** Niches recessed 0.9 m — shallower than the real ~1.25 m so sky light reaches the facades. */
const NICHE_D = 0.9;
const CELL_D = 2.4;
const BACK = 23;
/** Flat carved band tops: shrine niches close at 9.5, cave cells at 3.4. */
const BAND_TOP = 9.5;
const CELL_TOP = 3.4;
/** Corbelled niche arch: three recess steps. */
const ARCH = { l0: 6.55, l1: 7.35, l2: 8.15 };

const EAST_BAND = { z0: -26, z1: -3 };
const WEST_BAND = { z0: -25, z1: -5 };
const CELL_BAND = { z0: 1.5, z1: 15.5 };

interface Niche {
  z0: number;
  z1: number;
  big: boolean;
}

/** East group of five, centred on the largest shrine; z decreases northward, so the first is the "north shrine". */
const EAST_NICHES: Niche[] = [
  { z0: -24.5, z1: -21.8, big: false },
  { z0: -20.6, z1: -17.9, big: false },
  { z0: -16.7, z1: -13.75, big: true },
  { z0: -12.55, z1: -9.85, big: false },
  { z0: -8.65, z1: -5.95, big: false },
];

const WEST_NICHES: Niche[] = [
  { z0: -23.4, z1: -20.7, big: false },
  { z0: -19.5, z1: -16.8, big: false },
  { z0: -15.6, z1: -12.9, big: false },
  { z0: -11.7, z1: -9.0, big: false },
];

/** One row of meditation cells stands in for the ~34 caves scattered along the real gorge. */
const CELLS: { z0: number; z1: number }[] = [
  { z0: 3, z1: 4.7 },
  { z0: 6, z1: 7.7 },
  { z0: 9, z1: 10.7 },
  { z0: 12, z1: 13.7 },
];

/** Deterministic pseudo-random for rock jitter, so screenshots stay stable. */
const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * A shrine facade in relief: moulded pedestal, body with a false door framed by pilasters and
 * crowned with a kala, then three roof tiers each carrying two antefix "towers" — the real candi
 * bear three lingga-yoni ornaments per tier (the centre one hides behind the next tier here).
 * STD total ≈ 6.9 m, LARGE (Anak Wungsu) ≈ 7.4 m, matching the ~7 m published figures.
 */
function facade(parts: Parts, big: boolean): void {
  const s = big ? 1.07 : 1;
  const dado = 0.14 * s;
  block(parts, "lower", rectOutline(0.24 * s, 1.02 * s), 0, 1.25 * s, { scale: 0.5 });
  block(parts, "middle", rectOutline(0.14 * s, 0.85 * s), 1.25 * s, 4.15 * s, { scale: 0.5 });

  const dw = 0.31 * s;
  parts.get("middle", "nicheShadow").quad(
    [dado + 0.005, 1.25 * s, -dw],
    [dado + 0.005, 1.25 * s, dw],
    [dado + 0.005, 3.05 * s, dw],
    [dado + 0.005, 3.05 * s, -dw],
    [1, 0, 0],
  );
  const masonry = parts.get("middle", "masonry");
  for (const side of [-1, 1]) {
    const za = side > 0 ? dw : -dw - 0.12 * s;
    const zb = side > 0 ? dw + 0.12 * s : -dw;
    masonry.box([dado - 0.04, 1.25 * s, za], [dado + 0.05, 3.28 * s, zb]);
  }
  masonry.box([dado - 0.04, 3.05 * s, -dw - 0.12 * s], [dado + 0.05, 3.28 * s, dw + 0.12 * s]);
  for (const side of [-1, 1]) {
    masonry.box([dado - 0.04, 1.25 * s, side > 0 ? 0.7 * s : -0.86 * s], [dado + 0.06, 4.15 * s, side > 0 ? 0.86 * s : -0.7 * s]);
  }
  parts.get("middle", "statue").geometry(kala(), placement(dado + 0.06, 3.28 * s, 0, "east", 0.5 * s));

  block(parts, "middle", rectOutline(0.2 * s, 0.95 * s), 4.15 * s, 4.42 * s, { scale: 0.4 });
  let y = 4.42 * s;
  const statue = parts.get("upper", "statue");
  for (const w of [0.95, 0.75, 0.55]) {
    block(parts, "upper", rectOutline(0.2 * s, w * s), y, y + 0.62 * s, { scale: 0.35 });
    y += 0.62 * s;
    for (const side of [-1, 1]) statue.geometry(ratna(), placement(0.2 * s, y, side * (w * s - 0.12), "east", 0.3 * s));
  }
  statue.geometry(ratna(), placement(0, y, 0, "east", 0.62 * s));
}

/** One gorge wall. dir = 1 for the east bank (faces west), -1 for the west bank. */
function buildCliff(site: Site, dir: 1 | -1): void {
  const masonry = site.get("middle", "masonry");
  // Local x offsets a..b from the carved face into the rock, converted to world min/max. The west
  // bank mirrors about -FACE: [-(FACE+b), -(FACE+a)] — the old [FACE-b, FACE-a] collapsed the bank
  // to a ~1 m slab whose crest boxes stretched across the gorge in front of the east facades.
  const x = (a: number, b: number): [number, number] => (dir > 0 ? [FACE + a, FACE + b] : [-FACE - b, -FACE - a]);

  const plainSlabs = (z0: number, z1: number, seed: number): void => {
    let z = z0;
    let k = seed;
    while (z < z1 - 0.4) {
      const w = Math.min(2.2 + 1.3 * hash(k), z1 - z);
      const j = hash(k + 0.5) < 0.22 ? 1.1 : 0.5 * hash(k + 0.5);
      // Taper the ridge ends so the rock sinks into the lawn instead of ending in a wall.
      const taper = Math.max(0.15, Math.min(1, (z + 52) / 12, (28 - z) / 12));
      const h = 1 + (9.5 + 5 * hash(k + 0.25)) * taper;
      const [xa, xb] = x(j, BACK);
      masonry.box([xa, -1, z], [xb, h, z + w]);
      // Rocky skirt behind the crest so the ridge back descends instead of ending in a wall.
      const [sa, sb] = x(BACK, BACK + 5 + 4 * hash(k + 2));
      masonry.box([sa, -1, z], [sb, 2.5 + 3.5 * hash(k + 3), z + w]);
      z += w;
      k += 1;
    }
  };

  const crestSlabs = (band: { z0: number; z1: number }, y0: number, seed: number): void => {
    let z = band.z0;
    let k = seed;
    while (z < band.z1 - 0.4) {
      const w = Math.min(2.4 + 1.4 * hash(k), band.z1 - z);
      const [xa, xb] = x(hash(k + 0.5), BACK);
      masonry.box([xa, y0, z], [xb, y0 + 2 + 2.5 * hash(k + 0.75), z + w]);
      const [sa, sb] = x(BACK, BACK + 5 + 4 * hash(k + 1.25));
      masonry.box([sa, -1, z], [sb, 1.5 + 2.5 * hash(k + 1.5), z + w]);
      z += w;
      k += 1;
    }
  };

  const carveNiches = (niches: Niche[], band: { z0: number; z1: number }): void => {
    // Rock behind the niches: its front face is every niche's back wall.
    const [ba, bb] = x(NICHE_D, BACK);
    masonry.box([ba, -1, band.z0], [bb, BAND_TOP, band.z1]);
    const spans: [number, number][] = [[band.z0, niches[0].z0]];
    for (let i = 0; i < niches.length - 1; i++) spans.push([niches[i].z1, niches[i + 1].z0]);
    spans.push([niches[niches.length - 1].z1, band.z1]);
    for (const [a, b] of spans) {
      const [pa, pb] = x(0, NICHE_D);
      masonry.box([pa, -1, a], [pb, BAND_TOP, b]);
    }
    for (const n of niches) {
      const [xa, xb] = x(0, NICHE_D);
      site.get("lower", "floor").box([xa, -1, n.z0], [xb, 0.06, n.z1]);
      // Corbelled arch: two column pairs step the opening in, the cap closes to the band top.
      masonry.box([xa, ARCH.l0, n.z0], [xb, ARCH.l2, n.z0 + 0.3], { bottom: false });
      masonry.box([xa, ARCH.l0, n.z1 - 0.3], [xb, ARCH.l2, n.z1], { bottom: false });
      masonry.box([xa, ARCH.l1, n.z0 + 0.3], [xb, ARCH.l2, n.z0 + 0.6], { bottom: false });
      masonry.box([xa, ARCH.l1, n.z1 - 0.6], [xb, ARCH.l2, n.z1 - 0.3], { bottom: false });
      masonry.box([xa, ARCH.l2, n.z0 - 0.3], [xb, BAND_TOP, n.z1 + 0.3]);
      const fp = new Parts();
      facade(fp, n.big);
      // The east cliff sits in morning shadow: render the carved facades in the lighter statue
      // stone so they read against the dark rock around them (the real candi are lighter carved
      // faces in a dark cliff, not built masonry).
      const parts = fp.build().map((p) => (p.key === "masonry" ? { ...p, key: "statue" as const } : p));
      const facing = dir > 0 ? "west" : "east";
      const fx = dir > 0 ? FACE + NICHE_D - 0.02 : -(FACE + NICHE_D) + 0.02;
      site.place(parts, placement(fx, 0.06, (n.z0 + n.z1) / 2, facing));
      // Water spout below the niche (every real candi has one; the central is a naga).
      const c = (n.z0 + n.z1) / 2;
      const hw = n.big ? 0.2 : 0.11;
      const [sa, sb] = x(-0.32, 0);
      masonry.box([sa, 0.34, c - hw], [sb, 0.52, c + hw]);
    }
    crestSlabs(band, BAND_TOP, dir > 0 ? 40 : 140);
  };

  const carveCells = (): void => {
    const [ba, bb] = x(CELL_D, BACK);
    masonry.box([ba, -1, CELL_BAND.z0], [bb, CELL_TOP, CELL_BAND.z1]);
    const spans: [number, number][] = [[CELL_BAND.z0, CELLS[0].z0]];
    for (let i = 0; i < CELLS.length - 1; i++) spans.push([CELLS[i].z1, CELLS[i + 1].z0]);
    spans.push([CELLS[CELLS.length - 1].z1, CELL_BAND.z1]);
    for (const [a, b] of spans) {
      const [pa, pb] = x(0, CELL_D);
      masonry.box([pa, -1, a], [pb, CELL_TOP, b]);
    }
    for (const cell of CELLS) {
      const [xa, xb] = x(0, CELL_D);
      site.get("lower", "floor").box([xa, -1, cell.z0], [xb, 0.06, cell.z1]);
      masonry.box([xa, 2.0, cell.z0], [xb, 2.4, cell.z0 + 0.3], { bottom: false });
      masonry.box([xa, 2.0, cell.z1 - 0.3], [xb, 2.4, cell.z1], { bottom: false });
      masonry.box([xa, 2.4, cell.z0 - 0.3], [xb, CELL_TOP, cell.z1 + 0.3]);
      const [ta, tb] = x(0, 0.3);
      masonry.box([ta, 0, cell.z0], [tb, 0.18, cell.z1]);
      // Dark plane deep in the cell so the doorway reads as a room, not a dent.
      const bx = dir > 0 ? FACE + CELL_D - 0.02 : -(FACE + CELL_D) + 0.02;
      site.get("middle", "nicheShadow").quad([bx, 0.1, cell.z0 + 0.05], [bx, 0.1, cell.z1 - 0.05], [bx, 1.9, cell.z1 - 0.05], [bx, 1.9, cell.z0 + 0.05], [-dir, 0, 0]);
    }
    crestSlabs(CELL_BAND, CELL_TOP, 240);
  };

  if (dir > 0) {
    carveNiches(EAST_NICHES, EAST_BAND);
    plainSlabs(-52, EAST_BAND.z0, 0);
    plainSlabs(EAST_BAND.z1, 28, 20);
  } else {
    carveNiches(WEST_NICHES, WEST_BAND);
    carveCells();
    plainSlabs(-52, WEST_BAND.z0, 100);
    plainSlabs(WEST_BAND.z1, CELL_BAND.z0, 120);
    plainSlabs(CELL_BAND.z1, 28, 160);
  }
}

/** Stone footbridge over the Pakerisan in front of the central (Anak Wungsu) shrine. */
function buildBridge(site: Site): void {
  const m = site.get("middle", "masonry");
  m.box([-6.6, 0.55, -16], [-0.4, 0.75, -14.4]);
  m.box([-6.3, 0.75, -16], [-0.7, 1.25, -15.8]);
  m.box([-6.3, 0.75, -14.6], [-0.7, 1.25, -14.4]);
  for (const px of [-5.4, -3.5, -1.6]) m.box([px - 0.35, 0, -15.7], [px + 0.35, 0.55, -14.7]);
  m.box([-0.9, 0, -15.8], [-0.4, 0.38, -14.6]);
  m.box([-7.1, 0, -15.8], [-6.6, 0.38, -14.6]);
}

/** Split stone gate where the descent path enters the complex. */
function buildGate(site: Site): void {
  const m = site.get("middle", "masonry");
  for (const side of [-1, 1]) {
    const o = 3 + side * 2.4;
    const i = 3 + side * 1.0;
    m.box([Math.min(o, i), 0, -32.7], [Math.max(o, i), 2.1, -31.3]);
    const io = 3 + side * 2.0;
    m.box([Math.min(io, i), 2.1, -32.5], [Math.max(io, i), 3.3, -31.5]);
    m.box([Math.min(o - side * 0.1, i + side * 0.1), 3.3, -32.8], [Math.max(o - side * 0.1, i + side * 0.1), 3.7, -31.2]);
  }
}

/**
 * The Pakerisan as a rocky stone bed — the app has no water material, so the river reads as its
 * boulder-strewn streambed between low banks.
 */
function buildRiver(site: Site): void {
  court(site, 2.2, 40, -3.5, -10, 0.05);
  const m = site.get("middle", "masonry");
  let z = -49;
  let k = 300;
  while (z < 29) {
    const w = 1.2 + hash(k + 9) * 0.9;
    m.box([-1.3, 0, z], [-0.75 + hash(k + 3) * 0.5, 0.3 + hash(k + 5) * 0.45, z + w]);
    m.box([-6.25 - hash(k + 7) * 0.5, 0, z + 0.4], [-5.7, 0.3 + hash(k + 11) * 0.45, z + 0.4 + w]);
    if (hash(k + 13) < 0.22) {
      const bx = -4.5 + hash(k + 15) * 1.2;
      m.box([bx, 0, z + 0.5], [bx + 0.8, 0.25 + hash(k + 17) * 0.2, z + 1.4]);
    }
    z += 1.6 + hash(k) * 1.4;
    k += 1;
  }
}

export function buildGunungKawi(textures: StoneTextures): CandiModel {
  const site = new Site("Gunung Kawi", textures);
  court(site, 2, 45, 3, -8);
  court(site, 1.9, 20, -8.5, -4);
  buildRiver(site);
  buildCliff(site, 1);
  buildCliff(site, -1);
  buildBridge(site);
  buildGate(site);
  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(3, 0, -58), yaw: Math.PI },
  };
}
