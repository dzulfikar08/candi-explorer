import { Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court } from "../kit/enclosure";
import { rectOutline } from "../kit/plan";
import { Site } from "../kit/site";
import { eye } from "../kit/tour";
import type { CandiModel, Realm, TourSection } from "../types";

/**
 * Gapura Wringin Lawang, Jatipasar, Trowulan: a Majapahit red-brick split gate (candi bentar),
 * base 13 × 11 m, height 15.5 m (Wikipedia "Gapura Wringinlawang" and "Trowulan"). The vertical
 * profile — plinth skirt, pedestal, corniced foot and body, a great collar cornice, then eight
 * shrinking roof tiers and a small capped crown — is proportioned from photographs of the restored
 * gate on Wikimedia Commons ("Gapura Wringin Lawang", "022 Gateway Exit, Wringin Lawang", "023
 * Close Up, Wringin Lawang"). The surveyed footprint (OpenStreetMap way 1376045122, 12.5 × 10 m)
 * is aligned within 6° of the cardinal axes with the passage running east–west; the model snaps it
 * to exact east–west. Simplifications: the inner faces of the two halves are kept strictly
 * vertical and plain (they lean inward slightly), the weathered stepped brickwork becomes clean
 * moulded bands, the blind panels are dark quads, and the modern lightning rods are omitted.
 */

/** Half the clear slot between the two halves. */
const PASSAGE = 0.95;
/** Gate face from the centre: half the ~11 m depth plus the skirt. */
const FACE = 5.6;
/** Passage floor level: eight 0.3 m steps from the lawn. */
const FLOOR = 2.4;
const STAIR_RUN = 0.4;

/** Rectangular zones of one half, bottom up: [realm, y0, y1, outer edge from the split, half depth]. */
const ZONES: [Realm, number, number, number, number][] = [
  ["lower", 0, 0.5, 6.5, FACE],
  ["lower", 0.5, FLOOR, 6.35, 5.4],
  ["middle", 2.7, 5.55, 6.2, 5.15],
  ["middle", 5.9, 7.75, 5.9, 4.9],
];

/** Collar cornices between zones; the last is the great wing that shoulders the roof. */
const CORNICES: [Realm, number, number, number, number][] = [
  ["lower", FLOOR, 2.7, 6.5, 5.55],
  ["middle", 5.55, 5.9, 6.5, 5.35],
  ["middle", 7.75, 8.1, 6.5, 5.6],
];

const ROOF_Y = 8.1;
const TIER = 0.75;
const TIERS = 8;

/** Three small shrinking slabs crowning the tiers: [y0, y1, outer edge, half depth]. */
const CAPS: [number, number, number, number][] = [
  [ROOF_Y + TIERS * TIER, 14.55, 1.55, 1.7],
  [14.55, 15.0, 1.45, 1.55],
  [15.0, 15.5, 1.35, 1.4],
];

/** Blind panels on the pedestal end faces: z ranges out from the split plane. */
const PANELS: [number, number][] = [
  [1.5, 3.1],
  [3.7, 5.5],
];

export function buildWringinLawang(textures: StoneTextures): CandiModel {
  const site = new Site("Wringin Lawang", textures, "brick");
  court(site, 26, 20);

  for (const s of [-1, 1]) {
    // The two mirror halves. Every box runs from the split plane out to its outer edge, so the
    // inner face of each half is one plain vertical plane, as on the real gate.
    const zone = (realm: Realm, y0: number, y1: number, out: number, depth: number) =>
      site.get(realm, "masonry").box([-depth, y0, s * PASSAGE], [depth, y1, s * out], {});
    for (const [realm, y0, y1, out, depth] of ZONES) zone(realm, y0, y1, out, depth);
    for (const [realm, y0, y1, out, depth] of CORNICES) zone(realm, y0, y1, out, depth);

    // Roof: each tier keeps a plain face to the passage and steps back on its outer edge, with a
    // cornice strip and a row of antefix-like blocks along that edge.
    for (let k = 0; k < TIERS; k++) {
      const y0 = ROOF_Y + k * TIER;
      const out = 4.2 - k * 0.4;
      const depth = 5.0 - k * 0.45;
      zone("upper", y0, y0 + TIER - 0.15, out, depth);
      zone("upper", y0 + TIER - 0.15, y0 + TIER, out + 0.12, depth + 0.12);
      const width = 2 * (depth + 0.12);
      const teeth = Math.round(width / 0.8);
      for (let i = 0; i < teeth; i++) {
        const x = -width / 2 + (width * (i + 0.5)) / teeth;
        site.get("upper", "masonry").box([x - 0.11, y0 + TIER, s * (out - 0.08)], [x + 0.11, y0 + TIER + 0.22, s * (out + 0.12)], {});
      }
    }
    for (const [y0, y1, out, depth] of CAPS) zone("upper", y0, y1, out, depth);

    // Blind panels, dark quads a hair proud of the wall like the kit's niches.
    const shadow = site.get("lower", "nicheShadow");
    for (const end of [-1, 1]) {
      const x = end * (5.4 + 0.01);
      for (const [z0, z1] of PANELS) shadow.quad([x, 0.9, s * z0], [x, 0.9, s * z1], [x, 2.1, s * z1], [x, 2.1, s * z0], [end, 0, 0]);
    }
    site.get("middle", "nicheShadow").quad([-2.2, 6.15, s * 5.91], [2.2, 6.15, s * 5.91], [2.2, 7.5, s * 5.91], [-2.2, 7.5, s * 5.91], [0, 0, s]);

    // Brick steps up to the passage floor on both faces.
    const steps = Math.round(FLOOR / 0.3);
    for (let j = 1; j <= steps; j++) {
      const xa = FACE + (steps - j) * STAIR_RUN;
      const xb = FACE + steps * STAIR_RUN;
      const [min, max] = s > 0 ? [xa, xb] : [-xb, -xa];
      site.get("lower", "floor").box([min, 0, -1.3], [max, 0.3 * j, 1.3], {});
    }
  }

  // Passage: a solid fill under the floor (hidden once the halves stand around it) and a paved
  // floor linking the two flights.
  site.get("lower", "masonry").box([-FACE, 0, -PASSAGE], [FACE, FLOOR, PASSAGE], {});
  site.get("lower", "floor").cap(rectOutline(FACE, PASSAGE), FLOOR);

  const climb = [eye(11.5, 0, 0), eye(9.5, 0, 0), eye(7.7, 0.9, 0), eye(6.2, FLOOR, 0)];
  const tour: TourSection[] = [
    { topic: "overview", label: "Approach from the east", points: [eye(55, 0, 0), eye(26, 0, 0), ...climb], lookRight: 0 },
    { topic: "passage", label: "Through the split", points: [eye(3.4, FLOOR, 0), eye(0, FLOOR, 0), eye(-3.4, FLOOR, 0), eye(-6.2, FLOOR, 0)], lookRight: 0 },
    { topic: "bentar", label: "Down the far side", points: [eye(-7.7, 0.9, 0), eye(-9.5, 0, 0), eye(-18, 0, 6), eye(-30, 0, 10)], lookRight: 0.25 },
  ];

  return {
    ...site.finish(),
    tour,
    walkSpawn: { position: new Vector3(46, 0, 0), yaw: Math.PI / 2 },
  };
}
