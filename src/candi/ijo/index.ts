import { Matrix4 } from "three";
import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { TerraceSpec } from "../kit/enclosure";
import { linggaYoni } from "../kit/ornaments";
import { placement, rectOutline, type Vec2 } from "../kit/plan";
import { Parts } from "../kit/site";
import { block, type ShrineSpec } from "../kit/shrine";
import type { CandiDefinition, Topic } from "../types";

/**
 * Candi Ijo — a Hindu sanctuary climbing the western slope of Gumuk Ijo hill (part of the
 * Baturagung ridge) in Sleman, drawn west-to-east up eleven stepped terraces to the main temple.
 *
 * Sources: Wikipedia "Ijo Temple" (English) and "Candi Ijo" (Indonesian — quoting the on-site
 * information board: 17 structures on 11 terraces; main temple 18.43 × 18.45 m, 16 m tall, west
 * entrance with door sill ≈ 1.2 m, lingga-yoni borne by nagas; perwara south 5.19 × 5.17 m /
 * 6.62 m, middle 6.30 × 5.15 m / 6.50 m with a nandi and padmasana inside, north 5.11 × 5.11 m /
 * 6.30 m; eight lingga patok found in the upper yard; buildings on terraces 1, 4, 5, 8 and 9;
 * the name "wuang hijo" in the Poh inscription of 906 CE). Horizon figures: Merapi 2,918 m and
 * Merbabu 3,145 m (Wikipedia) minus the temple's ≈ 410 m elevation; the Baturagung zone rises
 * 200–700 m and Pegunungan Sewu 0–300 m (English Wikipedia "Gunung Kidul Regency"). Andesite
 * masonry: jogjacagar.jogjaprov.go.id records andesite finds from Bukit Ijo.
 *
 * Simplifications (visible): the eleven real terraces are compressed onto one axis with stairs on
 * their west ends only, each retaining wall drawn 1.5 m high (individual heights are not
 * published); the three perwara share one ≈ 5.2 m wide / 6.4 m tall design; the triplet of niches
 * per wall face (centre higher), rhombus-perforated windows, antefixes and the gana frieze are
 * beyond the kit and left unmodelled; the niches are drawn empty as found, the statues lost; the
 * terrace-8 temple shown standing is the one of the western clusters restored in 2013.
 */

/** Retaining-wall height of one terrace step; per-terrace heights are not published. */
const STEP = 1.5;
/** Floor of the uppermost terrace, the yard of the main complex. */
const YARD = 11 * STEP;

/** West face, east face and half width across the hill (north–south) of each terrace, low to high. */
const TERRACES: readonly { xw: number; xe: number; floor: number; halfZ: number }[] = [
  { xw: -70, xe: -50, floor: 1.5, halfZ: 16 },
  { xw: -50.6, xe: -38, floor: 3, halfZ: 16 },
  { xw: -38.6, xe: -28, floor: 4.5, halfZ: 16 },
  { xw: -28.6, xe: -14, floor: 6, halfZ: 16 },
  { xw: -14.6, xe: -2, floor: 7.5, halfZ: 16 },
  { xw: -2.6, xe: 8, floor: 9, halfZ: 16 },
  { xw: 8.6, xe: 18, floor: 10.5, halfZ: 16 },
  { xw: 18.6, xe: 32, floor: 12, halfZ: 16 },
  { xw: 32.6, xe: 42, floor: 13.5, halfZ: 16 },
  { xw: 42.6, xe: 50, floor: 15, halfZ: 16 },
  { xw: 50.6, xe: 96, floor: 16.5, halfZ: 24 },
];

/**
 * Main temple: 18.43 × 18.45 m square pedestal (half 9.2), 16 m tall. The pedestal top puts the
 * door sill at the published 1.2 m above the yard; roof stages give the stepped-pyramid profile
 * with the kit's corner-and-face ratna rows standing in for the rows of three ratna per side.
 */
const MAIN: ShrineSpec = {
  plinths: [{ half: 9.2, height: 0.8 }],
  foot: { half: 6.6, height: 0.4 },
  body: { half: 3.4, height: 5.8, wall: 1 },
  door: { width: 1.5, height: 3 },
  doors: ["west"],
  stairs: ["west"],
  stairWidth: 2.4,
  roof: { tiers: 3, first: 2.6, shrink: 0.78, finial: "ratna" },
  crown: { kind: "ratna", height: 2.6 },
  image: { kind: "lingga", height: 1.7 },
  niches: "empty",
};

/**
 * Perwara: drawn as one design of ≈ 6.4 m (published heights 6.30–6.62 m) and ≈ 5.2 m wide
 * (5.11–6.30 m), east-facing with a cella; the rhombus windows are not modelled.
 */
const PERWARA: ShrineSpec = {
  foot: { half: 2.6, height: 0.5 },
  body: { half: 1.9, height: 2.3, wall: 0.6 },
  door: { width: 0.8, height: 1.6 },
  doors: ["east"],
  stairWidth: 1.2,
  roof: { tiers: 3, first: 1, shrink: 0.8, finial: "ratna" },
  crown: { kind: "ratna", height: 1.2 },
};

