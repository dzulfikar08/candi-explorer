import type { StoneTextures } from "../../render/stone";
import type { CandiDefinition, Topic } from "../types";
import { buildWringinLawang } from "./model";

/**
 * Sources: Wikipedia "Trowulan" and Indonesian Wikipedia "Gapura Wringinlawang" (base 13 × 11 m,
 * height 15.5 m, 14th century, red brick, candi bentar type, restoration 1991/92–1994/95 with the
 * north half down to 9 m beforehand, Gajah Mada speculation), English Wikipedia "Candi bentar"
 * (plain passage sides, elevated passage with a stair, type possibly born in the Majapahit era),
 * and the UNESCO World Heritage tentative submission "Trowulan" (2009). Photographs of the
 * restored gate on Wikimedia Commons guided the silhouette. Orientation is not stated in the
 * sources; the surveyed footprint (OpenStreetMap way 1376045122) runs the passage east–west, and
 * the model faces the approach east. Site elevation ≈ 45 m (SRTM via Open-Elevation).
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Mojokerto, East Java · 14th century CE",
    title: "Gapura Wringin Lawang",
    paragraphs: [
      "The 'Banyan Tree Gate' — in Javanese wringin is a banyan and lawang a door — stands at Jatipasar in Trowulan, the archaeological site generally identified as the capital of the Majapahit empire. It is a candi bentar, a split gateway, built entirely of red brick.",
      "The gate covers 13 × 11 m at the base and rises 15.5 m. Its form is that of a Majapahit temple — foot, body and tall roof — split perfectly into two mirroring halves with a narrow passage between them. It is one of the oldest and largest surviving candi bentar.",
      "Most historians agree that it was the gate of an important compound in the Majapahit capital. A popular speculation makes it the entrance to the residence of Gajah Mada, the empire's great mahapatih, but the identification remains unproven.",
    ],
    facts: [
      ["Height", "15.5 m"],
      ["Base", "13 × 11 m"],
      ["Type", "Candi bentar (split gate)"],
      ["Material", "Red brick"],
    ],
  },
  bentar: {
    kicker: "A Majapahit invention?",
    title: "The split gate",
    paragraphs: [
      "A candi bentar looks like a temple tower cut perfectly in two, leaving a passage between the halves. In contrast to the moulded outer faces, the sides of the passage are left completely plain, and the passage usually stands on a raised base reached by a flight of steps.",
      "Split gates are familiar across Java, Bali and Lombok today, but the type may have first appeared in the Majapahit era — and Wringin Lawang is among the oldest and largest that survive.",
    ],
    facts: [
      ["Halves", "Two perfect mirrors"],
      ["Passage sides", "Plain brick"],
      ["Roof", "None — the halves are open to the sky"],
    ],
  },
  passage: {
    kicker: "Walking through",
    title: "A door with no door",
    paragraphs: [
      "The gate has no doors and closes nothing: it narrows the way but offers no defence. Its purpose seems ceremonial and aesthetic — a frame of grandeur on the way into the next compound.",
      "The passage floor is raised above the lawn and reached by brick steps on each face. Between the halves the brickwork rises plain and unadorned, pressing close on either side of the walker before the sky opens again at the far end.",
    ],
    facts: [
      ["Passage", "Elevated, stepped on both faces"],
      ["Defence", "None — ceremonial only"],
    ],
  },
  restoration: {
    kicker: "1991/92 – 1994/95",
    title: "Risen from a ruin",
    paragraphs: [
      "When restoration began in 1991/1992 the gate was no longer whole: part of the north half's body and the whole crown had collapsed, leaving that side standing only about 9 m high. The work, completed in 1994/1995, raised both halves to their full 15.5 m again.",
      "The restored faces are patchworks: dense, thin-jointed Majapahit brickwork beside the looser new brick of the reconstructions, with the modern lightning rods now standing at each tip.",
    ],
    facts: [
      ["Restored", "1991/92 – 1994/95"],
      ["Before", "North half ≈ 9 m tall"],
    ],
  },
  capital: {
    kicker: "Trowulan",
    title: "Gate of the capital",
    paragraphs: [
      "Trowulan, a roughly 100 km² archaeological site, is thought to be Wilwatikta, the capital described in the 14th-century Nagarakretagama poem and razed in 1478. Most of its remains — temples, gates, pools, house floors — are of red brick.",
      "The gate stands a short distance south of the national road at Jatipasar. Submitted to the UNESCO World Heritage list in 2009, Trowulan is still only partly excavated, and the compound this gate once opened has not been found.",
    ],
    facts: [
      ["Site", "≈ 100 km²"],
      ["Capital razed", "1478"],
      ["UNESCO tentative list", "2009"],
    ],
  },
};

export const wringinLawang: CandiDefinition = {
  id: "wringin-lawang",
  name: "Wringin Lawang",
  location: "Mojokerto, Jawa Timur",
  site: { lat: -7.54202, lon: 112.39101 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "bentar", label: "The two halves", anchor: [0, 10, 0], view: { position: [20, 8, 26], target: [0, 9.5, 0] } },
    { topic: "passage", label: "Through the gate", anchor: [0, 5, 0], view: { position: [17, 5.6, 0], target: [0, 5, 0] } },
    { topic: "restoration", label: "North half roof", anchor: [-2, 11, -3], view: { position: [14, 13, -25], target: [-1, 11, -2] } },
    { topic: "capital", label: "Gate of the capital", anchor: [0, 8, 0], view: { position: [46, 18, 44], target: [0, 7, 0] } },
  ],
  horizon: [
    { name: "Penanggungan", lat: -7.62, lon: 112.63, relativeHeight: 1608, kind: "volcano" },
    { name: "Arjuno-Welirang", lat: -7.765, lon: 112.5897, relativeHeight: 3294, kind: "volcano" },
    { name: "Kelud", lat: -7.9333, lon: 112.3056, relativeHeight: 1686, kind: "volcano" },
    { name: "Bromo", lat: -7.9425, lon: 112.95, relativeHeight: 2284, kind: "volcano" },
    { name: "Semeru", lat: -8.1086, lon: 112.922, relativeHeight: 3631, kind: "volcano" },
  ],
  sources: [
    { title: "Trowulan — Wikipedia", url: "https://en.wikipedia.org/wiki/Trowulan" },
    { title: "Gapura Wringinlawang — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Gapura_Wringinlawang" },
    { title: "Candi bentar — Wikipedia", url: "https://en.wikipedia.org/wiki/Candi_bentar" },
    {
      title: "Trowulan – Former Capital City of Majapahit Kingdom — UNESCO World Heritage Centre",
      url: "https://whc.unesco.org/en/tentativelists/5466",
    },
  ],
  orbit: { position: [-18, 15, 15], target: [0, 7.5, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 60, shadowExtent: 26, approach: { x: 1, z: 0, start: 48 } },
  build: (textures: StoneTextures) => buildWringinLawang(textures),
};
