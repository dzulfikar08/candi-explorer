import type { StoneTextures } from "../../render/stone";
import { buildCompound } from "../kit/compound";
import type { ShrineSpec } from "../kit/shrine";
import type { Site } from "../kit/site";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources:
 * - Wikipedia "Gedong Songo" (en, citing Degroot, Vogler, Soekmono, Williams/Dumarcay): nine Hindu
 *   temples in five groups on a hill at ~1,270 m on the slopes of Gunung Ungaran near Bandungan,
 *   Semarang Regency; dated variously 8th–9th century (Vogler: 9th c., a century after Dieng phase
 *   III; Soekmono: 8th c.; Williams/Dumarcay: 780–830 CE); all dedicated to Shiva; Gedong I–II on
 *   the east side of the hill, III–IV to the north, V to the west; Gedong Songo III is a Shiva
 *   temple paired with a facing Nandi shrine and a Parvati shrine beside it; a vestibule at group
 *   III decorated with guardian figures; later associated inscription of 1382 CE; badly ruined when
 *   rediscovered in the 19th century, considerably restored since.
 * - Indonesian Wikipedia "Candi Gedong Songo": first reported by Loten in 1740; reported to
 *   Raffles in 1840 (as Candi Banyukuning) but recorded in his History of Java (1817) as "Gedong
 *   Pitoe" — seven buildings; van Braam published drawings in 1825 (now Museum Leiden);
 *   Friederich and Hoopermans wrote about the site in 1865; Gedong I restored 1928–1929, Gedong II
 *   1930–1931; Gedong III, IV and V restored 1977–1978; overall site consolidation 1972–1982; the
 *   temples still serve Hindu worship.
 * - Travellerspoint wiki guide (contributor theo1006, walking the site): the round walk is about
 *   2.5 km over five sites rising from ~1,240 m to 1,308 m; site 1 has one restored temple; site 2
 *   one restored temple plus perwara rubble; site 3 three restored buildings, its main temple
 *   still bearing all five niche statues — Mahakala, Nandisvara, Durga, Ganesha and Agastya; a
 *   crevice between sites 3 and 4 holds fumaroles and a sulphurous hot spring (bathing rooms); a
 *   Hanuman statue stands in the pines beyond site 3; site 4 is three close groups, the main one
 *   of eight buildings of which one is restored, two more restored in 2009, the third only rubble;
 *   site 5 (1,308 m) spreads over two terraces, one temple restored, still holding its Ganesha
 *   statue in its east wall; clear-day views south to Telomoyo (1,893 m) and Merbabu (3,142 m).
 * - ExploreSunda, "Candi Gedong Songo": GPS -7.20389, 110.338; hot springs believed to cure skin
 *   disease; temples still used for Hindu ceremony; horse trail between the groups.
 * - Gunung Ungaran (2,050 m, 7°11′40″S 110°20′30″E), "Gunung Merbabu" (3,145 m), "Gunung
 *   Telomoyo" (1,894 m) plus the Dieng-dossier coordinates for Sindoro and Sumbing for the horizon.
 *
 * Simplifications: real shrines are small (about 5–7 m); no authoritative per-temple dimensions
 * were found, so the kit's Dieng-like proportions are used at estimated sizes. The 2.5 km hill walk
 * is compressed to ~150 m of modelled slope, the five sites standing on stepped terraces at rising
 * heights. Facing directions are drawn uniformly west — the kit and sources give no per-group
 * orientation, and a west-facing Ganesha niche at site 5 implies a west front. Only the eight
 * restored buildings are modelled (one main shrine per group, three at site 3, two small ones at
 * site 4) plus rubble remains for the rest; the hot-spring pool is water but the fumarole steam is
 * not modelled. Raffles' "Gedong Pitoe" count of seven versus the name's "nine" reflects how
 * loosely the buildings are grouped; the model shows nine standing shrines plus ruins.
 */

