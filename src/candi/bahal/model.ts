import { LatheGeometry, Matrix4, Vector2, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import type { MeshBuilder } from "../../render/mesh-builder";
import { court } from "../kit/enclosure";
import { makara } from "../kit/ornaments";
import { type Direction, DIRECTIONS, offsetLoop, placement, rectOutline, type Vec2 } from "../kit/plan";
import { ruin } from "../kit/ruin";
import { block, stairRun, walls, type ShrineSpec } from "../kit/shrine";
import { type Part, Parts, Site } from "../kit/site";
import { eye, loop, path } from "../kit/tour";
import type { CandiModel, Realm, TourSection } from "../types";

/**
 * Candi Bahal I, drawn facing east. The published dimensions come from the National Library of
 * Indonesia's "Kepustakaan Candi" entry: courtyard of about 3000 m² walled in brick about 1 m thick
 * and 60 cm high, a gate floor projecting 7 m east flanked by 70 cm walls with stairs at its north
 * and south ends, a 7 × 7 m platform with east and west stairs between gate and temple, a main
 * temple of tatakan (7 m square, 1.8 m high), kaki (6 m square, 75 cm), tubuh (5 m square, chamber
 * 3 m square inside 1 m walls, doorway 1.2 × 2.5 m reached by a 60 cm stair from the foot) and a
 * cylindrical roof about 2.5 m high. The body's height and the cornice profiles are not published;
 * they are estimated from photographs (drum roughly as tall as the body, total ≈ 9 m). The form
 * above the drum is unknown and is left flat, as it stands today. The small foundations (3 m and
 * 2.5 m squares in a row on the south, a 2.5 m ruin in the north-west) have no recorded height.
 */

// Tatakan: 7 m square, 1.8 m high, with the 4 × 2 m projecting walkway east of the stair.
const PLINTH = { half: 3.5, height: 1.8 };
const WALK = { reach: 7.5, halfZ: 1 };
// Kaki: 6 m square, 0.75 m tall, leaving a 0.5 m walk around it on the tatakan.
const KAKI = { half: 3, top: PLINTH.height + 0.75 };
// Tubuh: 5 m square, walls 1 m thick, chamber 3 m square. Door 1.2 × 2.5 m on a 60 cm sill.
const BODY = { half: 2.5, top: 5.75, sillTop: KAKI.top + 0.6, door: { width: 1.2, height: 2.5 } };
// Atap: the cylinder (about 2.5 m, sitting on a square plate) with garland carving near its top.
const DRUM = { y0: 6.15, y1: 8.65, r0: 2.05, r1: 1.9 };
// Enclosure: about 3000 m² of courtyard (55 m across), wall 1 m thick and 0.6 m high, walkable.
const WALL = { half: 27.5, height: 0.6 };
const GATE = { out: 35, halfZ: 3, height: 0.65, parapet: 0.7 };

/** The tatakan outline with its east walkway, counter-clockwise seen from above. */
const PLINTH_LOOP: Vec2[] = [
  { x: PLINTH.half, z: PLINTH.half },
  { x: PLINTH.half, z: WALK.halfZ },
  { x: WALK.reach, z: WALK.halfZ },
  { x: WALK.reach, z: -WALK.halfZ },
  { x: PLINTH.half, z: -WALK.halfZ },
  { x: PLINTH.half, z: -PLINTH.half },
  { x: -PLINTH.half, z: -PLINTH.half },
  { x: -PLINTH.half, z: PLINTH.half },
];

/** The walkway alone, so the relief (dancers, giants) sits only where carvings are recorded. */
const WALK_LOOP: Vec2[] = [
  { x: WALK.reach, z: WALK.halfZ },
  { x: WALK.reach, z: -WALK.halfZ },
  { x: PLINTH.half, z: -WALK.halfZ },
  { x: PLINTH.half, z: WALK.halfZ },
];

/**
 * A stepped flight climbing the face `d` of a structure centred at (cx, cz), laterally offset u0,
 * from sBottom (out) up to the top edge sTop. Steps overlap 0.3 into the mass behind, with stepped
 * brick cheeks, as on the recorded stairways (the makara pair is placed separately).
 */
function flight(
  parts: Parts,
  d: Direction,
  cx: number,
  cz: number,
  u0: number,
  sTop: number,
  sBottom: number,
  yLow: number,
  yHigh: number,
  half: number,
): void {
  const floor = parts.get("lower", "floor");
  const masonry = parts.get("lower", "masonry");
  const v = DIRECTIONS[d];
  const at = (s: number, u: number): [number, number] => (v.x !== 0 ? [cx + v.x * s, cz + u] : [cx + u, cz + v.z * s]);
  const box = (b: MeshBuilder, s0: number, s1: number, ua: number, ub: number, ya: number, yb: number) => {
    const p = at(Math.min(s0, s1), Math.min(ua, ub));
    const q = at(Math.max(s0, s1), Math.max(ua, ub));
    b.box([p[0], ya, p[1]], [q[0], yb, q[1]]);
  };
  const n = Math.max(1, Math.ceil((yHigh - yLow) / 0.24));
  const riser = (yHigh - yLow) / n;
  const tread = (sBottom - sTop) / n;
  const cheek = 0.3;
  for (let j = 1; j <= n; j++) {
    const s1 = sTop + (n - j + 1) * tread;
    const top = yLow + j * riser;
    box(floor, sTop - 0.3, s1, u0 - half, u0 + half, yLow, top);
    box(masonry, sTop - 0.3, s1, u0 - half - cheek, u0 - half, yLow, Math.min(top + 0.5, yHigh + 0.5));
    box(masonry, sTop - 0.3, s1, u0 + half, u0 + half + cheek, yLow, Math.min(top + 0.5, yHigh + 0.5));
  }
}

/** A projecting band: wall ring on the grown loop with annular top and soffit (moulded profiles). */
function band(parts: Parts, realm: Realm, loop: Vec2[], y0: number, y1: number, grow: number): void {
  const masonry = parts.get(realm, "masonry");
  const out = offsetLoop(loop, grow);
  walls(masonry, out, y0, y1);
  masonry.cap(out, y1, [loop]);
  masonry.cap(out, y0, [loop], false);
}

/** The fallen shrine in the courtyard's north-west corner: a 2.5 m foundation under a rubble heap. */
const RUIN: ShrineSpec = {
  plinths: [{ half: 1.25, height: 0.5 }],
  foot: { half: 1, height: 0.4 },
  body: { half: 0.9, height: 1.2, wall: 0.3 },
  door: { width: 0.8, height: 1.4 },
  doors: ["east"],
  stairWidth: 1,
  roof: { tiers: 1, first: 0.8, shrink: 0.7, finial: "none" },
  crown: { kind: "none", height: 0 },
};

export function buildBahal(textures: StoneTextures): CandiModel {
  const site = new Site("Bahal I", textures, "brick");
  court(site, WALL.half - 0.5, WALL.half - 0.5);
  const lower = site.get("lower", "masonry");

  // Courtyard wall, walkable on its 1 m thickness, with the 6 m gate gap mid-east.
  lower.box([-WALL.half - 0.5, 0, -WALL.half - 0.5], [WALL.half + 0.5, WALL.height, -WALL.half + 0.5]);
  lower.box([-WALL.half - 0.5, 0, WALL.half - 0.5], [WALL.half + 0.5, WALL.height, WALL.half + 0.5]);
  lower.box([-WALL.half - 0.5, 0, -WALL.half + 0.5], [-WALL.half + 0.5, WALL.height, WALL.half - 0.5]);
  lower.box([WALL.half - 0.5, 0, -WALL.half + 0.5], [WALL.half + 0.5, WALL.height, -GATE.halfZ]);
  lower.box([WALL.half - 0.5, 0, GATE.halfZ], [WALL.half + 0.5, WALL.height, WALL.half - 0.5]);

  // Gate: a floor at wall-walk height projecting 7 m east, 70 cm walls flanking it, stairs at its
  // north and south ends (recorded for Bahal I; the Bahal II gate instead climbs from the east).
  lower.box([WALL.half + 0.5, 0, -GATE.halfZ], [GATE.out, GATE.height, GATE.halfZ]);
  lower.box([WALL.half + 0.5, GATE.height, -GATE.halfZ - 0.25], [GATE.out, GATE.height + GATE.parapet, -GATE.halfZ + 0.25]);
  lower.box([WALL.half + 0.5, GATE.height, GATE.halfZ - 0.25], [GATE.out, GATE.height + GATE.parapet, GATE.halfZ + 0.25]);
  flight(site, "east", 0, 0, -1.9, GATE.out, GATE.out + 0.9, 0, GATE.height, 0.65);
  flight(site, "east", 0, 0, 1.9, GATE.out, GATE.out + 0.9, 0, GATE.height, 0.65);

  // Main temple: tatakan (plain) plus the carved walkway rib, then the kaki.
  block(site, "lower", PLINTH_LOOP, 0, PLINTH.height);
  block(site, "lower", WALK_LOOP, 0, PLINTH.height, { relief: true });
  block(site, "lower", rectOutline(KAKI.half, KAKI.half), PLINTH.height, KAKI.top);

  // Body with a walk-in chamber. The room is recorded as empty, so nothing stands inside.
  const masonry = site.get("middle", "masonry");
  const bodyLoop = rectOutline(BODY.half, BODY.half);
  const chamberLoop = rectOutline(BODY.half - 1, BODY.half - 1);
  walls(masonry, bodyLoop, KAKI.top, BODY.sillTop);
  walls(masonry, bodyLoop, BODY.sillTop, BODY.top, {
    openings: new Map([[0, { width: BODY.door.width, height: BODY.door.height }]]),
  });
  masonry.box([-1.5, KAKI.top, -1.5], [1.5, BODY.sillTop - 0.01, 1.5], { bottom: true, top: true });
  masonry.cap(chamberLoop, BODY.sillTop);
  walls(masonry, chamberLoop, BODY.sillTop, BODY.top, {
    inward: true,
    openings: new Map([[0, { width: BODY.door.width, height: BODY.door.height }]]),
  });
  // Door reveal: jambs and soffit through the 1 m wall. The recorded frame is plain, without carving.
  const dw = BODY.door.width / 2;
  const dh = BODY.door.height;
  for (const side of [-1, 1]) {
    masonry.quad(
      [1.5, BODY.sillTop, side * dw],
      [BODY.half, BODY.sillTop, side * dw],
      [BODY.half, BODY.sillTop + dh, side * dw],
      [1.5, BODY.sillTop + dh, side * dw],
      [0, 0, -side],
    );
  }
  masonry.quad([1.5, BODY.sillTop + dh, -dw], [BODY.half, BODY.sillTop + dh, -dw], [BODY.half, BODY.sillTop + dh, dw], [1.5, BODY.sillTop + dh, dw], [0, -1, 0]);
  site.get("middle", "nicheShadow").cap(chamberLoop, BODY.top - 0.01, [], false);

  // Cornice fillets, the square plate, then the drum roof with its garland band and coping.
  band(site, "middle", bodyLoop, BODY.top, BODY.top + 0.1, 0.06);
  band(site, "middle", bodyLoop, BODY.top + 0.1, BODY.top + 0.2, 0.14);
  band(site, "middle", bodyLoop, BODY.top + 0.2, DRUM.y0 - 0.15, 0.22);
  band(site, "middle", bodyLoop, DRUM.y0 - 0.15, DRUM.y0, 0.3);
  masonry.cap(bodyLoop, DRUM.y0);
  const drum = new LatheGeometry(
    [
      [DRUM.r0, 0],
      [DRUM.r0, 0.18],
      [DRUM.r0 - 0.05, 0.3],
      [DRUM.r1, DRUM.y1 - DRUM.y0 - 0.2],
      [DRUM.r1 + 0.06, DRUM.y1 - DRUM.y0 - 0.1],
      [DRUM.r1, DRUM.y1 - DRUM.y0],
    ].map(([r, y]) => new Vector2(r, y)),
    28,
  ).translate(0, DRUM.y0, 0);
  site.get("upper", "masonry").geometry(drum, new Matrix4());
  // The garland carving recorded around the roof's edge, as a relief-textured sleeve on the drum.
  const swag = new LatheGeometry(
    [
      [DRUM.r0 - 0.02, 7.85],
      [DRUM.r1 - 0.02, 8.35],
    ].map(([r, y]) => new Vector2(r, y)),
    28,
  );
  site.get("upper", "reliefSingle").geometry(swag, new Matrix4());
  const coping = new LatheGeometry(
    [
      [DRUM.r1, DRUM.y1],
      [DRUM.r1 + 0.18, DRUM.y1 + 0.12],
      [DRUM.r1 + 0.18, DRUM.y1 + 0.22],
      [DRUM.r1 - 0.08, DRUM.y1 + 0.25],
      [0, DRUM.y1 + 0.25],
    ].map(([r, y]) => new Vector2(r, y)),
    28,
  );
  site.get("upper", "masonry").geometry(coping, new Matrix4());

  // Stairs: ground to the walkway (rise 1.8), then the climb over the foot to the door sill.
  flight(site, "east", 0, 0, 0, WALK.reach, WALK.reach + stairRun(PLINTH.height), 0, PLINTH.height, 0.8);
  flight(site, "east", 0, 0, 0, BODY.half, BODY.half + stairRun(BODY.sillTop - PLINTH.height), PLINTH.height, BODY.sillTop, 0.8);
  // The recorded makara pair at the foot of the ground stair.
  for (const side of [-1, 1]) {
    site.get("lower", "statue").geometry(makara(), placement(WALK.reach + stairRun(PLINTH.height) + 0.15, 0, side * 0.95, "east"));
  }

  // The 7 × 7 m platform between gate and temple, stairs east and west; the two south foundations.
  block(site, "lower", rectOutline(3.5, 3.5, 15.5, 0), 0, 0.6);
  flight(site, "east", 15.5, 0, 0, 19, 19.9, 0, 0.6, 0.8);
  flight(site, "west", 15.5, 0, 0, 12, 11.1, 0, 0.6, 0.8);
  block(site, "lower", rectOutline(1.5, 1.5, 17, 14), 0, 0.5);
  block(site, "lower", rectOutline(1.25, 1.25, 12.5, 14), 0, 0.4);

  // Foundation with ruins in the courtyard's north-west corner.
  const fallen: Part[] = ruin(RUIN, 5);
  site.place(fallen, placement(-15, 0, -15));

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(70, 0, 0), yaw: Math.PI / 2 },
  };
}