/** The middle perwara shielded a nandi and a stone padmasana table; the side chambers were empty. */
const PERWARA_NANDI: ShrineSpec = { ...PERWARA, image: { kind: "bull", height: 1.1 } };

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Sleman, DI Yogyakarta · 10th–11th century CE",
    title: "Candi Ijo",
    paragraphs: [
      "A Shiva sanctuary on the western slope of Gumuk Ijo hill, part of the Baturagung ridge about 4 km south-east of Ratu Boko, at around 410 m above sea level. The hill's name is old: the Poh inscription of 906 CE already speaks of the 'people of Ijo' (wuang hijo).",
      "The compound climbs the slope from west to east as stepped terraces — 17 structures on 11 terraces according to the site's information board, most of them ruins still under excavation, with more than ten perwara thought to remain buried in the lower slopes. The fenced flat of the main complex covers about 0.8 ha, and finds on the mined northern and eastern slopes suggest the sanctuary was once far larger.",
      "The restored main temple crowns the highest terrace, facing west towards three perwara. From its yard the ground falls away to the rice fields, Yogyakarta and the runway of Adisucipto airport — which is why the site is best known for its sunsets.",
    ],
    facts: [
      ["Terraces", "11, with 17 structures"],
      ["Elevation", "≈ 410 m"],
      ["Built", "10th–11th century CE"],
      ["Named in", "Poh inscription, 906 CE"],
    ],
  },
  main: {
    kicker: "The main temple",
    title: "Lingga on nagas, roof of ratnas",
    paragraphs: [
      "A square temple, 18.43 × 18.45 m at the base and 16 m tall, standing on a tall plain pedestal. Its only entrance faces west, the door sill about 1.2 m above the yard, reached by a stair flanked by makaras whose mouths hold carved parrots; a stacked Kala head grins over the door, and two false windows flank it.",
      "Inside stands a large lingga on its yoni, borne by naga figures — Shiva united with Parvati, the earth upheld by the serpents. The north, east and south walls each carry three kala-makara niches, the centre one higher; they are empty today, the statues lost.",
      "The roof rises in three receding stages, each side adorned with a row of three ratna and a larger ratna crowning the whole; along the edge run antefixes framing busts of gods. This model draws the ratna rows as the kit's corner finials and leaves the antefixes aside.",
    ],
    facts: [
      ["Base", "18.43 × 18.45 m"],
      ["Height", "16 m"],
      ["Door sill", "≈ 1.2 m above the yard"],
      ["Chamber", "Lingga-yoni borne by nagas"],
    ],
  },
  perwara: {
    kicker: "The three perwara",
    title: "Trimurti before the master",
    paragraphs: [
      "In front of the main temple stand three smaller shrines, facing east towards it and honouring the Trimurti — Brahma, Vishnu and Shiva. Each has a walk-in cella, windows perforated in a rhombus pattern, and a three-stage roof crowned with rows of ratna.",
      "The site board measures them individually: the southern at 5.19 × 5.17 m and 6.62 m tall, the middle at 6.30 × 5.15 m and 6.50 m, the northern at 5.11 × 5.11 m and 6.30 m. The middle chamber held a nandi — Shiva's bull — on a stone padmasana table; the side chambers were found empty. One shared design of about 5.2 m and 6.4 m stands in for the three here.",
    ],
    facts: [
      ["Facing", "East, towards the main temple"],
      ["Dedication", "Trimurti"],
      ["Middle chamber", "Nandi and padmasana"],
      ["Heights", "6.30–6.62 m"],
    ],
  },
  terraces: {
    kicker: "The lower terraces",
    title: "Ruins down the slope",
    paragraphs: [
      "Below the upper yard the sanctuary steps down the hill. The board records a building base facing east on terrace 9; on terrace 8 three temples and four bases, one temple of these western clusters restored in 2013; a temple and two bases on terrace 5; and one temple each on terraces 4 and 1. Terraces 2, 3, 6, 7 and 10 carry no buildings.",
      "Excavation continues: more than ten perwara are believed still buried in these slopes. In the upper yard itself, excavation found eight pylon linggas at the points of the compass — drawn here ringing the lawn.",
    ],
    facts: [
      ["Upper yard", "Main temple and 3 perwara"],
      ["Terrace 8", "3 temples, 4 building bases"],
      ["Still buried", "More than 10 perwara"],
      ["Upper yard ring", "8 pylon linggas"],
    ],
  },
};

