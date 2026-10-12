import { Matrix4 } from "three";
import type { StoneTextures } from "../../render/stone";
import { type CompoundShrine, buildCompound } from "../kit/compound";
import { deity } from "../kit/ornaments";
import { OPPOSITE, placement, squareRing } from "../kit/plan";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Sewu" (citing Dumarçay, the Kelurak and Manjusrigrha inscriptions) and the
 * UNESCO listing "Prambanan Temple Compounds". Published figures: 249 temples (the main temple,
 * 8 apit and 240 perwara in four rows of 28, 44, 80 and 88); compound 185 m N–S by 165 m E–W; main
 * temple 29 m across and 30 m high. Row spacing and the apit positions are approximated.
 */

const MAIN: ShrineSpec = {
  plinths: [{ half: 14.5, height: 2.5, balustrade: 1.2 }],
  foot: { half: 10.5, height: 2 },
  body: { half: 7, height: 8, wall: 1.5 },
  door: { width: 1.6, height: 3 },
  doors: ["east", "south", "west", "north"],
  stairWidth: 2.4,
  // Cruciform plan: a chapel projects from every face.
  bay: { width: 0.55, depth: 0.2 },
  roof: { tiers: 4, first: 3.6, shrink: 0.8, finial: "stupa" },
  crown: { kind: "stupa", height: 6 },
};

const APIT: ShrineSpec = {
  foot: { half: 3.4, height: 1.6 },
  body: { half: 2.4, height: 3.6, wall: 0.7 },
  door: { width: 0.9, height: 1.8 },
  doors: ["east"],
  stairWidth: 1.2,
  roof: { tiers: 3, first: 1.8, shrink: 0.8, finial: "stupa" },
  crown: { kind: "stupa", height: 2.2 },
  niches: "buddha",
};

const PERWARA: ShrineSpec = {
  foot: { half: 2.6, height: 1.3 },
  body: { half: 1.8, height: 2.8, wall: 0.5 },
  door: { width: 0.8, height: 1.5 },
  doors: ["east"],
  stairWidth: 1,
  roof: { tiers: 3, first: 1.4, shrink: 0.8, finial: "stupa" },
  crown: { kind: "stupa", height: 1.8 },
};

/**
 * Rows from the inside out: 28, 44, 80 and 88 shrines. Counts per side are chosen to give those
 * totals on rectangles (the outer two are longer north–south, like the compound).
 */
const ROWS = [
  { perSide: 8, perSideZ: 8, half: 34, halfZ: 36, outward: true },
  { perSide: 12, perSideZ: 12, half: 47, halfZ: 50, outward: true },
  { perSide: 20, perSideZ: 22, half: 66, halfZ: 74, outward: false },
  { perSide: 22, perSideZ: 24, half: 74, halfZ: 83, outward: false },
];

/** Deterministic choice of which perwara stand rebuilt: about one in five, more on the inner rows. */
function standing(row: number, i: number): boolean {
  return ((i * 7 + row * 3) % 10) < (row < 2 ? 4 : 1);
}

