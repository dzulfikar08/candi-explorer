import { Matrix4 } from "three";
import type { StoneTextures } from "../../render/stone";
import { terrace } from "../kit/enclosure";
import { stupa } from "../kit/ornaments";
import { placement, rectOutline } from "../kit/plan";
import { buildCompound } from "../kit/compound";
import { type ShrineSpec, walls } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources:
 * - Wikipedia "Muaro Jambi Temple Compounds" (en): 26 km east of Jambi city; built by the Melayu
 *   kingdom, remains 7th–13th century; site stretches 7.5 km along the Batang Hari; eight
 *   excavated sanctuaries; Candi Tinggi, Candi Kedaton and Candi Gumpung the most significant
 *   intact temples; red brick with very little ornamentation, carving or statuary; nine temples
 *   restored; rediscovered by S. C. Crooke, 1824; restoration led by R. Soekmono from 1975
 *   (id-wiki); a Manjusrigrha inscription is associated with Gumpung.
 * - UNESCO World Heritage tentative list "Muarajambi Temple Compound" (ref. 6827, submitted
 *   15/4/2025): National Cultural Heritage Area of 3,981 ha (decree 259/M/2013); 101 sites
 *   recorded, ~11 restored (Kembar Batu, Gumpung, Tinggi I & II, Astano, Kotomahligai, Kedaton,
 *   Gedong I & II, Telagorajo pond); mandala-style concentric layout of main temple, perwara,
 *   gates, fences and moats; I-Tsing's 7th-century account of a Sumatran Buddhist centre; Atisha
 *   studied for 12 years under Suvarnadvipa Dharmakirti here in the 11th century; man-made
 *   canals and reservoirs for flood control, transport and fish farming.
 * - photodharma.net "Muara Jambi" (Anandajoti Bhikkhu site guide, measured on the ground):
 *   Candi Tinggi 2 enclosure wall and ditch ≈ 90 × 70 m with gates on the east and west; main
 *   building ≈ 9 m square, stair on the south; a small platform in front, one small stupa and
 *   partly restored perwaras around the grounds. Candi Gumpung: a 150+ m square enclosure, main
 *   building facing east with sandstone makara on the stair, relic gold plates inscribed with
 *   Vajrayana deity names and a headless Prajnaparamita statue found inside. Kolam Telagorajo:
 *   a man-made tank ≈ 70 × 30 m with lotuses, south of Candi Tinggi.
 * - Mysteria site atlas (field data): Candi Gumpung's central candi 20 × 20 m.
 * Horizon: Gunung Kerinci (3,805 m, 1.697°S 101.264°E) and Gunung Masurai (2,755 m,
 * 2.129°S 101.862°E), Global Volcanism Program / Wikidata; summit and site elevations sampled
 * from the Copernicus DEM (api.open-meteo.com/v1/elevation).
 *
 * Simplifications: the brief asked for one focal group, so only Candi Tinggi is modelled
 * (Gumpung, Kedaton and the rest are described in the topics — Tinggi's neighbours really stand
 * 200+ m away in bamboo groves). The true ~250 m from Tinggi to Kolam Telagorajo is compressed
 * to ~95 m so pond and temple share one scene. The restored main building rises in brick tiers
 * to roughly 14 m; the original crown is lost (sources give no published height), so the tier
 * count and stupa crown are an estimate.
 */

/**
 * Candi Tinggi: ≈ 9 m square, a tall solid brick body with niches, stepped tiers above and a
 * stupa-like crown. The restored stair faces south (drawn so); the real total height is not
 * published — the ≈ 14 m drawn here is an estimate to be checked against photos.
 */
export const TINGGI: ShrineSpec = {
  plinths: [{ half: 6.2, height: 0.7 }],
  foot: { half: 5.2, height: 0.5 },
  body: { half: 4.5, height: 7, wall: 1.1 },
  door: { width: 1.4, height: 2.6 },
  doors: ["east"],
  stairWidth: 2.4,
  bay: { width: 0.45, depth: 0.1 },
  roof: { tiers: 3, first: 2.2, shrink: 0.75, finial: "stupa" },
  crown: { kind: "stupa", height: 1.4 },
  niches: "empty",
};