/** Walk waypoints up every terrace flight (x, z, floor height): bottom and top of each stair. */
const CLIMB: readonly [number, number, number][] = [
  [-73.5, 0, 0],
  [-72.7, 0, 0],
  [-69.6, 0, 1.5],
  [-53.3, 0, 1.5],
  [-50.2, 0, 3],
  [-41.3, 0, 3],
  [-38.2, 0, 4.5],
  [-31.3, 0, 4.5],
  [-28.2, 0, 6],
  [-17.3, 0, 6],
  [-14.2, 0, 7.5],
  [-5.3, 0, 7.5],
  [-2.2, 0, 9],
  [5.7, 0, 9],
  [8.8, 0, 10.5],
  [15.7, 0, 10.5],
  [18.8, 0, 12],
  [29.7, 0, 12],
  [32.8, 0, 13.5],
  [39.7, 0, 13.5],
  [42.8, 0, 15],
  [47.7, 0, 15],
  [51.5, 0, YARD],
  [58, 10, YARD],
  [70, 10, YARD],
];

export const ijo: CandiDefinition = {
  id: "ijo",
  name: "Ijo",
  location: "Sleman, DI Yogyakarta",
  site: { lat: -7.7839, lon: 110.512 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "main", label: "Main temple", anchor: [74.8, 24, 0], view: { position: [56, 26, 34], target: [84, 21, 0] } },
    { topic: "perwara", label: "The three perwara", anchor: [66, 20, 6], view: { position: [52, 21, 24], target: [66, 19, 1] } },
    { topic: "terraces", label: "Terrace 8 shrine", anchor: [26, 15, -5], view: { position: [10, 17, 16], target: [26, 14, -4] } },
    { topic: "overview", label: "Terraces up the hill", anchor: [-8, 8.2, 14], view: { position: [-100, 12, 55], target: [-15, 8, 0] } },
  ],
  horizon: [
    { name: "Merapi", lat: -7.5407, lon: 110.4457, relativeHeight: 2510, kind: "volcano" },
    { name: "Merbabu", lat: -7.455, lon: 110.44, relativeHeight: 2735, kind: "volcano" },
    // Baturagung crest east of the temple (zone 200–700 m asl, temple ≈ 410 m).
    { name: "Baturagung ridge", lat: -7.8, lon: 110.6, relativeHeight: 240, kind: "ridge" },
    // The Gunungkidul limestone hills stand ≈ 600 m asl, barely above the temple's own 410 m.
    { name: "Gunungkidul hills", lat: -7.83, lon: 110.55, relativeHeight: 190, kind: "ridge" },
  ],
  orbit: { position: [0, 65, 40], target: [75, 20, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 105, shadowExtent: 100, approach: { x: -1, z: 0, start: 110 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Ijo",
        terraces: TERRACES.map((t): { spec: TerraceSpec; at: Vec2 } => ({
          spec: { halfX: (t.xe - t.xw) / 2, halfZ: t.halfZ, height: STEP, y: t.floor - STEP, stairs: ["west"], stairWidth: 2.2 },
          at: { x: (t.xw + t.xe) / 2, z: 0 },
        })),
        extra(site) {
          // Eight pylon linggas at the compass points of the upper yard, and the low building
          // bases (batur) the board records on terraces 5, 8 and 9.
          const patok = site.get("lower", "statue");
          for (const [x, z] of [
            [95, 0],
            [88.85, 14.85],
            [74, 21],
            [59.15, 14.85],
            [53, 0],
            [59.15, -14.85],
            [74, -21],
            [88.85, -14.85],
          ] as const) {
            patok.geometry(linggaYoni(), placement(x, YARD, z, "east").multiply(new Matrix4().makeScale(1.2, 1.6, 1.2)));
          }
          const bases = new Parts();
          for (const [x, z, hx, hz, floor] of [
            [-11, 4, 2.2, 1.8, 7.5],
            [-5, 5.5, 2.2, 1.8, 7.5],
            [21, 1, 2.2, 1.8, 12],
            [24, 6.5, 2.2, 1.8, 12],
            [30, -8, 2.2, 1.8, 12],
            [37, 0, 2.6, 2, 13.5],
          ] as const) {
            block(bases, "lower", rectOutline(hx, hz, x, z), floor, floor + 0.8);
          }
          site.place(bases.build(), new Matrix4());
        },
        shrines: [
          { spec: PERWARA_NANDI, at: { x: 66, z: 0 }, y: YARD, facing: "east", tour: { topic: "perwara", label: "The perwara of the Trimurti" } },
          { spec: MAIN, at: { x: 84, z: 0 }, y: YARD, facing: "west", tour: { topic: "main", label: "The main temple" } },
          { spec: PERWARA, at: { x: 26, z: -5 }, y: 12, facing: "east" },
          { spec: PERWARA, at: { x: 22, z: 3 }, y: 12, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: 29, z: 4 }, y: 12, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -8, z: -4 }, y: 7.5, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -22, z: 4 }, y: 6, facing: "east", ruined: true },
          { spec: PERWARA, at: { x: -60, z: -3 }, y: 1.5, facing: "east", ruined: true },
        ],
        approach: {
          from: { x: -110, z: 0 },
          topic: "overview",
          label: "Climbing the terraces",
          via: CLIMB.map(([x, z, y]) => ({ x, z, y })),
        },
      },
      textures,
    ),
};
