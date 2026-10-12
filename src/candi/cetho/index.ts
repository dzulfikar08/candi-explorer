import { buildCetho } from "./model";
import { ADVISERS, BATUR, GATE1, GATE2, LEVELS, TURTLE } from "./layout";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Candi Ceto" (id) and "Ceto Temple" (en); Indonesia Kaya, "Candi Cetho,
 * Candi Peruwatan Agama Hindu" (BPCB-linked); karanganyarkab.go.id "Candi Cetho";
 * pesonakaranganyar.karanganyarkab.go.id. Sourced figures: ruins reported by Van de Vlies (1842),
 * first excavated 1928; 14 terraces recorded west→east, 13 still traceable, 9 rebuilt in the
 * 1975–1976 restoration by Sudjono Humardani; gate inscription dated 1397 Saka (1475 CE) naming a
 * ruwatan (purification) function; floor-relief animal chronogram read as 1373 Saka (1451 CE);
 * building presumed begun 1451; floor phallus ≈ 2 m; site at 1,400–1,496 m above sea level
 * (sources differ); still used for Hindu and kejawen worship; Saraswati statue placed under
 * bupati Rina Iriani (2003–2008), a gift of Gianyar regency. The model draws 13 terraces and
 * approximates all dimensions; per-terrace features follow the nine-level restoration sequence,
 * and every named statue, the timber pendapa, the great gate and the summit cube building are
 * products of that 1970s rebuilding.
 */

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Karanganyar, Jawa Tengah · late Majapahit, 15th century CE",
    title: "Candi Cetho",
    paragraphs: [
      "A Hindu sanctuary on the north-western slope of Gunung Lawu, at 1,400–1,500 m one of the highest temple sites in Java and among the last great temples built on the island before its courts turned to Islam in the sixteenth century.",
      "The sanctuary climbs its hill as a stepped pyramid of terraces — the old punden berundak form of East Java's holy mountains, revived at the end of Majapahit, when Javanese religion had long diverged from Indian precepts. Thirteen terraces can still be traced from the western entrance to the top court; nine were rebuilt.",
      "The name Cetho means 'clear': from the hamlet one looks far across central Java, north to Solo with Merbabu, Merapi and Sumbing on the horizon. Van de Vlies reported the ruins in 1842, the Antiquities Service dug in 1928, and in 1975–1976 Sudjono Humardani rebuilt the site in a restoration archaeologists criticised. It is still used for Hindu and kejawen worship today.",
    ],
    facts: [
      ["Terraces", "13 traceable · 9 rebuilt"],
      ["Built", "presumed 1451–1475 CE"],
      ["Elevation", "≈ 1,400–1,500 m"],
      ["Reported", "1842 (Van de Vlies)"],
      ["Rebuilt", "1975–1976"],
    ],
  },
  ascent: {
    kicker: "The climb",
    title: "Terraces, gates and pavilions",
    paragraphs: [
      "A visit is an ascent. Guardian statues stand before the great split gate — a candi bentar of the 1975–1976 rebuilding — and beyond it every level is climbed by a stair against the retaining wall, the courts narrowing as the sanctuary rises.",
      "On the way up lie the petilasan of Ki Ageng Krincingwesi, honoured ancestor of the Cetho hamlet, and wooden pendapa that still serve for ceremonies. A second split gate higher on the climb carries an Old Javanese inscription on its wall that names the sanctuary a place of ruwatan — ritual cleansing — and dates it to 1397 Saka, 1475 CE.",
    ],
    facts: [
      ["Great gate", "added 1975–1976"],
      ["Inscription", "1397 Saka = 1475 CE"],
      ["Function", "ruwatan, purification"],
    ],
  },
  reliefs: {
    kicker: "Middle terraces",
    title: "Turtle, sun and lingga",
    paragraphs: [
      "A flat stone setting on one of the middle terraces shows a giant turtle, the disk of the Surya Majapahit and a phallus about two metres long: the turtle stands for the creation of the universe, the phallus for the creation of mankind. Creatures around them — a shellfish, frogs, a crab — read as a chronogram for 1373 Saka, 1451 CE, the presumed start of building.",
      "On the levels above, rows of carved panels tie Cetho to Sukuh below the mountain: scenes read as the Sudamala story, still told at ruwatan rites, and the churning of the ocean with Garudeya. The model marks them only as plain relief walls.",
    ],
    facts: [
      ["Turtle", "creation of the universe"],
      ["Phallus", "≈ 2 m long"],
      ["Chronogram", "1373 Saka = 1451 CE"],
    ],
  },
  statues: {
    kicker: "Higher terraces",
    title: "Advisers of the last king",
    paragraphs: [
      "Statues of this age were made large but carved simply. Above the inscribed gate stand Sabdapalon to the north and Nayagenggong to the south, the half-legendary counsellors — perhaps one and the same person — of King Brawijaya V, the last ruler of Majapahit.",
      "The next level holds the kuntobimo, a phallus statue honoured in gratitude for the land's fertility, and Brawijaya V himself in the form of Mahadewa. All these figures were set up during the 1970s rebuilding; their identifications belong to that time, not to the fifteenth century.",
    ],
    facts: [
      ["Sabdapalon", "north side"],
      ["Nayagenggong", "south side"],
      ["Kuntobimo", "phallus · fertility"],
    ],
  },
  summit: {
    kicker: "Terrace thirteen",
    title: "The prayer court",
    paragraphs: [
      "The highest rebuilt level is a closed court of prayer behind a gate that is kept locked outside ceremony days. Its cube-shaped stone building, like the pendapa below, is a work of the 1970s rebuilding: the 1928 excavation found too little of the original summit structure to reconstruct it.",
      "At the top of the complex stood the sanctuary's patirtan, where worshippers cleansed themselves before the rites. East of the court a white statue of Saraswati — a gift from the regency of Gianyar in Bali, placed under bupati Rina Iriani (2003–2008) — rises on its own terrace. Down the north-eastern slope lies the smaller Candi Kethek.",
    ],
    facts: [
      ["Top court", "prayer · locked outside ceremonies"],
      ["Cube building", "1970s rebuilding"],
      ["Saraswati", "gift of Gianyar, 2000s"],
    ],
  },
};

