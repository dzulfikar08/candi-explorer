import { LatheGeometry, Matrix4, Vector2, Vector3, type BufferGeometry } from "three";
import type { StoneTextures } from "../../render/stone";
import { type MeshBuilder, type V3 } from "../../render/mesh-builder";
import { court, enclosure } from "../kit/enclosure";
import { type Direction, DIRECTIONS, type Vec2 } from "../kit/plan";
import { block, stairRun } from "../kit/shrine";
import { type Part, Parts, Site } from "../kit/site";
import type { CandiModel, Realm } from "../types";
import { buildTour } from "./tour";
import {
  BUNGSU,
  MAHLIGAI,
  MAHLIGAI_CROWN,
  MAHLIGAI_SHAFT,
  PALANGKA,
  SMALL_STUPAS,
  STUPA_BULB,
  TUA,
  TUA_DRUM,
  WALL,
} from "./layout";

/**
 * Muara Takus is built of brick (fabrick "brick" here) and takes no Javanese shrine form: every
 * structure is a solid stupa or terraced mass, so the geometry is stacked polygonal tiers and
 * lathe-turned round parts rather than the kit's chambered shrine.
 */

/** Rectangle with cut corners, counter-clockwise like `rectOutline`; reads as the polygonal brick tiers. */
function chamferedRect(halfX: number, halfZ: number, c: number): Vec2[] {
  if (c <= 0) return [{ x: halfX, z: halfZ }, { x: halfX, z: -halfZ }, { x: -halfX, z: -halfZ }, { x: -halfX, z: halfZ }];
  return [
    { x: halfX, z: halfZ - c },
    { x: halfX, z: -halfZ + c },
    { x: halfX - c, z: -halfZ },
    { x: -halfX + c, z: -halfZ },
    { x: -halfX, z: -halfZ + c },
    { x: -halfX, z: halfZ - c },
    { x: -halfX + c, z: halfZ },
    { x: halfX - c, z: halfZ },
  ];
}

/** Map stair-local coordinates (s along the outward axis of `d`, u lateral) to world space. */
function axisPoint(d: Direction, s: number, u: number, y: number): V3 {
  const v = DIRECTIONS[d];
  return v.x !== 0 ? [v.x * s, y, u] : [u, y, v.z * s];
}

function axisBox(b: MeshBuilder, d: Direction, s: [number, number], u: [number, number], y: [number, number]): void {
  const p = axisPoint(d, s[0], u[0], y[0]);
  const q = axisPoint(d, s[1], u[1], y[1]);
  b.box([Math.min(p[0], q[0]), y[0], Math.min(p[2], q[2])], [Math.max(p[0], q[0]), y[1], Math.max(p[2], q[2])]);
}

/** Stepped brick flight with plain cheek walls; Muara Takus stairs carry no makara spouts. */
function stair(parts: Parts, realm: Realm, d: Direction, sTop: number, yLow: number, yHigh: number, width: number): void {
  const masonry = parts.get(realm, "masonry");
  const rise = yHigh - yLow;
  const n = Math.max(1, Math.ceil(rise / 0.24));
  const riser = rise / n;
  const tread = stairRun(rise) / n;
  const w = width / 2;
  // Overlap into the wall behind so no gap shows at the top step.
  const back = sTop - 0.3;
  for (let j = 1; j <= n; j++) {
    const s1 = sTop + (n - j + 1) * tread;
    const top = yLow + j * riser;
    axisBox(parts.get(realm, "floor"), d, [back, s1], [-w, w], [yLow, top]);
    for (const side of [-1, 1]) {
      const u: [number, number] = side < 0 ? [-w - 0.45, -w] : [w, w + 0.45];
      axisBox(masonry, d, [back, s1], u, [yLow, Math.min(top + 0.75, yHigh + 0.75)]);
    }
  }
}

/** Portal with projecting jambs and lintel on a face at distance `face` along `d`, void behind. */
function portal(parts: Parts, realm: Realm, d: Direction, face: number, y0: number, width: number, height: number): void {
  const v = DIRECTIONS[d];
  const n: V3 = [v.x, 0, v.z];
  const w = width / 2;
  parts
    .get(realm, "nicheShadow")
    .quad(
      axisPoint(d, face + 0.01, -w, y0),
      axisPoint(d, face + 0.01, w, y0),
      axisPoint(d, face + 0.01, w, y0 + height),
      axisPoint(d, face + 0.01, -w, y0 + height),
      n,
    );
  for (const side of [-1, 1]) {
    const u: [number, number] = side < 0 ? [-w - 0.6, -w] : [w, w + 0.6];
    axisBox(parts.get(realm, "masonry"), d, [face, face + 0.35], u, [y0, y0 + height + 0.45]);
  }
  axisBox(parts.get(realm, "masonry"), d, [face, face + 0.35], [-w - 0.6, w + 0.6], [y0 + height, y0 + height + 0.45]);
}

/** Lathe-turned round brickwork: profile is (radius, height above y0); 36 segments for Mahligai's 36 sides. */
function latheOf(profile: readonly (readonly [number, number])[], segments: number, y0: number): BufferGeometry {
  return new LatheGeometry(profile.map(([r, y]) => new Vector2(r, y + y0)), segments);
}

