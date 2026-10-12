import type { StoneTextures } from "../../render/stone";
import type { CandiDefinition, Topic } from "../types";
import { buildBajangRatu } from "./model";

/**
 * Sources: Indonesian Wikipedia "Gapura Bajang Ratu" (paduraksa type; brick throughout except the
 * andesite stair floor and door sills; site at 41.49 m elevation; plan ±11.5 × 10.5 m, 16.5 m tall,
 * passage ±1.4 m wide; foot storey 2.48 m; Sri Tanjung relief on the foot beside the stair, Ramayana
 * on the right wing wall, kala over the door; kala flanked by lions, sun, legged naga and garuda
 * heads on the roof; read as the pedharmaan of Jayanegara — "returned to the world of Wisnu",
 * 1250 Saka / c. 1328 CE — at Kapopongan in Antawulan named in the Negarakertagama; named "Bajang
 * Ratu" first in the Oundheitkundig Verslag of 1915; restoration inaugurated 1992), Kepustakaan
 * Candi / Perpustakaan Nasional RI "Candi Bajangratu" (orientation east–west through the passage;
 * body 6.74 m long; tiered roof ending in a square peak), and English Wikipedia "Paduraksa" (the
 * oldest paduraksa still standing, mid-14th century). Coordinates from Wikidata Q11112539
 * (7°34′04″S 112°23′56″E), matching OpenStreetMap.
 *
 * Simplifications: the gate is approached from the west (the passage runs east–west and the real
 * orientation is northeast–southwest, snapped to the cardinal here); the roof reliefs are carried by
 * the brick texture except a plain sun disc on the third tier; the fence walls flanking the wing
 * walls survive only as foundations and are not drawn.
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Trowulan, Mojokerto · mid-14th century CE",
    title: "Gapura Bajang Ratu",
    paragraphs: [
      "The finest surviving gate of the Majapahit capital: a paduraksa, a roofed gateway built entirely of red brick, standing 16.5 m tall on a plan of about 11.5 × 10.5 m, with a passage just 1.4 m wide running straight through it.",
      "Historians link it to Çrenggapura (Kapopongan) at Antawulan, the sanctuary named in the Negarakertagama where King Jayanegara, dead in 1250 Saka (c. 1328 CE), was venerated as one 'returned to the world of Vishnu'. The gate may be all that remains of it — the shrine behind is gone, along with the fence walls that once continued the gate's wings.",
      "Its Javanese name means 'the small or deformed king', and folklore ties it to Jayanegara. The name appears first in the 1915 archaeological report; the gate was consolidated then and fully restored by 1992.",
    ],
    facts: [
      ["Height", "16.5 m"],
      ["Plan", "≈ 11.5 × 10.5 m"],
      ["Type", "Paduraksa (roofed gate)"],
      ["Restored", "Inaugurated 1992"],
    ],
  },
  gate: {
    kicker: "Foot, body and roof",
    title: "Three storeys of brick",
    paragraphs: [
      "Like a temple, the gate reads in three zones: a moulded foot storey 2.48 m high, the tall pierced body that carries the passage, and a tiered roof rising in shrinking steps to a square peak — the meru silhouette of East Javanese brickwork.",
      "Everything is brick except the stairway floors and the door sills, which are andesite. Corbelled brickwork spans the 1.4 m passage and carries the massive lintel band above the doors on both faces.",
      "A pair of wing walls with stepped pylons projects from the foot of the gate; they once ran on into long fence walls, known today only from their foundations.",
    ],
    facts: [
      ["Foot storey", "2.48 m"],
      ["Passage", "≈ 1.4 m wide"],
      ["Material", "Red brick; andesite sills and stair"],
      ["Wings", "Pylon-ended, fence walls lost"],
    ],
  },
  passage: {
    kicker: "Through the gate",
    title: "The door of the dead king",
    paragraphs: [
      "A kala face glares over the doorway on both sides, and false-door niches close the north and south faces of the body. On the foot walls beside the stair runs the story of Sri Tanjung, whose vindication after death made her tale a fitting emblem for a memorial gate; the right wing carries scenes of the Ramayana.",
      "The roof reliefs are a whole guard troop: kala heads flanked by lions, the winged sun, a legged naga, garuda heads and one-eyed cyclops figures — protective images to ward off misfortune.",
      "A gate fit for a deified king still rules local manners: in Trowulan it remains custom for a funeral procession to leave by the back door, and a taboo warns officials against walking through this one.",
    ],
    facts: [
      ["Over the door", "Kala and sulur vines"],
      ["Foot reliefs", "Sri Tanjung; Ramayana on the wing"],
      ["Roof reliefs", "Sun, naga, garuda, cyclops"],
    ],
  },
};

export const bajangRatu: CandiDefinition = {
  id: "bajang-ratu",
  name: "Bajang Ratu",
  location: "Mojokerto, Jawa Timur",
  // Wikidata Q11112539 / OpenStreetMap.
  site: { lat: -7.5677, lon: 112.3988 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    // Kala head over the west doorway (base y ≈ 7.1).
    { topic: "passage", label: "Kala over the door", anchor: [-3.6, 7.6, 0], view: { position: [-16, 7.5, 6], target: [-3.5, 7.2, 0] } },
    // Sun (Surya) disc on the third roof tier, west face.
    { topic: "passage", label: "Sun relief on the roof", anchor: [-2.8, 11.2, 0], view: { position: [-14, 12, 5], target: [-2.7, 11.1, 0] } },
    // Wing wall and pylon on the south side of the west front.
    { topic: "gate", label: "Wing wall and pylon", anchor: [-4.2, 2.4, 11.5], view: { position: [-16, 5, 20], target: [-4, 2.2, 11] } },
    { topic: "overview", label: "The whole gate", anchor: [0, 8, 0], view: { position: [-30, 15, 24], target: [0, 8, 0] } },
  ],
  horizon: [
    { name: "Penanggungan", lat: -7.6156, lon: 112.62, relativeHeight: 1612, kind: "volcano" },
    { name: "Anjasmoro", lat: -7.621, lon: 112.281, relativeHeight: 2236, kind: "volcano" },
    { name: "Welirang", lat: -7.691, lon: 112.477, relativeHeight: 3115, kind: "volcano" },
    { name: "Arjuno", lat: -7.725, lon: 112.576, relativeHeight: 3298, kind: "volcano" },
  ],
  sources: [
    { title: "Gapura Bajang Ratu — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Gapura_Bajang_Ratu" },
    { title: "Paduraksa — Wikipedia", url: "https://en.wikipedia.org/wiki/Paduraksa" },
  ],
  orbit: { position: [-16, 14, 14], target: [0, 8, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 60, shadowExtent: 26, approach: { x: -1, z: 0, start: 44 } },
  build: (textures: StoneTextures) => buildBajangRatu(textures),
};
