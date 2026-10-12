import { BoxGeometry, CylinderGeometry, Matrix4 } from "three";
import type { MeshBuilder } from "../../render/mesh-builder";
import type { StoneTextures } from "../../render/stone";
import { type CompoundShrine, buildCompound } from "../kit/compound";
import { terrace } from "../kit/enclosure";
import { deity, ratna, stupa } from "../kit/ornaments";
import { type Direction, placement, rectOutline, squareRing } from "../kit/plan";
import { type ShrineSpec, block, shrineLayout } from "../kit/shrine";
import { type Part, Parts, type Site } from "../kit/site";
import { eye } from "../kit/tour";
import type { CandiModel } from "../types";

/**
 * Geometry sources: Véronique Degroot, "Candi, Space and Landscape" (Leiden 2009), appendix entry
 * for Plaosan Lor — twin main temples A1/A2 of 23.3 m (N–S) × 15.7 m (E–W) facing west (264°),
 * each an oblong two-storey body with a vestibule and three rooms per floor; a shared inner
 * courtyard of 100 m (N–S) × 38.7 m (E–W) split by an east–west wall with a central gopura and
 * pierced by two west gopura in front of the entrances; three rows of perwara outside it — an
 * inner row of 50 square shrines (≈ 4.5 m, outward facing), central and outer rows of 116 stupas
 * with eight corner shrines (NW/SW turned west, NE/SE east); the whole enclosed by a 225 m (N–S)
 * × 87 m (E–W) wall; and structure C, a 21.7 × 18.9 m pendopo terrace at the north end with a
 * west stair and 16 octagonal column bases, ringed by rows of collapsed stupas. The per-side
 * shrine counts (7 N · 7 S · 19 E · 17 W for the inner row), the paduraksa form of the gates, the
 * dvarapala pairs and the six large stupas of the north yard come from candi.pnri.go.id (quoted
 * on ki-demang.com). Heights are not published; the main temples are drawn ≈ 21 m tall after
 * arkadewi.id, the only figure found, and the roof as stepped tiers crowned by a stupa after
 * photographs. Simplifications: the two storeys are drawn as one tall chamber (the wooden floor
 * is lost, as at Sari), the entrance-side bay projects on all four faces (the kit has no
 * one-sided bay), per-side row counts are evened out onto symmetric rectangles (19 E / 17 W → 20
 * / 20), the outer enclosures (415 × 245 m, moat, 460 × 290 m) and Plaosan Kidul are not
 * modelled, and which perwara stand restored is illustrative.
 */

const MAIN: ShrineSpec = {
  // Twin candi induk, 23.3 × 15.7 m, on a ~60 cm base without a gallery (PNRI). The aspect gives
  // the oblong N–S plan; local east becomes the real west entrance through `facing: "west"`.
  foot: { half: 7.85, height: 0.6 },
  body: { half: 7.2, height: 12.2, wall: 1.3 },
  door: { width: 1.5, height: 2.8 },
  doors: ["east"],
  stairWidth: 2.2,
  bay: { width: 0.4, depth: 0.12 },
  aspect: 1.48, // 23.3 / 15.7
  roof: { tiers: 3, first: 2.6, shrink: 0.8, finial: "stupa" },
  crown: { kind: "stupa", height: 3 },
  niches: "deity", // rows of near life-size bodhisattvas line the outer walls
  image: { kind: "buddha", height: 2.6 }, // the central bronze Buddhas are lost
};

const CAITYA: ShrineSpec = {
  // The square perwara shrines, about 4.5 m on a side (Degroot); restored examples are slim towers.
  foot: { half: 2.25, height: 1.1 },
  body: { half: 1.7, height: 2.7, wall: 0.5 },
  door: { width: 0.8, height: 1.6 },
  doors: ["east"],
  stairWidth: 1,
  roof: { tiers: 3, first: 1.5, shrink: 0.8, finial: "stupa" },
  crown: { kind: "stupa", height: 1.5 },
};

/** The twin temples, 30 m apart centre to centre (aroengbinang), in a 100 × 38.7 m court. */
const COURT = { halfX: 19.35, halfZ: 50, cz: 48 };
const NORTH_Z = COURT.cz - 25;
const SOUTH_Z = COURT.cz + 25;

