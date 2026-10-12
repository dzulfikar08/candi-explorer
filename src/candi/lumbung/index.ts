import type { StoneTextures } from "../../render/stone";
import { type CompoundShrine, buildCompound } from "../kit/compound";
import { OPPOSITE, squareRing } from "../kit/plan";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Candi Lumbung, a 9th-century Buddhist compound in the Prambanan temple park, Klaten: one main
 * temple ringed by sixteen perwara shrines, with the small Candi Bubrah to the north on the line
 * toward Sewu.
 *
 * Sources:
 * - Wikipedia "Lumbung" (EN): 16 perwara around a main temple; faces east with the main entrance
 *   on the east but reachable from all cardinal points; "lumbung" (rice barn) is a local name, the
 *   original name unknown; the Kelurak inscription of 782 CE was found nearby but probably refers
 *   to Sewu; compound in relatively good condition compared to Bubrah; coordinates
 *   7.748138° S, 110.492871° E.
 * - Wikipedia "Candi Lumbung" (ID, citing Sedyawati et al. 2013, "Candi Indonesia: Seri Jawa",
 *   pp. 146–147) with its infobox/Wikidata data: 17 temples (1 main, 16 perwara), andesite, 9th
 *   century, facade east, main plan a 20-sided polygon of ≈ 350 m², incomplete.
 * - candi.pnri.go.id "Candi Lumbung" (via ki-demang.com): main platform (batur) ≈ 2.5 m high;
 *   outer walls carved with men and women at nearly life size, Kuwera and Hariti flanking the
 *   door; 3 niches on each of the north, west and south sides (9 in all) held Dhyani Buddhas,
 *   none surviving; 11 niches in the chamber; stairs and door on the east; roof destroyed,
 *   presumed stupa-crowned like the perwara roofs; perwara on ≈ 1 m batur, base ≈ 5 m square,
 *   plain 3.6 m body, stair with cheek walls in front of the door, jawless kala above the door,
 *   stacked-cube roof with stupa finial and small corner stupas, stone slab bases inside; the
 *   courtyard is paved with andesite.
 * - Véronique Degroot, "Candi Space and Landscape" (PhD thesis, Leiden, 2011), Lumbung section:
 *   true orientation 84° 25′ (Siswoyo 1996); main base a staggered square of 10 m (half-width;
 *   with the 350 m² figure this reads as a ≈ 20 m platform) with an eastern projection for the
 *   stair, body a staggered square of 6.6 m (half-width); all 16 perwara face the main temple,
 *   though in the east row only the central shrine looks straight at it and its two neighbours
 *   face it along the row, a path possibly linking it to the temple; enclosure wall/fence remains
 *   found in 1920 (Bosch); Lumbung stands on a line with Bubrah (150 m north) and Sewu (450 m
 *   north), on flat ground ≈ 500 m east of the Opak river, altitude ≈ 156 m.
 * - Wikipedia "Candi Bubrah (Klaten)" (ID) and Kemdikbud/BPCB "Candi Bubrah Sudah Tidak Bubrah
 *   Lagi" (via Kompas, 2023): Bubrah lies between Lumbung and Sewu; 12 × 12 m andesite; found as
 *   rubble ≈ 2 m high with broken Buddha statues; restored 2016 – 14 December 2017; now stands
 *   again facing east, its walls lined with niches for Dhyani Buddhas, a tall slender form with a
 *   stupa roof symbolising Mount Meru; Lumbung, Bubrah and Sewu are believed to form one Buddhist
 *   mandala unit.
 *
 * Simplifications: the 20-sided main plan is drawn as the kit's stepped square with bays; ring,
 * enclosure and court dimensions are approximated (none are published); the main temple's roof
 * form and every height are approximations (no total heights are published); the perwara corner
 * stupas, wall figure carvings and inner slab bases are not modelled; Bubrah is drawn at about
 * half its real distance (≈ 160 m north, slightly west) so the compound stays readable.
 */

