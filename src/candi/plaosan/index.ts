import type { StoneTextures } from "../../render/stone";
import type { CandiDefinition, Topic } from "../types";
import { buildPlaosan } from "./model";

/**
 * Sources: Wikipedia "Plaosan" (174 small buildings: 116 stupas and 58 shrines; inscriptions
 * dated 825–850 CE naming the sanctuary a gift of Rakai Pikatan; built by Sri Kahulunan /
 * Pramodhawardhani, daughter of Samaratungga, married to Rakai Pikatan; two-storey main temples
 * in upper and lower levels of three rooms; Khmer prince relief; 2006 earthquake damage);
 * Indonesian Wikipedia "Candi Plaosan" (Plaosan Lor's two main temples lined north–south, male
 * reliefs on the southern and female on the northern temple, moat around the complex); Véronique
 * Degroot, "Candi, Space and Landscape" (Leiden 2009) and candi.pnri.go.id via ki-demang.com for
 * all layout, dimension and perwara-row figures (see model.ts); aroengbinang.com (temples ~30 m
 * apart, south temple restored 1962 and north in the 1990s by Suaka Peninggalan Sejarah dan
 * Purbakala Jawa Tengah, ~60 cm base, dvarapala at the west entrance); readingborobudur.org (row
 * breakdown 50 / 54+4 / 62+4, dvarapala found 70 cm under ground in 1994, mandapa with 16
 * column bases); yogyes.com (pendopo ≈ 21.62 × 19 m); arkadewi.id (main temples ≈ 21 m high —
 * the only published height found, treated as approximate).
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Klaten, Central Java · mid-9th century CE",
    title: "Candi Plaosan",
    paragraphs: [
      "A Buddhist sanctuary on the Prambanan plain about 1 km northeast of Prambanan itself. Short inscriptions dated 825–850 CE record Plaosan as a gift of sanctuary of Rakai Pikatan, the Hindu king of Mataram, and connect it with Sri Kahulunan — usually identified as his queen Pramodhawardhani, the Buddhist daughter of the Sailendra king Samaratungga.",
      "'Lor' means north: the site divides into Plaosan Lor and Plaosan Kidul, now split by a village road but once one compound walled and moated against its enemies. This model covers the core of Plaosan Lor — the twin main temples, their courts, the three rows of perwara and the northern pendopo; the outer enclosure walls and the moat are not drawn.",
      "The twin temples are the only two-storey shrines still standing on the plain, three rooms to a floor, with rows of near life-size figures carved on their outer walls. The 2006 Yogyakarta earthquake damaged the site, and restoration continues.",
    ],
    facts: [
      ["Perwara", "174: 58 shrines · 116 stupas"],
      ["Built", "inscriptions of 825–850 CE"],
      ["Faces", "West (264°)"],
      ["Core enclosure", "225 × 87 m"],
    ],
  },
  twins: {
    kicker: "The twin candi induk",
    title: "Two temples, two storeys, one household",
    paragraphs: [
      "The two main temples stand side by side about 30 m apart, each in its own walled court, joined by a gate in the wall between them. Both are oblong, 23.3 m north–south by 15.7 m east–west, and face west — a rarity on the Prambanan plain, where temples face the sunrise.",
      "Behind the entrance vestibule each floor held three rooms; beam sockets once carried a wooden upper floor, and scholars have read the smooth, unpierced terraces as a monastery for monks or a treasury for canonical texts. Each temple housed six stone Bodhisattvas around a missing central image, probably a bronze Buddha — eighteen statues in the pair.",
      "The southern temple was rebuilt in 1962, the northern in the 1990s. The reliefs differ deliberately: men on the southern walls, women on the northern ones — read as Rakai Pikatan and Pramodhawardhani, each watching over the other's faith.",
    ],
    facts: [
      ["Plan", "23.3 × 15.7 m each"],
      ["Height", "≈ 21 m"],
      ["Storeys", "2, three rooms a floor"],
      ["Restored", "1962 · 1990s"],
    ],
  },
  facades: {
    kicker: "Outer walls",
    title: "Figures nearly life-size",
    paragraphs: [
      "Rows of carved figures run along the outer walls of both temples at close to human scale: mostly male bodhisattvas, with smaller female figures by the windows, each in a niche under a kala mask. Inside, niches flanked by Kuwera, god of wealth, and Hariti, protector of children, once held lamps.",
      "One inner-wall figure wearing a distinctive crown has been identified as a Khmer prince — a foreign guest carved among the worshippers of a Javanese sanctuary.",
    ],
  },
  perwara: {
    kicker: "174 perwara",
    title: "Rows of stupas and shrines",
    paragraphs: [
      "Around the twin temples run three rectangular rows: an inner row of 50 square shrines about 4.5 m wide looking outward — seven to each short side, nineteen along the east and seventeen along the west — then a row of 54 stupas with a shrine at each corner, and an outer row of 62 stupas with four more corner shrines.",
      "Many carry short inscriptions beginning anumoda, 'a token of approval', naming the kings, princes and officials who paid for each building; the stupa shapes and the temple-shaped caitya are read as gifts of Buddhist and Hindu donors respectively. The rows stand so close together that any procession must have kept to the courts — the circuit of the walls here follows that inner path.",
      "Nearly all of the rows are collapsed. Which shrines stand in this model is illustrative, following the gradual restoration now under way.",
    ],
    facts: [
      ["Inner row", "50 shrines (7 · 7 · 19 · 17)"],
      ["Middle row", "54 stupas + 4 corner shrines"],
      ["Outer row", "62 stupas + 4 corner shrines"],
      ["Total", "174"],
    ],
  },
  mandapa: {
    kicker: "Structure C",
    title: "The pendopo of the north court",
    paragraphs: [
      "At the north end of the compound stands a stone terrace about 21.7 by 18.9 m with its stair on the west side: a pendopo whose wooden hall has long vanished. Sixteen octagonal column bases still mark the positions of the pillars, and a groove for wooden wall panels runs around the platform's edge.",
      "Rows of collapsed stupas surround the terrace — three on the east and west, one on the north and south — and six larger stupas stand in the yard beyond. At the compound's west gates, two pairs of dvarapala giants face each other across the passages; the statues, found in 1994 some 70 cm under the ground, are nearly life-size.",
    ],
    facts: [
      ["Terrace", "21.7 × 18.9 m"],
      ["Column bases", "16"],
      ["Entrance", "West"],
    ],
  },
};

export const plaosan: CandiDefinition = {
  id: "plaosan",
  name: "Plaosan",
  location: "Klaten, Jawa Tengah",
  site: { lat: -7.7406, lon: 110.5044 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "twins", label: "The twin temples", anchor: [0, 11, 48], view: { position: [-75, 32, 140], target: [0, 9, 48] } },
    { topic: "facades", label: "Wall figures", anchor: [-7.6, 8, 73], view: { position: [-36, 11, 94], target: [-7, 7, 73] } },
    { topic: "perwara", label: "Rows of perwara", anchor: [-32.5, 4, 48], view: { position: [-80, 34, 122], target: [-22, 2, 52] } },
    { topic: "mandapa", label: "Pendopo", anchor: [0, 3, -62], view: { position: [-42, 17, -20], target: [0, 2, -62] } },
    { topic: "overview", label: "From the north-west", anchor: [0, 18, 0], view: { position: [-115, 58, -90], target: [0, 8, 12] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2765, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2980, kind: "volcano" },
    { name: "Gunungkidul hills", lat: -7.9, lon: 110.52, relativeHeight: 450, kind: "ridge" },
    { name: "Bukit Ijo", lat: -7.8926, lon: 110.5024, relativeHeight: 210, kind: "ridge" },
  ],
  orbit: { position: [-105, 70, 135], target: [0, 7, 48] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 155, shadowExtent: 120, approach: { x: -0.88, z: 0.47, start: 100 } },
  build: (textures: StoneTextures) => buildPlaosan(textures),
};
