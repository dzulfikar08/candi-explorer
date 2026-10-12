import { BoxGeometry, LatheGeometry, Matrix4, SphereGeometry, Vector2, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court, enclosure, terrace } from "../kit/enclosure";
import { deity, ratna } from "../kit/ornaments";
import { placement, rectOutline } from "../kit/plan";
import { Site } from "../kit/site";
import { eye } from "../kit/tour";
import type { CandiModel, Realm } from "../types";

/**
 * Geometry for Candi Sukuh. Axis west (entrance) to east (pyramid), +z south, metres.
 *
 * Layout per the sources: three terraces, each higher than the one in front, the main pyramid
 * against the back of the highest court, the stairway on the pyramid's west face, turtles and
 * statue groups in front of it (Wikipedia "Sukuh"; perpusnas-based description on joynesia.com).
 * The published figures give the pyramid about 8.7 m tall and roughly 15 m across; terrace
 * heights, court sizes and statue positions are estimated from photos and noted where they
 * depart from what the sources state.
 */

// Courts, west to east. Heights of the risers between courts are approximations.
const T1 = { cx: 0, halfX: 27, halfZ: 20, floor: 2.4, wall: 1.3 };
const T2 = { cx: 9.5, halfX: 17.5, halfZ: 13, floor: 4.6, wall: 1.1 };
const T3 = { cx: 16.75, halfX: 10.25, halfZ: 11, floor: 7.2 };
// Pyramid: base about 15 m square, 8.3 m of masonry up to the summit platform (published total
// 8.7 m, including the offering block), a two-tier mass with the stairway trench cut into the
// west face. block() cannot cut a stair trench, so the tiers are assembled from boxes.
const PYR = { cx: 19, half: 7.5, lowerTop: 12.4, upperHalf: 4.6, upperTop: 15.5 };
// Trench cut into the lower tier's west face for the head of the stair.
const TRENCH = { zHalf: 1.2, backX: 13 };
const STAIR_W = 2.4;

/**
 * Sukuh's flights are narrow and steep and carry no makara terminals, so the kit's stairFlight
 * (kit proportions, makara at the foot) is not used; every flight here climbs east.
 */
function steepStair(site: Site, realm: Realm, xFace: number, yLow: number, yHigh: number, width: number): void {
  const n = Math.ceil((yHigh - yLow) / 0.4);
  const riser = (yHigh - yLow) / n;
  const tread = 0.32;
  const w = width / 2;
  const steps = site.get(realm, "floor");
  const cheek = site.get(realm, "masonry");
  for (let j = 1; j <= n; j++) {
    const x0 = xFace - (n - j + 1) * tread;
    const x1 = x0 + tread;
    const top = yLow + j * riser;
    steps.box([x0, yLow, -w], [x1, top, w]);
    for (const side of [-1, 1]) {
      const z0 = side < 0 ? -w - 0.45 : w;
      cheek.box([x0, yLow, z0], [x1, Math.min(top + 0.55, yHigh + 0.55), z0 + 0.45]);
    }
  }
}

/** Roofed paduraksa over the first-terrace entrance, hand-built: the kit's gate is proportioned for tall enclosure walls and its passage lintel would clip a walking camera. Wing reliefs stand for the 1437 chronogram carvings. */
function entryGate(site: Site): void {
  const x = T1.cx - T1.halfX;
  const y = T1.floor;
  const m = site.get("lower", "masonry");
  const carved = site.get("lower", "reliefSingle");
  for (const side of [-1, 1]) {
    const za = side < 0 ? -2.1 : 1.5;
    const zb = side < 0 ? -1.5 : 2.1;
    m.box([x - 0.8, y, za], [x + 0.8, y + 2.8, zb]);
    // Wing panel (monster swallowing a man, birds and dog: the 1437 chronogram, drawn as one panel).
    carved.quad(
      [x - 0.82, y + 0.3, za],
      [x - 0.82, y + 0.3, zb],
      [x - 0.82, y + 2.5, zb],
      [x - 0.82, y + 2.5, za],
      [-1, 0, 0],
      [
        [0, 0],
        [0.25, 0],
        [0.25, 0.92],
        [0, 0.92],
      ],
    );
  }
  m.box([x - 0.9, y + 2.8, -1.5], [x + 0.9, y + 3.4, 1.5]);
  let yy = y + 3.4;
  let half = 2.1;
  for (let k = 0; k < 4; k++) {
    m.box([x - 0.9 + k * 0.12, yy, -half], [x + 0.9 - k * 0.12, yy + 0.42, half]);
    yy += 0.42;
    half -= 0.35;
  }
  m.geometry(ratna(), placement(x, yy, 0, "east", 0.55));
}

