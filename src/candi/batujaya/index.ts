import type { StoneTextures } from "../../render/stone";
import type { CandiDefinition, Topic } from "../types";
import { BLANDONGAN, buildBatujaya, JIWA } from "./model";

/**
 * Sources (every historical claim and figure below traces to one of these):
 * - Wikipedia "Batujaya" (en): discovery 1984 by University of Indonesia; ~30 structures ("unur")
 *   over 5 km²; bricks of clay mixed with rice husks (no volcanic rock locally); Tarumanagara era
 *   c. 5th–6th century CE; stucco concrete (gravel/sand/lime) + lime plaster; national cultural
 *   treasure April 2019 (Jakarta Post).
 * - Wikipedia "Percandian Batujaya" (id): Blandongan ~100 m from Jiwa, stairs on four sides,
 *   radiocarbon on Blandongan artifacts 2nd–12th century CE; amulets depicting the Twin Miracle
 *   of Shravasti (six figures: 3 meditating Buddhas, abhayamudra Buddha, Brahma Sahampati, Sakka);
 *   votive tablets + 16-carat gold slab in Pallawa script/Sanskrit; pendharmaan-temple hypothesis.
 * - Widyastuti & Saptono 2024 (Atlantis Press, Incolwis 2022): Jiwa 19 × 19 m, no stairs,
 *   pradaksinapatha, patta/uttara/kumuda foot plinths, eight-lotus-petal body, circular rolak
 *   stupa base ("most likely a stupa"); Blandongan biggest/most complete, foot + half body,
 *   balustrade (original height unknown), square corner protrusions, semi-circular pillars
 *   between stairs and corners, hallway floored with stucco concrete, 12 pillar bases for a
 *   wooden cungkup, collapsed brick stupa hypothesis from curved stucco shards, SE–NW complex
 *   orientation, ~6 km from the coast, site near the Ci Tarum.
 * - photodharma.net (Anandajoti Bhikkhu, from the site guide): Jiwa 19×19×4.7 m (Kompas
 *   14/5/2020 agrees), pradaksina path 2.65 m wide, restored 1996–2001, excavated 1984/1985–86;
 *   Blandongan first level 25 × 25 m, second level 10 × 10 m, standing height ≈ 4.7 m, brick
 *   from two eras (5th–7th and 7th–10th centuries), older building layer buried inside.
 * - OpenStreetMap ways 499582316 / 482379225: Jiwa centroid −6.056997,107.154687; Blandongan
 *   centroid −6.055630,107.153525 → ~200 m apart at bearing ≈320° (the id-wiki "100 m" is an
 *   under-estimate; the OSM-measured distance is modelled, true scale).
 *
 * Simplifications: both temples are drawn cardinal-aligned although the complex axis runs SE–NW
 * (both are square-symmetric, so only the pair axis carries that orientation); Jiwa's eight
 * petals are stylised to an octagonal flare; Blandongan's balustrade height is a 1.05 m guess
 * (unknown), its wooden cungkup and collapsed crowning stupa are NOT reconstructed.
 */

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Karawang, Jawa Barat · c. 5th–6th century CE",
    title: "Batujaya",
    paragraphs: [
      "Out in the rice paddies of coastal Karawang, about six kilometres from the Java Sea and near the Ci Tarum river, lie the oldest temple ruins yet found in Java. Excavation since 1984 has uncovered some thirty brick structures — mounds the villagers call unur — spread over roughly five square kilometres across the villages of Segaran and Telagajaya.",
      "The complex is attributed to the Tarumanagara era, around the fifth to sixth centuries CE, though radiocarbon dates on finds from Candi Blandongan span the second to the twelfth century. Volcanic stone, the material of the later Javanese temples, does not occur here: everything is built of clay brick mixed with rice husks, hardened where needed with an early lime concrete and coated with lime stucco.",
      "Two temples have been restored and stand in for the rest in this scene: Candi Jiwa, a lotus-shaped stupa platform, and Candi Blandongan, the largest structure of the complex, a short walk to its north-west. The complex was declared an Indonesian national cultural treasure in April 2019.",
    ],
    facts: [
      ["Site", "≈ 5 km², some 30 unur"],
      ["Material", "Brick tempered with rice husks"],
      ["Era", "Tarumanagara, c. 5th–6th century CE"],
      ["Protected", "National cultural treasure, 2019"],
    ],
  },
  jiwa: {
    kicker: "Segaran I · the lotus temple",
    title: "Candi Jiwa",
    paragraphs: [
      "A square brick platform 19 metres across and 4.7 metres high, with no stairs and no entrance: worship happened on the 2.65-metre brick pradaksina path around it, walking the monument clockwise. Its foot carries the patta, uttara and kumuda plinth mouldings of early temple architecture.",
      "Seen from above, the top blooms: eight lotus petals around a circular brick base framed by an upright square rolak — the socket of a stupa, or perhaps of a large Buddha image. The whole temple reads as a stupa floating on an open lotus blossom, a form not found anywhere else in Indonesia.",
      "Excavated in 1984 and 1985–1986, restored 1996–2001. Only the foot and lower body survive; the petalled crown follows the excavators' reading that Jiwa was most likely a stupa.",
    ],
    facts: [
      ["Platform", "19 × 19 m"],
      ["Height", "4.7 m"],
      ["Pradaksina path", "2.65 m wide"],
      ["Restored", "1996–2001"],
    ],
  },
  blandongan: {
    kicker: "Segaran V · the great platform",
    title: "Candi Blandongan",
    paragraphs: [
      "The largest and most complete temple of Batujaya stands about two hundred metres north-west of Candi Jiwa: a stepped brick platform 25 metres square with a stair climbing each of its four sides, squared projections at the corners, semi-circular pillars between the stairs, and a balustrade whose original height nobody knows.",
      "On the platform a smaller 10-metre body rises — today only its foot and half-body survive, to a standing height near 4.7 metres. Around it runs a hallway floored with lime concrete, where twelve pillar bases in a row once carried a wooden hall (cungkup) that sheltered the top. Curved shards of that concrete, shaped like a stupa's dome, suggest the crowning stupa that has collapsed.",
      "Brick from two building phases has been identified — fifth–seventh and seventh–tenth centuries — and the layer of an older building lies buried inside the platform. One hypothesis makes Blandongan a memorial temple, perhaps for King Purnawarman of Tarumanagara, honoured by Buddhists he tolerated and protected.",
    ],
    facts: [
      ["First level", "25 × 25 m"],
      ["Second level", "10 × 10 m"],
      ["Stairs", "All four sides"],
      ["Standing height", "≈ 4.7 m"],
    ],
  },
  brick: {
    kicker: "Materials and craft",
    title: "Brick, husks and stucco",
    paragraphs: [
      "The coastal plain offers no volcanic stone, so the builders fired bricks of river clay mixed with rice husks and laid them in thin, nearly mortarless courses. At Blandongan some bricks are pushed proud of the wall face in stepped layers, so the surface catches the light in ridges — ornament by bricklaying alone.",
      "Where a structure needed real strength — floors, hardened wall cores — they used an early unreinforced concrete of gravel, sand and lime, and coated surfaces with lime plaster. Excavations recovered stucco ornaments modelled as human and animal heads, plasterwork rather than carved stone.",
    ],
    facts: [
      ["Brick", "Clay and rice husks"],
      ["Strengthening", "Lime concrete (stucco)"],
      ["Ornament", "Modelled plaster, not carved stone"],
    ],
  },
  amulet: {
    kicker: "The finds",
    title: "Amulets of the Twin Miracle",
    paragraphs: [
      "Excavation at Blandongan turned up identical terracotta amulets carved with six figures: three Buddhas in meditation above, and below them a Buddha with raised hand — the abhaya gesture — flanked by the god Brahma Sahampati and by Sakka, lord of the gods. They depict the Twin Miracle of Shravasti, when the Buddha streamed fire and water from his body and multiplied himself into the sky.",
      "With them were votive tablets bearing Buddha images and holy verses, and the same verses scratched in Pallawa script and Sanskrit on terracotta, on brick, and on a small foldable slab of gold. The finds point to an early Buddhist community here, centuries before the great temples of Central Java rose.",
    ],
    facts: [
      ["Amulet figures", "Six: Buddhas, Brahma, Sakka"],
      ["Script", "Pallawa alphabet, Sanskrit"],
      ["Gold", "Inscribed gold slab"],
    ],
  },
};

