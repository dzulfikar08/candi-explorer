import type { CandiDefinition, Topic } from "../types";
import { buildBorobudur } from "./model";

/**
 * Sources: Wikipedia "Borobudur" (citing Soekmono, Dumarçay, Miksic) and the UNESCO World Heritage
 * listing. Figures are the commonly published ones; the 3D model approximates proportions.
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Magelang, Central Java · c. 780–830 CE",
    title: "Candi Borobudur",
    paragraphs: [
      "The largest Buddhist temple in the world, built by the Sailendra dynasty without mortar from andesite blocks. It is a single great stupa laid out as a stepped pyramid: nine stacked platforms, six square and three circular, crowned by a central dome. Seen from above it forms a mandala.",
      "Pilgrims climb it on foot. The path circles each level clockwise past the reliefs, then rises by the stairway to the next, from the carved galleries to the plain circular terraces at the top.",
      "Abandoned after the 14th century, it was brought to European attention in 1814 by Stamford Raffles and restored by Theodoor van Erp (1907–1911) and by Indonesia with UNESCO (1973–1983). It became a World Heritage Site in 1991.",
      "This model is procedural: proportions and counts follow published figures, carving is stylised, and the upper corridors are drawn slightly wider than the real 2 m so they can be walked.",
    ],
    facts: [
      ["Base", "123 × 123 m"],
      ["Height", "35 m to the top of the main stupa"],
      ["Relief panels", "2,672 (1,460 narrative)"],
      ["Buddha statues", "504 originally"],
      ["Stone", "≈ 55,000 m³ of andesite"],
      ["UNESCO", "World Heritage Site, 1991"],
    ],
  },
  landscape: {
    kicker: "Kedu Plain",
    title: "Between twin volcanoes",
    paragraphs: [
      "Borobudur stands on raised ground in the Kedu Plain, between the twin volcanoes Sindoro–Sumbing and Merbabu–Merapi, near the Progo and Elo rivers. Merapi's crater is about 28 km to the east-north-east; its 2010 eruption covered the temple in ash.",
      "The main entrance faces east. Borobudur, Pawon and Mendut lie on a straight east–west line, and the Waisak procession still walks from Mendut through Pawon to Borobudur.",
    ],
    facts: [
      ["Merapi", "≈ 28 km ENE"],
      ["Main entrance", "East stairway"],
    ],
  },
  kamadhatu: {
    kicker: "Kamadhatu · the world of desire",
    title: "The hidden foot",
    paragraphs: [
      "The broad base is a later encasement. In 1885 J. W. IJzerman found that it hides an earlier foot carved with 160 panels of the Karmavibhangga, scenes of cause and effect: deeds in daily life and their rewards in heaven or punishment in hell.",
      "Some panels carry short inscriptions that seem to be instructions to the sculptors. The panels were photographed in 1890–1891 by Kassian Cephas and covered again; a stretch at the south-east corner is left open, shown here as carved panels on the base.",
    ],
    facts: [
      ["Narrative panels", "160"],
      ["Base walls", "4 m high"],
      ["Discovered", "1885"],
    ],
  },
  gallery1: {
    kicker: "Rupadhatu · first gallery",
    title: "The life of the Buddha",
    paragraphs: [
      "The five square terraces form Rupadhatu, the world of forms. Their narrow galleries are walled on both sides with reliefs, read clockwise from the east stairway: wall panels from right to left, balustrade panels from left to right.",
      "The first gallery's main wall has two rows of 120 panels. The upper row is the Lalitavistara, the life of Prince Siddhartha up to the first sermon; the lower row and the balustrades tell Jataka and Avadana stories of the Buddha's former lives.",
    ],
    facts: [
      ["Main wall, upper", "Lalitavistara · 120"],
      ["Main wall, lower", "Jataka/Avadana · 120"],
      ["Balustrade", "Jataka/Avadana · 372 + 128"],
    ],
  },
  gallery2: {
    kicker: "Rupadhatu · second gallery",
    title: "Sudhana sets out",
    paragraphs: [
      "From the second gallery the main walls follow the Gandavyuha, the closing chapter of the Avatamsaka Sutra: the youth Sudhana wanders in search of the highest wisdom and meets more than fifty teachers. The balustrade here still tells Jataka and Avadana stories.",
    ],
    facts: [
      ["Main wall", "Gandavyuha · 128"],
      ["Balustrade", "Jataka/Avadana · 100"],
    ],
  },
  gallery34: {
    kicker: "Rupadhatu · third and fourth galleries",
    title: "The search for wisdom",
    paragraphs: [
      "The third and fourth galleries continue Sudhana's journey on both walls until he reaches Perfect Wisdom. The Gandavyuha series covers 460 panels in all, more than any other story on the monument.",
      "Altogether the narrative reliefs run for about 3 km around the hidden foot and the four galleries.",
    ],
    facts: [
      ["Third gallery", "88 wall · 88 balustrade"],
      ["Fourth gallery", "84 wall · 72 balustrade"],
    ],
  },
  niches: {
    kicker: "Rupadhatu · 432 statues",
    title: "Buddhas in the niches",
    paragraphs: [
      "Seated Buddhas face outward from niches along the five balustrades: 104, 104, 88, 72 and 64 from the bottom up. They look alike, but the hands differ. On the first four balustrades each side has its own mudra; on the fifth they all make the same one.",
      "The statues in this model use these hand positions in simplified form: look at the east and west faces up close.",
    ],
    facts: [
      ["East", "Bhumisparsa · touching the earth"],
      ["South", "Vara · giving"],
      ["West", "Dhyana · meditation"],
      ["North", "Abhaya · fearlessness"],
      ["Fifth balustrade", "Vitarka · reasoning"],
    ],
  },
  gates: {
    kicker: "Stairways",
    title: "Kala gates",
    paragraphs: [
      "A stairway rises at the centre of each side, passing through arched gates at every level. The arches are corbelled: stone courses step inward until they meet, with no true arch or keystone.",
      "Each gate carries a Kala head at the top with makara on either side, a motif common to Javanese temple gateways. The stairs are famously steep; the east stairway is the pilgrims' entrance.",
    ],
    facts: [
      ["Stairways", "4, one per side"],
      ["Gate motif", "Kala–makara"],
    ],
  },
  arupadhatu: {
    kicker: "Arupadhatu · the formless world",
    title: "The circular terraces",
    paragraphs: [
      "Above the last square terrace the reliefs stop. Three circular platforms carry rings of 32, 24 and 16 perforated stupas around the main stupa, and their plain surfaces contrast with the crowded galleries below.",
      "From here the view opens to the volcanoes and hills around the Kedu Plain.",
    ],
    facts: [
      ["Circular terraces", "3"],
      ["Perforated stupas", "72 (32 · 24 · 16)"],
    ],
  },
  stupas: {
    kicker: "Arupadhatu · 72 statues",
    title: "Perforated stupas",
    paragraphs: [
      "Each bell-shaped stupa holds a seated Buddha making the dharmachakra mudra, turning the wheel of the law, half visible through the stone lattice. The stupas on the two lower terraces have diamond-shaped openings; those on the top terrace have square ones.",
    ],
    facts: [
      ["Mudra", "Dharmachakra"],
      ["Openings", "Diamond (lower two rings), square (top ring)"],
    ],
  },
  mainStupa: {
    kicker: "Summit",
    title: "The main stupa",
    paragraphs: [
      "The central dome is the highest point of the monument, about 35 m above the ground. It is closed and empty. Hartmann looked inside in 1842, but what he found was never recorded.",
      "Van Erp put a chhatra (stone parasol) on its spire during his restoration; it was later taken down and is now kept with the 'Unfinished Buddha' at the Karmawibhangga Museum near the temple.",
    ],
    facts: [
      ["Height", "≈ 35 m above ground"],
      ["Interior", "Sealed, empty"],
    ],
  },
};

export const borobudur: CandiDefinition = {
  id: "borobudur",
  name: "Borobudur",
  location: "Magelang, Jawa Tengah",
  site: { lat: -7.6079, lon: 110.2038 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    {
      topic: "kamadhatu",
      label: "Hidden foot",
      anchor: [56, 2.4, 60.5],
      view: { position: [78, 6, 86], target: [52, 2, 58] },
    },
    {
      topic: "niches",
      label: "Buddha niches",
      anchor: [54.8, 8.6, -22],
      view: { position: [66, 9, -30], target: [54, 8, -22] },
    },
    {
      topic: "gates",
      label: "East stairway",
      anchor: [62, 6, 0],
      view: { position: [96, 14, 18], target: [50, 9, 0] },
    },
    {
      topic: "gallery1",
      label: "First gallery",
      anchor: [52.6, 9.2, 10],
      view: { position: [53.1, 9.7, 21], target: [52.2, 8.9, 2] },
    },
    {
      topic: "arupadhatu",
      label: "Circular terraces",
      anchor: [0, 24, 26],
      view: { position: [30, 36, 58], target: [0, 20, 0] },
    },
    {
      topic: "stupas",
      label: "Perforated stupa",
      anchor: [17.9 * Math.cos(Math.PI / 24), 24, 17.9 * Math.sin(Math.PI / 24)],
      view: { position: [27, 24.5, 4.5], target: [17.5, 22, 2.2] },
    },
    {
      topic: "mainStupa",
      label: "Main stupa",
      anchor: [0, 36, 0],
      view: { position: [22, 30, 22], target: [0, 28, 0] },
    },
    {
      topic: "landscape",
      label: "Merapi & Merbabu",
      anchor: [72, 3, -17],
      view: { position: [-14, 41, 7], target: [60, 30, -18] },
    },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2650, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2880, kind: "volcano" },
    { name: "Sumbing", lat: -7.384, lon: 110.07, relativeHeight: 3100, kind: "volcano" },
    { name: "Sindoro", lat: -7.3, lon: 109.992, relativeHeight: 2870, kind: "volcano" },
    { name: "Menoreh Hills", lat: -7.7, lon: 110.15, relativeHeight: 650, kind: "ridge" },
  ],
  sources: [
    { title: "Borobudur — Wikipedia", url: "https://en.wikipedia.org/wiki/Borobudur" },
    { title: "Candi Borobudur — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Borobudur" },
    { title: "Borobudur Temple Compounds — UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/592/" },
  ],
  orbit: { position: [150, 70, 95], target: [0, 12, 0] },
  realms: {
    lower: "Kamadhatu · base",
    middle: "Rupadhatu · square galleries",
    upper: "Arupadhatu · circular terraces",
  },
  setting: { plazaRadius: 140, shadowExtent: 85, approach: { x: 1, z: 0, start: 64 } },
  build: buildBorobudur,
};
