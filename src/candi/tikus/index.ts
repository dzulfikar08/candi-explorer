import type { StoneTextures } from "../../render/stone";
import { Vector3 } from "three";
import type { MeshBuilder, V3 } from "../../render/mesh-builder";
import { buildCompound } from "../kit/compound";
import { sunkenCourt } from "../kit/enclosure";
import { rectOutline } from "../kit/plan";
import type { Site } from "../kit/site";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Wikipedia bahasa Indonesia "Candi Tikus" (dimensions, depth, stair, basins, spouts,
 * central structure) and English Wikipedia "Trowulan" § Tikus Temple (discovery 1914, restorations
 * 1985/1989, Mount Mahameru form). Published figures: basin about 29.5 × 28.25 m, sunk about 3.5 m
 * below the surrounding ground; north stair 3.5 m wide; two square basins 3.5 × 2 m, 1.5 m deep,
 * flanking the stair foot with three andesite padma spouts each; central structure 7.65 × 7.65 m
 * near the south side with a ~2 m meru-roofed tower surrounded by 8 smaller turrets and 17
 * jaladwara spouts around the base.
 *
 * Simplifications: the pool is shown dry (as it usually is); the two ledge walkways around the rim
 * are folded into the plain sunken-court wall; the lotus-and-makara spouts are plain brick
 * projections without carving; the meru tower's flat-topped roof is a stepped brick mass.
 */

const DEPTH = 3.5;
// 29.5 m east–west × 28.25 m north–south.
const PIT = { halfX: 14.75, halfZ: 14.125 };
const STAIR_W = 3.5;

/** Miniature meru turret: a shrinking stack of brick boxes, total height 3 × half × 1.6. */
function turret(b: MeshBuilder, x: number, z: number, y: number, half: number): void {
  b.box([x - half, y, z - half], [x + half, y + half * 1.6, z + half], {});
  b.box([x - half * 0.68, y + half * 1.6, z - half * 0.68], [x + half * 0.68, y + half * 2.5, z + half * 0.68], {});
  b.box([x - half * 0.42, y + half * 2.5, z - half * 0.42], [x + half * 0.42, y + half * 3.1, z + half * 0.42], {});
}

/** A projecting water spout: a small brick nose at spout height on a wall face. */
function spout(b: MeshBuilder, at: V3, out: V3): void {
  const [x, y, z] = at;
  const [dx, , dz] = out;
  const t = 0.13;
  const min: V3 = [x + (dx < 0 ? -0.28 : 0) - (dz !== 0 ? t : 0), y - 0.13, z + (dz < 0 ? -0.28 : 0) - (dx !== 0 ? t : 0)];
  const max: V3 = [x + (dx > 0 ? 0.28 : 0) + (dz !== 0 ? t : 0), y + 0.13, z + (dz > 0 ? 0.28 : 0) + (dx !== 0 ? t : 0)];
  b.box(min, max, { bottom: true });
}

// Central Mahameru structure: 7.65 m square, pushed toward the south side, facing the north stair.
const CORE = { half: 3.825, cz: 3 };

/** Two terraced foundations, the body, a 9-turret crown and the 17 jaladwara around the foot. */
function centralStructure(site: Site): void {
  const b = site.get("lower", "masonry");
  const y0 = -DEPTH;
  const foot = site.get("lower", "floor");
  foot.cap(rectOutline(CORE.half, CORE.half, 0, CORE.cz), y0 + 0.02);
  // Two terraced foundations (the published plan says the building rose on two terraces).
  b.box([-CORE.half, y0, CORE.cz - CORE.half], [CORE.half, y0 + 1.1, CORE.cz + CORE.half], {});
  const h2 = 2.7;
  b.box([-h2, y0 + 1.1, CORE.cz - h2], [h2, y0 + 2.1, CORE.cz + h2], {});
  // Body block with the central tower on top.
  const hb = 1.75;
  b.box([-hb, y0 + 2.1, CORE.cz - hb], [hb, y0 + 3.5, CORE.cz + hb], {});
  turret(b, 0, CORE.cz, y0 + 3.5, 1.05);
  // Eight smaller turrets ring the central one on the second terrace.
  for (const [x, z] of [[-2, -2], [0, -2], [2, -2], [-2, 0], [2, 0], [-2, 2], [0, 2], [2, 2]] as const) {
    turret(b, x, CORE.cz + z, y0 + 2.1, 0.42);
  }
  // 17 jaladwara spouts around the base wall, evenly spaced along the perimeter.
  const per = 4 * CORE.half * 2;
  for (let i = 0; i < 17; i++) {
    const d = ((i + 0.5) / 17) * per;
    const side = Math.floor(d / (CORE.half * 2));
    const u = (d % (CORE.half * 2)) - CORE.half;
    const out = side === 0 ? [0, 1] : side === 1 ? [1, 0] : side === 2 ? [0, -1] : [-1, 0];
    const at: V3 = side % 2 === 0 ? [u, y0 + 0.8, CORE.cz + out[1] * CORE.half] : [out[0] * CORE.half, y0 + 0.8, CORE.cz + u];
    spout(b, at, [out[0], 0, out[1]]);
  }
}

