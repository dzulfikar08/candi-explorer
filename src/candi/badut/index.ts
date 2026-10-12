import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: English Wikipedia "Badut Temple" (history, west-north-westerly facing, the plain 2 m
 * pedestal, the west stair, the ~1.5 m projecting portal, the 5.53 × 3.67 m garbagriha with
 * lingga-yoni, the niche scheme with only Durga surviving, the three perwara, the restoration of
 * 1925–26 by B. De Haan, and the lost roof), Indonesian Wikipedia "Candi Badut" (the 11 × 11 m
 * square plan, facing west, the lower-jawless kala, the 1925–27 restoration dates) and Indonesian
 * Wikipedia "Prasasti Dinoyo" (682 Saka = 760 CE, chronogram nayana-vayu-ras, Dewasimha and
 * Liswa/Gajayana, the Agastya dedication, the oldest Old Javanese script). The English article
 * gives the stone fence as "11 m × 11 m" while the Indonesian one uses 11 × 11 m for the temple
 * plan itself; the plan reading is used here and no fence dimensions are claimed.
 *
 * Simplifications: no total height is published, so the body height is derived from the sourced
 * plan and chamber sizes and the lost roof is drawn as one low truncated tier (stated in the
 * topic text). The real temple faces west-north-west, snapped to west here. The projecting portal
 * exists only on the west face; the kit's small bay projects on every face. The three perwara are
 * ruined mounds whose exact positions and sizes are not published; they are drawn west of the
 * temple, offset from the walk so nothing blocks the stair. The lingga's height is not published;
 * it is drawn 1.4 m tall.
 */

const MAIN: ShrineSpec = {
  // The whole foot is one plain, undecorated 2 m pedestal carrying the full 11 × 11 m plan.
  foot: { half: 5.5, height: 2 },
  // Chamber 5.53 × 3.67 m: half 3.8 × aspect 0.75 with 0.7 m walls and the default bay gives
  // interiors of about 5.6 × 3.7 m.
  body: { half: 3.8, height: 3.8, wall: 0.7 },
  aspect: 0.75,
  door: { width: 1.5, height: 2.6 },
  doors: ["east"], // local front; the compound turns it to face west
  stairWidth: 2,
  // The roof is lost — one low truncated tier marks where the superstructure broke off.
  roof: { tiers: 1, first: 1.6, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
  image: { kind: "lingga", height: 1.4 },
  niches: "deity",
};

const PERWARA: ShrineSpec = {
  foot: { half: 1.9, height: 1.2 },
  body: { half: 1.3, height: 1.6, wall: 0.5 },
  door: { width: 0.7, height: 1.3 },
  doors: ["east"],
  stairWidth: 0.9,
  roof: { tiers: 1, first: 1, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
};

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Malang, East Java · 8th century CE",
    title: "Candi Badut",
    paragraphs: [
      "The oldest known temple in East Java, in the Tidar area about 5 km west of central Malang. Unlike its East Javanese neighbours such as Singosari and Kidal, it follows the older Central Javanese style, and it has been tentatively linked to the Dinoyo inscription of 760 CE.",
      "It was found in 1921 as a mound of stone and earth, first reported by Maureen Brecher, a Dutch controller working in Malang, and rebuilt in 1925–26 under B. De Haan of the Dutch East Indies Archaeological Service. Excavation showed the building had collapsed completely except for the foot.",
      "Only the foot and the body survive. Too little roof stone remained to reconstruct the tiered superstructure, so the temple stands today as a squat, roofless box; the single low tier drawn here simply marks where the roof broke off.",
    ],
    facts: [
      ["Oldest in", "East Java (est. 760 CE)"],
      ["Faces", "West-north-west (drawn facing west)"],
      ["Discovered", "1921"],
      ["Restored", "1925–26"],
    ],
  },
  dinoyo: {
    kicker: "The Dinoyo inscription",
    title: "Kanjuruhan and the star of Agastya",
    paragraphs: [
      "The Dinoyo inscription, found in Malang's Dinoyo suburb, is dated by the chronogram nayana-vayu-ras to 682 Saka — 760 CE — and is written in Sanskrit in the oldest known Old Javanese (Kawi) script.",
      "It names King Dewasimha and his son Liswa, who took the throne name Gajayana, and tells how a stone image of the sage Agastya was installed to replace an older wooden one. The historian Purbatjaraka connected this court with the temple, but the link between inscription and building is still debated for want of stronger evidence.",
      "The name Badut itself is traced to the Sanskrit bha-dyut, the light of the star Canopus — the star of Agastya in Java — fitting for a shrine tied to his worship; another reading derives it from Liswa, a name meaning jester.",
    ],
    facts: [
      ["Dated", "682 Saka · 760 CE"],
      ["Script", "Sanskrit, Old Javanese (Kawi)"],
      ["Kings named", "Dewasimha · Gajayana"],
    ],
  },
  body: {
    kicker: "Foot and body",
    title: "A plain pedestal and a walk-in chamber",
    paragraphs: [
      "The foot is a plain rectangular pedestal about 2 m high, without a single moulding or decoration — an unusual simplicity even for its time — and the stairway on the west face rises straight up it to the door of the chamber.",
      "The garbagriha measures about 5.5 × 3.7 m and holds a lingga on its yoni, the emblem of Shiva. The entrance occupies a small room projecting about 1.5 m from the face and is crowned by a kala-makara portal whose kala, as in Central Java, has no lower jaw.",
      "The roof above the body is lost: the 1920s restoration rebuilt only the foot and the body, and the low tier shown here is a stand-in for the missing superstructure.",
    ],
    facts: [
      ["Plan", "11 × 11 m"],
      ["Chamber", "≈ 5.5 × 3.7 m"],
      ["Pedestal", "≈ 2 m, undecorated"],
      ["Image", "Lingga and yoni"],
    ],
  },
  niches: {
    kicker: "The niches",
    title: "Where the gods stood",
    paragraphs: [
      "Small niches pierce the walls of the body. As at contemporary Shiva temples such as Sambisari, Gebang and Merak, the niches flanking the door should have held Mahakala and Nandishwara, the north niche Durga Mahisasuramardini, the east one Ganesha and the south one Agastya.",
      "At Badut only the Durga Mahisasuramardini survives; every other statue is lost. The standing figures shown in the niches here stand in for that scheme.",
    ],
    facts: [
      ["Surviving", "Durga Mahisasuramardini"],
      ["Lost", "Ganesha · Agastya · Mahakala · Nandishwara"],
    ],
  },
  perwara: {
    kicker: "The compound",
    title: "Three shrines and a fence",
    paragraphs: [
      "West of the temple, in front of its face, stand the remains of three perwara, the small companion shrines of a Javanese compound — heaps of fallen stone and footings, all that is left of them.",
      "A rectangular stone fence once enclosed the compound, but only the base of the wall survives, so its height and the full layout of the yard are unknown.",
    ],
    facts: [
      ["Perwara", "3, west of the temple"],
      ["Fence", "Only the base survives"],
    ],
  },
};

