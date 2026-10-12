import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Mendut" (citing Soekmono and the Karangtengah inscription) and the
 * Borobudur Conservation Office notes. Published figures: base 13.7 m square and 3.7 m high,
 * total height 26.4 m. The temple faces north-west; it is drawn facing west here.
 */
export const MENDUT: ShrineSpec = {
  plinths: [{ half: 6.85, height: 3.7, balustrade: 1, relief: true }],
  foot: { half: 5, height: 0.6 },
  body: { half: 4.4, height: 8.5, wall: 1 },
  door: { width: 1.5, height: 3.2 },
  doors: ["east"],
  stairWidth: 2.2,
  bay: { width: 0.5, depth: 0.06 },
  roof: { tiers: 3, first: 3.4, shrink: 0.78, finial: "stupa" },
  crown: { kind: "stupa", height: 4.5 },
  image: { kind: "buddha", height: 3 },
};

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Magelang, Central Java · early 9th century CE",
    title: "Candi Mendut",
    paragraphs: [
      "A Buddhist temple 3 km east of Borobudur, built by the Sailendra dynasty. The Karangtengah inscription of 824 CE mentions a sanctuary called Venuvana, 'bamboo grove', often identified with Mendut.",
      "Borobudur, Pawon and Mendut lie on a straight line, and each year the Waisak procession walks from Mendut through Pawon to Borobudur.",
      "Found under a mound of earth in 1836, it was restored between 1897 and 1904. The upper roof did not survive and its exact form is unknown; the stupa crown here is a reconstruction.",
    ],
    facts: [
      ["Height", "26.4 m"],
      ["Base", "13.7 × 13.7 m, 3.7 m high"],
      ["Faces", "North-west (drawn facing west)"],
      ["Restored", "1897–1904"],
    ],
  },
  chamber: {
    kicker: "The chamber",
    title: "Three great statues",
    paragraphs: [
      "The chamber holds three of the finest Buddhist statues in Java, each carved from a single block. In the middle sits Vairocana, about 3 m tall, making the dharmachakra mudra and seated with both feet on the ground rather than cross-legged.",
      "He is flanked by the bodhisattvas Avalokiteshvara and Vajrapani. Here a single seated Buddha stands in for the group.",
    ],
    facts: [
      ["Centre", "Vairocana, ≈ 3 m"],
      ["Left", "Avalokiteshvara"],
      ["Right", "Vajrapani"],
    ],
  },
  reliefs: {
    kicker: "Stair and walls",
    title: "Fables on the stairway",
    paragraphs: [
      "The cheek walls of the stairway carry animal fables from the Jataka and Pancatantra, such as the tortoise carried through the air by two geese who drops when he opens his mouth to speak.",
      "The outer walls of the body bear large panels of bodhisattvas and of Tara, and the base walkway is enclosed by a low balustrade.",
    ],
  },
};

export const mendut: CandiDefinition = {
  id: "mendut",
  name: "Mendut",
  location: "Magelang, Jawa Tengah",
  site: { lat: -7.6046, lon: 110.2295 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "chamber", label: "Vairocana", anchor: [-4.4, 6.5, 0], view: { position: [-24, 7, 6], target: [-3, 6, 0] } },
    { topic: "reliefs", label: "Stairway fables", anchor: [-10, 2.5, 1.6], view: { position: [-20, 4, 10], target: [-9, 2.5, 0] } },
    { topic: "overview", label: "Roof", anchor: [0, 20, 0], view: { position: [-30, 22, 24], target: [0, 15, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2650, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2880, kind: "volcano" },
    { name: "Sumbing", lat: -7.384, lon: 110.07, relativeHeight: 3100, kind: "volcano" },
    { name: "Sindoro", lat: -7.3, lon: 109.992, relativeHeight: 2870, kind: "volcano" },
    { name: "Menoreh Hills", lat: -7.7, lon: 110.15, relativeHeight: 650, kind: "ridge" },
  ],
  sources: [
    { title: "Mendut — Wikipedia", url: "https://en.wikipedia.org/wiki/Mendut" },
    { title: "Candi Mendut — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Mendut" },
  ],
  orbit: { position: [-40, 22, 34], target: [0, 9, 0] },
  realms: {
    lower: "Kamadhatu · base",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 70, shadowExtent: 30, approach: { x: -1, z: 0, start: 20 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Mendut",
        courts: [{ halfX: 20, halfZ: 18 }],
        shrines: [{ spec: MENDUT, at: { x: 0, z: 0 }, facing: "west", tour: { topic: "chamber", label: "Base walkway and chamber" } }],
        approach: { from: { x: -60, z: 0 }, topic: "overview", label: "Approach from the north-west" },
      },
      textures,
    ),
};