/** A perwara restored only to its foot, as most ancillary shrines at Tinggi stand today. */
export const PERWARA: ShrineSpec = {
  foot: { half: 2.6, height: 1 },
  body: { half: 2, height: 2.2, wall: 0.7 },
  door: { width: 1, height: 1.8 },
  doors: ["east"],
  stairWidth: 1.4,
  roof: { tiers: 2, first: 1.2, shrink: 0.75, finial: "stupa" },
  crown: { kind: "none", height: 0 },
  niches: "empty",
};

/** Kolam Telagorajo: the tank is ≈ 70 × 30 m; drawn ≈ 0.9 m deep with a brick revetment. */
const POND = { halfX: 35, halfZ: 15, depth: 0.9, cz: 95 };

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Muaro Jambi Regency, Jambi · 7th–13th century CE",
    title: "Muaro Jambi",
    paragraphs: [
      "A vast Buddhist temple city on the Batang Hari river, 26 km east of Jambi. Built by the Melayu kingdom in the orbit of Srivijaya, its remains run 7.5 km along the river and cover a protected area of 3,981 hectares — the largest ancient temple complex in Southeast Asia.",
      "The temples are of red brick, and unlike those of Java they carry very little carving or statuary. A hundred and one sites are known, from restored temples to walled mounds called menapo; eleven have been restored. I-Tsing described a great Sumatran Buddhist centre here in the 7th century, and in the 11th the Indian master Atisha spent twelve years studying under Suvarnadvipa Dharmakirti at this site.",
      "This model shows one focal group, Candi Tinggi, with its walled enclosure and the lotus tank of Kolam Telagorajo. The other restored compounds — Gumpung, Kedaton, Astano, Gedong, Kotomahligai and more — stand scattered through the groves around it, laid out in mandala style with gates, inner fences and canals.",
    ],
    facts: [
      ["Protected area", "3,981 ha (decree 259/M/2013)"],
      ["Distance", "26 km east of Jambi"],
      ["Period", "7th–13th century CE"],
      ["Sites", "101 recorded, ~11 restored"],
    ],
  },
  tinggi: {
    kicker: "The focal group",
    title: "Candi Tinggi",
    paragraphs: [
      "Candi Tinggi stands at the centre of the main cluster of sites. Its enclosure wall and ditch form a rectangle of about 90 × 70 m with gates on the east and west sides, and the main stair climbs from the south.",
      "The main building is about 9 m square, a tall solid brick mass with blind niches, restored as stepped tiers crowned by a stupa-like top. In front of it stands a small platform whose purpose is unknown, and around the grounds one small stupa and a number of perwaras, the ancillary shrines, restored only in part.",
      "The original height of the tower is not published; the crown shown here is an estimate.",
    ],
    facts: [
      ["Enclosure", "≈ 90 × 70 m, gates east and west"],
      ["Main building", "≈ 9 m square"],
      ["Stair", "South"],
    ],
  },
  gumpung: {
    kicker: "A neighbour",
    title: "Candi Gumpung",
    paragraphs: [
      "West of Tinggi lies Candi Gumpung, in a walled enclosure more than 150 m square. Its main temple, about 20 × 20 m, faces east, with carved sandstone makara guarding the stair — a rare touch of stone ornament in a brick land.",
      "Relics were found embedded in the building, including gold plates inscribed with the names of Vajrayana deities, together with a headless Prajnaparamita statue. A Manjusrigrha inscription is associated with the temple.",
    ],
    facts: [
      ["Central candi", "≈ 20 × 20 m"],
      ["Finds", "Gold relic plates, Prajnaparamita"],
    ],
  },
  water: {
    kicker: "Water in the swamp",
    title: "Kolam Telagorajo and the canals",
    paragraphs: [
      "The compound sits on the swampy levees of the Batang Hari, and its builders mastered the water: man-made canals run around the temples and connect them to the river, serving flood control, transport and fish farming — a network compared with those of the Mekong valley.",
      "Kolam Telagorajo, a man-made tank about 70 × 30 m just south of the compound, still grows lotuses and is now a picnic spot. The tank drawn here is a simplified rectangle with a brick revetment.",
    ],
    facts: [
      ["Tank", "≈ 70 × 30 m"],
      ["Canals", "Linked to the Batang Hari"],
    ],
  },
};