/** The main monument: a two-tier truncated pyramid, the summit platform ringed by a low parapet with the offering block in the middle. */
function pyramid(site: Site): void {
  const m = site.get("upper", "masonry");
  const floor = site.get("upper", "floor");
  const y0 = T3.floor;
  const y1 = PYR.lowerTop;
  const y2 = PYR.upperTop;
  const x0 = PYR.cx - PYR.half;
  const x1 = PYR.cx + PYR.half;
  const ux0 = PYR.cx - PYR.upperHalf;
  const ux1 = PYR.cx + PYR.upperHalf;
  // Skirt and cornice bands, split around the stair trench.
  for (const [ya, yb] of [
    [y0, y0 + 0.55],
    [y1 - 0.5, y1],
  ]) {
    m.box([x0 - 0.24, ya, -PYR.half - 0.24], [x1 + 0.24, yb, -TRENCH.zHalf]);
    m.box([x0 - 0.24, ya, TRENCH.zHalf], [x1 + 0.24, yb, PYR.half + 0.24]);
    m.box([TRENCH.backX, ya, -TRENCH.zHalf], [x1 + 0.24, yb, TRENCH.zHalf]);
  }
  // Lower tier: north and south slabs, back pier closing the trench, floor over the trench hole.
  m.box([x0, y0, -PYR.half], [x1, y1, -TRENCH.zHalf]);
  m.box([x0, y0, TRENCH.zHalf], [x1, y1, PYR.half]);
  m.box([TRENCH.backX, y0, -TRENCH.zHalf], [x1, y1, TRENCH.zHalf]);
  floor.cap(rectOutline(PYR.half, PYR.half, PYR.cx, 0), y1, [rectOutline((TRENCH.backX - x0) / 2, TRENCH.zHalf, (x0 + TRENCH.backX) / 2, 0)]);
  // Upper tier: skirt, mass (its top is the platform floor), cornice.
  m.box([ux0 - 0.24, y1, -PYR.upperHalf - 0.24], [ux1 + 0.24, y1 + 0.5, PYR.upperHalf + 0.24]);
  m.box([ux0, y1, -PYR.upperHalf], [ux1, y2, PYR.upperHalf]);
  m.box([ux0 - 0.24, y2 - 0.45, -PYR.upperHalf - 0.24], [ux1 + 0.24, y2 + 0.05, PYR.upperHalf + 0.24]);
  // Parapet around the summit, open on the west where the stair arrives.
  const py = y2 + 0.05;
  const pt = py + 0.4;
  m.box([ux0, py, -PYR.upperHalf], [ux1, pt, -PYR.upperHalf + 0.7]);
  m.box([ux0, py, PYR.upperHalf - 0.7], [ux1, pt, PYR.upperHalf]);
  m.box([ux1 - 0.7, py, -PYR.upperHalf], [ux1, pt, PYR.upperHalf]);
  m.box([ux0, py, -PYR.upperHalf], [ux0 + 0.7, pt, -TRENCH.zHalf]);
  m.box([ux0, py, TRENCH.zHalf], [ux0 + 0.7, pt, PYR.upperHalf]);
  // Offering block, still black with incense today; the 1.82 m lingga found here is in Jakarta.
  m.box([PYR.cx - 0.9, py, -0.9], [PYR.cx + 0.9, py + 0.55, 0.9]);
  // West-face reliefs: the smithy (Bhima, dancing Ganesha, Arjuna at the bellows) and the
  // life-sized ithyphallic figure, both drawn flat on the wall beside the stair.
  const carved = site.get("upper", "reliefSingle");
  carved.quad(
    [x0 - 0.02, 8.2, 2.6],
    [x0 - 0.02, 8.2, 5.0],
    [x0 - 0.02, 10.4, 5.0],
    [x0 - 0.02, 10.4, 2.6],
    [-1, 0, 0],
    [
      [0, 0],
      [1, 0],
      [1, 0.92],
      [0, 0.92],
    ],
  );
  carved.quad(
    [x0 - 0.02, 8.2, -4.8],
    [x0 - 0.02, 8.2, -3.6],
    [x0 - 0.02, 9.9, -3.6],
    [x0 - 0.02, 9.9, -4.8],
    [-1, 0, 0],
    [
      [0, 0],
      [0.5, 0],
      [0.5, 0.71],
      [0, 0.71],
    ],
  );
}

