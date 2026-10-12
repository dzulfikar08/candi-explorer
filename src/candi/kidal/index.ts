import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources:
 * - Wikipedia "Kidal Temple" (en): Hindu temple of the Singhasari dynasty at Rejokidal, Tumpang,
 *   East Java, ~24 km east of Malang; built around 1248, restored in the 1990s; three levels on a
 *   raised platform; at the foot, reliefs depict the Garudeya (Garuda) story; may have encased a
 *   Shiva portrait of King Anusapati.
 * - Wikipedia "Candi Kidal" (id): built 1248 at the end of the sraddha rites (12 years after the
 *   death) for Anusapati, second king of Singhasari (reigned 1227-1248); andesite stone; three
 *   parts (kaki, tubuh, atap) with a markedly tall foot and a body narrower than both foot and
 *   roof, giving a slender look; the plain top roof surface carries neither ratna nor stupa; Kala
 *   heads with fangs above the door and niches; three Garudeya reliefs, one on each foot face
 *   except the entrance side, read prasawiya (counter-clockwise) starting on the south side;
 *   foundation remains of a perimeter wall with an entrance stair on the west were excavated in
 *   the 1990s restoration; site at ~520 m elevation on the western slope of the Tengger massif,
 *   at 8°02'S 112°43'E; the Shiva Mahadewa portrait statue from the chamber is now in the
 *   Tropenmuseum (Amsterdam) and a Shiva statue possibly from Kidal is in Leiden.
 * - southeastasiankingdoms.wordpress.com "Candi Kidal and Jago": the temple reaches about 12 m
 *   today but was apparently about 5 m taller in its original form.
 *
 * Simplifications: the kit's foot relief is a generic carved band, not the three specific
 * Garudeya panels - they are marked with hotspots on the south, east and north foot faces instead.
 * The original crown is lost (the top surface is plain), so the model ends on the bare third roof
 * tier, matching the id-Wikipedia description and the ~12 m surviving height.
 */
export const KIDAL: ShrineSpec = {
  plinths: [{ half: 5.6, height: 0.9, relief: true }],
  foot: { half: 4.4, height: 3.1, relief: true },
  body: { half: 2.9, height: 3.6, wall: 0.9 },
  door: { width: 1.1, height: 2.1 },
  doors: ["east"],
  stairWidth: 1.2,
  roof: { tiers: 3, first: 2.3, shrink: 0.75, finial: "none" },
  crown: { kind: "none", height: 0 },
  image: { kind: "deity", height: 1.8 },
  niches: "deity",
};

// Modelled tip ≈ 12.9 m (0.9 + 3.1 + 3.6 + 2.3 + 1.7 + 1.3): within ~10% of the ~12 m surviving height (the original
// was apparently ~17 m, but no reconstruction of the lost crown exists to model).

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Tumpang, Jawa Timur · c. 1248 CE",
    title: "Candi Kidal",
    paragraphs: [
      "A Hindu funerary temple of the Singhasari dynasty in Rejokidal village, Tumpang, about 24 km east of Malang. It was built around 1248, at the end of the twelve-year sraddha mourning cycle for King Anusapati, the second ruler of Singhasari (reigned 1227-1248), who was honoured there as Shiva.",
      "East Javanese temples are shrines to dead kings rather than monuments to a faith, and their proportions differ from Central Javanese ones: a taller foot, a slimmer body and more roof tiers. Kidal is the classic early example - the body is narrower than both the foot and the roof, which gives the temple its slender look. The top roof surface is plain, without a ratna or stupa crown; whatever finished it originally is lost.",
      "The temple, of andesite stone, was restored in the 1990s. The excavation also brought back the foundations of a perimeter wall with an entrance stair on the west. The Shiva portrait statue from the chamber, identified with Anusapati himself, is now kept in the Netherlands.",
    ],
    facts: [
      ["Built", "c. 1248 CE"],
      ["Dedicated to", "Anusapati, king of Singhasari"],
      ["Height today", "≈ 12 m (originally apparently ≈ 17 m)"],
      ["Stone", "Andesite"],
      ["Entrance", "West"],
      ["Restored", "1990s"],
    ],
  },
  garudeya: {
    kicker: "The foot of the temple",
    title: "The Garudeya reliefs",
    paragraphs: [
      "Three panels on the foot depict the Garudeya, the Javanese kakawin telling how Garuda freed his mother Winata from slavery to her sister Kadru by seizing the amerta, the water of immortality, from the gods. Read counter-clockwise starting on the south face, right of the entrance: first Garuda guarded beneath the three serpents, then Garuda carrying the amerta vessel on his head - the finest and best preserved panel - and finally Garuda carrying his freed mother in his arms.",
      "The story is a tale of release (ruwatan), and its placement on a royal funerary temple is deliberate: reliefs of moral liberation on the foot helped purify the deceased king. Many read the choice as Anusapati's own wish to redeem his mother, Ken Dedes.",
      "Here the panels are marked on the three foot faces by hotspot markers; the kit models a generic carved band rather than the specific figures. The same Garudeya story appears again at Candi Sukuh on Mount Lawu.",
    ],
    facts: [
      ["Panels", "3, one per face except the entrance"],
      ["Reading", "Counter-clockwise, starting south"],
      ["Story", "Garuda freeing his mother with the amerta"],
    ],
  },
  kala: {
    kicker: "Doors and niches",
    title: "The Kala guardian",
    paragraphs: [
      "Above the entrance and the niches looms the head of Kala, an aspect of Shiva and the traditional guardian of sacred buildings. The Kidal Kala is deliberately frightening: bulging eyes, gaping mouth and two large curved fangs, an East Javanese signature. Fingers in a threatening mudra gesture flank it on either side.",
      "The single chamber (garbhagrha) once held an arca of Shiva Mahadewa, understood as a portrait of King Anusapati; it is now in the Tropenmuseum in Amsterdam. A standing deity figure stands in for it in this model.",
    ],
    facts: [
      ["Guardian", "Kala head with fangs"],
      ["Chamber image", "Shiva Mahadewa (now Amsterdam)"],
    ],
  },
};

