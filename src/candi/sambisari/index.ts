import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import { sunkenCourt } from "../kit/enclosure";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Sambisari" and the BPCB Yogyakarta site notes. Published figures: found in
 * 1966 about 6.5 m below the present ground; inner court about 50 × 48 m; main temple base about
 * 13.6 m square. The excavation's grassy banks are drawn as straight retaining walls.
 */

const DEPTH = 6.5;
const PIT = { halfX: 40, halfZ: 36 };

const MAIN: ShrineSpec = {
  plinths: [{ half: 6.8, height: 1.4, balustrade: 0.9 }],
  foot: { half: 4.3, height: 0.5 },
  body: { half: 3.1, height: 3.6, wall: 0.8 },
  door: { width: 1, height: 2 },
  doors: ["east"],
  stairWidth: 1.6,
  roof: { tiers: 1, first: 1.2, shrink: 0.82, finial: "ratna" },
  crown: { kind: "none", height: 0 },
  image: { kind: "lingga", height: 1.4 },
  niches: "deity",
};

const PERWARA: ShrineSpec = {
  foot: { half: 2.4, height: 1.2 },
  body: { half: 1.6, height: 2.4, wall: 0.5 },
  door: { width: 0.7, height: 1.3 },
  doors: ["east"],
  stairWidth: 1,
  roof: { tiers: 2, first: 1.1, shrink: 0.8, finial: "ratna" },
  crown: { kind: "ratna", height: 1.2 },
};

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Sleman, Yogyakarta · early 9th century CE",
    title: "Candi Sambisari",
    paragraphs: [
      "A Shiva temple that lay hidden under some 6.5 m of volcanic debris from Merapi until 1966, when a farmer's hoe struck carved stone. Excavation and reconstruction took until 1987; the temple now sits at the bottom of a broad pit, its old ground level far below today's fields.",
      "The burial preserved it well. The court is walled, with the main temple facing west towards three small perwara shrines, of which only the bases remain.",
    ],
    facts: [
      ["Buried", "≈ 6.5 m below ground"],
      ["Found", "1966"],
      ["Rebuilt", "1966–1987"],
      ["Faces", "West"],
    ],
  },
  main: {
    kicker: "The main temple",
    title: "Lingga, yoni and niches",
    paragraphs: [
      "The chamber holds a lingga on a yoni, the emblem of Shiva. Niches on the outer walls held Durga to the north, Ganesha to the east and Agastya to the south, the usual guardians of a Javanese Shiva shrine.",
      "The main temple stands on a broad platform with a low balustrade; stone pedestals around it may have carried posts for a wooden shelter. The roof above the body is lost and is drawn here only as a single low tier.",
    ],
    facts: [
      ["Chamber", "Lingga and yoni"],
      ["North niche", "Durga"],
      ["East niche", "Ganesha"],
      ["South niche", "Agastya"],
    ],
  },
};

export const sambisari: CandiDefinition = {
  id: "sambisari",
  name: "Sambisari",
  location: "Sleman, DI Yogyakarta",
  site: { lat: -7.7623, lon: 110.4471 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "main", label: "Main temple", anchor: [-3.2, -3.2, 0], view: { position: [-26, 2, 14], target: [0, -3, 0] } },
    { topic: "overview", label: "Old ground level", anchor: [-40, 0.5, 20], view: { position: [-70, 14, 46], target: [-10, -5, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2750, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2980, kind: "volcano" },
  ],
  orbit: { position: [-62, 30, 48], target: [0, -4, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 90, shadowExtent: 50, approach: { x: -1, z: 0, start: 41 }, pit: PIT },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Sambisari",
        enclosures: [{ halfX: 25, halfZ: 24, y: -DEPTH, height: 1.6, thickness: 0.9, gates: ["west"], gateWidth: 3, gate: "none" }],
        extra(site) {
          sunkenCourt(site, { ...PIT, depth: DEPTH, stairs: ["west", "east"], stairWidth: 3 });
        },
        shrines: [
          { spec: MAIN, at: { x: 0, z: 0 }, y: -DEPTH, facing: "west", tour: { topic: "main", label: "The main temple" } },
          { spec: PERWARA, at: { x: -16, z: -9 }, y: -DEPTH, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -16, z: 0 }, y: -DEPTH, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -16, z: 9 }, y: -DEPTH, facing: "east", ruined: true },
        ],
        approach: {
          from: { x: -80, z: 0 },
          topic: "overview",
          label: "Down into the excavation",
          via: [
            { x: -41, z: 0 },
            { x: -31, z: 0, y: -DEPTH },
            { x: -26, z: 0, y: -DEPTH },
            { x: -22, z: 5, y: -DEPTH },
            { x: -18, z: 5, y: -DEPTH },
          ],
        },
      },
      textures,
    ),
};