/** The two square basins flanking the stair foot, each with three padma spouts on its outer wall. */
function sideBasins(site: Site): void {
  const b = site.get("lower", "masonry");
  for (const x of [-4.1, 4.1]) {
    const z = -11.6;
    const hx = 1.75;
    const hz = 1;
    const top = -DEPTH + 1.5; // basin rims stand 1.5 m above the pool floor
    const t = 0.35;
    b.box([x - hx, -DEPTH, z + hz], [x + hx, top, z + hz + t], {}); // south wall
    b.box([x - hx, -DEPTH, z - hz - t], [x + hx, top, z - hz], {}); // north wall
    b.box([x - hx - t, -DEPTH, z - hz], [x - hx, top, z + hz], {}); // west wall
    b.box([x + hx, -DEPTH, z - hz], [x + hx + t, top, z + hz], {}); // east wall
    for (const u of [-0.8, 0, 0.8]) spout(b, [x + u, -DEPTH + 0.9, z - hz - t], [0, 0, -1]);
  }
}

const topics: Record<string, Topic> = {
  overview: {
    kicker: "Mojokerto, Jawa Timur · Majapahit, 13th–14th century CE",
    title: "Candi Tikus",
    paragraphs: [
      "A red-brick ritual bathing place (petirtaan) at the heart of the Majapahit capital of Trowulan, found in 1914 when regent Kromojoyo Adinegoro had a rat-infested mound dug open and a miniature temple came to light. Full restoration followed in 1984–1989.",
      "The building is a sunken rectangular basin about 29.5 × 28.25 m, its floor lying some 3.5 m below the surrounding ground. A 3.5 m wide stair descends into it from the north, flanked by two small basins; the structure modelled on Mount Mahameru stands toward the south side.",
      "No written source records who built it or when; the miniature meru towers suggest the 13th–14th century. Experts still debate its function: a royal bathing place, a water distribution works, or a shrine — the pool is shown dry here, as it usually stands today.",
    ],
    facts: [
      ["Basin", "29.5 × 28.25 m"],
      ["Sunk", "≈ 3.5 m below ground"],
      ["Found", "1914"],
      ["Restored", "1984–1989"],
    ],
  },
  mahameru: {
    kicker: "The central structure",
    title: "A brick Mount Mahameru",
    paragraphs: [
      "Facing the stair from the south side stands a square building 7.65 m across. It rose on two terraced foundations, on which a central tower about 2 m high with a flat-topped meru roof was surrounded by eight smaller turrets of the same kind — a brick miniature of the holy Mount Mahameru, source of the elixir of immortality.",
      "Seventeen jaladwara spouts in the shape of lotus flowers and makaras line the base wall, ready to pour water into the basin. Two brick sizes and two styles of spout suggest the complex was built in more than one stage.",
    ],
    facts: [
      ["Footprint", "7.65 × 7.65 m"],
      ["Turrets", "1 central + 8"],
      ["Spouts", "17 jaladwara"],
    ],
  },
  basins: {
    kicker: "The pool",
    title: "Stairs, basins and spouts",
    paragraphs: [
      "The entrance is on the north side, down a 3.5 m wide stair to the floor of the basin. Left and right of the stair foot sit two square basins 3.5 × 2 m and 1.5 m deep, each with three padma (lotus) spouts of andesite stone in its outer wall.",
      "A narrow ledge runs around the structure at ground level, and a second, wider walkway lies about a metre lower around the pool edge. In this model the water is omitted: the basin is usually dry, and the ledges are simplified into the retaining wall.",
    ],
    facts: [
      ["Stair", "3.5 m wide, north"],
      ["Side basins", "3.5 × 2 m, 1.5 m deep"],
      ["Padma spouts", "3 per basin"],
    ],
  },
};

export const tikus: CandiDefinition = {
  id: "tikus",
  name: "Tikus",
  location: "Mojokerto, Jawa Timur",
  site: { lat: -7.3424, lon: 112.3807 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "mahameru", label: "Mahameru tower", anchor: [0, -1, CORE.cz], view: { position: [1, -0.5, -9], target: [0, -1, CORE.cz] } },
    { topic: "basins", label: "Side basins", anchor: [-4.1, -2.4, -11.6], view: { position: [3, -1.2, -2.5], target: [-2.5, -2.8, -11.8] } },
    { topic: "overview", label: "The sunken petirtaan", anchor: [-PIT.halfX, 0.5, 6], view: { position: [-32, 9, -27], target: [0, -2.5, 0] } },
  ],
  horizon: [
    { name: "Penanggungan", lat: -7.617, lon: 112.681, relativeHeight: 1620, kind: "volcano" },
    { name: "Arjuno", lat: -7.705, lon: 112.476, relativeHeight: 3310, kind: "volcano" },
    { name: "Welirang", lat: -7.725, lon: 112.58, relativeHeight: 3120, kind: "volcano" },
  ],
  orbit: { position: [-30, 14, 22], target: [0, -2.5, 0] },
  realms: {
    lower: "Bhurloka · foot",
    middle: "Bhuvarloka · body",
    upper: "Svarloka · roof",
  },
  setting: { plazaRadius: 70, shadowExtent: 30, approach: { x: 0, z: -1, start: 40 }, pit: PIT },
  build: (textures: StoneTextures) =>
    buildCompound(
      {
        name: "Tikus",
        fabric: "brick",
        shrines: [],
        extra(site) {
          sunkenCourt(site, { ...PIT, depth: DEPTH, stairs: ["north"], stairWidth: STAIR_W });
          centralStructure(site);
          sideBasins(site);
        },
        approach: {
          from: { x: 0, z: -55 },
          topic: "overview",
          label: "Down into the petirtaan",
          via: [
            { x: 0, z: -14.75 },
            { x: 0, z: -9, y: -DEPTH },
            { x: 0, z: -4, y: -DEPTH },
          ],
        },
        walkSpawn: { position: new Vector3(0, 0, -55), yaw: Math.PI },
      },
      textures,
    ),
};