export const kidal: CandiDefinition = {
  id: "kidal",
  name: "Kidal",
  location: "Malang, Jawa Timur",
  site: { lat: -8.0333, lon: 112.7167 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    // The shrine is placed facing west, so world -x is the entrance side and the local east
    // face maps to world west, local south to world north, local north to world south.
    { topic: "garudeya", label: "Garudeya relief 1", anchor: [3.6, 2.6, 3.2], view: { position: [16, 3.5, 11], target: [3.4, 2.6, 3.0] } },
    { topic: "garudeya", label: "Garudeya relief 2", anchor: [5.6, 2.6, 0], view: { position: [17, 3.5, 3], target: [5.4, 2.6, 0] } },
    { topic: "garudeya", label: "Garudeya relief 3", anchor: [3.6, 2.6, -3.2], view: { position: [16, 3.5, -11], target: [3.4, 2.6, -3.0] } },
    { topic: "kala", label: "Kala over the door", anchor: [-4.4, 4.6, 0], view: { position: [-14, 5.5, 5], target: [-4.4, 4.4, 0] } },
    { topic: "overview", label: "The temple", anchor: [0, 9, 0], view: { position: [-26, 10, 20], target: [0, 6.5, 0] } },
  ],
  horizon: [
    { name: "Arjuno", lat: -7.725, lon: 112.575, relativeHeight: 2820, kind: "volcano" },
    { name: "Kawi", lat: -7.917, lon: 112.612, relativeHeight: 2030, kind: "volcano" },
    { name: "Bromo", lat: -7.942, lon: 112.95, relativeHeight: 1810, kind: "volcano" },
    { name: "Semeru", lat: -8.108, lon: 112.922, relativeHeight: 3160, kind: "volcano" },
  ],
  orbit: { position: [-26, 11, 22], target: [0, 6, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 60, shadowExtent: 22, approach: { x: -1, z: 0, start: 20 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Kidal",
        courts: [{ halfX: 13, halfZ: 13 }],
        // 1990s excavation found only the foundations of this perimeter wall, with an entrance on
        // the west; its original gate form is uncertain, so a low wall with a small paduraksa.
        enclosures: [{ halfX: 13, halfZ: 13, height: 1.6, thickness: 0.6, gates: ["west"], gateWidth: 2.6, gate: "paduraksa" }],
        shrines: [{ spec: KIDAL, at: { x: 0, z: 0 }, facing: "west", tour: { topic: "kala", label: "Chamber and Kala heads" } }],
        approach: { from: { x: -50, z: 0 }, topic: "overview", label: "Approach from the west" },
      },
      textures,
    ),
};