/** Dieng-style main shrine, ~7 m: square cella, three shrinking roof tiers, ratna bud. */
const MAIN: ShrineSpec = {
  plinths: [{ half: 2.7, height: 0.6 }],
  foot: { half: 2.2, height: 0.8, relief: true },
  body: { half: 1.75, height: 2.2, wall: 0.7 },
  door: { width: 0.95, height: 1.8 },
  doors: ["east"],
  stairWidth: 1.1,
  bay: { width: 0.5, depth: 0.2 },
  roof: { tiers: 3, first: 1.3, shrink: 0.72, finial: "ratna" },
  crown: { kind: "ratna", height: 0.7 },
  image: { kind: "lingga", height: 0.9 },
  niches: "deity",
};

/** Small companion shrine (~5 m): plain plinth, niche on the front only. */
const SMALL: ShrineSpec = {
  plinths: [{ half: 1.7, height: 0.45 }],
  foot: { half: 1.4, height: 0.55 },
  body: { half: 1.1, height: 1.6, wall: 0.5 },
  door: { width: 0.8, height: 1.5 },
  doors: ["east"],
  stairWidth: 0.9,
  bay: { width: 0.4, depth: 0.12 },
  roof: { tiers: 2, first: 0.9, shrink: 0.72, finial: "ratna" },
  crown: { kind: "ratna", height: 0.5 },
  image: { kind: "deity", height: 0.7 },
  niches: "empty",
};

/** Platform heights up the hillside: five sites from ~1,240 m to 1,308 m in the model's 3 m steps. */
const G1 = 0;
const G2 = 3;
const G3 = 6;
const G4 = 9;
const G5 = 12;
const G5_UPPER = 14.5;

/** Sulphurous hot spring in the crevice between sites 3 and 4, sunk in a hollow east of the path. */
function hotSpring(site: Site): void {
  site.get("lower", "water").box([-12, 0.15, -102], [-4, 0.6, -94]);
  const rock = site.get("lower", "masonry");
  // Rim of andesite blocks around the pool, open to the path on the west side.
  rock.box([-13, 0, -103], [-12, 1.2, -93]);
  rock.box([-4, 0, -103], [-3, 1.3, -93]);
  rock.box([-12, 0, -103], [-4, 1.4, -102]);
  // Bathing shed (concrete rooms in reality, kept as a plain block) on the uphill side.
  rock.box([-12, 0, -94.5], [-4, 2.2, -93.5]);
}

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Semarang, Jawa Tengah · 8th–9th century CE",
    title: "Candi Gedong Songo",
    paragraphs: [
      "Nine small Shiva temples in five groups stud the southern slope of Gunung Ungaran between 1,240 and 1,308 m above sea level, among pine woods and hot volcanic springs. With Dieng they are among the oldest Hindu sanctuaries in Java — dated to the 8th or early 9th century, depending on the scholar — and they stand among the many sites attributed to the Sanjaya line of Mataram.",
      "A visit is a walk: a path of about two and a half kilometres climbs site by site up the hill, each group in a clearing of its own. The temples were already ruins when first recorded in 1740; Raffles knew them as 'Gedong Pitoe', seven buildings, and only later surveying brought the count to the name's 'songo', nine. Dutch restorers rebuilt the first two groups around 1930, the upper three in 1977–1978.",
      "The shrines follow the Dieng manner — square cella under steep tiered roofs — but with richer plinth and cornice mouldings, and several have a porch extended on the base. The temples are still used for Hindu ceremony, and on a clear day the path south looks down the valley to Telomoyo and Merbabu, the two volcanoes that close the view.",
    ],
    facts: [
      ["Temples", "9 in 5 groups"],
      ["Built", "8th–9th century (dated variously)"],
      ["Dedicated to", "Shiva"],
      ["Altitude", "1,240–1,308 m"],
    ],
  },
  group1: {
    kicker: "First site",
    title: "Gedong I",
    paragraphs: [
      "The lowest group stands a short walk from the park entrance and holds a single restored temple — one of the two found last and one of the first to be rebuilt, in 1928–1929 on Dutch excavations of the previous decade.",
      "Its form is the classic early formula: a square plinth, a porch with a stair, a cube-like cella and a steep stack of shrinking roof storeys ending in a ratna bud, in close imitation of the temples of the Dieng plateau.",
    ],
    facts: [
      ["Site", "Lowest of the five"],
      ["Restored", "1928–1929"],
      ["Temple", "1"],
    ],
  },
  group3: {
    kicker: "Third site · the main group",
    title: "Gedong III",
    paragraphs: [
      "The largest group, on a terrace at about 1,297 m, keeps three restored buildings — a Shiva temple with a facing Nandi and a companion shrine beside it, with traces of more. Its vestibule is decorated with guardian figures.",
      "The main temple is the most complete of the whole complex: all five wall niches still hold their statues — the door guardians Mahakala and Nandisvara, and Durga, Ganesha and Agastya, the standard images of a Shiva sanctuary. Beyond the group a modern Hanuman statue stands among the pines, placed by no one knows whom.",
    ],
    facts: [
      ["Buildings restored", "3"],
      ["Pairing", "Shiva shrine with facing Nandi"],
      ["Niches", "Mahakala · Nandisvara · Durga · Ganesha · Agastya"],
    ],
  },
  spring: {
    kicker: "The crevice",
    title: "Hot springs",
    paragraphs: [
      "Between the third and fourth sites the path drops into a crack in the hillside where volcanic heat still works: fumaroles exhale and a sulphurous spring fills bathing rooms, its water credited with curing skin disease.",
      "The active volcanism is a reminder of why the plateau is holy ground — the temples stand on the shoulder of a dormant volcano, and the sulfur smell mingles with the incense of the ceremonies still held at the shrines.",
    ],
    facts: [
      ["Water", "Sulphurous hot spring"],
      ["Belief", "Cures skin disease"],
    ],
  },
  group4: {
    kicker: "Fourth site",
    title: "Gedong IV",
    paragraphs: [
      "Across the crevice the hillside carries three close temple groups: the largest once held eight buildings of which one has been re-erected, a second pair was restored in 2009, and the third survives only as rubble on the terrace.",
      "The scatter shows how the sanctuaries worked — not lone towers but little courts of main shrine and companions, most of which now lie in heaps of andesite around the survivors.",
    ],
    facts: [
      ["Main group", "8 buildings, 1 restored"],
      ["Second group", "2 restored, 2009"],
      ["Third group", "Rubble"],
    ],
  },
  group5: {
    kicker: "Fifth site · the summit",
    title: "Gedong V",
    paragraphs: [
      "The last group, at 1,308 m the highest of the five, spreads over two terraces reached by steep stairs that horses cannot climb. One temple has been restored, and inside its east wall the Ganesha statue still sits in its niche — one of very few images left in place.",
      "From the terrace the reward is the view: south over the valley the line of Telomoyo and Merbabu closes the horizon, and on clear days even the great cones of Sindoro and Sumbing are visible to the west.",
    ],
    facts: [
      ["Altitude", "1,308 m"],
      ["Terraces", "2"],
      ["Kept image", "Ganesha in the east wall"],
    ],
  },
};

