import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import { rectOutline } from "../kit/plan";
import type { ShrineSpec } from "../kit/shrine";
import type { Site } from "../kit/site";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Jawi Temple" (id.wikipedia "Candi Jawi" adds the same figures) and the
 * Nagarakretagama canto 56 account of Hayam Wuruk's 1359 visit. Published figures: temple
 * 24.5 m high on a base 14.2 × 9.5 m; compound 40 × 60 m within a 2 m red-brick wall; the cella
 * door and main stair face east. The base is black stone, the upper parts white stone; the enclosure
 * wall is red brick, but a site has one fabric, so the whole model is drawn in stone.
 * Volcano heights: Arjuno 3339 m, Welirang 3156 m, Penanggungan
 * 1653 m; the temple sits at roughly 600 m on Welirang's eastern slope.
 *
 * Simplifications: the lotus moat is drawn as a dry curb-and-bed ring (the terrain stays flat);
 * the crown's cube-and-stupa combination is drawn as a stupa; the roof is plain receding stone
 * tiers, and the stone's colour difference (black base, white upper parts) is not modelled.
 */

const JAWI: ShrineSpec = {
  // Base 14.2 m north–south × 9.5 m east–west: E–W half 4.75, aspect = 7.1 / 4.75.
  foot: { half: 4.75, height: 2.5 },
  body: { half: 3.9, height: 8, wall: 1.2 },
  aspect: 1.5,
  door: { width: 1.4, height: 2.8 },
  doors: ["east"],
  stairs: ["east"],
  stairWidth: 2,
  roof: { tiers: 5, first: 3.1, shrink: 0.8, finial: "none" },
  crown: { kind: "stupa", height: 4 },
  image: { kind: "buddha", height: 2.6 },
  niches: "deity",
};

// Footprint of the moat ring, centred on the temple: bed from the inner to the outer half.
const MOAT_INNER = { x: 8, z: 10 };
const MOAT_OUTER = { x: 10.3, z: 12.3 };
const CURB = { t: 0.3, h: 0.35 };

/** The lotus moat as a dry ring: a recessed-looking bed bounded by low curbs. */
function moat(site: Site): void {
  const b = site.get("lower", "masonry");
  const floor = site.get("lower", "floor");
  floor.cap(rectOutline(MOAT_OUTER.x, MOAT_OUTER.z), 0.05, [rectOutline(MOAT_INNER.x, MOAT_INNER.z)]);
  // Two rectangular curb rings, four strips each: north, south and the two ends.
  for (const [hx, hz] of [[MOAT_INNER.x, MOAT_INNER.z], [MOAT_OUTER.x, MOAT_OUTER.z]] as const) {
    b.box([-hx, 0, hz - CURB.t], [hx, CURB.h, hz], {});
    b.box([-hx, 0, -hz], [hx, CURB.h, -hz + CURB.t], {});
    b.box([hx - CURB.t, 0, -hz + CURB.t], [hx, CURB.h, hz - CURB.t], {});
    b.box([-hx, 0, -hz + CURB.t], [-hx + CURB.t, CURB.h, hz - CURB.t], {});
  }
}

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Pasuruan, Jawa Timur · late 13th century CE",
    title: "Candi Jawi",
    paragraphs: [
      "A tall slender temple on the eastern slope of Mount Welirang, its base of black stone carrying upper parts of white stone, built by Kertanegara, the last king of Singhasari. The Nagarakretagama calls it Jajawa and describes Hayam Wuruk stopping here in 1359 CE to make offerings to his great-grandfather.",
      "It served the Shiva-Buddha syncretism Kertanegara patronised: a Shivaite sanctuary crowned with a Buddhist ornament, holding mortuary statues of the king in both guises. The Buddha Akshobya image vanished after lightning struck the temple in 1331, which Prapanca read as a sign of śūnyatā.",
      "Restored between 1938 and 1941 and again from 1975 to 1980, the work completing in 1982.",
    ],
    facts: [
      ["Height", "24.5 m"],
      ["Base", "14.2 × 9.5 m"],
      ["Faces", "East"],
      ["Original name", "Jajawa"],
    ],
  },
  syncretism: {
    kicker: "Shiva-Buddha",
    title: "One king, two faiths",
    paragraphs: [
      "The shrine held two mortuary statues of Kertanegara, one Shivaite and one Buddhist, embodying the fused sect he espoused. Niches around the body held Shivaite figures — Nandisvara, Durga, Ganesha, Nandi and Brahma — now kept in the Trowulan and Mpu Tantular museums.",
      "The temple stands in for the lost statues; the niches carry simplified standing figures.",
    ],
    facts: [["Niche statues", "Now in museums"]],
  },
  compound: {
    kicker: "The compound",
    title: "Wall and moat",
    paragraphs: [
      "The compound measures 40 × 60 m inside a 2 m high red-brick wall (drawn in stone here, since the model uses one material), and the temple is surrounded by a moat once planted with flowering lotus. Here the moat is drawn as a dry channel ring, since the site's ground is flat.",
      "After visiting in 1359, Hayam Wuruk's court poet Prapanca recorded the compound's magnificence in the Nagarakretagama, one of the fullest eye-witness descriptions any Javanese temple has.",
    ],
    facts: [
      ["Compound", "40 × 60 m"],
      ["Wall", "2 m high, brick"],
    ],
  },
};

export const jawi: CandiDefinition = {
  id: "jawi",
  name: "Jawi",
  location: "Pasuruan, Jawa Timur",
  site: { lat: -7.6625, lon: 112.6697 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "syncretism", label: "Niches and cella", anchor: [3.9, 6, 0], view: { position: [18, 7, 8], target: [0, 6, 0] } },
    { topic: "compound", label: "Moat and wall", anchor: [10.3, 0.5, 0], view: { position: [26, 6, 16], target: [6, 1, 0] } },
    { topic: "overview", label: "Crown", anchor: [0, 22, 0], view: { position: [-24, 26, 20], target: [0, 18, 0] } },
  ],
  horizon: [
    { name: "Mount Penanggungan", lat: -7.623, lon: 112.655, relativeHeight: 1050, kind: "volcano" },
    { name: "Mount Welirang", lat: -7.717, lon: 112.692, relativeHeight: 2560, kind: "volcano" },
    { name: "Mount Arjuno", lat: -7.725, lon: 112.585, relativeHeight: 2740, kind: "volcano" },
  ],
  sources: [
    { title: "Jawi Temple — Wikipedia", url: "https://en.wikipedia.org/wiki/Jawi_Temple" },
    { title: "Candi Jawi — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Jawi" },
  ],
  orbit: { position: [-32, 18, 30], target: [0, 10, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 80, shadowExtent: 35, approach: { x: 1, z: 0, start: 45 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Jawi",
        courts: [{ halfX: 20, halfZ: 30 }],
        enclosures: [{ halfX: 20, halfZ: 30, height: 2, thickness: 0.8, gates: ["east"], gateWidth: 3.5, gate: "paduraksa" }],
        extra: moat,
        shrines: [{ spec: JAWI, at: { x: 0, z: 0 }, facing: "east", tour: { topic: "syncretism", label: "Around the temple" } }],
        approach: { from: { x: 60, z: 0 }, topic: "overview", label: "Approach from the east" },
      },
      textures,
    ),
};