const MAIN: ShrineSpec = {
  plinths: [{ half: 10, height: 2.5 }],
  foot: { half: 7.5, height: 1.2 },
  body: { half: 6.6, height: 7, wall: 1.1 },
  door: { width: 1.6, height: 3 },
  doors: ["east"],
  stairWidth: 2.2,
  bay: { width: 0.5, depth: 0.1 },
  // The real roof is lost; PNRI presumes a stupa-crowned tower like the perwara roofs. Height is
  // an approximation — none is published.
  roof: { tiers: 3, first: 3.2, shrink: 0.72, finial: "stupa" },
  crown: { kind: "stupa", height: 3.2 },
  niches: "buddha",
};

const PERWARA: ShrineSpec = {
  plinths: [{ half: 2.9, height: 1 }],
  foot: { half: 2.5, height: 0.5 },
  body: { half: 1.8, height: 2.7, wall: 0.55 },
  door: { width: 0.8, height: 1.5 },
  doors: ["east"],
  stairWidth: 1,
  roof: { tiers: 3, first: 1.6, shrink: 0.78, finial: "stupa" },
  crown: { kind: "stupa", height: 1.7 },
};

const BUBRAH: ShrineSpec = {
  plinths: [{ half: 6, height: 1.2 }],
  foot: { half: 4.7, height: 0.9 },
  body: { half: 2.9, height: 5.2, wall: 0.85 },
  door: { width: 1.1, height: 2.2 },
  doors: ["east"],
  stairWidth: 1.6,
  // Tall and slender with a stupa roof (Kemdikbud); height approximated, none published.
  roof: { tiers: 3, first: 2.4, shrink: 0.7, finial: "stupa" },
  crown: { kind: "stupa", height: 2.8 },
  niches: "buddha",
};

/** Half-width of the perwara ring: five shrines per side at 12.5 m centres. */
const RING = 25;

/** Main temple, the 16-shrine ring and Bubrah to the north. */
function shrines(): CompoundShrine[] {
  const out: CompoundShrine[] = [{ spec: MAIN, at: { x: 0, z: 0 }, facing: "east", tour: { topic: "main", label: "The main temple" } }];
  // All sixteen perwara face the main temple (PNRI), so each is turned against its side's outward
  // direction. Degroot records the two shrines flanking the on-axis east one as facing along the
  // row toward it; simplified here to the uniform inward facing of the official description.
  for (const { position, facing } of squareRing(RING, 5)) {
    out.push({ spec: PERWARA, at: position, facing: OPPOSITE[facing] });
  }
  // Bubrah: ≈ 160 m north (slightly west) in reality; drawn at about half distance.
  out.push({ spec: BUBRAH, at: { x: -10, z: -80 }, facing: "east" });
  return out;
}

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Klaten, Central Java · 9th century CE",
    title: "Candi Lumbung",
    paragraphs: [
      "A Buddhist compound in the Prambanan temple park, a few hundred metres north of Prambanan itself and just south of Candi Bubrah and Sewu. 'Lumbung' means rice barn in Javanese: the name locals gave it, perhaps for its shape. Its original name is unknown.",
      "It groups one main temple and sixteen perwara shrines in a square ring around it. Like its great neighbour Sewu it faces east, and the compound could be entered from all four cardinal directions; its courtyard is paved with andesite.",
      "The Kelurak inscription of 782 CE, dedicated to the bodhisattva Manjusri, was found near this compound, though it probably refers to Sewu. The perwara shrines stand restored up to their superstructures; the main temple is still largely a ruin.",
    ],
    facts: [
      ["Temples", "17: 1 main, 16 perwara"],
      ["Faces", "East (84° 25′)"],
      ["Built", "9th century CE"],
      ["World Heritage", "Prambanan compounds, 1991"],
    ],
  },
  main: {
    kicker: "The centre",
    title: "Twenty sides, one lost roof",
    paragraphs: [
      "The main temple stands on a platform about 2.5 m high. Its plan is a twenty-sided polygon of about 350 m² — drawn here as a stepped square some 20 m across — with a projection on the east side housing the staircase and a corridor into the chamber. The door and stair face east.",
      "Its walls are carved with figures of men and women at nearly life size, and Kuwera and Hariti flank the entrance. Three niches on each of the other three sides once held statues of Dhyani Buddhas; none remain. Inside, eleven niches line the chamber walls.",
      "The roof has collapsed completely and only the lower walls still stand. It was probably a stupa-crowned tower like the perwara roofs, and that is what this model draws; its height is an approximation.",
    ],
    facts: [
      ["Plan", "20-sided, ≈ 350 m²"],
      ["Platform", "≈ 2.5 m high"],
      ["Body", "≈ 13 m across"],
      ["Roof", "Lost — form unknown"],
    ],
  },
  perwara: {
    kicker: "Sixteen shrines",
    title: "All facing the centre",
    paragraphs: [
      "Sixteen similar small temples stand in a square ring around the main one, and every one of them faces it. In the east row only the central shrine looks straight at the temple: the two beside it are turned along the row toward it, and a path may once have linked that central shrine to the main stair. This model follows the simpler, uniform inward facing.",
      "Each stands on a platform about a metre high, with a base roughly 5 m square and a plain body 3.6 m across. A stair with cheek walls rises to the door, and a kala mouth without lower jaw frames the doorway.",
      "The roofs are stacks of shrinking cubes crowned by a stupa, with small stupas at every cube corner — a form the model simplifies. Inside each chamber, stone slabs like statue bases are set in a row.",
    ],
    facts: [
      ["Perwara", "16 in a square ring"],
      ["Each", "≈ 5 m base, 3.6 m body"],
      ["Platform", "≈ 1 m high"],
      ["Facing", "The main temple"],
    ],
  },
  bubrah: {
    kicker: "Toward Sewu",
    title: "Candi Bubrah",
    paragraphs: [
      "Some 150 m north of Lumbung, roughly on the line toward Sewu, stands Candi Bubrah — the third Buddhist sanctuary of this north–south line, which Kemdikbud describes as one Buddhist mandala unit. This model draws it at about half its real distance to keep the compound readable.",
      "'Bubrah' means crumbled: the temple was found as a heap of stone about two metres high, with broken statues of Buddhas among the rubble. Its andesite body measures 12 × 12 m.",
      "Restoration finished in December 2017, and the temple now stands again, facing east, its walls lined with niches for Dhyani Buddhas under a slender stupa roof symbolising Mount Meru. Its height is not published and is approximated here.",
    ],
    facts: [
      ["Position", "≈ 150 m N, toward Sewu"],
      ["Plan", "12 × 12 m"],
      ["Found", "Rubble ≈ 2 m high"],
      ["Restored", "2016–2017"],
    ],
  },
};

