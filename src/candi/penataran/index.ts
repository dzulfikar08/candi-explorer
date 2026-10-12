import { buildPenataran } from "./model";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources:
 * - Wikipedia "Candi Penataran" (Indonesian): dimensions (Bale Agung 37 × 18.84 × 1.44 m;
 *   Pendopo Teras 29.05 × 9.22 × 1.5 m; Candi Naga 6.57 × 4.83 m, 4.70 m tall, foot and body
 *   only; main temple three terraces totalling 7.19 m), site elevation 450 m, area 12,946 m²,
 *   the dated buildings (Palah inscription 1119 Saka = 1197 CE; Candi Naga 1208 Saka = 1286;
 *   dwarapala of 1232/1214/1242 Saka = 1310/1319/1320; main-temple mahakala 1269 Saka = 1347;
 *   Dated Temple 1291 Saka = 1369; Pendopo Teras 1297 Saka = 1375; pool 1337 Saka = 1415), the
 *   relief programme (Ramayana read prasawiya on terrace one, Krishnayana pradaksina on terrace
 *   two, winged lions and nagas on terrace three), and the NW–SE axis of the complex.
 * - Wikipedia "Penataran" (English): three courtyards arranged like a Balinese pura with the
 *   holiest at the rear; Hayam Wuruk's favourite sanctuary in the Nagarakretagama; worship of
 *   Shiva; no stones from a stone roof, so scholars reconstruct a wooden tiered roof like a
 *   Balinese pura; Soekmono's reading of the empty central shrine; UNESCO tentative list
 *   1995–2015; Triguna's Krishnayana.
 * - Wikimedia Commons, KITLV collections (19th-century depictions of the site).
 *
 * The real axis runs WNW–ESE; the model snaps it to west–east (about 22°). All masonry is drawn
 * in andesite; the brick gate and foundations are rendered in the same fabric. The main temple's
 * collapsed upper shrine is drawn rebuilt on the ground south-east of its stepped base, leaving
 * the third terrace's top empty; the ritual pool holds the kit's still-water surface.
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Blitar, East Java · 12th–15th century CE",
    title: "Candi Penataran",
    paragraphs: [
      "The largest Hindu temple complex in East Java, in the village of Penataran on the southwestern slopes of Mount Kelud, 450 m above sea level and about 12 km north-east of Blitar. Its ancient name was Palah: an inscription of 1119 Saka (1197 CE) records King Srengga of Kediri founding a sanctuary where the king daily worshipped Bhatara Palah.",
      "Building went on for some two and a half centuries, through the Singhasari and Majapahit courts. Kertanegara added a temple in 1286, and the Nagarakretagama of 1365 describes King Hayam Wuruk's visit to Palah, his favourite sanctuary. The youngest date on the site is 1415.",
      "Three courtyards lie one behind another, rising toward the sacred mountain at the back like a Balinese pura. Shiva was worshipped here as the mountain god Acalapati, a plea to the volcano that regularly erupts above. The real axis of the complex runs west-north-west to east-south-east; it is drawn facing due west here.",
    ],
    facts: [
      ["Area", "12,946 m², three courts"],
      ["Attested", "1197 (Palah inscription) to 1415"],
      ["Faces", "West (true axis WNW–ESE)"],
      ["Elevation", "450 m"],
    ],
  },
  pendopo: {
    kicker: "The first courtyard",
    title: "Pendopo terraces",
    paragraphs: [
      "The front courtyard held two stone terraces that carried halls of wood and thatch on wooden pillars; the stone pillar bases remain, the roofs are gone. The larger is the Bale Agung, 37 m long, 18.84 m wide and 1.44 m high — by N. J. Krom's reading, the assembly hall of the priests, as in Bali.",
      "South-east of it stands the Pendopo Teras, 29.05 × 9.22 m and 1.5 m high, its walls dated 1297 Saka (1375 CE). Nagas coil around both terraces, and the Pendopo Teras walls carry story reliefs, among them the tales of Bubhuksah and Gagang Aking, of Sri Tanjung, and of Sang Satyawan.",
      "The west gate of the complex is flanked by a pair of giants, the Reco Pentung, dated 1232 Saka (1310 CE) under King Jayanegara; a smaller dated pair (1319 CE) keeps the way into the second courtyard.",
    ],
    facts: [
      ["Bale Agung", "37 × 18.84 m, 1.44 m high"],
      ["Pendopo Teras", "29.05 × 9.22 × 1.5 m"],
      ["Pendopo Teras dated", "1297 Saka = 1375 CE"],
      ["Gate guardians", "Dwarapala of 1310 and 1319 CE"],
    ],
  },
  dated: {
    kicker: "First courtyard, south side",
    title: "The Dated Temple",
    paragraphs: [
      "About 20 m south-east of the Pendopo Teras stands Candi Candra Sengkala, 'the Dated Temple', carved with the year 1291 Saka — 1369 CE. East Javanese know it better as Candi Brawijaya, whose emblem it became.",
      "A single tall cella entered from the west, its niches crowned by kala heads and its roof ending in a cube-shaped mastaka. Inside sits a Ganesha on a padmasana, and the cover stone above the chamber bears the Surya Majapahit, the sun emblem of the dynasty.",
      "A statue beside the temple is read as Gayatri Rajapatni, and the low brick enclosure wall around the building still shows its west entrance. Here it is drawn with a standing figure in place of the Ganesha and a plain block for the mastaka.",
    ],
    facts: [
      ["Dated", "1291 Saka = 1369 CE"],
      ["Door", "West"],
      ["Image", "Ganesha on a padmasana"],
      ["Also called", "Candi Brawijaya"],
    ],
  },
  naga: {
    kicker: "The second courtyard",
    title: "The Naga Temple",
    paragraphs: [
      "Candi Naga is the oldest dated building in the complex: its serpents and their nine supporters spell the chronogram 'naga muluk sinangga jalma', 1208 Saka — 1286 CE, when Kertanegara, the last king of Singhasari, turned his attention to Palah.",
      "Only the foot and body survive, 6.57 m long, 4.83 m wide and 4.70 m high. Nine figures in royal dress stand against the walls — at the corners, at the middle of the three blind walls, and flanking the west door — each with a hand raised to carry the serpent that coils around the body above them; one of their hands holds a ritual bell.",
      "The body walls are carved with medallion reliefs. No stone of the roof survives; the model shows the ruin as it stands, roofless, the serpent suggested by a band and raised head blocks.",
    ],
    facts: [
      ["Built", "1286 CE, under Kertanegara"],
      ["Size", "6.57 × 4.83 m, 4.70 m tall"],
      ["Serpents", "Carried by nine figures"],
      ["Roof", "Lost"],
    ],
  },
  reliefs: {
    kicker: "The main temple",
    title: "Ramayana and Krishnayana in stone",
    paragraphs: [
      "The rear courtyard holds the state sanctuary: three stepped terraces whose walls carry one of the great narrative cycles of Java. Around the first terrace runs the Javanese Ramayana, to be read prasawiya, anti-clockwise, from the north-west corner; around the second, the Krishnayana — Krishna's abduction of and marriage to Rukmini, after Triguna's poem — read clockwise, pradaksina.",
      "The third terrace, nearly square, is carved with winged lions and winged nagas, their heads raised. The figures are drawn like wayang shadows, a style far removed from the classical reliefs of Central Java.",
      "Two mahakala guard each side of the stairway, their pedestals dated 1269 Saka — 1347 CE, deep in the reign of Hayam Wuruk.",
    ],
    facts: [
      ["Terrace 1", "Ramayana, read prasawiya"],
      ["Terrace 2", "Krishnayana, read pradaksina"],
      ["Terrace 3", "Winged lions and nagas"],
      ["Stair guardians", "Dated 1347 CE"],
    ],
  },
  summit: {
    kicker: "The top of the main temple",
    title: "A shrine without a stone roof",
    paragraphs: [
      "The three terraces rise 7.19 m in all. The temple's upper shrine — a small walk-in cella — collapsed long ago. This model shows it on the ground beside the stepped base, with the top of the third terrace left empty; that placement is a drawing choice, not something the sources describe. No stones that could have formed a stone roof were found anywhere in the complex, so scholars reconstruct a wooden frame roofed with palm fibre or thatch in receding tiers, like the meru roofs of Balinese temples.",
      "R. Soekmono concluded that the central chamber was empty: no divine image stood in it. Penataran therefore records the passage from the stone-roofed temples of Central Java to the organic-roofed sanctuaries still in use in Bali. A comparable temple, Pura Yeh Gangga in Bali, was built in 1334 with the same kind of substructure.",
      "Behind the temple, near the river that flows down from Kelud, lies a ritual bathing pool dated 1337 Saka — 1415 CE, the youngest date in the complex. A century's pilgrimages later, the Sundanese chronicle of Bujangga Manik still names Rabut Palah as a place of learning, though he complains the pilgrims had grown worldly.",
    ],
    facts: [
      ["Terraces", "Three, 7.19 m high"],
      ["Roof", "Wood and thatch (reconstructed)"],
      ["Chamber", "Empty (Soekmono)"],
      ["Bathing pool", "Dated 1415 CE"],
    ],
  },
};