export const gedongSongo: CandiDefinition = {
  id: "gedong-songo",
  name: "Gedong Songo",
  location: "Semarang, Jawa Tengah",
  site: { lat: -7.2085, lon: 110.3418 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "overview", label: "The hillside", anchor: [4, 8, -70], view: { position: [-30, 26, 40], target: [2, 6, -70] } },
    { topic: "group1", label: "Gedong I", anchor: [0, 4, 0], view: { position: [-14, 4.5, 9], target: [0, 3, 0] } },
    { topic: "group3", label: "Gedong III · the niche statues", anchor: [4, 8.5, -75], view: { position: [-10, 9.5, -62], target: [4, 6.5, -75] } },
    { topic: "spring", label: "Hot spring", anchor: [-8, 1.5, -98], view: { position: [-20, 5, -88], target: [-8, 0.5, -98] } },
    { topic: "group5", label: "Gedong V", anchor: [0, 18.5, -145], view: { position: [-16, 17, -130], target: [0, 15, -145] } },
  ],
  horizon: [
    // Site elevation ~1,250 m; summit heights from Wikipedia/Wikidata.
    { name: "Gunung Ungaran", lat: -7.1944, lon: 110.3417, relativeHeight: 800, kind: "volcano" },
    { name: "Gunung Merbabu", lat: -7.4547, lon: 110.4417, relativeHeight: 1895, kind: "volcano" },
    { name: "Gunung Telomoyo", lat: -7.375, lon: 110.298, relativeHeight: 644, kind: "volcano" },
    { name: "Gunung Sindoro", lat: -7.3011, lon: 109.9967, relativeHeight: 1903, kind: "volcano" },
    { name: "Gunung Sumbing", lat: -7.385, lon: 110.0725, relativeHeight: 2121, kind: "volcano" },
  ],
  orbit: { position: [-110, 105, 60], target: [0, 7, -70] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 170, shadowExtent: 170, approach: { x: 0, z: 1, start: 65 } },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Gedong Songo",
        // Only the eight re-erected buildings stand; the rest of the ~20 known structures are rubble.
        shrines: [
          // Site 1: single temple (real walk: ~1,240 m).
          { spec: MAIN, at: { x: 0, z: 0 }, y: G1, facing: "west", tour: { topic: "group1", label: "Gedong I" } },
          // Site 2: one restored temple, its perwara a heap.
          { spec: MAIN, at: { x: -6, z: -40 }, y: G2, facing: "west", tour: { topic: "overview", label: "Gedong II" } },
          { spec: SMALL, at: { x: -2.5, z: -37 }, y: G2, facing: "west", ruined: true },
          // Site 3: Shiva temple with facing Nandi and a companion shrine; more existed.
          { spec: MAIN, at: { x: 4, z: -75 }, y: G3, facing: "west", tour: { topic: "group3", label: "Gedong III · main temple" } },
          { spec: SMALL, at: { x: -1, z: -75 }, y: G3, facing: "east", tour: { topic: "group3", label: "Nandi shrine" } },
          { spec: SMALL, at: { x: 4, z: -80 }, y: G3, facing: "west" },
          { spec: SMALL, at: { x: 8.5, z: -72 }, y: G3, facing: "west", ruined: true },
          // Site 4: three close groups — one restored main, two 2009 restorations, one rubble.
          { spec: MAIN, at: { x: 12, z: -110 }, y: G4, facing: "west", tour: { topic: "group4", label: "Gedong IV" } },
          { spec: SMALL, at: { x: 7, z: -113 }, y: G4, facing: "west" },
          { spec: SMALL, at: { x: 16, z: -114 }, y: G4, facing: "west" },
          { spec: SMALL, at: { x: 13, z: -106 }, y: G4, facing: "south", ruined: true },
          // Site 5: one restored temple on the upper of two terraces.
          { spec: MAIN, at: { x: 0, z: -145 }, y: G5_UPPER, facing: "west", tour: { topic: "group5", label: "Gedong V" } },
        ],
        courts: [
          { halfX: 12, halfZ: 9, cx: 4, cz: -75, y: G3 },
          { halfX: 11, halfZ: 8, cx: 11, cz: -110, y: G4 },
          { halfX: 10, halfZ: 8, cx: 0, cz: -145, y: G5 },
          { halfX: 7, halfZ: 6, cx: 0, cz: -145, y: G5_UPPER },
        ],
        terraces: [
          { spec: { halfX: 14, halfZ: 10, height: G2, stairs: ["south"], stairWidth: 2 }, at: { x: -6, z: -40 } },
          { spec: { halfX: 14, halfZ: 11, height: G3 - G2, y: G2, stairs: ["south"], stairWidth: 2 }, at: { x: 3, z: -74 } },
          { spec: { halfX: 14, halfZ: 10, height: G4 - G3, y: G3, stairs: ["south"], stairWidth: 2 }, at: { x: 11, z: -110 } },
          { spec: { halfX: 12, halfZ: 10, height: G5 - G4, y: G4, stairs: ["south"], stairWidth: 2 }, at: { x: 0, z: -145 } },
          { spec: { halfX: 9, halfZ: 7, height: G5_UPPER - G5, y: G5, stairs: ["south"], stairWidth: 1.6 }, at: { x: 0, z: -145 } },
        ],
        extra: hotSpring,
        // The 2.5 km hill walk is compressed; the tour follows it site by site.
        approach: {
          from: { x: 0, z: 55 },
          topic: "overview",
          label: "The walk up the hill",
          via: [
            { x: 0, z: 15, y: G1 },
            { x: -6, z: -32, y: G2 },
            { x: 3, z: -66, y: G3 },
            { x: 11, z: -102, y: G4 },
          ],
        },
      },
      textures,
    ),
};
