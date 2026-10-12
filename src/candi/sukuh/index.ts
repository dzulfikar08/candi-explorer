import type { StoneTextures } from "../../render/stone";
import { buildSukuh } from "./model";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Sukuh" (en, citing Kinney/Klokke/Kieven "Worshiping Siva and Buddha",
 * Miksic and O'Connor; figures: 910 m elevation, 8.7 m height, 1437 gate chronogram, 1.82 m
 * lingga of 1440, three west-facing turtles, Raffles/Johnson 1815), Indonesian Wikipedia
 * "Candi Sukuh" (terrace structure, gate chronograms 1359 Saka = 1437 and 1378 Saka = 1456,
 * 1928 restoration, andesite stone, offering square on the summit, pyramid read as Mount
 * Mandaragiri) and the perpusnas-based description on joynesia.com (paduraksa first gate,
 * roofless second gate, floor lingga-yoni stepped over as a ruwat, winged eagle figures dated
 * 1441-1442, Sudamala panels, ≈ 15 m pyramid base, narrow steep west stair, wooden
 * superstructure hypothesis, andesite). Terrace risers, court sizes and statue positions are
 * photo estimates; the pyramid's battered walls are drawn as a two-tier stack.
 */

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Karanganyar, Jawa Tengah · 15th century CE",
    title: "Candi Sukuh",
    paragraphs: [
      "A Hindu sanctuary at 910 m on the western slope of Mount Lawu, above the village of Berjo in Karanganyar. Built around 1437, in the last decades of Majapahit rule, it belongs to the last significant burst of temple building in Java before the island's courts turned to Islam.",
      "It breaks the classical rules. Instead of a tall tapering shrine it rises as three stepped courts crowned by a truncated pyramid, a shape that recalls the pyramids of Mesoamerica and revives Java's pre-Hindu punden berundak terraces. What the shape meant to its builders is not recorded; one suggestion is simply a mountain.",
      "In 1815 Johnson, Raffles' resident at Surakarta, reported the complex collapsed: statues toppled, most figures decapitated. Restoration has run in several campaigns since the Dutch period. The walk here follows the old approach, from the 1437 gate up through the courts to the pyramid at the back.",
    ],
    facts: [
      ["Height", "8.7 m"],
      ["Built", "c. 1437 CE"],
      ["Elevation", "910 m"],
      ["Faces", "West"],
    ],
  },
  gate: {
    kicker: "The first terrace",
    title: "The 1437 gate",
    paragraphs: [
      "Worshippers entered through a roofed paduraksa gate in the western wall of the lowest terrace. Its wings carry a carving of a monster swallowing a man, with birds in a tree and a dog below: a chronogram reading 1359 Saka, 1437 CE, the likely date of the temple's consecration.",
      "Set into the floor just inside, where everyone entering must step across it, lies a relief of a lingga and yoni about to meet. Such floor carvings were meant to be walked over: crossing them formed part of a ruwat, a cleansing rite for those who came in.",
    ],
    facts: [
      ["Form", "Paduraksa (roofed)"],
      ["Chronogram", "1359 Saka = 1437 CE"],
      ["Floor relief", "Lingga and yoni"],
    ],
  },
  terraces: {
    kicker: "The middle court",
    title: "Gates without roofs",
    paragraphs: [
      "Each court is enclosed by its own low wall, and each climb to the next terrace passes through a gate beside the stair. The second-terrace gate has lost its roof, and two guardian dwarapala beside the third stair are worn nearly smooth.",
      "A chronogram on the second gate, 'the elephant priest bites the tail', reads 1378 Saka, 1456 CE, a generation after the first gate and perhaps after a later repair.",
    ],
    facts: [
      ["Second gate", "Roofless"],
      ["Its chronogram", "1378 Saka = 1456 CE"],
      ["Guardians", "Dwarapala pair"],
    ],
  },
  statues: {
    kicker: "The third terrace",
    title: "Turtles, eagles and the world's foundation",
    paragraphs: [
      "Three great stone turtles lie in front of the pyramid, heads to the west, their shells flattened like tables, perhaps offering tables for purification and ancestor rites. In Hindu myth the tortoise Kurma is the avatar that supports the world.",
      "On the north side stood three winged eagle-headed figures, two now headless; inscriptions on them date to 1441 and 1442. With the turtles they belong to the Garudeya tale, the quest for the water of life: the churning of the ocean is named in one inscription, and the truncated pyramid itself has been read as Mount Mandara, the mountain used as the churning-stick.",
      "South of the path a small hollow shrine, candi pewara, keeps a small headless figure that is still venerated with offerings today.",
    ],
    facts: [
      ["Turtles", "Three, heads west"],
      ["Winged figures", "Three, one intact"],
      ["Their dates", "1441-1442 CE"],
      ["Small shrine", "Candi pewara"],
    ],
  },
  reliefs: {
    kicker: "The panels",
    title: "Sudamala and the smith",
    paragraphs: [
      "Carved slabs stand loose in the courts. On the north side of the first court: a horseman with his spearmen, a pair of oxen and a man on an elephant. On the pyramid's west face, a life-sized man grasps his own penis, one of the frank fertility images that set Sukuh apart from every older Javanese monument.",
      "Five panels on the south side of the upper court tell the Sudamala, the story of Sadewa freeing the goddess Durga from her curse: a ruwat tale, like the temple's own rites. Inscriptions and chronograms on the panels date the work between 1439 and 1442.",
      "Beside the stair a relief shows a smithy: Bhima at the forge, Ganesha dancing, Arjuna blowing the furnace. In Java the smith drew his power from the god of fire, and a magic kris from the smithy legitimised kings.",
    ],
    facts: [
      ["Sudamala", "Five panels, south side"],
      ["First court", "Horseman, oxen, elephant"],
      ["Smithy relief", "Bhima, Ganesha, Arjuna"],
      ["Dated", "1439-1442 CE"],
    ],
  },
  pyramid: {
    kicker: "The main monument",
    title: "A truncated pyramid",
    paragraphs: [
      "At the back of the highest court rises the main monument: a plain truncated pyramid, about 15 m across the base and 8.7 m tall, its sheer battered walls relieved only by a narrow, steep stairway that climbs the west face straight to the summit platform.",
      "On the platform a square block still carries traces of incense, the offering place. The only object recovered from the summit is a 1.82 m lingga inscribed from tip to base with the date 1440, now in the National Museum in Jakarta; it may once have stood here. Several archaeologists think the stone pyramid is only the pedestal of the sanctuary, its shrine built in timber above, for post stones remain around the top.",
    ],
    facts: [
      ["Base", "≈ 15 m across"],
      ["Height", "8.7 m"],
      ["Summit find", "1.82 m lingga, now Jakarta"],
      ["Stairway", "Narrow, on the west face"],
    ],
  },
};

