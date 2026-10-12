import type { CandiDefinition, Topic } from "../types";
import { buildPrambanan } from "./model";

/**
 * Sources: Wikipedia "Prambanan" and "Rara Jonggrang" (citing Soekmono, Dumarçay and the
 * Shivagrha inscription), and the UNESCO listing "Prambanan Temple Compounds". Figures are the
 * commonly published ones; the 3D model approximates proportions and positions.
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Sleman, Yogyakarta · mid-9th century CE",
    title: "Candi Prambanan",
    paragraphs: [
      "The largest Hindu temple compound in Indonesia, dedicated to the Trimurti: Shiva the destroyer, Brahma the creator and Vishnu the preserver. Its slender towers with jewel-shaped ratna finials rise from three concentric courts, the holiest in the middle.",
      "The Shivagrha inscription of 856 CE, attributed to King Rakai Pikatan of Mataram, describes a great Shiva temple and the diversion of a river beside it, usually identified with Prambanan and the Opak river to its west. It was enlarged by later kings, then abandoned when the court moved to East Java in the 10th century, and largely collapsed in a 16th-century earthquake.",
      "Colin Mackenzie surveyed the ruins in 1811. Reconstruction began in 1918; the Shiva temple was completed in 1953. The 2006 Yogyakarta earthquake damaged it again and it was repaired. It became a World Heritage Site in 1991.",
      "This model is procedural: heights and counts follow published figures, positions inside the courts are approximate, and carving is stylised.",
    ],
    facts: [
      ["Shiva temple", "47 m high, 34 m wide"],
      ["Brahma & Vishnu", "33 m high, 20 m wide"],
      ["Original temples", "240"],
      ["Inner court", "110 × 110 m"],
      ["Inscription", "Shivagrha, 856 CE"],
      ["UNESCO", "World Heritage Site, 1991"],
    ],
  },
  landscape: {
    kicker: "Prambanan Plain",
    title: "Under Merapi",
    paragraphs: [
      "Prambanan stands on the plain between Merapi, about 24 km to the north, and the Sewu hills of Gunungkidul to the south. Within a few kilometres lie Sewu, Lumbung, Bubrah, Plaosan, Sari, Kalasan and the Ratu Boko plateau: Hindu and Buddhist foundations built side by side in the same generations.",
      "The temple faces east. The Opak river runs past its west side; the Shivagrha inscription records that its course was changed to flow alongside the temple.",
    ],
    facts: [
      ["Merapi", "≈ 24 km N"],
      ["Main entrance", "East gate"],
    ],
  },
  shiva: {
    kicker: "Bhuvarloka · the central temple",
    title: "Candi Shiva Mahadeva",
    paragraphs: [
      "The tallest temple stands in the exact middle of the compound. Stairs on all four sides climb to a gallery, then to four chambers in the body. The east chamber, reached by the main stair, holds a 3 m statue of Shiva Mahadeva.",
      "The other three chambers face south, west and north: Agastya, Shiva as the divine teacher; Ganesha, his elephant-headed son; and Durga Mahishasuramardini slaying the buffalo demon. Local tradition calls the Durga statue Roro Jonggrang, the 'slender maiden' of the legend, and the whole compound is often named after her.",
      "In the legend, Prince Bandung Bondowoso is set the task of building a thousand temples in one night. When he is about to succeed, the princess has women pound rice and light fires so the roosters crow early; finding he has been tricked, he turns her to stone as the thousandth statue.",
    ],
    facts: [
      ["East chamber", "Shiva Mahadeva, 3 m"],
      ["South", "Agastya"],
      ["West", "Ganesha"],
      ["North", "Durga (Roro Jonggrang)"],
    ],
  },
  ramayana: {
    kicker: "Gallery reliefs",
    title: "The Ramayana in stone",
    paragraphs: [
      "The inner face of the gallery balustrade is carved with the Ramayana: Rama, his wife Sita, the abduction by Ravana and the war in Lanka. Pilgrims read it walking clockwise from the east stair, keeping the temple on the right, and the story continues on the gallery of the Brahma temple. The Vishnu temple carries the Krishnayana, the life of Krishna.",
      "The outer face of the temple foot has a repeating motif found only here and at nearby temples: a lion in a niche flanked by panels of kalpataru wishing trees guarded by kinnara, half-bird, half-human beings. It is known as the Prambanan motif.",
    ],
    facts: [
      ["Shiva & Brahma", "Ramayana"],
      ["Vishnu", "Krishnayana"],
      ["Reading order", "Clockwise from the east"],
    ],
  },
  trimurti: {
    kicker: "The main row",
    title: "Brahma and Vishnu",
    paragraphs: [
      "Brahma's temple stands south of Shiva's and Vishnu's north, all three in a north–south row facing east. Each has a single chamber with a statue of its god, reached by a stair on the east.",
      "Their galleries continue the reliefs of the Shiva temple: the second half of the Ramayana on Brahma's, and the Krishnayana on Vishnu's.",
    ],
    facts: [
      ["Height", "33 m each"],
      ["Width", "20 m each"],
      ["Brahma", "South of Shiva"],
      ["Vishnu", "North of Shiva"],
    ],
  },
  nandi: {
    kicker: "The vahana row",
    title: "Nandi, Garuda and Hamsa",
    paragraphs: [
      "Facing the main row from the east stand three temples for the mounts (vahana) of the Trimurti. Opposite Shiva is Nandi, the bull, whose temple still holds his statue together with statues of Surya and Chandra, the sun and moon gods.",
      "Opposite Vishnu is the temple of Garuda, the eagle, and opposite Brahma that of Hamsa, the swan. Their original statues are lost.",
    ],
    facts: [
      ["Height", "≈ 25 m"],
      ["Faces", "West, toward the main row"],
    ],
  },
  perwara: {
    kicker: "Middle court · 224 shrines",
    title: "The perwara rows",
    paragraphs: [
      "Around the walled inner court, 224 small perwara (guardian) shrines stand in four concentric square rows of 44, 52, 60 and 68. They are thought to have been offerings by the realm's lesser lords, built to a single design.",
      "Most are still heaps of fallen stone; restoration rebuilds them one at a time from their own blocks. Here a few complete ones stand in the inner row to show their form; the real restored ones are not at these exact positions.",
    ],
    facts: [
      ["Count", "224 (44 · 52 · 60 · 68)"],
      ["Height", "≈ 14 m each"],
    ],
  },
};

export const prambanan: CandiDefinition = {
  id: "prambanan",
  name: "Prambanan",
  location: "Sleman, DI Yogyakarta",
  site: { lat: -7.752, lon: 110.4915 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    {
      topic: "shiva",
      label: "Shiva temple",
      anchor: [8.7, 12, 0],
      view: { position: [62, 22, 24], target: [0, 18, 0] },
    },
    {
      topic: "ramayana",
      label: "Ramayana gallery",
      anchor: [8, 4.4, 16.3],
      view: { position: [9, 5, 14.2], target: [4, 4, 16.6] },
    },
    {
      topic: "shiva",
      label: "Durga chamber",
      anchor: [0, 8.3, -8.8],
      view: { position: [5, 9, -24], target: [0, 8, -8] },
    },
    {
      topic: "trimurti",
      label: "Brahma",
      anchor: [5.4, 8, 36],
      view: { position: [44, 16, 58], target: [0, 12, 36] },
    },
    {
      topic: "trimurti",
      label: "Vishnu",
      anchor: [5.4, 8, -36],
      view: { position: [44, 16, -58], target: [0, 12, -36] },
    },
    {
      topic: "nandi",
      label: "Nandi",
      anchor: [35.9, 5, 0],
      view: { position: [22, 7, 6], target: [36, 5, 0] },
    },
    {
      topic: "perwara",
      label: "Perwara rows",
      anchor: [74.75, 5, 23],
      view: { position: [125, 25, 50], target: [70, 3, 20] },
    },
    {
      topic: "landscape",
      label: "Merapi",
      anchor: [-14, 3, -105],
      view: { position: [12, 50, 60], target: [-20, 35, -100] },
    },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2760, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2990, kind: "volcano" },
    { name: "Ratu Boko plateau", lat: -7.77, lon: 110.489, relativeHeight: 60, kind: "ridge" },
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 450, kind: "ridge" },
  ],
  orbit: { position: [170, 85, 120], target: [0, 14, 0] },
  realms: {
    lower: "Bhurloka · foot, the world of mortals",
    middle: "Bhuvarloka · body, the purified",
    upper: "Svarloka · roof, the gods",
  },
  setting: { plazaRadius: 175, shadowExtent: 120, approach: { x: 1, z: 0, start: 118 } },
  build: buildPrambanan,
};