export const muaroJambi: CandiDefinition = {
  id: "muaro-jambi",
  name: "Muaro Jambi",
  location: "Muaro Jambi, Jambi",
  site: { lat: -1.4779, lon: 103.6671 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    // Candi Tinggi: body niches, south stair, and the tank.
    { topic: "tinggi", label: "Candi Tinggi", anchor: [0, 8, 4.5], view: { position: [26, 10, 30], target: [0, 7, 2] } },
    { topic: "tinggi", label: "South stair", anchor: [0, 2.5, 8], view: { position: [8, 3, 26], target: [0, 2.5, 7] } },
    { topic: "gumpung", label: "Perwara ruins", anchor: [20, 1.2, -14], view: { position: [34, 6, -4], target: [20, 1, -13] } },
    { topic: "water", label: "Kolam Telagorajo", anchor: [0, 0, POND.cz], view: { position: [40, 9, POND.cz + 26], target: [0, -0.5, POND.cz] } },
  ],
  // Kerinci and Masurai on the western horizon; the site itself lies at ~8 m (Copernicus DEM).
  horizon: [
    { name: "Kerinci", lat: -1.697, lon: 101.264, relativeHeight: 3800, kind: "volcano" },
    { name: "Masurai", lat: -2.129, lon: 101.862, relativeHeight: 2750, kind: "volcano" },
  ],
  sources: [
    { title: "Muaro Jambi Temple Compounds — Wikipedia", url: "https://en.wikipedia.org/wiki/Muaro_Jambi_Temple_Compounds" },
    { title: "Muarajambi Temple Compound — UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/tentativelists/6827/" },
    { title: "Muara Jambi, Sumatra — Photo Dharma", url: "https://photodharma.net/Indonesia/32-Muara-Jambi/index.htm" },
  ],
  orbit: { position: [46, 36, 42], target: [0, 6, 0] },
  realms: {
    lower: "Kamadhatu · base",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 165, shadowExtent: 105, approach: { x: 0, z: 1, start: 150 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Muaro Jambi",
        fabric: "brick",
        courts: [{ halfX: 44, halfZ: 34 }],
        enclosures: [
          // The restored brick enclosure wall, ≈ 90 × 70 m, with its gates on east and west.
          { halfX: 45, halfZ: 35, height: 1.5, thickness: 0.7, gates: ["east", "west"], gateWidth: 3.5, gate: "paduraksa" },
        ],
        shrines: [
          { spec: TINGGI, at: { x: 0, z: 0 }, facing: "south", tour: { topic: "tinggi", label: "Climbing Candi Tinggi" } },
          // Partly restored perwaras, kept as standing feet with collapsed tops.
          { spec: PERWARA, at: { x: 20, z: -14 }, facing: "south", ruined: true },
          { spec: PERWARA, at: { x: -23, z: 12 }, facing: "south", ruined: true },
          { spec: PERWARA, at: { x: 24, z: 13 }, facing: "south", ruined: true },
        ],
        extra(site) {
          // The small platform in front of the main building (purpose unknown).
          site.place(terrace({ halfX: 4, halfZ: 2.5, height: 0.8, stairs: ["north"], stairWidth: 2 }), placement(0, 0, 12));
          // The small stupa in the grounds, a stupa ornament on a moulded base.
          const statue = site.get("upper", "statue");
          statue.box([-22, 0, -16], [-19.4, 0.7, -13.4], {});
          statue.geometry(
            stupa(),
            placement(-20.7, 0.7, -14.7, "east").multiply(new Matrix4().makeScale(2.1, 2.6, 2.1)),
          );
          // Kolam Telagorajo: a brick-lined tank holding still water.
          const rim = site.get("lower", "masonry");
          const rimLoop = rectOutline(POND.halfX + 0.8, POND.halfZ + 0.8, 0, POND.cz);
          walls(rim, rimLoop, -POND.depth - 0.7, 0.1, { inward: true });
          rim.cap(rectOutline(POND.halfX + 1.4, POND.halfZ + 1.4, 0, POND.cz), 0.12, [rectOutline(POND.halfX + 0.8, POND.halfZ + 0.8, 0, POND.cz)]);
          site.get("lower", "floor").cap(rectOutline(POND.halfX + 0.8, POND.halfZ + 0.8, 0, POND.cz), -POND.depth - 0.7);
          site.get("lower", "water").cap(rectOutline(POND.halfX, POND.halfZ, 0, POND.cz), -POND.depth + 0.25);
        },
        // Walk in from the south, past the lotus tank, and enter by the west gate.
        approach: {
          from: { x: -60, z: 128 },
          topic: "overview",
          label: "From the lotus tank to the west gate",
          via: [{ x: -74, z: 82 }, { x: -70, z: 40 }, { x: -56, z: 8 }],
        },
      },
      textures,
    ),
};
