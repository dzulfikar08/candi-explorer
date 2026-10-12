import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import { deity, ratna, stupa } from "../kit/ornaments";
import { placement } from "../kit/plan";
import { shrineLayout } from "../kit/shrine";
import type { ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: English Wikipedia "Pawon" and Indonesian Wikipedia "Candi Pawon". Published figures:
 * square base with 10 m sides, total height 13.3 m, a single chamber 2.65 × 2.64 m and 5.20 m
 * high on a 1.5 m batur, andesite, restored 1903. The temple actually faces slightly north of
 * west; it is drawn facing west here. Door and window sizes are approximated from photographs.
 * The roof carries exactly five small stupas and four small ratnas; the kit's tier finials come
 * in fixed rings of six, so that count is placed by hand in `extra()`.
 */
const PAWON: ShrineSpec = {
  foot: { half: 5, height: 1.5, relief: true },
  body: { half: 3.6, height: 5.2, wall: 2.27 },
  door: { width: 1.4, height: 2.8 },
  doors: ["east"],
  stairWidth: 2,
  bay: { width: 0.34, depth: 0.12 },
  roof: { tiers: 2, first: 2.4, shrink: 0.75, finial: "none" },
  crown: { kind: "stupa", height: 2.4 },
  niches: "deity",
};

/** Tier tops for the hand-placed finial rings; total height comes to exactly 13.3 m. */
const ROOF_TIERS = shrineLayout(PAWON).tiers;

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Magelang, Central Java · 8th–9th century CE",
    title: "Candi Pawon",
    paragraphs: [
      "A small Buddhist temple on the straight line that joins Borobudur, 1.75 km to the north-east, with Mendut, 1.15 km to the south-west. All three were built under the Sailendra dynasty and are inscribed together as UNESCO World Heritage; the detail of Pawon's carving suggests it is slightly older than Borobudur.",
      "The name is everyday Javanese for 'kitchen', but the epigrapher J.G. de Casparis derived it from awu, 'ash': a per-awu-an, a place that keeps the ashes of a cremated king, which would make Pawon a mortuary temple — though whose king is uncertain (Casparis suggested King Indra, r. 782–812). Villagers call it Bajranalan, from Sanskrit vajra, 'thunderbolt', and anala, 'fire'.",
      "It stands on a square 10 m base and rises 13.3 m, and was restored in 1903. At the full moon of May or June the Waisak procession still walks from Mendut through Pawon up to Borobudur.",
    ],
    facts: [
      ["Height", "13.3 m"],
      ["Base", "10 × 10 m"],
      ["Faces", "West-north-west (drawn facing west)"],
      ["Stone", "Andesite"],
      ["Restored", "1903"],
    ],
  },
  chamber: {
    kicker: "The chamber",
    title: "An empty room",
    paragraphs: [
      "A single doorway on the west opens into one square chamber, 2.65 × 2.64 m but 5.20 m high. No statue was found inside — only a square basin in the centre of the floor — so the temple's dedication is unknown.",
    ],
    facts: [
      ["Size", "2.65 × 2.64 m"],
      ["Height", "5.20 m"],
      ["Statue", "None found"],
      ["Floor", "Square basin"],
    ],
  },
  reliefs: {
    kicker: "The walls",
    title: "A tree of life and its guardians",
    paragraphs: [
      "Nothing at Pawon tells a story: its reliefs are purely decorative. On the north and south walls kinnara and kinnari — half human, half bird — stand either side of a kalpataru, the tree of life, growing from a pot with money bags scattered beneath its branches.",
      "Niches beside the west door hold Kuwera, god of wealth, standing; his southern figure is damaged past recognition. Bodhisattvas and taras fill the other niches, a kala face caps the doorway, makara flank the foot of the stair, and high on the front wall a pair of small rectangular windows ventilates the chamber. The model uses the kit's generic carved-panel texture; only the panels' placement follows the sources.",
    ],
    facts: [
      ["North & south", "Kalpataru flanked by kinnara-kinnari"],
      ["Beside the door", "Standing Kuwera"],
      ["Other niches", "Bodhisattvas and taras"],
      ["Absent", "Narrative reliefs"],
    ],
  },
  roof: {
    kicker: "The roof",
    title: "Five stupas, four ratnas",
    paragraphs: [
      "The roof steps up in two square tiers, its cornices ringed with finials — five small stupas and four small ratnas — with a larger stupa at the very summit.",
      "Struck by its simplicity, symmetry and harmony, historians have dubbed this little temple 'the jewel of Javanese temple architecture', in contrast with the tall, slender temples of the later East Javanese style.",
    ],
    facts: [
      ["Finials", "5 stupas + 4 ratnas"],
      ["Summit", "One larger stupa"],
      ["Tiers", "2 stepped squares"],
    ],
  },
};

