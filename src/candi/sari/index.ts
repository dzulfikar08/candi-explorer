import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Sari (temple)" (citing Soekmono and the Kalasan inscription). Published
 * figures: about 17.3 m north–south by 10 m east–west, two storeys of three rooms each. The
 * windows and the second storey's floor are not modelled; the body is drawn as one tall chamber.
 */
const SARI: ShrineSpec = {
  foot: { half: 5.6, height: 1.4 },
  body: { half: 5, height: 9.5, wall: 1 },
  aspect: 1.73,
  door: { width: 1.2, height: 2.6 },
  doors: ["east"],
  stairWidth: 1.6,
  bay: { width: 0.3, depth: 0.05 },
  roof: { tiers: 2, first: 2.2, shrink: 0.82, finial: "stupa" },
  crown: { kind: "stupa", height: 2.6 },
  niches: "deity",
};

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Sleman, Yogyakarta · late 8th century CE",
    title: "Candi Sari",
    paragraphs: [
      "An oblong two-storey Buddhist building near Kalasan, with three rooms on each floor. Holes in the walls held the beams of a wooden upper floor, and windows light both storeys, so it is usually read as a vihara, a dwelling for monks, rather than a shrine.",
      "It is often identified with the monastery that the Kalasan inscription of 778 CE says was built next to the temple of Tara.",
    ],
    facts: [
      ["Plan", "≈ 17.3 × 10 m"],
      ["Storeys", "2, three rooms each"],
      ["Faces", "East"],
    ],
  },
  figures: {
    kicker: "Outer walls",
    title: "Taras and bodhisattvas",
    paragraphs: [
      "Between the windows the outer walls carry 36 standing figures of Taras and bodhisattvas, most in pairs, holding lotus flowers. Like Kalasan, the carving was finished with a coat of white vajralepa plaster.",
      "The roof carries three rows of three stupas; here a single tier of small stupas and a crown stand in for them.",
    ],
    facts: [["Wall figures", "36"]],
  },
};

export const sari: CandiDefinition = {
  id: "sari",
  name: "Sari",
  location: "Sleman, DI Yogyakarta",
  site: { lat: -7.7598, lon: 110.4727 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "figures", label: "Wall figures", anchor: [0, 6, 8.8], view: { position: [10, 6, 22], target: [0, 6, 6] } },
    { topic: "overview", label: "Entrance", anchor: [5.2, 3, 0], view: { position: [22, 6, 6], target: [0, 5, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2760, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2990, kind: "volcano" },
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 450, kind: "ridge" },
  ],
  orbit: { position: [36, 16, 30], target: [0, 7, 0] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · storeys",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 70, shadowExtent: 28, approach: { x: 1, z: 0, start: 22 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Sari",
        courts: [{ halfX: 18, halfZ: 22 }],
        shrines: [{ spec: SARI, at: { x: 0, z: 0 }, facing: "east", tour: { topic: "figures", label: "Around the vihara" } }],
        approach: { from: { x: 60, z: 0 }, topic: "overview", label: "Approach from the east" },
      },
      textures,
    ),
};