export const lumbung: CandiDefinition = {
  id: "lumbung",
  name: "Lumbung",
  location: "Klaten, Jawa Tengah",
  site: { lat: -7.748138, lon: 110.492871 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "main", label: "Main temple", anchor: [7, 9, 0], view: { position: [36, 16, 28], target: [0, 10, 0] } },
    { topic: "perwara", label: "Perwara ring", anchor: [25, 4, 0], view: { position: [46, 28, 46], target: [10, 3, 0] } },
    { topic: "main", label: "Carved walls", anchor: [7.5, 5.5, 0], view: { position: [16, 7, 6], target: [7, 5.5, 0] } },
    { topic: "bubrah", label: "Candi Bubrah", anchor: [-10, 5, -80], view: { position: [2, 11, -50], target: [-10, 5, -80] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2775, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2990, kind: "volcano" },
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 450, kind: "ridge" },
  ],
  orbit: { position: [72, 40, 70], target: [0, 7, -12] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 105, shadowExtent: 62, approach: { x: 1, z: 0, start: 46 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Lumbung",
        courts: [{ halfX: 33, halfZ: 33 }],
        // Only remains of the enclosure were found in 1920 (Bosch, in Degroot): drawn as a low
        // fence with openings on all four sides, since the compound is reachable from every
        // cardinal point.
        enclosures: [{ halfX: 33, halfZ: 33, height: 1.3, thickness: 0.6, gates: ["east", "south", "west", "north"], gateWidth: 4, gate: "none" }],
        shrines: shrines(),
        // The central east perwara stands on the temple's own axis, so the walk doglegs around it
        // between the shrines instead of running straight up the stair line.
        approach: {
          from: { x: 66, z: 0 },
          via: [
            { x: 36, z: 0 },
            { x: 28, z: 4 },
            { x: 20, z: 5.5 },
            { x: 14, z: 6 },
          ],
          topic: "overview",
          label: "Approach from the east gate",
        },
      },
      textures,
    ),
};
