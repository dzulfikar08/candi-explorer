import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import { rectOutline } from "../kit/plan";
import type { ShrineSpec } from "../kit/shrine";
import type { Site } from "../kit/site";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia "Cangkuang" / id.wikipedia "Candi Cangkuang" (discovery 1966 by Harsoyo and
 * Uka Tjandrasasmita from an 1893 Vorderman report; restoration 1974–1975, reconstruction 1976,
 * inaugurated 1978; only ~40% of the original andesite blocks survived, the rest is poured cement;
 * base 4.5 × 4.5 m and 1.37 m high on a 4.7 × 4.7 m, 30 cm platform; body 4.22 × 4.22 m and
 * 2.49 m high; roof in two tiers 3.8 m and 2.74 m square; total height 8.5 m (en.wikipedia);
 * east-facing with a stair on the east side; 62 cm damaged Shiva statue with a nandi head on the
 * pedestal; the Islamic grave of Embah Dalem Arief Muhammad a few metres away; the temple shares
 * the 16.5 ha Kampung Pulo island with a traditional Sundanese village, in Situ Cangkuang lake)
 * and exploresunda.com for the GPS position (-7.1029, 107.9189). Horizon heights from the
 * Indonesian Wikipedia mountain articles and the id.wikipedia Candi Cangkuang survey
 * (Guntur 2849 m, Cikuray 2821 m, Papandayan 2665 m, Haruman 1218 m, Kaledong 1249 m; site ≈ 660 m).
 * The id.wikipedia article places the door on the north face; en.wikipedia and the restored
 * building's east stair are followed here.
 */

/**
 * Proportions follow the published measurements (0.3 + 1.37 + 2.49 + 1.56 + 1.1 m plus crown
 * ≈ 8.5 m). The roof's pseudo-lingam pinnacles are drawn as a single ratna crown; the temple is
 * otherwise unadorned — no relief, no niches.
 */
const CANGKUANG: ShrineSpec = {
  plinths: [{ half: 2.35, height: 0.3 }],
  foot: { half: 2.25, height: 1.37 },
  body: { half: 2.11, height: 2.49, wall: 0.5 },
  door: { width: 0.6, height: 1.56 },
  doors: ["east"],
  stairWidth: 1.26,
  roof: { tiers: 2, first: 1.9, shrink: 0.72, finial: "none" },
  crown: { kind: "ratna", height: 1.7 },
  image: { kind: "deity", height: 0.62 },
};

/** The temple island is drawn as a moulded terrace; the 16.5 ha island itself is far larger. */
const ISLAND = { halfX: 8, halfZ: 6, height: 1.4 };
/** Situ Cangkuang: a dark flat sheet (nicheShadow material) with a hole for the island. */
const LAKE = { halfX: 40, halfZ: 30 };

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Garut, Jawa Barat · 8th century CE",
    title: "Candi Cangkuang",
    paragraphs: [
      "A small Shiva temple on Kampung Pulo, an island in Situ Cangkuang lake in Garut, West Java — the first and only Hindu temple known to have survived in the Sundanese lands. Its plain, blocky style resembles the early temples of the Dieng plateau, and experts date it to the early 8th century from the weathering of its andesite and its lack of relief.",
      "Inside the single chamber stands a small damaged stone statue of Shiva, 62 cm tall, its hands broken and face eroded; a nandi head carved on the pedestal is what identifies the figure.",
      "Three metres from the temple is something no other candi has: the Islamic grave of Embah Dalem Arief Muhammad, venerated as the ancestor of the Kampung Pulo village that shares the island, and reached today by raft across the lake.",
    ],
    facts: [
      ["Height", "8.5 m"],
      ["Base", "4.5 × 4.5 m"],
      ["Faces", "East"],
      ["Fabric", "Andesite, ~40% original"],
    ],
  },
  reconstruction: {
    kicker: "1966–1978",
    title: "Built twice",
    paragraphs: [
      "The temple was found in 1966 by researchers Harsoyo and Uka Tjandrasasmita, following an 1893 report of a broken statue and an old grave on the hill of Kampung Pulo. Villagers had long used the scattered andesite blocks as gravestones.",
      "Excavation and restoration ran from 1974; the reconstruction of the frame, roof and Shiva statue was carried out in 1976 and inaugurated in 1978. Only about 40% of the original stones could be reused — the rest is poured cement, sand and iron — so the temple's true original form is unknown.",
    ],
    facts: [
      ["Discovered", "1966"],
      ["Reconstructed", "1974–1976, opened 1978"],
      ["Original stones", "≈ 40%"],
    ],
  },
  island: {
    kicker: "Situ Cangkuang",
    title: "Temple on the water",
    paragraphs: [
      "The sanctuary occupies a 16.5 hectare island stretching east to west in the small lake of Situ Cangkuang, a fertile valley some 600 m above sea level. Originally the whole island was ringed by water; the southern arm has since silted into paddy fields, and the surviving lake lies to the north.",
      "Beside the temple stand the six traditional houses of Kampung Pulo and the grave of Arief Muhammad, together protected as a cultural sanctuary. The distant skyline is Garut's ring of volcanoes: Guntur, Papandayan and Cikuray to the south-west, Haruman and Kaledong to the north.",
    ],
  },
};

