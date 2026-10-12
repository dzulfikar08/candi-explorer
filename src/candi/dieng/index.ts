import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources:
 * - Wikipedia "Dieng temples": the Arjuna cluster lines four shrines up north–south (Arjuna at the
 *   north end, then Srikandi, Puntadewa, Sembadra), all facing west, with Semar facing east right
 *   opposite Arjuna; built between the mid 7th and the end of the 8th century; the oldest standing
 *   stone structures in Central Java; rediscovered submerged in 1814 by a British soldier and the
 *   lake later drained; an inscription of 731 Śaka (809 CE), the oldest Old-Javanese script
 *   specimen, was found near Arjuna.
 * - NUS Press, "Dieng Temple Complex Excavation Site Report" (2010): plateau at ≈ 2,000 m; the
 *   valley is ringed by peaks including Perahu and Panggongan; Dumarçay's two phases (Arjuna, Semar
 *   and Srikandi late 7th c.–c. 730; Puntadewa and Sembadra c. 730–780); van Kinsbergen drained the
 *   lake in 1865.
 * - Dinas Pariwisata dan Kebudayaan Kab. Banjarnegara, "Candi Arjuna": square plan 6 × 6 m facing
 *   west, eight stair steps with penil, a 1 m wide vestibule, five empty niches (two flanking the
 *   door, one each north, east, south), a jalawara spout under the north niche, a three-tier (bhumi)
 *   roof of South-Indian (Dravida) character ending in a probable ratna, not a stupika; a yoni still
 *   stands in the chamber, the Shiva image may be the one now in the National Museum, Jakarta.
 * - Dinas Pariwisata dan Kebudayaan Kab. Banjarnegara, "Komplek Candi DIENG": the complex is two
 *   rows, an east row of four shrines all facing west and a west row with only Semar.
 * - Indonesian Wikipedia "Candi Semar": 4.65 m long, 2.6 m wide, 2.8 m high on a 0.5 m plain plinth,
 *   mandapa-like with a limasan (hip) roof, original top destroyed, door kala–makara like Arjuna's,
 *   facing Arjuna as its candi perwara.
 * - Indonesian Wikipedia "Candi Srikandi": 4.8 × 3.85 × 4.9 m on a 0.5 m plinth, Trimurti reliefs
 *   (Wisnu north, Brahma south, Syiwa east), original roof form unknown.
 * - Indonesian Wikipedia "Candi Puntadewa": batur 2.5 m high, which makes the temple look small but
 *   tall; original roof destroyed.
 * - Indonesia Kaya, "Kompleks Candi Arjuna": Arjuna, Puntadewa and Sembadra are Shiva temples,
 *   Srikandi is the only Trimurti temple; Semar is the only surviving service (perwara) temple;
 *   Sembadra was built last in the most local style (niches projecting outwards instead of Indian
 *   recessed ones); statues are kept in Museum Kailasa.
 * - ExploreSunda, "Candi Arjuna Complex": Sembadra reportedly has an octagonal plan, a carved lotus
 *   with seventeen small spires and a ratna on its roof (single-source detail, not modelled).
 * - Indonesian Wikipedia "Gunung Prau" (2,590 m, 7°11′13″S 109°55′22″E), "Gunung Sindoro"
 *   (3,153 m; Wikidata coordinates) and "Gunung Sumbing (Jawa Tengah)" (3,371 m,
 *   7°23′06″S 110°04′21″E) for the horizon; relative heights are measured from the ≈ 2,093 m
 *   plateau elevation given by Wikipedia "Dieng temples".
 *
 * Simplifications: the kit builds square or oblong shrines, so Sembadra's octagonal base and its
 * lotus-and-spires roof, and the antefik crowns of the others, are drawn as plain tiers with a
 * ratna. The roofs of Srikandi, Puntadewa and Sembadra are reconstructions — their original forms
 * are unknown. Gaps between the shrines are approximated: the Srikandi–Puntadewa spacing (≈ 15 m)
 * comes from their Wikidata coordinates, the others are estimated to match. All five temples are
 * andesite (the kit default), not brick.
 */