function shrines(): CompoundShrine[] {
  const out: CompoundShrine[] = [{ spec: MAIN, at: { x: 0, z: 0 }, facing: "east", tour: { topic: "main", label: "Main temple" } }];
  // Apit pairs flank each axial path between the main temple and the first row.
  for (const [x, z, facing] of [
    [25, -7, "east"],
    [25, 7, "east"],
    [-25, -7, "west"],
    [-25, 7, "west"],
    [-7, 26, "south"],
    [7, 26, "south"],
    [-7, -26, "north"],
    [7, -26, "north"],
  ] as const) {
    out.push({ spec: APIT, at: { x, z }, facing });
  }
  ROWS.forEach((row, r) => {
    squareRing(row.half, row.perSide, row.halfZ, row.perSideZ).forEach(({ position, facing }, i) => {
      out.push({ spec: PERWARA, at: position, facing: row.outward ? facing : OPPOSITE[facing], ruined: !standing(r, i) });
    });
  });
  return out;
}

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Klaten, Central Java · late 8th century CE",
    title: "Candi Sewu",
    paragraphs: [
      "The second-largest Buddhist temple complex in Java after Borobudur, 800 m north of Prambanan and older than it. 'Sewu' means a thousand: the 249 temples were counted as a thousand in the Roro Jonggrang legend.",
      "An inscription found here in 1960, dated 792 CE, calls the place Manjusrigrha, the house of Manjusri, the bodhisattva of wisdom. The Kelurak inscription of 782 CE, found nearby, records a statue of Manjusri being set up, perhaps here.",
      "The main temple was rebuilt in 1993. The 2006 Yogyakarta earthquake damaged it again; it has since been repaired.",
    ],
    facts: [
      ["Temples", "249"],
      ["Compound", "185 × 165 m"],
      ["Main temple", "29 m across, 30 m high"],
      ["Inscription", "Manjusrigrha, 792 CE"],
    ],
  },
  main: {
    kicker: "The centre",
    title: "The main temple",
    paragraphs: [
      "The main temple has a cruciform plan: a central chamber with four smaller chapels, one opening from each face, all reached by stairs on the four sides. The central chamber probably held a bronze statue, now lost; only its stone pedestal remains.",
      "Its roof, like those of the smaller shrines around it, is set with stupas, marking it as Buddhist where Prambanan's Hindu towers carry ratna.",
    ],
    facts: [
      ["Plan", "Cruciform, five chambers"],
      ["Stairs", "On all four sides"],
    ],
  },
  rows: {
    kicker: "240 perwara",
    title: "A mandala of shrines",
    paragraphs: [
      "Around the main temple stand 240 smaller shrines in four rectangular rows of 28, 44, 80 and 88, with eight apit temples in pairs on the axes. The arrangement is read as a mandala, the cosmos centred on the main sanctuary.",
      "Many rows were rebuilt in the 1990s and 2000s; others are still heaps of stone. Which ones stand here is illustrative.",
    ],
    facts: [
      ["Perwara", "240 (28 · 44 · 80 · 88)"],
      ["Apit", "8, in pairs"],
    ],
  },
  dvarapala: {
    kicker: "The gates",
    title: "Dvarapala guardians",
    paragraphs: [
      "Each of the four gates is guarded by a pair of dvarapala, kneeling giants holding clubs, each carved from a single block of andesite about 2.3 m high. They are drawn here as simplified figures.",
    ],
    facts: [["Height", "≈ 2.3 m each"]],
  },
};

export const sewu: CandiDefinition = {
  id: "sewu",
  name: "Sewu",
  location: "Klaten, Jawa Tengah",
  site: { lat: -7.7437, lon: 110.492 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "main", label: "Main temple", anchor: [7.2, 8, 0], view: { position: [45, 20, 20], target: [0, 12, 0] } },
    { topic: "rows", label: "Perwara rows", anchor: [47, 5, 30], view: { position: [90, 30, 70], target: [40, 2, 20] } },
    { topic: "dvarapala", label: "Dvarapala", anchor: [85, 2.5, 4], view: { position: [97, 4, 14], target: [85, 2, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2760, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2990, kind: "volcano" },
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 450, kind: "ridge" },
  ],
  orbit: { position: [150, 80, 110], target: [0, 8, 0] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 150, shadowExtent: 95, approach: { x: 1, z: 0, start: 95 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Sewu",
        courts: [{ halfX: 20, halfZ: 20 }],
        enclosures: [{ halfX: 82.5, halfZ: 92.5, height: 1.4, thickness: 0.8, gates: ["east", "south", "west", "north"], gateWidth: 5, gate: "none" }],
        shrines: shrines(),
        extra(site) {
          // Kneeling guardians either side of every gate, facing out.
          const statue = site.get("lower", "statue");
          for (const [x, z, front] of [
            [84.5, -4, "east"],
            [84.5, 4, "east"],
            [-84.5, -4, "west"],
            [-84.5, 4, "west"],
            [-4, 94.5, "south"],
            [4, 94.5, "south"],
            [-4, -94.5, "north"],
            [4, -94.5, "north"],
          ] as const) {
            statue.box([x - 0.7, 0, z - 0.7], [x + 0.7, 0.4, z + 0.7], {});
            statue.geometry(deity(), placement(x, 0.4, z, front).multiply(new Matrix4().makeScale(2, 1.9, 2.4)));
          }
        },
        approach: { from: { x: 130, z: 0 }, topic: "overview", label: "Approach from the east gate" },
      },
      textures,
    ),
};