const TURTLE_SHELL = new LatheGeometry(
  [
    [0, 0.5],
    [0.45, 0.48],
    [0.7, 0.34],
    [0.88, 0.16],
    [0.97, 0.04],
    [0.97, 0],
  ].map(([r, y]) => new Vector2(r, y)),
  20,
);

const TURTLE_PLINTH = new BoxGeometry(2.3, 0.22, 1.8);
const TURTLE_LEG = new BoxGeometry(0.5, 0.3, 0.32);
const TURTLE_TAIL = new BoxGeometry(0.3, 0.22, 0.3);
const TURTLE_HEAD = new SphereGeometry(0.26, 12, 10);

/** Flattened-shell turtle altar, heads to the west like all three at the site. */
function turtle(site: Site, x: number, z: number): void {
  const statue = site.get("upper", "statue");
  const at = (g: BoxGeometry | LatheGeometry | SphereGeometry, ox: number, oy: number, oz: number, sx = 1) =>
    statue.geometry(g, placement(x, T3.floor, z, "west", 1.3).multiply(new Matrix4().makeTranslation(ox, oy, oz)).multiply(new Matrix4().makeScale(sx, 1, 1)));
  at(TURTLE_PLINTH, 0, 0.11, 0);
  at(TURTLE_SHELL, -0.1, 0.22, 0);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) at(TURTLE_LEG, sx * 0.55, 0.37, sz * 0.8);
  at(TURTLE_TAIL, -1.15, 0.42, 0);
  at(TURTLE_HEAD, 1.3, 0.45, 0, 1.6);
}

const WING = new BoxGeometry(1.15, 0.5, 0.07);

/** Winged eagle-headed attendant; three stood on the north side, one still headed. */
function wingedFigure(site: Site, x: number, z: number): void {
  const statue = site.get("upper", "statue");
  const base = placement(x, T3.floor, z, "south", 1.7);
  statue.geometry(deity(), base);
  for (const side of [-1, 1])
    statue.geometry(WING, base.clone().multiply(new Matrix4().makeTranslation(side * 0.55, 0.72, 0)).multiply(new Matrix4().makeRotationZ(side * 0.45)));
}

/** Free-standing carved slab (the relief panels stand loose in the courts). */
function reliefSlab(site: Site, realm: Realm, y: number, x: number, z: number, w: number, h: number, north: boolean): void {
  const t = 0.35;
  site.get(realm, "masonry").box([x - w / 2, y, z - t / 2], [x + w / 2, y + 0.15, z + t / 2]);
  site.get(realm, "masonry").box([x - w / 2, y + 0.15, z - t / 2], [x + w / 2, y + h, z + t / 2]);
  const nz = north ? -1 : 1;
  const zf = z + (north ? -t / 2 - 0.02 : t / 2 + 0.02);
  site.get(realm, "reliefSingle").quad(
    [x - w / 2, y + 0.15, zf],
    [x + w / 2, y + 0.15, zf],
    [x + w / 2, y + h, zf],
    [x - w / 2, y + h, zf],
    [0, 0, nz],
    [
      [0, 0],
      [w / 2.4, 0],
      [w / 2.4, 1],
      [0, 1],
    ],
  );
}

/** Tapering monolith; flat obelisk-shaped stones stand beside the pyramid stair. */
function stele(site: Site, x: number, z: number): void {
  const m = site.get("upper", "masonry");
  const y = T3.floor;
  m.box([x - 0.55, y, z - 0.3], [x + 0.55, y + 1.0, z + 0.3]);
  m.box([x - 0.38, y + 1.0, z - 0.22], [x + 0.38, y + 2.1, z + 0.22]);
  m.box([x - 0.26, y + 2.1, z - 0.16], [x + 0.26, y + 2.4, z + 0.16]);
}

