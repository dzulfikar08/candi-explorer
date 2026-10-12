import type { StoneTextures } from "../../render/stone";
import type { CandiDefinition, Topic } from "../types";
import { buildRatuBoko } from "./model";

/**
 * Sources: English Wikipedia "Ratu Boko" (196 m elevation, ~250,000 m², gate rows of three and
 * five paduraksa with the Panabwara inscription, Candi Pembakaran 26 × 26 m with a central square
 * pit, pendopo and kaputren descriptions, the 792 CE Abhayagiri Vihara inscription naming Rakai
 * Panangkaran (r. 746–784), the Shivagrha inscription's fortified hill of 856, the King Boko
 * legend, the debate over the site's function); Indonesian Wikipedia "Situs Ratu Boko" (≈ 25 ha,
 * 8th-century Sailendra origins); the BPCB Yogyakarta site description republished at
 * 1001indonesia.net (outer row of three roofless paduraksa reached by two ~2.5 m flights, main row
 * of five ~15 m east with three stairways and ratna-roofed flankers, Pembakaran ~37 m NE of the
 * main gate with a 4 × 4 m pit and the nearby Amerta Mantana well, paseban 38 × 7 × 1.5 m with
 * 20 umpak, pendopo court 40 × 30 m walled 3 m with gates N/W/S, a 1.46 m stage with 24 umpak, a
 * 20 × 6 m pringgitan with 12, three miniature shrines with the centre one for Vishnu, keputren
 * with square and round basins). Simplifications, visible in the model: the real compound covers
 * roughly 250,000 m² on three terraces — the model compresses it to the gate terrace plus one
 * great plateau; Batu Putih is limestone on site and is drawn in the kit's andesite; basin depths
 * and gate pylon heights are not published and are scaled from photographs.
 */

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Sleman, DI Yogyakarta · 8th–9th century CE",
    title: "Kraton Ratu Boko",
    paragraphs: [
      "Not a temple but a walled hilltop compound: about 3 km south of Prambanan, 196 m above the plain, covering roughly 250,000 m². The Abhayagiri Wihara inscription of 792 CE records Rakai Panangkaran (r. 746–784), a Buddhist king, founding a hilltop retreat here 'free from danger'; Durga, Ganesha and yoni finds show later Hindu patrons too. Local people name the hill after King Boko, the legendary father of Roro Jonggrang of the Prambanan tale.",
      "Whatever it began as, the Shivagrha inscription shows the hill held as a fortified stronghold of stacked stones by 856, in the succession war that ended with Rakai Kayuwangi. Only the stonework survives — the halls stood on timber posts — so the site reads today as terraces, gates and pools, and its function is still argued over: palace, monastery or retreat.",
      "The real terraces spread over hundreds of metres; this model compresses the compound to a walkable core and keeps the gate rows, platforms and pools at their published sizes.",
    ],
    facts: [
      ["Elevation", "196 m above sea level"],
      ["Area", "≈ 250,000 m² (≈ 25 ha)"],
      ["Distance", "≈ 3 km south of Prambanan"],
      ["Earliest inscription", "Abhayagiri Wihara, 792 CE"],
    ],
  },
  gates: {
    kicker: "The western entrance",
    title: "Two rows of paduraksa",
    paragraphs: [
      "The compound is entered from the west, up the slope that faces Prambanan. The outer row is three roofless paduraksa gateways standing shoulder to shoulder on a high terrace, the central one the largest; two stone flights of about 2.5 m each climb to it through revetted talud walls.",
      "Some 15 m east stands the main row: five paduraksa, again with a larger central gateway, but only three stairways — the two small end gates have none. The flanking gateways keep their stepped hip roofs crowned with ratnas, while the great central roof is lost. An inscription on the main gate carries the name of Rakai Panabwara, a descendant of Panangkaran, staking his claim to the palace.",
    ],
    facts: [
      ["Outer row", "3 gateways, roofs lost"],
      ["Main row", "5 gateways, 3 stairways"],
      ["Between the rows", "≈ 15 m"],
      ["Flanking roofs", "Stepped roofs with ratna"],
    ],
  },
  pembakaran: {
    kicker: "North-east of the gates",
    title: "Candi Pembakaran, the burning platform",
    paragraphs: [
      "About 37 m north-east of the main gate rises a two-terrace platform, roughly 26 × 26 m at the base and 3 m tall, its walls faced with stone and a stair on the west side. In the middle of the upper terrace a square pit about 4 × 4 m descends — the feature that earned the structure its name, 'the cremation temple'.",
      "Whether royal corpses were really burned here is uncertain: the platform's size and position suggest it could as well have been an altar or a display terrace. Nearby lies an old well called Amerta Mantana — 'holy water given a mantra' — whose water is still drawn for luck and for the Tawur Agung ceremony held the day before Nyepi.",
    ],
    facts: [
      ["Platform", "≈ 26 × 26 m, 3 m high"],
      ["Burning pit", "≈ 4 × 4 m"],
      ["Distance", "≈ 37 m NE of the main gate"],
    ],
  },
  pendopo: {
    kicker: "Audience halls",
    title: "Paseban and pendopo",
    paragraphs: [
      "South of the gates the paseban reception terrace runs 38 m north–south, 7 m wide and 1.5 m high, climbed from the west. Twenty stone umpak stand on its floor: the bases of timber posts, all that remains of a hall whose walls and roof were wood.",
      "Nearby a 3 m stone wall with paduraksa gates on its north, west and south sides encloses the pendopo court, its drainage spouts (jaladwara) pierce the outer face. Inside stand two stone terraces: the pendopo stage, 1.46 m high with 24 umpak for its columns, and behind it the smaller pringgitan terrace with 12 more. Outside the south-east corner an intact stone terrace carries three miniature shrines — the larger central one for Vishnu, flanked by Shiva and Brahma — with a square stone basin before them.",
    ],
    facts: [
      ["Paseban", "38 × 7 m, 1.5 m high, 20 bases"],
      ["Pendopo stage", "1.46 m high, 24 bases"],
      ["Pringgitan", "20 × 6 m, 12 bases"],
      ["Miniature shrines", "3, centre one for Vishnu"],
    ],
  },
  keputren: {
    kicker: "East of the pendopo",
    title: "The keputren bathing courtyards",
    paragraphs: [
      "Behind their own walls east of the pendopo lie the bathing courtyards remembered as the keputren, the women's quarter. Paduraksa doorways open into walled courts where a large square basin and two narrower ones sink below the paving, and a dividing wall with a connecting door leads on to a second court of eight round basins in three rows.",
      "The pools are part of the hill's water works: a hilltop residence needed springs caught and stored. Water still matters here — devotees draw from the Amerta Mantana well for luck, and Hindus use it in the Tawur Agung rite before Nyepi to purify the soul and restore the earth's harmony.",
    ],
    facts: [
      ["West court", "1 square and 2 rectangular basins"],
      ["East court", "8 round basins in 3 rows"],
      ["Amerta Mantana", "Well still used ritually"],
    ],
  },
  kecil: {
    kicker: "On the terrace's end",
    title: "Three miniature shrines",
    paragraphs: [
      "At the end of the stone terrace outside the pendopo's south-east wall stand three miniature shrines facing the court: a larger central temple dedicated to Vishnu, flanked by shrines for Shiva and Brahma, with a square stone basin set before the row.",
      "Small as they are, the shrines show the compound's religious life running alongside its business of halls and audiences — one reason scholars still argue whether Ratu Boko was a palace at all, a monastery, or a place of retreat.",
    ],
    facts: [
      ["Count", "3 shrines, N–S row"],
      ["Central shrine", "Vishnu, larger"],
      ["Before them", "Square stone basin"],
    ],
  },
};