export const cetho: CandiDefinition = {
  id: "cetho",
  name: "Cetho",
  location: "Karanganyar, Jawa Tengah",
  site: { lat: -7.5956, lon: 111.1581 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "ascent", label: "The great gate", anchor: [GATE1.x, GATE1.y + 4.5, -3], view: { position: [GATE1.x - 15, GATE1.y + 6.5, -16], target: [GATE1.x, GATE1.y + 2, 0] } },
    { topic: "reliefs", label: "Turtle of creation", anchor: [TURTLE.x, LEVELS[2].y + 0.9, 0], view: { position: [TURTLE.x - 8, LEVELS[2].y + 4.5, -9], target: [TURTLE.x, LEVELS[2].y + 0.3, 0] } },
    { topic: "ascent", label: "The inscribed gate", anchor: [GATE2.x, GATE2.y + 3.7, -2.2], view: { position: [GATE2.x - 30, GATE2.y + 15, 26], target: [LEVELS[11].mid, LEVELS[11].y, 0] } },
    { topic: "statues", label: "Sabdapalon & Nayagenggong", anchor: [ADVISERS.x, LEVELS[7].y + 1.4, -ADVISERS.z], view: { position: [ADVISERS.x - 9, LEVELS[7].y + 2.5, -13], target: [ADVISERS.x, LEVELS[7].y + 1.2, -3] } },
    { topic: "summit", label: "The cube building", anchor: [BATUR.x, LEVELS[12].y + 4, -2.5], view: { position: [BATUR.x - 20, LEVELS[12].y + 9, -13], target: [BATUR.x, LEVELS[12].y + 2.5, 0] } },
  ],
  horizon: [
    { name: "Gunung Lawu", lat: -7.6272, lon: 111.192, relativeHeight: 1770, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 1650, kind: "volcano" },
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 1430, kind: "volcano" },
    { name: "Sumbing", lat: -7.384, lon: 110.07, relativeHeight: 1870, kind: "volcano" },
    { name: "Sindoro", lat: -7.3, lon: 109.992, relativeHeight: 1640, kind: "volcano" },
  ],
  orbit: { position: [-140, 100, 100], target: [0, 10, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 130, shadowExtent: 95, approach: { x: -1, z: 0, start: 100 } },
  build: buildCetho,
};
