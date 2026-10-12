import type { CandiDefinition, Topic } from "../types";
import { buildGunungKawi } from "./model";

/**
 * Sources:
 * - Wikipedia "Gunung Kawi": 11th-century temple and funerary complex at Tampaksiring, northeast
 *   of Ubud, across both sides of the Pakerisan river; 10 rock-cut candi carved into ~7 m-high
 *   sheltered niches; east side five (one theory: Udayana, Mahendradatta, Airlangga, Anak Wungsu,
 *   Marakata), west side four (minor queens or concubines); "Haji Lumahing Jalu" inscription on
 *   the north shrine of the east side, "the king made a temple here"; site coordinates.
 * - indonesia.travel, "Candi Gunung Kawi Temple Complex": shrines stand in 8 m sheltered niches
 *   imitating East Javanese temples; false doorways "going nowhere"; small chamber beneath with a
 *   peripih plaque with nine holes; three-tiered roofs bearing nine stylised lingga-yoni symbols;
 *   ~300 steps down and a stone archway entrance; Tirta Empul a kilometre north; Kebo Iwa legend;
 *   a 1080 CE dating; tenth candi south across the valley, by one theory a royal minister.
 * - ancientbali.com, "Pura Gunung Kawi": seven-metre candis; three roof tiers each adorned with
 *   three small lingga-yoni-like towers; each candi has a water spout, the central one a naga;
 *   inscriptions in "Kadiri quadrate" script; central candi dedicated to Anak Wungsu
 *   (c. 1049–1078); 34 meditation caves; the tenth shrine lies ~200 m downstream and is thought
 *   to commemorate a high-ranking official or spiritual figure.
 * - NOW! Bali, "Gunung Kawi: A Window into Ancient Bali": five shrines east of the river, four
 *   opposite on the west, tenth alone on Bukit Gundul; caves used by meditating hermits.
 * - National Museum of Asian Art (asia.si.edu) collection page for Gunung Kawi: material listed
 *   as andesite.
 *
 * Simplifications: the ~300-step descent is drawn at valley-floor grade; the river is a rocky
 * stone bed (no water material); the ~34 caves are condensed into one row of four cells on the
 * west bank; the tenth shrine, the modern Pura Gunung Kawi courtyard and the rock-cut water
 * channels are outside the model; cliff crest profiles are invented approximations of the gorge.
 */

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Gianyar, Bali · 11th century CE",
    title: "Gunung Kawi",
    paragraphs: [
      "An 11th-century temple and funerary complex at Tampaksiring, northeast of Ubud, spread across both sides of the sacred Pakerisan river. Ten candi — shrines carved in relief straight out of the cliff face, each about seven metres tall — stand in sheltered niches of the gorge, earning the site its name: the Valley of the Balinese Kings.",
      "The monuments are thought to honour King Anak Wungsu of the Udayana dynasty and his queens. Five stand together on the east bank, four opposite on the west bank, and a tenth — smaller, and by one theory commemorating a royal minister — lies alone some 200 metres downstream, beyond this model.",
      "Visitors still arrive the old way: several hundred steps down from the Tampaksiring road, through a stone archway into the gorge. That descent is drawn here at valley-floor level.",
    ],
    facts: [
      ["Shrines", "10 · five east, four west, one downstream"],
      ["Height", "≈ 7 m, carved in relief"],
      ["River", "Pakerisan"],
      ["Stone", "andesite cliff"],
    ],
  },
  memorials: {
    kicker: "False doors in the rock",
    title: "Memorials, not tombs",
    paragraphs: [
      "Each candi is a facade carved in relief whose doorway is a false one, opening onto solid rock. Beneath it a small chamber, reached by a sloping shaft from the front, held a stone plaque (peripih) pierced with nine holes for offerings — the necessities of earthly existence buried with the honoured dead.",
      "The form copies free-standing temples of Central and East Java: a moulded base, a body, and massive three-tiered roofs bearing nine stylised lingga-yoni ornaments. Inscriptions over the false doorways are cut in the decorative 'Kadiri quadrate' script of the 10th–11th centuries; on the north shrine of the eastern group one still reads Haji Lumahing Jalu — 'the king made a temple here'.",
      "The central shrine of the eastern five is dedicated to Anak Wungsu, who ruled c. 1049–1078. Every candi has a water spout at its base; the central spout is carved as a naga.",
    ],
    facts: [
      ["Height", "≈ 7 m"],
      ["Roof", "3 tiers · 9 lingga-yoni ornaments"],
      ["Script", "Kadiri quadrate"],
      ["Central east shrine", "Anak Wungsu, c. 1049–1078"],
    ],
  },
  east: {
    kicker: "East bank",
    title: "Five royal shrines",
    paragraphs: [
      "The eastern cliff carries the largest group: five shrines side by side in their niches, with rock-cut water channels designed to encircle the central monument.",
      "By one long-standing theory the five are dedicated to King Udayana, his queen Mahendradatta — a Javanese princess — and their sons Airlangga, Anak Wungsu and Marakata: the family that ruled 11th-century Bali. Anak Wungsu takes the central, largest niche; Airlangga went on to rule Java.",
    ],
    facts: [
      ["Group", "5 shrines"],
      ["Theorised dedicatees", "Udayana, Mahendradatta, Airlangga, Anak Wungsu, Marakata"],
    ],
  },
  west: {
    kicker: "West bank",
    title: "Four shrines across the river",
    paragraphs: [
      "Opposite stand four shrines of the same design, reached across the river. By the dynastic theory they commemorate the king's minor wives or concubines.",
      "Another reading gives the whole complex to Anak Wungsu himself, his wives and concubines. The dedications rest on worn inscriptions, and no source settles the question.",
    ],
    facts: [
      ["Group", "4 shrines"],
      ["Theorised dedicatees", "minor queens or concubines"],
    ],
  },
  hermits: {
    kicker: "Monks and ascetics",
    title: "The hermitage caves",
    paragraphs: [
      "Besides the shrines, the gorge holds some 34 caves and rooms cut into the rock — dwellings and meditation retreats where ascetics sat, some still draped in sacred cloth. Buddhist monks prayed here alongside Shaiva devotees, a coexistence typical of 11th-century Bali.",
      "The model condenses them into one row of four cave cells in the west cliff; on the site the caves scatter along both walls of the valley, their mossy openings easy to walk past.",
    ],
    facts: [["Caves recorded", "≈ 34"]],
  },
  water: {
    kicker: "The sacred river",
    title: "Pakerisan",
    paragraphs: [
      "The Pakerisan is one of Bali's holiest rivers, still used for ritual purification (melukat). It flows past Tirta Empul, the holy water temple about a kilometre upstream of the shrines, and continues downstream towards Goa Gajah and further rock-cut hermitages in the same valley.",
      "Legend claims the whole complex was carved in a single night by the giant Kebo Iwa, using only his fingernails. The stone itself is the cliff's andesite, cut — over considerably more than one night — into the valley of the kings.",
    ],
    facts: [
      ["River", "Pakerisan, sacred to Balinese Hindus"],
      ["Tirta Empul", "≈ 1 km upstream"],
      ["Legend", "carved overnight by Kebo Iwa"],
    ],
  },
};

