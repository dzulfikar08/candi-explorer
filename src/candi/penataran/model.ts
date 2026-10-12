import { Matrix4, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court, enclosure, terrace } from "../kit/enclosure";
import { deity, linggaYoni, ratna } from "../kit/ornaments";
import { type Direction, placement } from "../kit/plan";
import { ruin } from "../kit/ruin";
import { type ShrineSpec, shrine, shrineLayout } from "../kit/shrine";
import { type Part, Site } from "../kit/site";
import type { CandiModel } from "../types";
import { buildTour } from "./tour";

/**
 * Sources: Wikipedia "Candi Penataran" (Indonesian) for dimensions and dates — Bale Agung
 * 37 × 18.84 m, 1.44 m high; Pendopo Teras 29.05 × 9.22 × 1.5 m; Candi Naga 4.83 × 6.57 m and
 * 4.70 m tall (foot and body only); the main temple's three terraces 7.19 m high — and
 * Wikipedia "Penataran" (English) for the complex's history and the wooden-roof hypothesis.
 *
 * The real complex lies on a west-north-west – east-south-east axis; here it is snapped to
 * west – east (+x is the rear), a rotation of about 22°. The front court is stone (andesite) per
 * the sources; the brick gate and foundations are drawn in the same stone because a site has one
 * fabric in this kit.
 */

/** Candi Candra Sengkala, the Dated Temple (Candi Angka Tahun / Brawijaya), 1291 Saka = 1369 CE. */
export const DATED: ShrineSpec = {
  plinths: [{ half: 3.1, height: 0.7 }],
  foot: { half: 2.4, height: 1.0, relief: true },
  body: { half: 1.75, height: 3.6, wall: 0.7 },
  door: { width: 1.1, height: 2.1 },
  doors: ["west"],
  niches: "empty",
  stairWidth: 1.8,
  bay: { width: 0.3, depth: 0.06 },
  roof: { tiers: 2, first: 1.5, shrink: 0.75, finial: "none" },
  crown: { kind: "none", height: 0 },
  // The chamber holds a seated Ganesha; the kit's standing deity stands in for it.
  image: { kind: "deity", height: 1.3 },
};

/**
 * Candi Naga, 1208 Saka = 1286 CE under Kertanegara. Published state: 6.57 m long (E–W),
 * 4.83 m wide, 4.70 m tall, foot and body only — the roof is lost.
 */
