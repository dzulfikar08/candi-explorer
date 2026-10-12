import type { CandiDefinition, Topic } from "../types";
import { buildMuaraTakus } from "./model";

/**
 * Sources: English Wikipedia "Muara Takus" (74 × 74 m wall about 1 m high with a north gateway;
 * Mahligai 14.30 m, lotus-shaped, lion figures; Bungsu 6.20 m of two stones; Tua 32.8 × 21.8 m,
 * 8.50 m, terraced, solid; Palangka 1.45 m; Srivijaya, 11th–12th century; rediscovered by Cornet
 * De Groot 1860, surveyed by W. P. Groenveld 1880, researched 1983). Indonesian Wikipedia
 * "Candi Muara Takus" (Mahligai plinth 9.44 × 10.6 m, 28-sided base, 36-sided tower, south
 * entrance, Schnitger's corner lions, Yzerman's top slab; Tua foot tiers 2.37 m and 1.98 m, east
 * and west stairs 3.08 m and 4 m, round base remains d ≈ 7 m, sandstone at corners/pilasters/
 * cornices, two phases; Bungsu 13.20 × 16.20 m, square top, sandstone north and brick south
 * halves, Yzerman's gold plates with tricula and Nagari letters, white-stone stair and small
 * stupas east; Palangka 5.10 × 5.7 m, ≈ 2 m, north door, altar; Pongkai clay ≈ 6 km downstream;
 * 1.5 × 1.5 km earthen embankment; oldest candi site in Sumatra / only one in Riau). UNESCO World
 * Heritage tentative list "Muara Takus Compound Site" (submitted 6 Oct 2009; coordinates
 * N 0°20′20.19″ E 100°38′24.62″; 1983 mapping of embankments; vajra drawings and Nagari
 * inscription read as Vajrayana; embankment as flood defence and drainage; brick similarity to
 * Tanjung clay). Indonesia Travel: the largest brick buildings on Sumatra.
 * Horizon: named peaks from OpenStreetMap, summit heights and the ≈ 80 m site elevation sampled
 * from the Copernicus DEM (api.open-meteo.com/v1/elevation).
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Kampar, Riau · 11th–12th century CE",
    title: "Candi Muara Takus",
    paragraphs: [
      "On the bank of the Kampar Kanan river in inland Riau stand some of the largest brick buildings on Sumatra: a Buddhist temple compound thought to belong to the Srivijaya empire, its surviving structures dated to the 11th–12th century. Inside a low perimeter wall of about 74 × 74 metres, with a gateway on the north side, rise Candi Tua, the Stupa Mahligai, Candi Bungsu and Candi Palangka; beyond the wall, earthen ramparts of roughly 1.5 × 1.5 km run down to the river.",
      "The site was rediscovered by Cornet De Groot in 1860, surveyed by W. P. Groenveld in 1880 and mapped again in 1983, when the ancient embankments and the Mahligai compound were recorded. In 2009 Indonesia put Muara Takus on its UNESCO World Heritage tentative list.",
      "This model is procedural: published heights and footprints are matched, the buildings' positions inside the wall are estimated from site photographs, and the polygonal brick profiles are simplified.",
    ],
    facts: [
      ["Perimeter wall", "74 × 74 m, gate to the north"],
      ["Mahligai stupa", "14.30 m tall"],
      ["Candi Tua", "32.8 × 21.8 m, 8.50 m tall"],
      ["Period", "11th–12th century CE"],
      ["UNESCO", "Tentative list, 2009"],
    ],
  },
  mahligai: {
    kicker: "Arupadhatu · the lotus tower",
    title: "Stupa Mahligai",
    paragraphs: [
      "The most intact building in the compound is a tall tower stupa unlike any other in Indonesia; its closest relatives stand in Thailand and Myanmar. A polygonal plinth about 9.44 × 10.6 metres carries a cylindrical shaft whose base is worked into lotus petals; higher up the tower swells into a great bulbous lotus cushion and closes in a small round top, 14.30 metres in all.",
      "The entrance faces south, toward Candi Tua. Schnitger records seated lion statues on the four corners of the foundation, and Yzerman a carved slab crowning the tower; today the lions are gone or barely discernible from below.",
    ],
    facts: [
      ["Height", "14.30 m"],
      ["Plinth", "9.44 × 10.6 m"],
      ["Tower", "36 sides"],
      ["Entrance", "South"],
    ],
  },
  tua: {
    kicker: "The largest · Candi Sulung",
    title: "Candi Tua",
    paragraphs: [
      "'The old temple', also called Candi Sulung ('the first-born'), is the largest structure in the complex: a solid terraced mass with no chamber and no interior space at all. Its base measures 32.8 × 21.8 metres and it stands 8.50 metres high, stepping up rather like a miniature Borobudur to a round crowning part.",
      "The foot rises in two moulded tiers, 2.37 and 1.98 metres, with entrance stairs on the west and east sides, 3.08 and 4 metres wide. Brick is the mass of the building; sandstone appears only at corners, pilasters and the cornice bands. Research in 1983 showed at least two building phases, and seated lions once watched the upper terraces.",
    ],
    facts: [
      ["Base", "32.8 × 21.8 m"],
      ["Height", "8.50 m"],
      ["Foot tiers", "2.37 m + 1.98 m"],
      ["Stairs", "East 4 m · west 3.08 m"],
      ["Interior", "Solid"],
    ],
  },
  bungsu: {
    kicker: "The youngest",
    title: "Candi Bungsu",
    paragraphs: [
      "'The youngest' stands west of Mahligai, 13.2 × 16.2 metres at the base and 6.20 metres tall, much like Candi Tua but closing in a square upper part. Its north half is built of sandstone and its south half of brick, the joint following the moulding: the sandstone part was completed first and the brick half added against it.",
      "Excavating the lotus seat (padmasana) on top, Yzerman found a deposit of earth and ash holding gold plates scratched with tricula symbols and letters in Nagari script — relics buried when the stupa was sealed. Small stupas and a stair of white stone stand to the east.",
    ],
    facts: [
      ["Base", "13.2 × 16.2 m"],
      ["Height", "6.20 m"],
      ["Materials", "Sandstone north · brick south"],
      ["Relic find", "Gold plates, Nagari script"],
    ],
  },
  palangka: {
    kicker: "The altar",
    title: "Candi Palangka",
    paragraphs: [
      "Due east of Mahligai stands the lowest building of the compound: a plain brick platform about 5.10 × 5.7 metres with its door facing north, usually read as an altar.",
      "Only about 1.45–2 metres of it now remains — the two main sources give different figures — but the earliest colonial expeditions describe a much taller building whose upper terraces have long since collapsed.",
    ],
    facts: [
      ["Body", "5.10 × 5.7 m"],
      ["Height today", "≈ 1.45–2 m"],
      ["Door", "North"],
      ["Use", "Altar (suggested)"],
    ],
  },
  bricks: {
    kicker: "Brick, clay and earth",
    title: "Building in brick",
    paragraphs: [
      "Javanese temples are carved from volcanic andesite; Muara Takus is built of brick, with sandstone and river stone only as accents. The clay was dug at Pongkai, about 6 km downstream — the name may mean 'earth pit', and the old borrow pits now lie drowned under the Koto Panjang reservoir.",
      "The compound is Buddhist: the stupa form and Mahayana design point to Srivijaya's religion, and stone fragments with vajra drawings and Nagari letters found here led Indonesia to describe a Vajrayana community in its UNESCO nomination. Around it all, roughly 1.5 × 1.5 km of earthen embankment held back the floods of the Kampar Kanan and drained the rainwater.",
    ],
    facts: [
      ["Fabric", "Brick, with sandstone trim"],
      ["Clay source", "Pongkai, ≈ 6 km downstream"],
      ["Embankment", "≈ 1.5 × 1.5 km"],
      ["Faith", "Buddhist (Mahayana; Vajrayana traces)"],
    ],
  },
};

export const muaraTakus: CandiDefinition = {
  id: "muara-takus",
  name: "Muara Takus",
  location: "Kampar, Riau",
  site: { lat: 0.3395, lon: 100.6402 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    {
      topic: "mahligai",
      label: "Stupa Mahligai",
      anchor: [2, 11, -10],
      view: { position: [24, 14, -32], target: [2, 8, -10] },
    },
    {
      topic: "tua",
      label: "Candi Tua",
      anchor: [0, 5, 11],
      view: { position: [30, 16, 38], target: [0, 4, 11] },
    },
    {
      topic: "bungsu",
      label: "Candi Bungsu",
      anchor: [-17, 4, -7],
      view: { position: [-30, 10, 4], target: [-17, 3, -7] },
    },
    {
      topic: "palangka",
      label: "Candi Palangka",
      anchor: [13.5, 1.4, -10],
      view: { position: [20, 5, -2], target: [13.5, 1, -10] },
    },
    {
      topic: "bricks",
      label: "North gate and wall",
      anchor: [0, 1.2, -37],
      view: { position: [9, 6, -50], target: [0, 1.5, -37] },
    },
  ],
  // Summit heights: Bukit Panjang 368 m, Bukit Gantinggadang 286 m, Gunung Targampo 1085 m on the
  // Copernicus DEM, against the site's ≈ 80 m; positions from OpenStreetMap peak nodes.
  horizon: [
    { name: "Bukit Panjang", lat: 0.2815, lon: 100.5757, relativeHeight: 288, kind: "ridge" },
    { name: "Bukit Gantinggadang", lat: 0.1379, lon: 100.6913, relativeHeight: 206, kind: "ridge" },
    { name: "Gunung Targampo", lat: 0.0156, lon: 100.5868, relativeHeight: 1005, kind: "ridge" },
  ],
  sources: [
    { title: "Muara Takus — Wikipedia", url: "https://en.wikipedia.org/wiki/Muara_Takus" },
    { title: "Candi Muara Takus — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Muara_Takus" },
    { title: "Muara Takus Compound Site — UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/tentativelists/5464/" },
  ],
  orbit: { position: [36, 38, 42], target: [0, 8, 0] },
  realms: {
    lower: "Kamadhatu · foot, plinths and enclosure wall",
    middle: "Rupadhatu · body, the tower shafts",
    upper: "Arupadhatu · roof, the lotus crowns",
  },
  setting: { plazaRadius: 90, shadowExtent: 60, approach: { x: 0, z: -1, start: 55 } },
  build: buildMuaraTakus,
};
