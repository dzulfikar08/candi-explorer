import { CylinderGeometry, LatheGeometry, Matrix4, Vector2, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { ALL_DIRECTIONS, placement, rectOutline } from "../kit/plan";
import { block, walls } from "../kit/shrine";
import { type Part, Parts, Site } from "../kit/site";
import { terrace } from "../kit/enclosure";
import type { CandiModel } from "../types";
import { BLANDONGAN, BLANDONGAN_HALF, BLANDONGAN_TOP } from "./layout";
import { buildTour } from "./tour";

/**
 * Sources: Wikipedia "Batujaya" (en) and "Percandian Batujaya" (id); Widyastuti & Saptono 2024,
 * "Divisions of Space of Batujaya Temple Complex in Karawang, West Java" (Atlantis Press,
 * Incolwis 2022 proceedings); photodharma.net "Batujaya Candi Sites" (Anandajoti Bhikkhu, site
 * data from the site guide); Kompas 14/5/2020 (Jiwa 19 × 19 m, 4.7 m high); OpenStreetMap ways
 * 499582316 (Candi Jiwa) and 482379225 (Candi Blandongan) for the relative positions.
 *
 * Layout: the two restored temples stand about 200 m apart, Blandongan at bearing ≈320° (N–NW)
 * of Jiwa — the SE–NW axis the whole complex follows. That true distance is kept. The buildings
 * themselves are drawn aligned to the cardinals although the complex axis is SE–NW, and the two
 * are placed on the same axis here so the pair reads as it does on the site.
 */

/** Candi Jiwa (Segaran I), the south-eastern temple. */
export const JIWA = { x: 64, z: 77 };
/** Candi Blandongan (Segaran V), the north-western temple. */
export const BLANDONGAN = { x: -64, z: -77 };
/** Blandongan platform: 25 × 25 m first level, standing 2.2 m before the central body rises. */
export const BLANDONGAN_HALF = 12.5;
export const BLANDONGAN_TOP = 2.2;
/** stairRun(2.2): how far the flights project from the platform edge. */
export const BLANDONGAN_RUN = stairRun(BLANDONGAN_TOP);

/** Stair half-width at the platform edge (flights are 2.6 m wide). */
const STAIR_HALF = 1.3;

/**
 * Candi Jiwa: a square brick platform 19 × 19 m and 4.7 m high with no stairs; its top is shaped
 * as eight lotus petals around a circular brick base (rolak) that probably carried a stupa.
 * Worshippers walked the 2.65 m pradaksina path around it, drawn here as a paved ring.
 */
function jiwaParts(): Part[] {
  const parts = new Parts();
  const lower = parts.get("lower", "masonry");
  // Moulded foot: the patta / uttara / kumuda plinth bands, simplified to the kit profile.
  block(parts, "lower", rectOutline(9.5, 9.5), 0, 1.05, { scale: 1.8 });
  // Plain square shaft up to the second tier.
  walls(lower, rectOutline(9.15, 9.15), 1.05, 2.85);
  lower.cap(rectOutline(9.15, 9.15), 2.85);
  // Upper square tier, out of which the petals rise.
  block(parts, "middle", rectOutline(7.4, 7.4), 2.85, 3.85, { scale: 1.2 });
  // Eight lotus petals: an eight-segment lathe flaring out over the tier and curling in to the
  // centre. The petals' real brick profile is simplified to this flare.
  const upper = parts.get("upper", "masonry");
  const petals = new LatheGeometry(
    [
      [6.95, 3.78],
      [7.42, 4.06],
      [7.18, 4.3],
      [5.4, 4.48],
      [3.1, 4.55],
      [2.5, 4.6],
      [1.2, 4.66],
      [0.05, 4.68],
    ].map(([r, y]) => new Vector2(r, y)),
    8,
  );
  upper.geometry(petals, new Matrix4());
  // The circular stupa base in its square rolak border — the only element on the crown level.
  const rolak = new CylinderGeometry(1.5, 1.62, 0.25, 24);
  upper.geometry(rolak, new Matrix4().makeTranslation(0, 4.575, 0));
  // Pradaksina path, 2.65 m of brick paving around the foot.
  parts.get("lower", "floor").cap(rectOutline(12.3, 12.3), 0.05, [rectOutline(9.65, 9.65)]);
  return parts.build();
}

/**
 * Candi Blandongan, upper parts: a balustrade of unknown height (drawn 1.05 m) around the
 * platform edge, opened for the four stairs; squared corner blocks and semi-circular pillars
 * between stairs and corners; twelve pillar bases in the hallway that carried a wooden cungkup
 * (the posts themselves are not reconstructed); and the 10 × 10 m central body, of which about
 * half survives to the present standing height of ≈ 4.7 m. The crowning stupa has collapsed and
 * its form is unknown, so nothing is rebuilt above the body.
 */
function blandonganUpper(): Part[] {
  const parts = new Parts();
  const mid = parts.get("middle", "masonry");
  const centre = 12.2;
  const thickness = 0.55;
  for (const d of ALL_DIRECTIONS) {
    const v = d === "east" ? { x: 1, z: 0 } : d === "west" ? { x: -1, z: 0 } : d === "south" ? { x: 0, z: 1 } : { x: 0, z: -1 };
    const p = { x: -v.z, z: v.x };
    const at = (a: number) => ({ x: v.x * centre + p.x * a, z: v.z * centre + p.z * a });
    // Two balustrade stretches per side, broken by the stair opening in the middle.
    for (const [a0, a1] of [
      [STAIR_HALF + 0.5, centre - 1.3],
      [-(centre - 1.3), -(STAIR_HALF + 0.5)],
    ] as const) {
      const c0 = at(a0);
      const c1 = at(a1);
      const x0 = Math.min(c0.x, c1.x) - Math.abs(v.x) * (thickness / 2);
      const x1 = Math.max(c0.x, c1.x) + Math.abs(v.x) * (thickness / 2);
      const z0 = Math.min(c0.z, c1.z) - Math.abs(v.z) * (thickness / 2);
      const z1 = Math.max(c0.z, c1.z) + Math.abs(v.z) * (thickness / 2);
      mid.box([x0, BLANDONGAN_TOP, z0], [x1, BLANDONGAN_TOP + 1.05, z1], {});
    }
    // Semi-circular pilasters on the outer wall face, one between the stair and each corner.
    for (const a of [6.5, -6.5]) {
      const c = at(a);
      const pilaster = new CylinderGeometry(0.7, 0.78, BLANDONGAN_TOP, 12);
      parts.get("lower", "masonry").geometry(pilaster, new Matrix4().makeTranslation(c.x + v.x * 0.3, BLANDONGAN_TOP / 2, c.z + v.z * 0.3));
    }
  }
  // Squared corner projections, set flush inside the platform edge.
  for (const sx of [1, -1]) {
    for (const sz of [1, -1]) {
      mid.box([sx * 11.7 - 0.8, BLANDONGAN_TOP, sz * 11.7 - 0.8], [sx * 11.7 + 0.8, BLANDONGAN_TOP + 1.6, sz * 11.7 + 0.8], {});
    }
  }
  // Twelve wooden-post bases, three per side, lining the hallway between body and balustrade.
  for (const a of [-4.5, 0, 4.5]) {
    for (const r of [8.4, -8.4]) {
      mid.box([a - 0.33, BLANDONGAN_TOP, r - 0.33], [a + 0.33, BLANDONGAN_TOP + 0.35, r + 0.33], {});
      mid.box([r - 0.33, BLANDONGAN_TOP, a - 0.33], [r + 0.33, BLANDONGAN_TOP + 0.35, a + 0.33], {});
    }
  }
  // The central body: a moulded base and the standing half of the 10 × 10 m structure.
  block(parts, "middle", rectOutline(5.2, 5.2), BLANDONGAN_TOP, BLANDONGAN_TOP + 0.35, { scale: 1.1 });
  walls(mid, rectOutline(4.9, 4.9), BLANDONGAN_TOP + 0.35, 4.7);
  mid.cap(rectOutline(4.9, 4.9), 4.7);
  return parts.build();
}

/** Both restored temples on their true SE–NW axis, 200 m apart. */
export function buildBatujaya(textures: StoneTextures): CandiModel {
  const site = new Site("Batujaya", textures, "brick");
  site.place(jiwaParts(), placement(JIWA.x, 0, JIWA.z));
  site.place(
    terrace({
      halfX: BLANDONGAN_HALF,
      halfZ: BLANDONGAN_HALF,
      height: BLANDONGAN_TOP,
      stairs: ["east", "south", "west", "north"],
      stairWidth: STAIR_HALF * 2,
    }),
    placement(BLANDONGAN.x, 0, BLANDONGAN.z),
  );
  site.place(blandonganUpper(), placement(BLANDONGAN.x, 0, BLANDONGAN.z));
  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(82.5, 0, 124.5), yaw: Math.atan2(82.5, 124.5) },
  };
}