export const pawon: CandiDefinition = {
  id: "pawon",
  name: "Pawon",
  location: "Magelang, Jawa Tengah",
  site: { lat: -7.60616, lon: 110.219522 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "chamber", label: "The west doorway", anchor: [-3.7, 3, 0], view: { position: [-20, 4.5, 8], target: [-1, 2.8, 0] } },
    { topic: "reliefs", label: "Kalpataru and kinnara", anchor: [1.4, 4.2, 3.66], view: { position: [9, 5.5, 14], target: [1.4, 4.2, 3.6] } },
    { topic: "roof", label: "Stupa-crowned roof", anchor: [0, 12.1, 0], view: { position: [-19, 17, 15], target: [0, 10.8, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2670, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2885, kind: "volcano" },
    { name: "Sumbing", lat: -7.384, lon: 110.07, relativeHeight: 3111, kind: "volcano" },
    { name: "Sindoro", lat: -7.3, lon: 109.992, relativeHeight: 2876, kind: "volcano" },
    { name: "Menoreh Hills", lat: -7.7, lon: 110.15, relativeHeight: 640, kind: "ridge" },
  ],
  sources: [
    { title: "Pawon — Wikipedia", url: "https://en.wikipedia.org/wiki/Pawon" },
    { title: "Candi Pawon — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Pawon" },
    { title: "Borobudur Temple Compounds — UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/592/" },
  ],
  orbit: { position: [-34, 16, 24], target: [0, 6.5, 0] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 45, shadowExtent: 24, approach: { x: -1, z: 0, start: 24 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Pawon",
        courts: [{ halfX: 14, halfZ: 12 }],
        shrines: [{ spec: PAWON, at: { x: 0, z: 0 }, facing: "west", tour: { topic: "chamber", label: "Stair, body and chamber" } }],
        extra(site) {
          // The sourced finial count: four corner stupas on the lower tier and four ratnas on the
          // upper one; the spec's crown draws the larger summit stupa.
          site.instanceGeometry(
            stupa(),
            site.material("upper", "statue"),
            [1, -1].flatMap((sx) => [1, -1].map((sz) => placement(sx * 2.2, ROOF_TIERS[0].top, sz * 2.2, "east", 1.1))),
            false,
          );
          site.instanceGeometry(
            ratna(),
            site.material("upper", "statue"),
            [1, -1].flatMap((sx) => [1, -1].map((sz) => placement(sx * 1.74, ROOF_TIERS[1].top, sz * 1.74, "east", 0.85))),
            false,
          );
          // Kalpataru panels flanked by kinnara-kinnari, one each side of the central bay on the
          // north and south walls (the bay projects to |u| = 1.22; panels start clear of it).
          const relief = site.get("middle", "reliefSingle");
          for (const z of [3.64, -3.64]) {
            for (const s of [1, -1]) {
              relief.quad(
                [s * 1.35, 2.2, z],
                [s * 3.45, 2.2, z],
                [s * 3.45, 6.2, z],
                [s * 1.35, 6.2, z],
                [0, 0, Math.sign(z)],
                [
                  [0, 0],
                  [0.875, 0],
                  [0.875, 1],
                  [0, 1],
                ],
              );
            }
          }
          // The pair of small ventilation windows high on the west front wall.
          const shadow = site.get("middle", "nicheShadow");
          for (const s of [1, -1]) {
            shadow.quad([-3.64, 5.7, s * 1.6], [-3.64, 5.7, s * 2.1], [-3.64, 6.35, s * 2.1], [-3.64, 6.35, s * 1.6], [-1, 0, 0]);
          }
          // Kuwera niches flank the door: a shallow ledge and a standing figure (the kit only
          // recesses niches on faces without doors, so these are applied to the wall face).
          const masonry = site.get("middle", "masonry");
          for (const s of [1, -1]) {
            masonry.box([-3.72, 2.9, s * 1.75], [-3.6, 3.02, s * 2.35], {});
            site.instanceGeometry(deity(), site.material("middle", "statue"), [placement(-3.66, 3.02, s * 2.05, "west", 1.3)], false);
          }
          // The empty chamber keeps only the square basin at its centre.
          site.get("lower", "masonry").box([-0.55, 1.5, -0.55], [0.55, 1.85, 0.55], {});
        },
        approach: { from: { x: -48, z: 0 }, topic: "overview", label: "Approach from the west" },
      },
      textures,
    ),
};