/** Small hollow shrine south of the path (candi pewara) with the headless figure inside. */
function pewaraShrine(site: Site): void {
  const m = site.get("upper", "masonry");
  const y = T3.floor;
  const x0 = 9.4;
  const x1 = 10.8;
  const z0 = 3.9;
  const z1 = 5.3;
  m.box([x0, y, z0], [x1, y + 0.18, z1]);
  m.box([x0, y + 0.18, z1 - 0.25], [x1, y + 1.5, z1]);
  m.box([x1 - 0.25, y + 0.18, z0], [x1, y + 1.5, z1]);
  m.box([x0, y + 0.18, z0], [x0 + 0.25, y + 1.5, z1]);
  m.box([x0, y + 0.18, z0], [x0 + 0.35, y + 1.5, z0 + 0.25]);
  m.box([x1 - 0.35, y + 0.18, z0], [x1, y + 1.5, z0 + 0.25]);
  m.box([x0, y + 1.1, z0], [x1, y + 1.5, z0 + 0.25]);
  // Headless votive figure, seated, facing the entrance.
  m.box([x0 + 0.45, y + 0.18, z0 + 0.35], [x1 - 0.45, y + 0.5, z0 + 0.95]);
  m.box([x0 + 0.52, y + 0.5, z0 + 0.5], [x1 - 0.52, y + 1.1, z0 + 0.85]);
}