/** Arjuna: square 6 × 6 m base, west front, eight steps, three roof tiers, ratna finial. */
const ARJUNA: ShrineSpec = {
  plinths: [{ half: 3.0, height: 0.55 }],
  foot: { half: 2.6, height: 1.35 },
  body: { half: 2.1, height: 2.8, wall: 0.85 },
  door: { width: 1.0, height: 2.0 },
  doors: ["east"],
  stairWidth: 1.2,
  bay: { width: 0.5, depth: 0.22 },
  roof: { tiers: 3, first: 1.7, shrink: 0.72, finial: "ratna" },
  crown: { kind: "ratna", height: 1.1 },
  image: { kind: "lingga", height: 1.0 },
  niches: "empty",
};

/** Srikandi: published 4.8 × 3.85 × 4.9 m, slightly elongated north–south. */
const SRIKANDI: ShrineSpec = {
  plinths: [{ half: 2.1, height: 0.5 }],
  foot: { half: 1.925, height: 0.6, relief: true },
  body: { half: 1.5, height: 1.6, wall: 0.6 },
  door: { width: 0.9, height: 1.7 },
  doors: ["east"],
  stairWidth: 1.0,
  bay: { width: 0.45, depth: 0.12 },
  aspect: 1.25,
  roof: { tiers: 3, first: 0.75, shrink: 0.75, finial: "ratna" },
  crown: { kind: "ratna", height: 0.55 },
  image: { kind: "deity", height: 0.8 },
  niches: "empty",
};

/** Puntadewa: stands on a 2.5 m batur, so it reads small but tall; roof form unknown. */
const PUNTADEWA: ShrineSpec = {
  plinths: [{ half: 3.2, height: 2.5 }],
  foot: { half: 2.7, height: 0.7 },
  body: { half: 2.2, height: 2.4, wall: 0.75 },
  door: { width: 0.9, height: 1.8 },
  doors: ["east"],
  stairWidth: 1.0,
  bay: { width: 0.4, depth: 0.1 },
  roof: { tiers: 3, first: 1.1, shrink: 0.72, finial: "ratna" },
  crown: { kind: "ratna", height: 0.7 },
  image: { kind: "lingga", height: 0.9 },
  niches: "empty",
};

/** Sembadra: smallest and lowest of the four; its octagonal base is drawn square (kit limits). */
const SEMBADRA: ShrineSpec = {
  plinths: [{ half: 2.0, height: 0.4 }],
  foot: { half: 1.8, height: 0.5 },
  body: { half: 1.4, height: 1.5, wall: 0.6 },
  door: { width: 0.8, height: 1.6 },
  doors: ["east"],
  stairWidth: 0.9,
  bay: { width: 0.4, depth: 0.1 },
  roof: { tiers: 2, first: 0.9, shrink: 0.72, finial: "ratna" },
  crown: { kind: "ratna", height: 0.7 },
  image: { kind: "lingga", height: 0.8 },
  niches: "empty",
};

