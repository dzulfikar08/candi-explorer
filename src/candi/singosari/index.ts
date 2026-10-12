import type { StoneTextures } from "../../render/stone";
import { buildSingosari } from "./model";
import type { CandiDefinition, Topic } from "../types";

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Malang, Jawa Timur · c. 1300 CE",
    title: "Candi Singosari",
    paragraphs: [
      "A single tall tower of andesite on a broad lawn, raised as the funerary temple (pendharmaan) of Kertanegara, last king of Singhasari, killed in 1292 when Jayakatwang's armies sacked his court. The Nagarakretagama (cantos 37:7 and 38:3) and the Gajah Mada inscription of 1351, found in the temple yard, both name it as his mortuary shrine, built around 1300 by order of Gajah Mada for 'Bhatara Sang Mokta ring Siwa-Buddha Laya' — the king deified in the fused Shiva-Buddha cult.",
      "Older writers called it Candi Cungkup or Candi Menara, 'the tower': it was the tallest temple of its day hereabouts. The square base measures about 14 × 14 m; some 14 m of the tower still stands, and its plain top is one sign among many that the work was never finished. The temple faces west, though some descriptions give north-west, toward Mount Arjuno.",
      "Restored by the Netherlands East Indies antiquities service in the 1930s, the campaign left heaps of stones around the yard that were never put back into the building.",
    ],
    facts: [
      ["Built", "c. 1300 CE (estimated)"],
      ["Commemorates", "Kertanegara, d. 1292"],
      ["Faces", "West"],
      ["Base", "14 × 14 m"],
      ["Height", "about 14 m remain"],
    ],
  },
  chamber: {
    kicker: "The foot",
    title: "Chambers at ground level",
    paragraphs: [
      "Unusually for a major Javanese temple, the sacred rooms sit at the bottom of the tower, in the foot. The west doorway opens through several metres of solid masonry into a chamber at gallery level: the sources describe a lingga on a yoni (its top broken) with images of Ganesha, Agastya and Durga on its sides, of which only Agastya survived. Niche shrines flank the entrance and open on the other three faces — all empty today.",
      "Most of the temple's statues left long ago: carried off from 1804 and shipped to the Netherlands in 1819, they are now mostly in Leiden. The celebrated Prajnaparamita found in this compound ended up in the National Museum in Jakarta.",
    ],
    facts: [
      ["Chamber", "in the foot, at gallery level"],
      ["Images", "lingga-yoni; Ganesha, Agastya, Durga"],
      ["Survives", "only Agastya, of the side images"],
    ],
  },
  dvarapala: {
    kicker: "West of the temple",
    title: "The gate giants",
    paragraphs: [
      "About 300 m further west, flanking the road to the alun-alun, stand two colossal Dvarapala gate guardians — the largest in Java, each carved from a single block of andesite 3.7 m tall and reckoned to weigh about 40 tons, set some 20 m apart (today the main road runs between them). Their clubs hang head-down: a guardian huge enough to crush anyone, choosing mercy — and welcome.",
      "They once faced east, toward this temple, and are thought to have guarded the gate of Kertanegara's palace, which lay behind them to the west. The southern figure, buried to its chest until the late 1980s, turned slightly north-east as it was lifted from the ground. In this model the pair is drawn inside the plaza, a few dozen metres from the temple, so the walk passes between them.",
    ],
    facts: [
      ["Height", "3.7 m, single andesite blocks"],
      ["Weight", "about 40 t each"],
      ["Real location", "c. 300 m west of the temple"],
    ],
  },
  unfinished: {
    kicker: "Never finished",
    title: "An unfinished temple",
    paragraphs: [
      "The carving stops short everywhere: the foot is bare of relief, the panels that do exist show simple flowers and animals, the kala head over the entrance is incomplete, and the niches stand empty. Archaeologists read all this as a temple abandoned before its carving programme was done.",
      "The top was never crowned either. The roof rises as plain receding tiers and has partly collapsed, with no finial; the model draws three plain tiers to the surviving height and leaves the top flat. The stone heaps around the yard are the piles the 1930s restoration never reassembled.",
    ],
    facts: [
      ["Restoration", "1930s, Netherlands Indies antiquities service"],
      ["Kala over the door", "incomplete"],
      ["Roof", "plain tiers, no finial"],
    ],
  },
};

export const singosari: CandiDefinition = {
  id: "singosari",
  name: "Singosari",
  location: "Malang, Jawa Timur",
  site: { lat: -7.8878, lon: 112.6639 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "chamber", label: "Chamber in the foot", anchor: [-3, 3, 0], view: { position: [-24, 8, 13], target: [-3, 3.5, 0] } },
    { topic: "dvarapala", label: "Gate guardian", anchor: [-40, 2.5, 10], view: { position: [-31, 3.5, 18.5], target: [-40, 2.3, 10] } },
    { topic: "unfinished", label: "Unfinished top", anchor: [0, 12.8, 0], view: { position: [17, 16, 21], target: [0, 11, 0] } },
    { topic: "overview", label: "Temple from the south-west", anchor: [0, 7, 0], view: { position: [-30, 14, 27], target: [0, 6.5, 0] } },
  ],
  horizon: [
    { name: "Gunung Arjuno", lat: -7.7253, lon: 112.5767, relativeHeight: 2827, kind: "volcano" },
    { name: "Gunung Welirang", lat: -7.7206, lon: 112.6019, relativeHeight: 2644, kind: "volcano" },
    { name: "Gunung Bromo", lat: -7.9425, lon: 112.953, relativeHeight: 1817, kind: "volcano" },
    { name: "Gunung Semeru", lat: -8.1087, lon: 112.923, relativeHeight: 3164, kind: "volcano" },
  ],
  orbit: { position: [-24, 26, 22], target: [0, 7, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 90, shadowExtent: 46, approach: { x: -1, z: 0, start: 60 } },
  build: (textures: StoneTextures) => buildSingosari(textures),
};
