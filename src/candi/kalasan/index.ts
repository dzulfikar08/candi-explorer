import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Kalasan" (citing the Kalasan inscription of 778 CE, Soekmono and
 * Dumarçay). The plan is cruciform: a chapel projects from each face of the central chamber.
 * Dimensions are approximated from photographs; only the inscription date is a published figure.
 */
const KALASAN: ShrineSpec = {
  plinths: [{ half: 13, height: 1.2 }],
  foot: { half: 9.5, height: 3 },
  body: { half: 7, height: 7.5, wall: 1.6 },
  door: { width: 1.5, height: 3 },
  doors: ["east"],
  stairWidth: 2.2,
  bay: { width: 0.5, depth: 0.2 },
  roof: { tiers: 3, first: 4, shrink: 0.78, finial: "stupa" },
  crown: { kind: "stupa", height: 5 },
  niches: "buddha",
};

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Sleman, Yogyakarta · 778 CE",
    title: "Candi Kalasan",
    paragraphs: [
      "One of the oldest temples on the Prambanan plain, and one of the few in Java whose founding is dated. The Kalasan inscription of 778 CE, in Sanskrit, records that the gurus of the Sailendra king persuaded Maharaja Tejahpurnapana Panangkarana to build a sanctuary for the goddess Tara, with the village of Kalasa granted to the Buddhist community.",
      "The temple has a cruciform plan, with a chapel projecting from each side of the central chamber. Its roof steps up in tiers ringed with small stupas toward a crowning stupa, now lost.",
      "The nearby Candi Sari is often taken to be the monastery the inscription also mentions.",
    ],
    facts: [
      ["Founded", "778 CE (Kalasan inscription)"],
      ["Dedicated to", "Tara"],
      ["Faces", "East"],
    ],
  },
  vajralepa: {
    kicker: "Surface",
    title: "Vajralepa and the great Kala",
    paragraphs: [
      "The carved stone was coated with vajralepa, 'diamond plaster', a fine white render that sharpened the carving and protected it. Traces survive in the deeper recesses.",
      "Above the south doorway is one of the finest Kala heads in Java: the monster face set over thresholds to ward off evil, here surrounded by a dense border of foliage and celestial figures.",
    ],
  },
};

export const kalasan: CandiDefinition = {
  id: "kalasan",
  name: "Kalasan",
  location: "Sleman, DI Yogyakarta",
  site: { lat: -7.7672, lon: 110.4724 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "vajralepa", label: "Kala head", anchor: [0, 9, 7.4], view: { position: [4, 9, 24], target: [0, 8, 6] } },
    { topic: "overview", label: "Stupa roof", anchor: [0, 20, 0], view: { position: [30, 26, 22], target: [0, 16, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2760, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2990, kind: "volcano" },
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 450, kind: "ridge" },
  ],
  sources: [
    { title: "Kalasan — Wikipedia", url: "https://en.wikipedia.org/wiki/Kalasan" },
    { title: "Candi Kalasan — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Kalasan" },
  ],
  orbit: { position: [52, 26, 38], target: [0, 9, 0] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 80, shadowExtent: 35, approach: { x: 1, z: 0, start: 32 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Kalasan",
        courts: [{ halfX: 28, halfZ: 28 }],
        shrines: [{ spec: KALASAN, at: { x: 0, z: 0 }, facing: "east", tour: { topic: "vajralepa", label: "Around the temple" } }],
        approach: { from: { x: 70, z: 0 }, topic: "overview", label: "Approach from the east" },
      },
      textures,
    ),
};