/** Semar: oblong low mandapa, 4.65 × 2.6 m and 2.8 m high, door facing east at Arjuna. */
const SEMAR: ShrineSpec = {
  plinths: [{ half: 1.45, height: 0.5 }],
  foot: { half: 1.3, height: 0.5 },
  body: { half: 1.0, height: 1.2, wall: 0.5 },
  door: { width: 0.9, height: 1.5 },
  doors: ["east"],
  stairWidth: 1.0,
  bay: { width: 0.5, depth: 0.15 },
  aspect: 1.79,
  roof: { tiers: 1, first: 0.6, shrink: 0.8, finial: "none" },
  crown: { kind: "none", height: 0 },
};

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Banjarnegara, Central Java · 7th–8th century CE",
    title: "Kompleks Candi Arjuna, Dieng",
    paragraphs: [
      "Five small Hindu shrines stand on the Dieng plateau, about 2,000 m above sea level in the floor of an old volcanic caldera. They are the oldest standing stone structures in Central Java, raised between the mid 7th and the end of the 8th century and dedicated to Shiva — except Srikandi, which housed the Trimurti.",
      "The arrangement is two rows: an east row of four shrines — Arjuna at the north end, then Srikandi, Puntadewa and Sembadra — all facing west, and a west row with only Candi Semar, which faces east straight at Arjuna. Semar is a candi perwara, a service temple where worshippers gathered before entering the main shrine; it is the only one of these ancillary temples that survives.",
      "In 1814 a soldier of the British occupation found the temples standing in a shallow lake; the lake was drained a generation later and the shrines were named after wayang characters of the Mahabharata. The statues are gone: most are kept in the nearby Museum Kailasa.",
    ],
    facts: [
      ["Shrines", "5"],
      ["East row", "Arjuna, Srikandi, Puntadewa, Sembadra, all facing west"],
      ["West row", "Semar, facing east at Arjuna"],
      ["Period", "Mid 7th – late 8th century"],
    ],
  },
  arjuna: {
    kicker: "North end of the row",
    title: "Candi Arjuna",
    paragraphs: [
      "The oldest and largest temple of the complex, a 6 × 6 m square facing west, still close to its Indian models: its steep three-tier roof is compared with the Dravida temples of South India. Eight steps climb to a doorway with a vestibule about a metre deep, flanked by penil stair-parapets ending in naga heads.",
      "The walls carry five niches — two beside the door, one on each of the other sides — all empty now, crowned by kala masks and flanked by makara; a spout (jalawara) under the north niche once drained the lustration water from the yoni inside to pilgrims outside.",
      "The roof's three shrinking storeys end in a probable ratna bud rather than a Buddhist stupika, as befits a Shiva temple. A yoni still stands in the chamber; the Shiva image itself may be the one now in the National Museum in Jakarta. An inscription of 731 Śaka (809 CE) found nearby is the oldest known specimen of Old-Javanese script.",
    ],
    facts: [
      ["Plan", "6 × 6 m, square"],
      ["Faces", "West"],
      ["Stair", "8 steps"],
      ["Roof", "3 tiers, ratna finial"],
    ],
  },
  semar: {
    kicker: "West row, opposite Arjuna",
    title: "Candi Semar",
    paragraphs: [
      "A low, oblong service temple facing east straight at Candi Arjuna, the only surviving candi perwara of the complex: pilgrims gathered here with their offerings before entering the main shrine. Its squat shape is why it got the name of Semar, the pot-bellied clown-servant of the wayang, attending his lord Arjuna.",
      "It measures 4.65 m by 2.6 m and only 2.8 m high, on a plain half-metre plinth — built like a mandapa, a hall rather than a tower, with an empty room lit by small windows. The doorway carries kala and makara ornaments like Arjuna's; the roof looks like a Javanese limasan hip, but its top has collapsed and the original form is unknown.",
    ],
    facts: [
      ["Size", "4.65 × 2.6 m"],
      ["Height", "2.8 m"],
      ["Faces", "East, toward Arjuna"],
      ["Plinth", "0.5 m, unornamented"],
    ],
  },
  srikandi: {
    kicker: "Second in the row",
    title: "Candi Srikandi",
    paragraphs: [
      "The only temple of the complex dedicated to the Trimurti. Its wall reliefs show the three great gods separately: Vishnu on the north wall, Brahma on the south and Shiva on the east, behind the west-facing entrance.",
      "It is a small cube of a building, 4.8 × 3.85 m and 4.9 m high, on a half-metre plinth, with niches that project boldly out of the wall. The stepped roof shown here is a reconstruction: the original form was lost, as on most Dieng shrines.",
    ],
    facts: [
      ["Size", "4.8 × 3.85 × 4.9 m"],
      ["Dedicated to", "Trimurti"],
      ["Reliefs", "Wisnu N · Brahma S · Syiwa E"],
    ],
  },
  puntadewa: {
    kicker: "Third in the row",
    title: "Candi Puntadewa",
    paragraphs: [
      "A Shiva temple that looks small but tall, because the whole shrine rises from a batur 2.5 m high — you climb a long flight to reach its door. Judging by its structure it may have been the grandest building of the complex when its roof still stood.",
      "That roof is gone and its original form is unknown; the tiered pyramid drawn here follows the pattern of its neighbours.",
    ],
    facts: [
      ["Batur", "2.5 m high"],
      ["Dedicated to", "Shiva"],
      ["Roof", "original form unknown"],
    ],
  },
  sembadra: {
    kicker: "South end of the row",
    title: "Candi Sembadra",
    paragraphs: [
      "The smallest and southernmost shrine, dedicated to Shiva, and by its ornament the last to be built: its niches project outward instead of the recessed ones of the Indian-style early temples, the strongest mark of the local Javanese style at Dieng.",
      "It is described as having an octagonal base with a carved lotus ringed by seventeen small spires and a ratna on the roof. The model keeps a square plan and a plain tiered roof with the ratna crown — the kit builds only square and oblong shrines.",
    ],
    facts: [
      ["Position", "Southernmost and smallest"],
      ["Dedicated to", "Shiva"],
      ["Roof", "lotus, 17 spires, ratna (simplified here)"],
    ],
  },
};