function buildTour(): TourSection[] {
  // In from the east, up the gate's north stair, over the porch and across the courtyard.
  const approach = [
    ...path(0, [70, 0], [40, 0], [37.8, -1.9]),
    eye(36.4, 0.3, -1.9),
    eye(35, GATE.height, -1.9),
    eye(29.5, GATE.height, -1.4),
    eye(25, 0, -0.8),
    ...path(0, [12, 1.5]),
  ];
  // Climb to the door, look into the empty chamber, walk the kaki top.
  const climb = [eye(10.4, 0, 0), eye(9.2, 0.8, 0), eye(6.9, PLINTH.height, 0), eye(4.9, PLINTH.height, 0), eye(3.6, 2.2, 0), eye(2.6, BODY.sillTop, 0), eye(1, BODY.sillTop, 0)];
  const down = [...climb].reverse();
  return [
    { topic: "overview", label: "Approach from the east", points: approach, lookRight: 0 },
    { topic: "ruang", label: "Up to the chamber", points: [...climb, ...loop(2.9, KAKI.top, { start: "east" })], lookRight: 0.3 },
    {
      topic: "atap",
      label: "Around the foot and down",
      points: [eye(2.6, BODY.sillTop, 0), ...down.slice(1, 5), eye(6.9, PLINTH.height, 0), ...loop(3.3, PLINTH.height), eye(9.2, 0.8, 0), eye(10.4, 0, 0), ...path(0, [14, 8])],
      lookRight: -0.25,
    },
  ];
}
