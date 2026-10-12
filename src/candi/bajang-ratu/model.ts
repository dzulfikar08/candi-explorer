import { CylinderGeometry, Matrix4, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court } from "../kit/enclosure";
import { kala, ratna } from "../kit/ornaments";
import { offsetLoop, placement, rectOutline } from "../kit/plan";
import { block, walls } from "../kit/shrine";
import { Site } from "../kit/site";
import { eye, path } from "../kit/tour";
import type { CandiModel, TourSection } from "../types";

/**
 * Sources: Kepustakaan Candi, Perpustakaan Nasional RI, "Candi Bajangratu" (passage runs west–east
 * and the gate faces both east and west; body 6.74 m long; meru roof of stacked tiers with a square
 * peak; sun relief in the middle of the third layer; false-door niches north and south; brick
 * throughout except stone stairs, passage floor and sills; stairs up and down; Sri Tanjung on the
 * foot walls beside the stair, Ramayana on the front walls beside the door, kala over the doorway),
 * Wikipedia "Gapura Bajang Ratu" citing I.G. Bagus Arnawa 1998 (plan 11.5 × 10.5 m, height 16.5 m,
 * passage 1.4 m wide, foot 2.48 m, site at 41.49 m elevation) and budayajatim.com (Dinas Kebudayaan
 * Jatim; 1915 consolidation, restoration 1989–1992), plus Wikipedia "Paduraksa" (the oldest
 * paduraksa still standing, mid-14th century, 16.5 m).
 *
 * Simplifications: the gate is drawn facing west for the approach (it faces both ways); reliefs are
 * carried by the kit's panel texture only, except the sun disc on the third roof layer; the roof is
 * an 8-tier meru stack with corner ratna, ending in the square cap and finial the photos show.
 */

// Published figures (see header): 11.5 × 10.5 m footprint, 16.5 m tall, passage 1.4 m wide,
// foot storey 2.48 m, body 6.74 m long.
const FOOT_HALF_X = 5.75;
const FOOT_HALF_Z = 5.25;
const FOOT_H = 2.48;
const BODY_HALF_X = 3.37;
const BODY_HALF_Z = 2.9;
const BODY_TOP = 9.28;
const PASSAGE_HALF = 0.7;
const PASSAGE_H = 3.9;
const CORNICE_Y = 8.88;
const ROOF_BASE = BODY_TOP;
const TIER_H = 0.75;
// Meru profile: tiers shrink fast at first, then slower — a concave mountain outline.
const TIERS: [number, number][] = [
  [3.5, 3.05],
  [3.1, 2.7],
  [2.73, 2.37],
  [2.4, 2.09],
  [2.1, 1.83],
  [1.82, 1.59],
  [1.58, 1.37],
  [1.35, 1.17],
];
const STAIR_W = 2.6;
const STAIR_TREAD = 0.3;

/** Openings the passage cuts through the body's east and west faces (walls() numbers rectOutline edges 0=east, 2=west). */
function passageOpenings(): Map<number, { width: number; height: number }> {
  const at: Record<"0" | "2", { width: number; height: number }> = {
    "0": { width: PASSAGE_HALF * 2, height: PASSAGE_H },
    "2": { width: PASSAGE_HALF * 2, height: PASSAGE_H },
  };
  return new Map(Object.entries(at).map(([edge, opening]) => [Number(edge), opening]));
}

/** Flight of stone steps (andesite in reality) up one end of the platform, without the kit's makara — East Javanese gates drop it. */
function stairFlight(site: Site, face: "east" | "west"): void {
  const floor = site.get("lower", "floor");
  const masonry = site.get("lower", "masonry");
  const sign = face === "west" ? -1 : 1;
  const box = (s: [number, number], u: [number, number], y: [number, number], target = masonry) => {
    const x0 = sign < 0 ? -s[1] : s[0];
    const x1 = sign < 0 ? -s[0] : s[1];
    target.box([x0, y[0], Math.min(u[0], u[1])], [x1, y[1], Math.max(u[0], u[1])], {});
  };
  const n = Math.ceil(FOOT_H / 0.24);
  const riser = FOOT_H / n;
  const w = STAIR_W / 2;
  const cheek = 0.45;
  for (let j = 1; j <= n; j++) {
    const top = j * riser;
    // Overlap under the platform lip so no gap shows at the top step.
    box([FOOT_HALF_X - 0.3, FOOT_HALF_X + j * STAIR_TREAD], [-w, w], [0, top], floor);
    for (const side of [-1, 1]) box([FOOT_HALF_X - 0.3, FOOT_HALF_X + j * STAIR_TREAD], [side * w, side * (w + cheek)], [0, Math.min(top + 0.75, FOOT_H + 0.75)]);
  }
}