export const penataran: CandiDefinition = {
  id: "penataran",
  name: "Penataran",
  location: "Blitar, Jawa Timur",
  site: { lat: -8.01611, lon: 112.20917 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "pendopo", label: "Pendopo terraces", anchor: [-52, 2.2, -8], view: { position: [-76, 11, 26], target: [-46, 2, -3] } },
    { topic: "dated", label: "The Dated Temple", anchor: [-21, 5.5, 16], view: { position: [-37, 6.5, 28], target: [-20.5, 4, 16] } },
    { topic: "naga", label: "The Naga Temple", anchor: [2, 4.2, 3], view: { position: [-14, 8, 15], target: [2, 3.5, 3] } },
    { topic: "reliefs", label: "Ramayana reliefs", anchor: [30.5, 4.8, 0], view: { position: [12, 8, 15], target: [30, 4.2, 0] } },
    { topic: "summit", label: "The upper shrine", anchor: [69, 4, 6], view: { position: [50, 9, 18], target: [66, 3.5, 6] } },
  ],
  horizon: [
    { name: "Kelud", lat: -7.93, lon: 112.3094, relativeHeight: 1281, kind: "volcano" },
    { name: "Kawi", lat: -7.9167, lon: 112.4622, relativeHeight: 2101, kind: "volcano" },
    { name: "Arjuno-Welirang", lat: -7.717, lon: 112.575, relativeHeight: 2949, kind: "volcano" },
    { name: "Semeru", lat: -8.108, lon: 112.925, relativeHeight: 3226, kind: "volcano" },
  ],
  sources: [
    { title: "Candi Penataran — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Penataran" },
    { title: "Penataran — Wikipedia", url: "https://en.wikipedia.org/wiki/Penataran" },
    { title: "Candi Penataran — Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/Category:Candi_Penataran" },
  ],
  orbit: { position: [20, 22, 30], target: [48, 2.5, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 125, shadowExtent: 95, approach: { x: -1, z: 0, start: 100 } },
  build: buildPenataran,
};