export const dieng: CandiDefinition = {
  id: "dieng",
  name: "Dieng",
  location: "Banjarnegara, Jawa Tengah",
  site: { lat: -7.2052, lon: 109.9069 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "arjuna", label: "Candi Arjuna", anchor: [-2.6, 4, -8], view: { position: [-13, 5.5, -1], target: [-2, 3.5, -8] } },
    { topic: "semar", label: "Candi Semar", anchor: [-9.5, 1.5, -8], view: { position: [-2.5, 2.2, -3.5], target: [-9.5, 1.3, -8] } },
    { topic: "srikandi", label: "Candi Srikandi", anchor: [-0.6, 2.6, 5], view: { position: [-10, 4, 10], target: [-0.5, 2.2, 5] } },
    { topic: "puntadewa", label: "Candi Puntadewa", anchor: [-0.8, 4.5, 20], view: { position: [-11, 6, 25], target: [-0.5, 3.8, 20] } },
    { topic: "overview", label: "The row", anchor: [0, 2, 14], view: { position: [-24, 11, 40], target: [0, 3, 10] } },
  ],
  horizon: [
    { name: "Gunung Prau", lat: -7.18694, lon: 109.92278, relativeHeight: 500, kind: "volcano" },
    { name: "Gunung Sindoro", lat: -7.3011, lon: 109.9967, relativeHeight: 1060, kind: "volcano" },
    { name: "Gunung Sumbing", lat: -7.385, lon: 110.0725, relativeHeight: 1278, kind: "volcano" },
  ],
  orbit: { position: [30, 13, 36], target: [-2, 3, 10] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 55, shadowExtent: 32, approach: { x: 0, z: 1, start: 50 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Dieng",
        // The shrines stand on the drained lake bed: flat lawn, no enclosure walls, no paving.
        shrines: [
          // Tour order walks the row from the south: Sembadra first, then north to Arjuna,
          // and finishes facing Semar across the court.
          { spec: SEMBADRA, at: { x: 0, z: 32 }, facing: "west", tour: { topic: "sembadra", label: "Candi Sembadra" } },
          { spec: PUNTADEWA, at: { x: 0, z: 20 }, facing: "west", tour: { topic: "puntadewa", label: "Candi Puntadewa" } },
          { spec: SRIKANDI, at: { x: 0, z: 5 }, facing: "west", tour: { topic: "srikandi", label: "Candi Srikandi" } },
          { spec: ARJUNA, at: { x: 0, z: -8 }, facing: "west", tour: { topic: "arjuna", label: "Candi Arjuna" } },
          { spec: SEMAR, at: { x: -10, z: -8 }, facing: "east", tour: { topic: "semar", label: "Candi Semar" } },
        ],
        approach: { from: { x: 0, z: 50 }, topic: "overview", label: "Approach from the south" },
      },
      textures,
    ),
};