export const badut: CandiDefinition = {
  id: "badut",
  name: "Badut",
  location: "Malang, Jawa Timur",
  site: { lat: -7.9578, lon: 112.5983 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "dinoyo", label: "Lingga and yoni", anchor: [-4.2, 3.1, 0], view: { position: [-14, 5.5, 2], target: [0, 2.4, 0] } },
    { topic: "body", label: "Portal and stairway", anchor: [-4.15, 3.4, 0], view: { position: [-17, 4, 7], target: [-4, 2.8, 0] } },
    { topic: "niches", label: "Durga's niche", anchor: [2.6, 4, -2.95], view: { position: [-5, 5, -12], target: [0, 3.9, -2.9] } },
    { topic: "perwara", label: "Perwara remains", anchor: [-10.5, 1.6, -6.5], view: { position: [-22, 7, 7], target: [-10.5, 0.8, -2] } },
    { topic: "overview", label: "The lost roof", anchor: [0, 7.2, 0], view: { position: [-28, 11, 20], target: [0, 3.8, 0] } },
  ],
  horizon: [
    { name: "Arjuno-Welirang", lat: -7.7283, lon: 112.58, relativeHeight: 2860, kind: "volcano" },
    { name: "Panderman", lat: -7.881, lon: 112.735, relativeHeight: 1570, kind: "volcano" },
    { name: "Kelud", lat: -7.928, lon: 112.308, relativeHeight: 1250, kind: "volcano" },
    { name: "Semeru", lat: -8.1088, lon: 112.9228, relativeHeight: 3200, kind: "volcano" },
  ],
  orbit: { position: [-29, 24, 20], target: [-1, 3.5, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 45, shadowExtent: 16, approach: { x: -1, z: 0, start: 30 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Badut",
        courts: [{ halfX: 14, halfZ: 11 }],
        shrines: [
          { spec: MAIN, at: { x: 0, z: 0 }, facing: "west", tour: { topic: "body", label: "The main temple" } },
          // Remnants of the three perwara west of the front; kept clear of the walk to the stair.
          { spec: PERWARA, at: { x: -10.5, z: -6.5 }, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -12, z: 2.5 }, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -9, z: 8 }, facing: "east", ruined: true },
        ],
        approach: { from: { x: -30, z: 0 }, topic: "overview", label: "Approach from the west" },
      },
      textures,
    ),
};