export function buildSukuh(textures: StoneTextures): CandiModel {
  const site = new Site("Sukuh", textures);
  court(site, 29, 26, -30.5, 0);

  // Terraces rise eastward up the Lawu slope, each court set back inside the one below.
  site.place(terrace({ halfX: T1.halfX, halfZ: T1.halfZ, height: T1.floor, stairs: [], stairWidth: STAIR_W }), placement(T1.cx, 0, 0));
  site.place(terrace({ halfX: T2.halfX, halfZ: T2.halfZ, height: T2.floor - T1.floor, y: T1.floor, stairs: [], stairWidth: STAIR_W, realm: "middle" }), placement(T2.cx, 0, 0));
  site.place(terrace({ halfX: T3.halfX, halfZ: T3.halfZ, height: T3.floor - T2.floor, y: T2.floor, stairs: [], stairWidth: 2.2, realm: "middle" }), placement(T3.cx, 0, 0));
  steepStair(site, "lower", T1.cx - T1.halfX, 0, T1.floor, STAIR_W);
  steepStair(site, "middle", T2.cx - T2.halfX, T1.floor, T2.floor, STAIR_W);
  steepStair(site, "middle", T3.cx - T3.halfX, T2.floor, T3.floor, 2.2);

  // Low court walls. First gate: roofed paduraksa with the chronogram wings. Second gate:
  // roofless, drawn as a split gate; its dwarapala are worn beyond recognition in reality.
  enclosure(site, { halfX: T1.halfX, halfZ: T1.halfZ, y: T1.floor, height: T1.wall, thickness: 0.5, gates: ["west"], gateWidth: 3, gate: "none" });
  enclosure(site, { halfX: T2.halfX, halfZ: T2.halfZ, cx: T2.cx, y: T2.floor, height: T2.wall, thickness: 0.5, gates: ["west"], gateWidth: 2.8, gate: "bentar", realm: "middle" });
  entryGate(site);
  const m2 = site.get("middle", "masonry");
  for (const side of [-1, 1]) {
    const zc = side * 2.6;
    m2.box([3.6, T2.floor, zc - 0.4], [4.2, T2.floor + 2.2, zc + 0.4]);
    m2.box([3.55, T2.floor + 2.2, zc - 0.3], [4.25, T2.floor + 2.75, zc + 0.3]);
    m2.box([3.65, T2.floor + 2.75, zc - 0.22], [4.15, T2.floor + 3.1, zc + 0.22]);
  }
  for (const side of [-1, 1]) site.get("middle", "statue").geometry(deity(), placement(3.9, T2.floor, side * 1.9, "west", 1.6));

  pyramid(site);

  // First court: lingga-yoni relief set into the floor inside the gate, carved slabs on the north.
  site.get("lower", "reliefSingle").cap(rectOutline(1.0, 1.6, -20.5, 0), T1.floor + 0.03);
  for (const [x, w] of [
    [-14, 2.2],
    [-10.2, 1.8],
    [-6.4, 2.2],
  ] as const)
    reliefSlab(site, "lower", T1.floor, x, -16.5, w, 2.0, false);

  // Third court: winged figures north, Sudamala panels south, turtles and steles by the stair.
  for (const x of [9.5, 12.5, 15.5]) wingedFigure(site, x, -8.8);
  for (const x of [9.5, 11.25, 13.0, 14.75, 16.5]) reliefSlab(site, "upper", T3.floor, x, 9.9, 1.75, 1.9, true);
  turtle(site, 8.6, -4.6);
  turtle(site, 8.6, 4.6);
  turtle(site, 7.4, 6.4);
  stele(site, 10.8, -3.4);
  stele(site, 10.8, 3.4);
  pewaraShrine(site);

  // Stair up the pyramid's west face: free-standing on the court, then entering the trench.
  steepStair(site, "upper", PYR.cx - PYR.upperHalf, T3.floor, PYR.upperTop, 2.4);

  const yOf = (x: number) => {
    const run = 6.72;
    const start = PYR.cx - PYR.upperHalf - run;
    return T3.floor + Math.max(0, x - start) * ((PYR.upperTop - T3.floor) / run);
  };

  return {
    ...site.finish(),
    tour: [
      {
        topic: "overview",
        label: "Approach from the west",
        points: [eye(-62, 0, 0), eye(-40, 0, 0), eye(-32, 0, 0), eye(-29.5, 0.4, 0), eye(-28.2, 1.6, 0), eye(-26.5, T1.floor, 0)],
        lookRight: 0,
      },
      {
        topic: "gate",
        label: "The 1437 gate",
        points: [eye(-24, T1.floor, 2.2), eye(-22.8, T1.floor, -2.2), eye(-20.5, T1.floor, 0)],
        lookRight: -0.2,
      },
      {
        topic: "reliefs",
        label: "First court and its panels",
        points: [
          eye(-20.5, T1.floor, 0),
          eye(-16, T1.floor, -15.5),
          eye(-8, T1.floor, -16),
          eye(2, T1.floor, -16),
          eye(10, T1.floor, -16),
          eye(17, T1.floor, -15),
          eye(17, T1.floor, 15),
          eye(6, T1.floor, 16),
          eye(-6, T1.floor, 16),
          eye(-16, T1.floor, 15),
        ],
        lookRight: 0.3,
      },
      {
        topic: "terraces",
        label: "Climbing the second and third terraces",
        points: [eye(-16, T1.floor, 0), eye(-9.6, 2.64, 0), eye(-8.5, 3.86, 0), eye(-6, T2.floor, 0), eye(0, T2.floor, 0), eye(3.4, T2.floor, 0), eye(4.5, 4.88, 0), eye(5.8, 6.39, 0), eye(6.8, T3.floor, 0)],
        lookRight: 0,
      },
      {
        topic: "statues",
        label: "The sacred court",
        points: [eye(7.9, T3.floor, -3.2), eye(9.5, T3.floor, -7.4), eye(13.5, T3.floor, -8.4), eye(17, T3.floor, -8.4), eye(17, T3.floor, 8.4), eye(12.5, T3.floor, 8.4), eye(9.6, T3.floor, 6.6), eye(8.4, T3.floor, 1.8), eye(6.9, T3.floor, 0)],
        lookRight: 0.25,
      },
      {
        topic: "pyramid",
        label: "The pyramid stair and summit",
        points: [
          eye(7.2, T3.floor, 0),
          eye(8.4, yOf(8.4), 0),
          eye(9.9, yOf(9.9), 0),
          eye(11.5, yOf(11.5), 0),
          eye(13.0, yOf(13.0), 0),
          eye(14.5, PYR.upperTop, 0),
          eye(16.5, PYR.upperTop, 0),
          eye(18.2, PYR.upperTop, 0),
        ],
        lookRight: 0,
      },
    ],
    walkSpawn: { position: new Vector3(-62, 0, 0), yaw: Math.atan2(-62, 0) },
  };
}