/**
 * The three perwara rows, inside out. Totals follow Degroot: row 0 is 50 shrines (perSide 7 +
 * perSideZ 20); rows 1 and 2 are 54 + 62 stupas whose four corners are shrines (58 and 66 items).
 */
const ROWS = [
  { half: 23.5, halfZ: 55, perSide: 7, perSideZ: 20 },
  { half: 28, halfZ: 60, perSide: 11, perSideZ: 18 },
  { half: 32.5, halfZ: 65, perSide: 13, perSideZ: 21 },
];

/** Second enclosure, 225 m N–S × 87 m E–W (Degroot), with west doors on the A1, A2 and C axes. */
const WALL = { halfX: 43.5, halfZ: 112.5, cz: 2.5, height: 1.6, thickness: 0.9 };
const GATES = [-62, NORTH_Z, SOUTH_Z]; // -62 is the pendopo axis, a door Bernet Kempers suspected

/** Structure C, the pendopo terrace at the north end of the compound. */
const PENDOPO = { x: 0, z: -62 };

/** Illustrative survival: the inner row keeps the most restorations, most stupas are rubble. */
function standing(row: number, i: number): boolean {
  return row === 0 ? (i * 7 + 2) % 12 < 3 : (i * 5 + row) % 4 < 3;
}

function isCorner(p: { x: number; z: number }, row: (typeof ROWS)[number]): boolean {
  return Math.abs(Math.abs(p.x) - row.half) < 0.01 && Math.abs(Math.abs(p.z) - row.halfZ) < 0.01;
}

function shrines(): CompoundShrine[] {
  const out: CompoundShrine[] = [
    { spec: MAIN, at: { x: 0, z: NORTH_Z }, facing: "west", tour: { topic: "twins", label: "Candi Induk Utara" } },
    { spec: MAIN, at: { x: 0, z: SOUTH_Z }, facing: "west", tour: { topic: "facades", label: "Candi Induk Selatan" } },
  ];
  ROWS.forEach((row, r) => {
    squareRing(row.half, row.perSide, row.halfZ, row.perSideZ).forEach((p, i) => {
      const at = { x: p.position.x, z: p.position.z + COURT.cz };
      if (r === 0) out.push({ spec: CAITYA, at, facing: p.facing, ruined: !standing(r, i) });
      else if (isCorner(p.position, row)) {
        // Degroot: the eight corner shrines face east or west, not along their side.
        out.push({ spec: CAITYA, at, facing: p.position.x > 0 ? "east" : "west", ruined: !standing(r, i) });
      }
    });
  });
  return out;
}

/** Plaosan's perwara stupas are slender bells on a two-step base (PNRI: "jauh lebih kurus" than Borobudur's). */
function stupaPiece(): Part[] {
  const parts = new Parts();
  block(parts, "lower", rectOutline(1.15, 1.15), 0, 0.55);
  block(parts, "lower", rectOutline(0.8, 0.8), 0.55, 1.05);
  parts.get("upper", "masonry").geometry(stupa(), placement(0, 1.05, 0, "east", 2.7));
  return parts.build();
}

/** A collapsed stupa: the base under a low cone of blocks, as the stupa fields look today. */
function stupaRuinPiece(): Part[] {
  const parts = new Parts();
  block(parts, "lower", rectOutline(1.15, 1.15), 0, 0.45);
  const heap = parts.get("middle", "masonry");
  const unit = new BoxGeometry(1, 1, 1);
  let seed = 9;
  const r = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 18; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 1.35;
    const h = Math.max(0.15, 1.05 * (1 - d / 1.35) * (0.4 + r() * 0.6));
    const s = 0.35 + r() * 0.4;
    heap.geometry(unit, new Matrix4().makeTranslation(Math.cos(a) * d, 0.45 + h / 2, Math.sin(a) * d).multiply(new Matrix4().makeScale(s, h, s * 0.8)));
  }
  [1.9, 1.2].forEach((w, i) => heap.geometry(unit, new Matrix4().makeTranslation(0, 0.45 + i * 0.3, 0).multiply(new Matrix4().makeScale(w, 0.3, w))));
  return parts.build();
}