export const batujaya: CandiDefinition = {
  id: "batujaya",
  name: "Batujaya",
  location: "Karawang, Jawa Barat",
  site: { lat: -6.056314, lon: 107.154106 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "jiwa", label: "The lotus platform", anchor: [JIWA.x, 3.9, JIWA.z], view: { position: [JIWA.x + 36, 16, JIWA.z + 30], target: [JIWA.x, 3, JIWA.z] } },
    { topic: "blandongan", label: "The great platform", anchor: [BLANDONGAN.x, 3.4, BLANDONGAN.z], view: { position: [BLANDONGAN.x + 34, 14, BLANDONGAN.z + 40], target: [BLANDONGAN.x, 2.6, BLANDONGAN.z] } },
    { topic: "brick", label: "Husk-tempered brick", anchor: [BLANDONGAN.x + 10.9, 1.2, BLANDONGAN.z - 3], view: { position: [BLANDONGAN.x + 24, 3.5, BLANDONGAN.z + 8], target: [BLANDONGAN.x + 10.9, 1.3, BLANDONGAN.z - 3] } },
    { topic: "overview", label: "Both temples in the paddies", anchor: [0, 2, 0], view: { position: [130, 95, 150], target: [0, 0, 0] } },
  ],
  horizon: [
    { name: "Gunung Salak", lat: -6.72, lon: 106.731, relativeHeight: 2204, kind: "volcano" },
    { name: "Gunung Pangrango", lat: -6.776, lon: 106.982, relativeHeight: 2951, kind: "volcano" },
    { name: "Gunung Sanggabuana", lat: -6.533, lon: 107.367, relativeHeight: 1284, kind: "ridge" },
  ],
  orbit: { position: [110, 60, 130], target: [0, 6, 0] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 155, shadowExtent: 160, approach: { x: 0.55, z: 0.83, start: 150 } },
  build: (textures: StoneTextures) => buildBatujaya(textures),
};