export function buildMuaraTakus(textures: StoneTextures): CandiModel {
  const site = new Site("Muara Takus", textures, "brick");

  // Paved court and the low perimeter wall; only a gateway opening survives on the north side.
  court(site, WALL.half - 0.5, WALL.half - 0.5);
  enclosure(site, { halfX: WALL.half, halfZ: WALL.half, height: WALL.height, thickness: WALL.thickness, gates: ["north"], gateWidth: WALL.gate, gate: "none" });

  // Candi Tua: the largest structure, a solid two-tier foot, a body tier and a round crowning drum.
  // Sandstone accents (corners, pilasters, cornices) are not coloured separately here.
  const tua = new Parts();
  for (const t of [TUA.t1, TUA.t2]) block(tua, "lower", chamferedRect(t.halfX, t.halfZ, t.chamfer), t.bottom, t.top);
  block(tua, "middle", chamferedRect(TUA.t3.halfX, TUA.t3.halfZ, TUA.t3.chamfer), TUA.t3.bottom, TUA.t3.top);
  tua.get("upper", "masonry").geometry(latheOf(TUA_DRUM, 36, TUA.drum.bottom), new Matrix4());
  stair(tua, "lower", "east", TUA.t1.halfX, 0, TUA.t1.top, TUA.eastStairWidth);
  stair(tua, "lower", "east", TUA.t2.halfX, TUA.t1.top, TUA.t2.top, TUA.eastStairWidth);
  stair(tua, "middle", "east", TUA.t3.halfX, TUA.t2.top, TUA.t3.top, TUA.eastStairWidth);
  stair(tua, "lower", "west", TUA.t1.halfX, 0, TUA.t1.top, TUA.westStairWidth);
  stair(tua, "lower", "west", TUA.t2.halfX, TUA.t1.top, TUA.t2.top, TUA.westStairWidth);
  stair(tua, "middle", "west", TUA.t3.halfX, TUA.t2.top, TUA.t3.top, TUA.westStairWidth);
  site.place(tua.build(), new Matrix4().makeTranslation(TUA.cx, 0, TUA.cz));

  // Stupa Mahligai: polygonal plinth, 36-sided shaft, bulbous lotus crown; entrance on the south.
  const mahligai = new Parts();
  block(mahligai, "lower", chamferedRect(MAHLIGAI.plinth.halfX, MAHLIGAI.plinth.halfZ, MAHLIGAI.plinth.chamfer), 0, MAHLIGAI.plinth.top);
  mahligai.get("middle", "masonry").geometry(latheOf(MAHLIGAI_SHAFT, 36, MAHLIGAI.plinth.top), new Matrix4());
  mahligai.get("upper", "masonry").geometry(latheOf(MAHLIGAI_CROWN, 36, MAHLIGAI.plinth.top), new Matrix4());
  portal(mahligai, "lower", "south", MAHLIGAI.plinth.halfZ, 0, MAHLIGAI.portal.width, MAHLIGAI.portal.height);
  site.place(mahligai.build(), new Matrix4().makeTranslation(MAHLIGAI.cx, 0, MAHLIGAI.cz));

  // Candi Bungsu: like Tua but closing in a square upper part; brick fabric stands in for both
  // its halves (the real north half is sandstone). White-stone stair on the east.
  const bungsu = new Parts();
  for (const t of [BUNGSU.t1, BUNGSU.t2]) block(bungsu, "lower", chamferedRect(t.halfX, t.halfZ, t.chamfer), t.bottom, t.top);
  block(bungsu, "middle", chamferedRect(BUNGSU.t3.halfX, BUNGSU.t3.halfZ, BUNGSU.t3.chamfer), BUNGSU.t3.bottom, BUNGSU.t3.top);
  block(bungsu, "upper", chamferedRect(BUNGSU.t4.halfX, BUNGSU.t4.halfZ, BUNGSU.t4.chamfer), BUNGSU.t4.bottom, BUNGSU.t4.top);
  stair(bungsu, "lower", "east", BUNGSU.t1.halfX, 0, BUNGSU.t1.top, BUNGSU.stairWidth);
  site.place(bungsu.build(), new Matrix4().makeTranslation(BUNGSU.cx, 0, BUNGSU.cz));

  // Candi Palangka: low brick altar platform east of Mahligai, door facing north.
  const palangka = new Parts();
  block(palangka, "lower", chamferedRect(PALANGKA.t1.halfX, PALANGKA.t1.halfZ, PALANGKA.t1.chamfer), PALANGKA.t1.bottom, PALANGKA.t1.top);
  block(palangka, "lower", chamferedRect(PALANGKA.t2.halfX, PALANGKA.t2.halfZ, PALANGKA.t2.chamfer), PALANGKA.t2.bottom, PALANGKA.t2.top);
  portal(palangka, "lower", "north", PALANGKA.t1.halfZ, 0, PALANGKA.portal.width, PALANGKA.portal.height);
  site.place(palangka.build(), new Matrix4().makeTranslation(PALANGKA.cx, 0, PALANGKA.cz));

  // Small stupas between Bungsu and Mahligai: moulded base plus a lathe-turned bulb.
  const stupaBase = new Parts();
  block(stupaBase, "lower", chamferedRect(0.8, 0.8, 0.3), 0, 0.5);
  const stupaParts: Part[] = stupaBase.build();
  const stupaMatrices = SMALL_STUPAS.map((p) => new Matrix4().makeTranslation(p.x, 0, p.z));
  site.instance(stupaParts, stupaMatrices);
  site.instanceGeometry(latheOf(STUPA_BULB, 20, 0.5), site.material("upper", "masonry"), stupaMatrices, true);

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(0, 0, -55), yaw: Math.PI },
  };
}