export const cangkuang: CandiDefinition = {
  id: "cangkuang",
  name: "Cangkuang",
  location: "Garut, Jawa Barat",
  site: { lat: -7.1029, lon: 107.9189 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "island", label: "Temple and lake", anchor: [0, 4, 0], view: { position: [-26, 12, 22], target: [0, 4, 0] } },
    { topic: "reconstruction", label: "Rebuilt body", anchor: [0, 4.2, -2.2], view: { position: [-14, 5, -12], target: [0, 4, 0] } },
    { topic: "overview", label: "East stair", anchor: [3.6, 2.2, 0], view: { position: [16, 4, 5], target: [2, 2.5, 0] } },
  ],
  horizon: [
    { name: "Gunung Guntur", lat: -7.165, lon: 107.838, relativeHeight: 2189, kind: "volcano" },
    { name: "Gunung Papandayan", lat: -7.321, lon: 107.73, relativeHeight: 2005, kind: "volcano" },
    { name: "Gunung Cikuray", lat: -7.337, lon: 107.845, relativeHeight: 2161, kind: "volcano" },
    { name: "Gunung Haruman", lat: -7.066, lon: 107.9, relativeHeight: 558, kind: "volcano" },
    { name: "Gunung Kaledong", lat: -7.026, lon: 107.946, relativeHeight: 589, kind: "volcano" },
  ],
  orbit: { position: [-30, 16, 26], target: [0, 6, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 46, shadowExtent: 42, approach: { x: 1, z: 0, start: 34 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Cangkuang",
        terraces: [
          // The temple island, raised above the lake sheet; its stair faces the raft landing.
          { spec: { halfX: ISLAND.halfX, halfZ: ISLAND.halfZ, height: ISLAND.height, stairs: ["east"], stairWidth: 1.5 }, at: { x: 0, z: 0 } },
        ],
        shrines: [
          { spec: CANGKUANG, at: { x: 0, z: 0 }, y: ISLAND.height, facing: "east", tour: { topic: "overview", label: "Island platform and chamber" } },
        ],
        extra(site: Site): void {
          // Situ Cangkuang: a flat dark sheet at just above ground level — no banks or waves are
          // modelled, only the water's extent around the island terrace.
          site.get("lower", "nicheShadow").cap(rectOutline(LAKE.halfX, LAKE.halfZ), 0.04, [rectOutline(ISLAND.halfX + 1.2, ISLAND.halfZ + 1.2)]);
        },
        // Visitors cross the lake by raft from the east and step up onto the island.
        approach: { from: { x: 34, z: 0 }, via: [{ x: 12, z: 0, y: ISLAND.height }], topic: "island", label: "Crossing Situ Cangkuang from the east" },
      },
      textures,
    ),
};