export const gunungKawi: CandiDefinition = {
  id: "gunung-kawi",
  name: "Gunung Kawi",
  location: "Gianyar, Bali",
  site: { lat: -8.4234, lon: 115.3123 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "east", label: "Five eastern shrines", anchor: [11, 4, -15.2], view: { position: [3, 4.5, -14.5], target: [11.4, 4.5, -15.2] } },
    { topic: "memorials", label: "False door and kala", anchor: [11.3, 3.2, -15.2], view: { position: [8.8, 3, -15.2], target: [11.6, 3.1, -15.2] } },
    { topic: "west", label: "Four western shrines", anchor: [-11, 3.6, -14.3], view: { position: [-2, 4, -14.3], target: [-11.4, 4, -14.3] } },
    { topic: "hermits", label: "Hermitage caves", anchor: [-10.9, 1.7, 8.4], view: { position: [-3.5, 2.4, 8.4], target: [-12, 1.8, 8.4] } },
    { topic: "water", label: "Pakerisan gorge", anchor: [-3.5, 0.9, 6], view: { position: [2.5, 5.5, -12], target: [-3.5, 1, 3] } },
  ],
  // Gorge floor taken as ≈150 m elevation; Batur 1717 m and Agung 3031 m give the angular heights.
  horizon: [
    { name: "Batur", lat: -8.2422, lon: 115.3752, relativeHeight: 1570, kind: "volcano" },
    { name: "Agung", lat: -8.3435, lon: 115.5071, relativeHeight: 2880, kind: "volcano" },
  ],
  sources: [
    { title: "Gunung Kawi — Wikipedia", url: "https://en.wikipedia.org/wiki/Gunung_Kawi" },
    { title: "Bali's Candi Gunung Kawi Temple: Ancient Valley of Kings — Indonesia Travel", url: "https://www.indonesia.travel/us/en/destination/bali-nusa-tenggara/bali/bali---gunung-kawi-temple" },
    { title: "Pura Gunung Kawi — Ancient Bali", url: "https://ancientbali.com/pura-gunung-kawi/" },
    { title: "Gunung Kawi: A Window into Ancient Bali — NOW! Bali", url: "https://www.nowbali.co.id/shrines-gunung-kawi" },
  ],
  // Home view from mid-gorge, looking north-east at the row of five eastern facades.
  orbit: { position: [0, 9, 8], target: [10.5, 4, -15] },
  realms: {
    lower: "Bhurloka · foot — gorge floor, paths and niche pavings",
    middle: "Bhuvarloka · body — cliff faces and shrine bodies",
    upper: "Svarloka · roof — tiered roofs, antefixes and finials",
  },
  setting: { plazaRadius: 62, shadowExtent: 55, approach: { x: 0, z: -1, start: 58 } },
  build: buildGunungKawi,
};