export const NAGA: ShrineSpec = {
  foot: { half: 3.35, height: 1.3, relief: true },
  body: { half: 2.8, height: 3.4, wall: 0.6 },
  aspect: 0.72,
  door: { width: 1.2, height: 2.2 },
  doors: ["west"],
  niches: "empty",
  stairWidth: 2.0,
  roof: { tiers: 0, first: 0, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
};

/** The main temple's upper shrine, reconstructed on the ground beside its stepped base. */
export const CELLA: ShrineSpec = {
  foot: { half: 2.6, height: 0.5 },
  body: { half: 2.05, height: 2.7, wall: 0.6 },
  door: { width: 1.1, height: 1.9 },
  doors: ["west"],
  niches: "empty",
  stairWidth: 1.8,
  roof: { tiers: 0, first: 0, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
};

/** A small roofless shrine among the brick foundations of the middle court's north-east corner. */
const ROOFLESS: ShrineSpec = {
  foot: { half: 1.9, height: 0.8, relief: true },
  body: { half: 1.4, height: 2.3, wall: 0.5 },
  door: { width: 1.0, height: 1.7 },
  doors: ["west"],
  niches: "empty",
  stairWidth: 1.6,
  roof: { tiers: 0, first: 0, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
};

/** The "klein heiligdom" of the rear court's south-west side, a small shrine that collapsed. */
const SIDE: ShrineSpec = {
  foot: { half: 1.8, height: 0.7, relief: true },
  body: { half: 1.3, height: 2.2, wall: 0.5 },
  door: { width: 1.0, height: 1.6 },
  doors: ["west"],
  niches: "empty",
  stairWidth: 1.6,
  roof: { tiers: 1, first: 1.2, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
};

/** Rebuilt paduraksa over the stair into the rear court (only foundations survive). */
function paduraksa(site: Site, x: number, y: number, z: number): void {
  const b = site.get("lower", "masonry");
  for (const side of [-1, 1]) {
    const lo = side < 0 ? -3.0 : 1.8;
    const hi = side < 0 ? -1.8 : 3.0;
    b.box([x - 0.3, y, z + lo], [x + 1.9, y + 2.9, z + hi], {});
  }
  b.box([x - 0.3, y + 2.5, z - 3.0], [x + 1.9, y + 2.95, z + 3.0], {});
  let yy = y + 2.95;
  let half = 3.0;
  for (const h of [0.5, 0.45, 0.4]) {
    half -= 0.4;
    b.box([x - 0.1, yy, z - half], [x + 1.7, yy + h, z + half], {});
    yy += h;
  }
  b.geometry(ratna(), placement(x + 0.8, yy, z, "east", 1.0));
}

/** A guardian statue (dwarapala, mahakala) on a pedestal, facing `front`. */
function guardian(site: Site, x: number, y: number, z: number, front: Direction, height: number): void {
  const s = site.get("lower", "statue");
  s.box([x - 0.7, y, z - 0.7], [x + 0.7, y + 0.5, z + 0.7], {});
  s.geometry(deity(), placement(x, y + 0.5, z, front).multiply(new Matrix4().makeScale(height * 0.7, height, height * 0.7)));
}

/** Rows of stone pillar bases (umpak) that carried the wooden posts of a pendopo roof. */
function pillarBases(site: Site, cx: number, cz: number, y: number, halfX: number, halfZ: number, cols: number): void {
  const b = site.get("lower", "masonry");
  for (const sz of [-1, 1]) {
    for (let k = 0; k < cols; k++) {
      const x = cx - halfX + ((2 * halfX) / (cols - 1)) * k;
      const z = cz + sz * halfZ;
      b.box([x - 0.45, y, z - 0.45], [x + 0.45, y + 0.6, z + 0.45], {});
    }
  }
}

/** The nine deities that carry the serpent around Candi Naga's body, and a banded naga in place of the carving. */
function nagaRing(site: Site, cx: number, cz: number, floorY: number): void {
  const body = site.get("middle", "masonry");
  const statue = site.get("middle", "statue");
  const base = floorY + 1.3;
  const spots: [number, number][] = [
    [2.95, 2.15],
    [2.95, -2.15],
    [-2.95, 2.15],
    [-2.95, -2.15],
    [2.95, 0],
    [0, 2.25],
    [0, -2.25],
    [-2.95, 1.2],
    [-2.95, -1.2],
  ];
  for (const [dx, dz] of spots) {
    const front: Direction = Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? "east" : "west") : dz > 0 ? "south" : "north";
    statue.geometry(deity(), placement(cx + dx, base, cz + dz, front).multiply(new Matrix4().makeScale(1.4, 1.9, 1.4)));
  }
  // The serpent's body as a continuous band around the upper body, below the cornice.
  body.box([cx - 3.1, base + 2.0, cz - 2.35], [cx + 3.1, base + 2.6, cz - 1.95], {});
  body.box([cx - 3.1, base + 2.0, cz + 1.95], [cx + 3.1, base + 2.6, cz + 2.35], {});
  body.box([cx + 2.6, base + 2.0, cz - 2.35], [cx + 3.1, base + 2.6, cz + 2.35], {});
  body.box([cx - 3.1, base + 2.0, cz - 2.35], [cx - 2.6, base + 2.6, cz + 2.35], {});
  // Raised heads: a pair above the west door and one at each east corner.
  body.box([cx - 3.4, base + 2.6, cz - 1.5], [cx - 2.8, base + 3.1, cz - 0.9], {});
  body.box([cx - 3.4, base + 2.6, cz + 0.9], [cx - 2.8, base + 3.1, cz + 1.5], {});
  body.box([cx + 2.8, base + 2.6, cz - 1.9], [cx + 3.4, base + 3.1, cz - 1.3], {});
  body.box([cx + 2.8, base + 2.6, cz + 1.3], [cx + 3.4, base + 3.1, cz + 1.9], {});
}

export function buildPenataran(textures: StoneTextures): CandiModel {
  const site = new Site("Penataran", textures);

  // Three courts rising toward the rear (east): the front at ground level, then terraces of
  // 1.2 m and 2.6 m — the rear court "lies on higher ground" as the most sacred part.
  court(site, 25, 26, -50, 0);
  site.place(terrace({ halfX: 25, halfZ: 21, height: 1.2, stairs: ["west"], stairWidth: 3.2 }), placement(0, 0, 0));
  site.place(terrace({ halfX: 25, halfZ: 24, height: 1.4, y: 1.2, stairs: ["west"], stairWidth: 3.2 }), placement(50, 0, 0));

  // Perimeter wall: the west gate flanked by dated dwarapala is attested; the run is drawn all
  // round at full height although only footings survive elsewhere.
  enclosure(site, { halfX: 78, halfZ: 26, height: 2.6, thickness: 0.9, gates: ["west"], gateWidth: 3.6, gate: "paduraksa" });
  // The divisions between courts are low today; each keeps a gap where the stair arrives.
  enclosure(site, { halfX: 25, halfZ: 21, y: 1.2, height: 0.6, thickness: 0.6, gates: ["west"], gateWidth: 4.4, gate: "none" });
  enclosure(site, { halfX: 25, halfZ: 24, cx: 50, cz: 0, y: 2.6, height: 0.6, thickness: 0.6, gates: ["west"], gateWidth: 4.4, gate: "none" });
  paduraksa(site, 25, 2.6, 0);

  // First courtyard, north side: the Bale Agung, 37 × 18.84 m and 1.44 m high, its walls carved
  // with nagas, its roof carried on wooden pillars whose stone bases remain.
  site.place(
    terrace({ halfX: 18.5, halfZ: 9.42, height: 1.44, stairs: ["south", "east", "west"], stairWidth: 2.4, relief: true }),
    placement(-52, 0, -8),
  );
  pillarBases(site, -52, -8, 1.44, 15, 6.5, 6);

  // The Pendopo Teras, 29.05 × 9.22 m and 1.5 m high, dated 1297 Saka (1375 CE), south-east of
  // the Bale Agung, also ringed by nagas and story reliefs.
  site.place(terrace({ halfX: 14.5, halfZ: 4.6, height: 1.5, stairs: ["west"], stairWidth: 2.4, relief: true }), placement(-40, 0, 13));
  pillarBases(site, -40, 13, 1.5, 11.5, 2.8, 6);

  // The Dated Temple, about 20 m south-east of the Pendopo Teras, with its own low enclosure
  // wall and the statue read as Gayatri Rajapatni beside it. The cube mastaka sits on the flat top.
  site.place(shrine(DATED).parts, placement(-21, 0, 16, "west"));
  enclosure(site, { halfX: 5.6, halfZ: 5.6, cx: -21, cz: 16, height: 0.7, thickness: 0.45, gates: ["west"], gateWidth: 1.6, gate: "none" });
  const datedTip = shrineLayout(DATED).height;
  site.get("upper", "masonry").box([-21.55, datedTip, 15.45], [-20.45, datedTip + 1.0, 16.55], {});
  guardian(site, -21, 0, 23.4, "west", 1.5);

  // Two brick foundations north-east of the Dated Temple.
  const footings = site.get("lower", "masonry");
  footings.box([-18, 0, 7.25], [-14, 0.4, 10.75], {});
  footings.box([-13.5, 0, 5], [-10.5, 0.4, 8], {});

  // Gate guardians: the dated pairs at the west entrance (1310), the middle court (1319) and the
  // rear court (1320), plus the mahakala at the main temple's stair (1347).
  guardian(site, -79.6, 0, -2.7, "west", 2.2);
  guardian(site, -79.6, 0, 2.7, "west", 2.2);
  guardian(site, -23, 1.2, -2.7, "west", 1.7);
  guardian(site, -23, 1.2, 2.7, "west", 1.7);
  guardian(site, 27.2, 2.6, -3.6, "west", 1.7);
  guardian(site, 27.2, 2.6, 3.6, "west", 1.7);
  guardian(site, 28.6, 2.6, -2.3, "west", 1.6);
  guardian(site, 28.6, 2.6, 2.3, "west", 1.6);

  // Second courtyard: Candi Naga near its centre; the north-east group of foundations,
  // platforms and a roofless shrine; the 10 × 20 m brick foundation on the south-west side.
  site.place(shrine(NAGA).parts, placement(2, 1.2, 3, "west"));
  nagaRing(site, 2, 3, 1.2);
  site.place(shrine(ROOFLESS).parts, placement(16, 1.2, -10, "west"));
  footings.box([11.5, 1.2, -16], [18.5, 1.6, -12], {});
  footings.box([19.5, 1.2, -17], [23.5, 1.6, -13], {});
  footings.box([7, 1.2, -17.5], [12, 1.6, -14.5], {});
  footings.box([20, 1.2, -7], [25, 2.0, -3], {});
  footings.box([10, 1.2, -8], [14, 1.9, -4.5], {});
  footings.box([-23, 1.2, 5], [-3, 1.7, 15], {});
  footings.box([-18, 1.2, 15.5], [-14, 1.7, 19.5], {});

  // Third courtyard: the main temple, three relief terraces 7.19 m high in total (2.4 + 2.4 +
  // 2.39), each climbed from the west. The main temple's upper shrine — a walk-in cella — was
  // found collapsed and is shown rebuilt on the ground south-east of the base; the top of the
  // third terrace is left empty (its lost superstructure was probably wood and thatch).
  site.place(terrace({ halfX: 17, halfZ: 13, height: 2.4, y: 2.6, stairs: ["west"], stairWidth: 3, relief: true }), placement(48, 0, 0));
  site.place(terrace({ halfX: 13, halfZ: 10, height: 2.4, y: 5.0, stairs: ["west"], stairWidth: 2.6, relief: true }), placement(48, 0, 0));
  site.place(terrace({ halfX: 9.5, halfZ: 8.5, height: 2.39, y: 7.4, stairs: ["west"], stairWidth: 2.2, relief: true }), placement(48, 0, 0));
  site.place(shrine(CELLA).parts, placement(69, 2.6, 6, "west"));

  // Rear court, south-west: the collapsed small shrine, and the Palah inscription lingga.
  const side = ruin(SIDE, 5);
  const sideParts: Part[] = [...side];
  site.instance(sideParts, [placement(42, 2.6, 16.5, "west")]);
  const statue = site.get("lower", "statue");
  statue.box([51.1, 2.6, 14.1], [52.9, 3.1, 15.9], {});
  statue.geometry(linggaYoni(), placement(52, 3.1, 15, "west", 1.7));

  // Five building remains along the north-west side, one the metre-high platform with story reliefs.
  footings.box([28, 2.6, -18], [32, 3.0, -15], {});
  footings.box([33, 2.6, -20], [36, 3.2, -17], {});
  footings.box([37, 2.6, -18.5], [41, 3.0, -16], {});
  footings.box([30, 2.6, -13.5], [33, 3.6, -10.5], {});
  footings.box([34.5, 2.6, -11.5], [37, 2.9, -9], {});

  // The ritual bathing pool of 1337 Saka (1415 CE) behind the main temple, near the river.
  const pool = site.get("lower", "masonry");
  pool.box([61, 2.6, 9], [71, 3.6, 9.6], {});
  pool.box([61, 2.6, 14.4], [71, 3.6, 15], {});
  pool.box([61, 2.6, 9], [61.6, 3.6, 15], {});
  pool.box([70.4, 2.6, 9], [71, 3.6, 15], {});
  // The pool holds water: the bottom is the kit's still-water surface (not tinted by realm overlays).
  site.get("lower", "water").box([61.6, 2.6, 9.6], [70.4, 2.7, 14.4], {});

  const tour = buildTour();
  return {
    ...site.finish(),
    tour,
    walkSpawn: { position: new Vector3(-120, 0, 0), yaw: Math.atan2(-120, 0) },
  };
}