export const sukuh: CandiDefinition = {
  id: "sukuh",
  name: "Sukuh",
  location: "Karanganyar, Jawa Tengah",
  site: { lat: -7.62722, lon: 111.13111 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "gate", label: "The 1437 gate", anchor: [-27, 4.6, 0], view: { position: [-49, 6.5, 13], target: [-27, 4, 0] } },
    { topic: "pyramid", label: "The pyramid", anchor: [14, 11, 0], view: { position: [-18, 7.5, 32], target: [18, 10, 0] } },
    { topic: "statues", label: "Turtle altars", anchor: [8.6, 8, 4.6], view: { position: [-2, 9.5, 14], target: [9, 7.6, 3.6] } },
    { topic: "reliefs", label: "Sudamala panels", anchor: [13, 8.4, 9.9], view: { position: [5.5, 9, 15.5], target: [13, 7.6, 9.7] } },
    { topic: "pyramid", label: "Summit platform", anchor: [19.5, 16.2, 0], view: { position: [-3, 13.5, 27], target: [19, 15, 0] } },
  ],
  horizon: [
    { name: "Lawu", lat: -7.6253, lon: 111.1923, relativeHeight: 2355, kind: "volcano" },
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2020, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2235, kind: "volcano" },
    { name: "Sumbing", lat: -7.384, lon: 110.07, relativeHeight: 2460, kind: "volcano" },
    { name: "Sindoro", lat: -7.3, lon: 109.992, relativeHeight: 2226, kind: "volcano" },
  ],
  orbit: { position: [-45, 30, 46], target: [10, 4, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 85, shadowExtent: 45, approach: { x: -1, z: 0, start: 60 } },
  build: (textures: StoneTextures) => buildSukuh(textures),
};
