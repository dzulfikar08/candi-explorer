import type { StoneTextures } from "../../render/stone";
import { buildBahal } from "./model";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Bahal temple" (citing Miksic 1996, Kepustakaan Candi 2015 and I.G.N. Anom &
 * Tjepi Kusman 1991) and the National Library of Indonesia's "Kepustakaan Candi" entry for Candi
 * Bahal, which carries the measured dimensions used by the model. Horizon: Sibualbuali (1819 m,
 * 1.556°N 99.255°E, Global Volcanism Program / Wikidata) and Sorikmarapi (2145 m, 0.684°N
 * 99.543°E, GVP / PeakVisor); the plain around Bahal village lies at about 65 m elevation
 * (elevationmap.net). Orientation: the gate stands mid-east and the temple faces it.
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Padang Lawas Utara, Sumatera Utara · 11th–13th century CE",
    title: "Candi Bahal I",
    paragraphs: [
      "The largest of the three Biaro Bahal temples — biaro, from vihara, a monastery — that stand about 500 m apart on the dry plain of Padang Lawas. The name Bahal is still used in Nepal for two-storeyed Vajrayana temples, and the complex is linked to the kingdom of Pannai, a port on the Strait of Malacca under the Srivijayan mandala, around the 11th to 13th century.",
      "Every structure here is red brick; only the sculptures are of stone. Each temple sits in its own walled courtyard with a gate on the east wall, the main temple facing the gate across the lawn. The architecture is so close to Candi Jabung in East Java that the two are often compared.",
      "Bahal I is the only temple of Padang Lawas fully restored, in campaigns in 1977–1978 and 1982–1983. The worship practised here is debated: the Buddhist identification fits the biaro name and the roof form, while finds of a Ganesha and giants in stone point to Tantrayana, into which Saiva and Buddhist cults both folded.",
    ],
    facts: [
      ["Period", "11th–13th century (Pannai)"],
      ["Material", "Red brick, stone sculpture"],
      ["Courtyard", "≈ 3000 m², walled"],
      ["Restored", "1977–1978, 1982–1983"],
      ["Faces", "East, toward the gate"],
    ],
  },
  tangga: {
    kicker: "The stairway",
    title: "Makara and dancers",
    paragraphs: [
      "The temple base projects a walkway 4 m long and 2 m wide to the east, ending in a stair flanked by a pair of stone makara heads with wide-open mouths. Inside each mouth crouches a creature like the kinnara of Javanese temples, but the backs of these makara carry rows of carved circles found on no Javanese example.",
      "Along the walls of the walkway run carvings of human figures, many caught mid-dance, and the east face of the base carries seated giants. The base itself is 7 m square and 1.8 m high, with the temple foot, 6 m square and 75 cm tall, standing free inside a narrow walk around it.",
    ],
    facts: [
      ["Base (tatakan)", "≈ 7 × 7 m, 1.8 m high"],
      ["Foot (kaki)", "≈ 6 × 6 m, 0.75 m high"],
      ["Guarding the stair", "Pair of stone makara"],
    ],
  },
  ruang: {
    kicker: "The chamber",
    title: "An empty room",
    paragraphs: [
      "A stair of about 60 cm rises from the foot's surface to a plain doorway 1.2 m wide and 2.5 m high, without a trace of carving on its frame. Inside, the body of the temple is hollow: a room about 3 m square enclosed by walls a metre thick.",
      "The room stands empty, and no record tells what image, if any, once stood here. Whatever the temple enshrined — the bronze and stone Buddhas and Saiva figures found across Padang Lawas hint at a Vajrayana circle — it has vanished with the monastery it served.",
    ],
    facts: [
      ["Doorway", "1.2 × 2.5 m, plain frame"],
      ["Chamber", "≈ 3 × 3 m, walls ≈ 1 m"],
      ["Contents", "None preserved"],
    ],
  },
  atap: {
    kicker: "The roof",
    title: "A cylinder of brick",
    paragraphs: [
      "The roof of Bahal I is unique among Indonesian temples: neither the stepped pyramid of East Java nor the stupa of Muara Takus, but a tall cylinder about 2.5 m high, sitting on the square body like a cake on a plate, ringed at its edge by carved garlands of flowers.",
      "That rounded profile reminded early observers of the Mahligai at Muara Takus, one of the arguments for calling Bahal a Buddhist temple. Whatever rose above the cylinder is lost; the flat top seen today is as the restoration left it.",
    ],
    facts: [
      ["Roof", "Cylinder ≈ 2.5 m high"],
      ["Decoration", "Carved flower garlands"],
      ["Comparable", "Mahligai, Muara Takus"],
    ],
  },
  halaman: {
    kicker: "The courtyard",
    title: "Walls to walk on",
    paragraphs: [
      "A courtyard of about 3000 m² is enclosed by a brick wall a metre thick but only 60 cm high — broad enough to walk around the compound on top of it. At the middle of the east side the wall spreads into a floor that projects 7 m outward, its edges flanked by 70 cm walls, with stairs at the north and south ends of the gate.",
      "Between the gate and the temple stands a square platform about 7 m across with stairs on its east and west faces; its purpose is unknown, as are the two small foundations in a row to the south and the ruined foundation in the north-west corner. Stone sculptures recovered from the site are kept in the small museum across the road.",
    ],
    facts: [
      ["Courtyard", "≈ 3000 m²"],
      ["Wall", "≈ 1 m thick, 0.6 m high"],
      ["Gate", "East, floor projecting 7 m"],
    ],
  },
};

export const bahal: CandiDefinition = {
  id: "bahal",
  name: "Bahal I",
  location: "Padang Lawas Utara, Sumatera Utara",
  site: { lat: 1.40556, lon: 99.73056 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "tangga", label: "Makara stair", anchor: [10.2, 1.1, 0], view: { position: [17, 3, 8], target: [9.5, 1.2, 0] } },
    { topic: "ruang", label: "Chamber door", anchor: [2.5, 4.2, 0], view: { position: [9, 5.5, 6.5], target: [2, 4.2, 0] } },
    { topic: "atap", label: "Drum roof", anchor: [0, 7.6, 2], view: { position: [13, 10.5, -15], target: [0, 6.8, 0] } },
    { topic: "halaman", label: "Gate and platform", anchor: [15.5, 0.7, 0], view: { position: [24, 3, 13], target: [15.5, 0.6, 0] } },
    { topic: "overview", label: "The biaro from the south-east", anchor: [0, 5, 0], view: { position: [26, 14, 30], target: [0, 4, 0] } },
  ],
  horizon: [
    { name: "Sibualbuali", lat: 1.556, lon: 99.255, relativeHeight: 1750, kind: "volcano" },
    { name: "Sorikmarapi", lat: 0.684, lon: 99.543, relativeHeight: 2080, kind: "volcano" },
  ],
  sources: [
    { title: "Bahal temple — Wikipedia", url: "https://en.wikipedia.org/wiki/Bahal_temple" },
    { title: "Candi Bahal — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Bahal" },
  ],
  // Home view from the gate/stair side, offset ~35° south, low enough to read stair and temple.
  orbit: { position: [33, 22, 24], target: [0, 5, 0] },
  realms: {
    lower: "Kamadhatu · enclosure and foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 60, shadowExtent: 40, approach: { x: 1, z: 0, start: 75 } },
  build: (textures: StoneTextures) => buildBahal(textures),
};