export function buildBajangRatu(textures: StoneTextures): CandiModel {
  const site = new Site("Bajang Ratu", textures, "brick");

  // Paved forecourt, then the moulded foot platform (kaki) with its relief dado.
  court(site, 19, 15);
  block(site, "lower", rectOutline(FOOT_HALF_X, FOOT_HALF_Z), 0, FOOT_H, { relief: true });
  stairFlight(site, "west");
  stairFlight(site, "east");

  // Body (tubuh): a tall block pierced by the 1.4 m passage. The outer skin carries the openings;
  // the inner masses (4 cm inside the skin) close the tunnel: side walls, ceiling and end reveals.
  const masonry = site.get("middle", "masonry");
  const bodyLoop = rectOutline(BODY_HALF_X, BODY_HALF_Z);
  walls(masonry, bodyLoop, FOOT_H, BODY_TOP, { openings: passageOpenings() });
  masonry.box([-BODY_HALF_X + 0.04, FOOT_H, PASSAGE_HALF], [BODY_HALF_X - 0.04, BODY_TOP - 0.04, BODY_HALF_Z - 0.04], {});
  masonry.box([-BODY_HALF_X + 0.04, FOOT_H, -BODY_HALF_Z + 0.04], [BODY_HALF_X - 0.04, BODY_TOP - 0.04, -PASSAGE_HALF], {});
  masonry.box([-BODY_HALF_X + 0.04, FOOT_H + PASSAGE_H, -PASSAGE_HALF], [BODY_HALF_X - 0.04, BODY_TOP - 0.04, PASSAGE_HALF], {});

  // Base band on the body, then door frames and the heavy lintel band on both fronts, kala above.
  const baseLip = offsetLoop(bodyLoop, 0.1);
  walls(masonry, baseLip, FOOT_H, FOOT_H + 0.3);
  masonry.cap(baseLip, FOOT_H + 0.3, [bodyLoop], true);
  for (const sx of [-1, 1]) {
    const xi = sx * BODY_HALF_X;
    const xo = sx * (BODY_HALF_X + 0.22);
    const x: [number, number] = [Math.min(xi, xo), Math.max(xi, xo)];
    masonry.box([x[0], FOOT_H, PASSAGE_HALF], [x[1], FOOT_H + PASSAGE_H + 0.7, PASSAGE_HALF + 0.36], {});
    masonry.box([x[0], FOOT_H, -PASSAGE_HALF - 0.36], [x[1], FOOT_H + PASSAGE_H + 0.7, -PASSAGE_HALF], {});
    masonry.box([x[0], FOOT_H + PASSAGE_H, -PASSAGE_HALF - 0.36], [x[1], FOOT_H + PASSAGE_H + 0.7, PASSAGE_HALF + 0.36], {});
    const kx = sx * (BODY_HALF_X + 0.22);
    site.get("middle", "statue").geometry(kala(), placement(kx, FOOT_H + PASSAGE_H + 0.7, 0, sx < 0 ? "west" : "east", 1.6));
  }

  // False-door niches (relung) on the north and south faces, as on the real gate.
  const shadow = site.get("middle", "nicheShadow");
  for (const side of [-1, 1]) {
    const z: [number, number] = [Math.min(side * BODY_HALF_Z, side * (BODY_HALF_Z + 0.18)), Math.max(side * BODY_HALF_Z, side * (BODY_HALF_Z + 0.18))];
    masonry.box([-0.93, 3.35, z[0]], [-0.65, 6.45, z[1]], {});
    masonry.box([0.65, 3.35, z[0]], [0.93, 6.45, z[1]], {});
    masonry.box([-0.93, 3.35, z[0]], [0.93, 3.6, z[1]], {});
    masonry.box([-0.93, 6.15, z[0]], [0.93, 6.45, z[1]], {});
    const zs = side * (BODY_HALF_Z + 0.01);
    shadow.quad([-0.65, 3.6, zs], [0.65, 3.6, zs], [0.65, 6.15, zs], [-0.65, 6.15, zs], [0, 0, side]);
  }

  // Cornice closing the body, projecting over the roof foot.
  const cornice = offsetLoop(bodyLoop, 0.35);
  walls(masonry, cornice, CORNICE_Y, BODY_TOP);
  masonry.cap(cornice, CORNICE_Y, [bodyLoop], false);
  site.get("middle", "floor").cap(cornice, BODY_TOP);

  // Roof (atap): a meru of moulded tiers, each with a projecting lip, square cap and ratna finial.
  const roof = site.get("upper", "masonry");
  const floor = site.get("upper", "floor");
  let y = ROOF_BASE;
  TIERS.forEach(([hx, hz], i) => {
    const loop = rectOutline(hx, hz);
    walls(roof, loop, y, y + TIER_H * 0.75);
    const lip = offsetLoop(loop, 0.12);
    walls(roof, lip, y + TIER_H * 0.75, y + TIER_H);
    roof.cap(lip, y + TIER_H * 0.75, [loop], false);
    floor.cap(lip, y + TIER_H);
    if (i === 0 || i === 2) {
      for (const qx of [-1, 1])
        for (const qz of [-1, 1])
          site.get("upper", "statue").geometry(ratna(), new Matrix4().makeTranslation(qx * (hx - 0.25), y + TIER_H, qz * (hz - 0.25)).multiply(new Matrix4().makeScale(0.42, 0.42, 0.42)));
    }
    if (i === 2) {
      // The sun (Surya Majapahit) sits in the middle of the third layer, east and west faces.
      for (const sx of [-1, 1])
        site.get("upper", "statue").geometry(
          new CylinderGeometry(0.3, 0.3, 0.08, 20),
          new Matrix4().makeTranslation(sx * (hx + 0.05), y + TIER_H / 2, 0).multiply(new Matrix4().makeRotationZ(Math.PI / 2)),
        );
    }
    y += TIER_H;
  });
  roof.box([-0.55, y, -0.55], [0.55, y + 0.34, 0.55], {});
  site.get("upper", "statue").geometry(ratna(), new Matrix4().makeTranslation(0, y + 0.34, 0).multiply(new Matrix4().makeScale(0.9, 0.9, 0.9)));

  // Wing walls (sayap) with end pylons, projecting from the foot near the west front. The fence
  // walls that once continued them survive only as foundations and are not drawn.
  for (const side of [-1, 1] as const) {
    const zm = side * (FOOT_HALF_Z + 6.05);
    const zp = side * (FOOT_HALF_Z + 7.45);
    const wall: [number, number] = [Math.min(FOOT_HALF_Z * side, zm), Math.max(FOOT_HALF_Z * side, zm)];
    const pylon: [number, number] = [Math.min(zm, zp), Math.max(zm, zp)];
    masonry.box([-4.7, 0, wall[0]], [-3.6, 1.7, wall[1]], {});
    masonry.box([-4.55, 1.7, wall[0]], [-3.75, 2.0, wall[1]], {});
    masonry.box([-4.4, 2.0, wall[0]], [-3.9, 2.25, wall[1]], {});
    masonry.box([-4.85, 0, pylon[0]], [-3.45, 3.3, pylon[1]], {});
    masonry.box([-4.7, 3.3, pylon[0] + side * 0.15], [-3.6, 3.6, pylon[1] - side * 0.15], {});
    masonry.box([-4.55, 3.6, pylon[0] + side * 0.3], [-3.75, 3.85, pylon[1] - side * 0.3], {});
  }

  return { ...site.finish(), tour: buildTour(), walkSpawn: { position: new Vector3(-32, 0, 0), yaw: Math.atan2(-32, 0) } };
}

/** Walk in from the west lawn, climb, pass straight through the gate, and circle it on the grass. */
export function buildTour(): TourSection[] {
  const half = BODY_HALF_X + 0.37;
  return [
    { topic: "overview", label: "Approach from the west", points: [...path(0, [-32, 0], [-18, 0], [-10.6, 0])], lookRight: 0 },
    {
      topic: "passage",
      label: "Through the gate",
      points: [
        eye(-10.6, 0, 0),
        eye(-8.75, 2.2, 0),
        eye(-6.8, FOOT_H, 0),
        eye(-half, FOOT_H, 0),
        eye(0, FOOT_H, 0),
        eye(half, FOOT_H, 0),
        eye(6.8, FOOT_H, 0),
        eye(8.75, 2.2, 0),
        eye(10.6, 0, 0),
      ],
      lookRight: 0,
    },
    {
      topic: "gate",
      label: "Around the gate",
      points: [...path(0, [11.8, 0], [10.8, 6.8], [0, 10.2], [-10.8, 6.8], [-11.8, 0]), eye(-14.5, 0, 0)],
      lookRight: 0.25,
    },
  ];
}