/** Stupa positions: the 116 perwara stupas around the temples, then structure C's stupa rows. */
function stupaMatrices(): { standing: Matrix4[]; ruined: Matrix4[] } {
  const standing: Matrix4[] = [];
  const ruined: Matrix4[] = [];
  ROWS.slice(1).forEach((row, r) => {
    squareRing(row.half, row.perSide, row.halfZ, row.perSideZ).forEach((p, i) => {
      if (isCorner(p.position, row)) return;
      const m = placement(p.position.x, 0, p.position.z + COURT.cz, p.facing);
      ((i * 7 + r) % 10 < 1 ? standing : ruined).push(m);
    });
  });
  // Around the pendopo: three rows east and west, one north and south, all reduced to piles of
  // stone (Degroot), plus the six large stupas of the north yard (PNRI).
  for (let i = 0; i < 12; i++) {
    ruined.push(placement(-16.5 + i * 3, 0, PENDOPO.z - 14, "east", 1.3));
    ruined.push(placement(-16.5 + i * 3, 0, PENDOPO.z + 14, "east", 1.3));
  }
  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < 9; i++) ruined.push(placement(19 + c * 6, 0, PENDOPO.z - 12 + i * 3, "east", 1.3));
    for (let i = 0; i < 8; i++) ruined.push(placement(-19 - c * 6, 0, PENDOPO.z - 10.5 + i * 3, "east", 1.3));
  }
  for (let i = 0; i < 6; i++) standing.push(placement(-12.5 + i * 5, 0, PENDOPO.z - 24, "east", 1.6));
  return { standing, ruined };
}

/** Simplified paduraksa gate in the west enclosure wall at `z`: pylons, lintel, stepped roof. */
function paduraksa(b: MeshBuilder, wx: number, z: number): void {
  const gap = 1.5;
  const pw = 1.4;
  const ph = 5;
  const x0 = wx - 1.1;
  const x1 = wx + 1.1;
  for (const s of [-1, 1] as const) {
    const za = Math.min(z + s * gap, z + s * (gap + pw));
    const zb = Math.max(z + s * gap, z + s * (gap + pw));
    b.box([x0, 0, za], [x1, ph * 0.55, zb], {});
    let yy = ph * 0.55;
    for (let k = 0; k < 4; k++) {
      const h = ph * (0.13 - k * 0.02);
      const inset = 0.18 * k;
      b.box([x0 + inset, yy, s < 0 ? za + inset : za], [x1 - inset, yy + h, s > 0 ? zb - inset : zb], {});
      yy += h;
    }
  }
  const lintel = ph * 0.55;
  b.box([x0, lintel - 0.6, z - gap], [x1, lintel, z + gap], {});
  let yy = lintel;
  let half = gap + pw;
  for (let k = 0; k < 5; k++) {
    const h = ph * 0.1 * (1 - k * 0.1);
    half *= 0.82;
    b.box([x0 + k * 0.15, yy, z - half], [x1 - k * 0.15, yy + h, z + half], {});
    yy += h;
  }
  b.geometry(ratna(), placement(wx, yy, z, "east", Math.max(1, half)));
}

/** The 225 × 87 m second enclosure wall (Degroot), broken by the three west doors. */
function enclosureWall(site: Site): void {
  const b = site.get("lower", "masonry");
  const { halfX, halfZ, cz, height, thickness } = WALL;
  const t = thickness / 2;
  const z0 = cz - halfZ - t;
  const z1 = cz + halfZ + t;
  const x0 = -halfX - t;
  const x1 = halfX + t;
  const run = (a: number, bb: number, c: number, d: number): void => {
    b.box([a, 0, bb], [c, height, d], {});
    b.box([a, height, bb], [c, height + 0.25, d], {});
  };
  for (const [a, z] of [
    [z0, GATES[0] - 1.5],
    [GATES[0] + 1.5, GATES[1] - 1.5],
    [GATES[1] + 1.5, GATES[2] - 1.5],
    [GATES[2] + 1.5, z1],
  ] as const) {
    run(x0, a, -halfX + t, z);
  }
  run(halfX - t, z0, x1, z1);
  run(x0, z0, x1, cz - halfZ + t);
  run(x0, cz + halfZ - t, x1, z1);
  for (const z of GATES) paduraksa(b, -halfX, z);
}