export const ratuBoko: CandiDefinition = {
  id: "ratu-boko",
  name: "Ratu Boko",
  location: "Sleman, DI Yogyakarta",
  site: { lat: -7.77, lon: 110.4889 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "gates", label: "Gerbang luar", anchor: [-41, 8.5, 0], view: { position: [-63, 11, 20], target: [-41, 8, 0] } },
    { topic: "gates", label: "Gerbang utama", anchor: [-26, 13, 0], view: { position: [-54, 10, 22], target: [-26, 11.5, 0] } },
    { topic: "pembakaran", label: "Candi Pembakaran", anchor: [10, 12.3, -18], view: { position: [-14, 16, -38], target: [10, 11, -18] } },
    { topic: "pendopo", label: "Pendopo", anchor: [43, 11.5, 30], view: { position: [18, 13, 8], target: [43, 11, 30] } },
    { topic: "keputren", label: "Keputren pools", anchor: [78, 10, 32], view: { position: [58, 12.5, 16], target: [78, 9.5, 33] } },
    { topic: "kecil", label: "Candi kecil", anchor: [76, 12.5, 58], view: { position: [56, 11.5, 68], target: [76, 11.5, 58] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2720, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2950, kind: "volcano" },
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 300, kind: "ridge" },
  ],
  orbit: { position: [-138, 68, 60], target: [-33, 8, 0] },
  realms: {
    lower: "Bhurloka · foot — terraces, walls and pools",
    middle: "Bhuvarloka · body — gates and hall platforms",
    upper: "Svarloka · roof — superstructures and finials",
  },
  setting: { plazaRadius: 150, shadowExtent: 110, approach: { x: -0.97, z: -0.24, start: 82 } },
  build: (textures: StoneTextures) => buildRatuBoko(textures),
};