/** Structure C: the pendopo terrace, its 16 column bases, and the corner-shrine pillar bases. */
function pendopo(site: Site): void {
  site.place(terrace({ halfX: 9.45, halfZ: 10.85, height: 1.8, stairs: ["west"], stairWidth: 2.4 }), placement(PENDOPO.x, 0, PENDOPO.z));
  const masonry = site.get("lower", "masonry");
  const umpak = new CylinderGeometry(0.38, 0.44, 0.35, 8);
  for (const p of squareRing(5.5, 6, 6.5, 4)) masonry.geometry(umpak, placement(p.position.x, 1.8, p.position.z + PENDOPO.z, "east"));
  // Each corner shrine of the stupa rows stands inside a ring of pillar bases (PNRI).
  const base = new BoxGeometry(0.45, 0.35, 0.45);
  for (const row of ROWS.slice(1)) {
    for (const cx of [-row.half, row.half]) {
      for (const czz of [-row.halfZ + COURT.cz, row.halfZ + COURT.cz]) {
        for (const p of squareRing(3.2, 4, 3.2, 4)) masonry.geometry(base, placement(cx + p.position.x, 0, czz + p.position.z, "east"));
      }
    }
  }
}

export function buildPlaosan(textures: StoneTextures): CandiModel {
  const built = buildCompound(
    {
      name: "Plaosan Lor",
      courts: [{ halfX: COURT.halfX, halfZ: COURT.halfZ, cz: COURT.cz }],
      // One court per temple: the shared wall between them carries the central gopura (Degroot).
      enclosures: [
        { halfX: COURT.halfX, halfZ: COURT.halfZ / 2, cz: COURT.cz - COURT.halfZ / 2, height: 2.6, thickness: 0.7, gates: ["west", "south"], gateWidth: 2.6, gate: "paduraksa" },
        { halfX: COURT.halfX, halfZ: COURT.halfZ / 2, cz: COURT.cz + COURT.halfZ / 2, height: 2.6, thickness: 0.7, gates: ["west", "north"], gateWidth: 2.6, gate: "paduraksa" },
      ],
      shrines: shrines(),
      extra(site) {
        pendopo(site);
        enclosureWall(site);
        // Two pairs of dvarapala at the north and south west gates, facing each other across the
        // passage (PNRI); the seated giants are drawn as simplified standing figures.
        const statue = site.get("lower", "statue");
        for (const z of [NORTH_Z, SOUTH_Z]) {
          for (const [dz, front] of [
            [-3.4, "south"],
            [3.4, "north"],
          ] as const) {
            statue.geometry(deity(), placement(-WALL.halfX, 0, z + dz, front as Direction).multiply(new Matrix4().makeScale(1.5, 1.9, 1.5)));
          }
        }
        const { standing: up, ruined } = stupaMatrices();
        for (const p of stupaPiece()) site.instanceGeometry(p.geometry, site.material(p.realm, p.key), up, true);
        for (const p of stupaRuinPiece()) site.instanceGeometry(p.geometry, site.material(p.realm, p.key), ruined, true);
      },
      approach: { from: { x: -100, z: NORTH_Z }, topic: "overview", label: "Approach from the west gates" },
    },
    textures,
  );
  // Route the walk between the twin temples through the central gopura of the dividing wall
  // instead of straight across it.
  const lead = shrineLayout(MAIN).stairReach + 4;
  const [approach, north, south] = built.tour;
  built.tour = [
    approach,
    north,
    {
      ...south,
      points: [eye(0, 0, COURT.cz - 5), eye(0, 0, COURT.cz), eye(0, 0, COURT.cz + 5), eye(-lead, 0, COURT.cz + 5), ...south.points],
    },
  ];
  return built;
}
