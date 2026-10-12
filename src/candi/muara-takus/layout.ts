import type { Vec2 } from "../kit/plan";

/**
 * Published dimensions in metres. English Wikipedia "Muara Takus": perimeter wall 74 × 74 m and
 * about 1 m high with a gateway on the north side; Mahligai 14.30 m tall with lion figures on its
 * base corners; Bungsu 6.20 m; Tua 32.8 × 21.8 m and 8.50 m; Palangka 1.45 m. Indonesian Wikipedia
 * "Candi Muara Takus": Mahligai plinth 9.44 × 10.6 m with a 28-sided base, 36-sided tower and south
 * entrance; Tua foot tiers 2.37 m and 1.98 m with 3.08 m and 4 m wide stairs on the west and east,
 * solid interior, sandstone reserved for corners, pilasters and cornices; Bungsu 13.20 × 16.20 m
 * (sandstone north half, brick south half) with a white-stone stair to its east; Palangka body
 * 5.10 × 5.7 m, about 2 m, door facing north; small stupas east of Bungsu. Building positions
 * inside the wall are estimated from site photographs (Tua south, Mahligai north of it, Bungsu
 * west and Palangka east of Mahligai); intermediate tier heights beyond the published ones are
 * chosen to match the published totals.
 */

export const WALL = { half: 37, height: 0.9, thickness: 0.6, gate: 3.2 };

export interface Tier {
  halfX: number;
  halfZ: number;
  chamfer: number;
  bottom: number;
  top: number;
}

export const TUA = {
  cx: 0,
  cz: 11,
  t1: { halfX: 16.4, halfZ: 10.9, chamfer: 4.2, bottom: 0, top: 2.37 } satisfies Tier,
  t2: { halfX: 13.6, halfZ: 8.5, chamfer: 3.2, bottom: 2.37, top: 4.35 } satisfies Tier,
  t3: { halfX: 10.4, halfZ: 6.6, chamfer: 2.4, bottom: 4.35, top: 6.0 } satisfies Tier,
  drum: { radius: 3.5, bottom: 6.0, top: 8.5 },
  eastStairWidth: 4,
  westStairWidth: 3.08,
};

/** Round crowning drum of Candi Tua: lathe profile (radius, height above `drum.bottom`). */
export const TUA_DRUM: readonly (readonly [number, number])[] = [
  [0, 0],
  [3.5, 0],
  [3.72, 0.22],
  [3.62, 0.5],
  [3.5, 2.0],
  [3.3, 2.3],
  [2.2, 2.5],
  [0, 2.5],
];

export const MAHLIGAI = {
  cx: 2,
  cz: -10,
  plinth: { halfX: 4.72, halfZ: 5.3, chamfer: 1.8, bottom: 0, top: 2.6 } satisfies Tier,
  /** Published total height, metres. */
  total: 14.3,
  portal: { width: 1.4, height: 2.2 },
};

/** Tower shaft above the plinth (radius, height above the plinth top); lathe's 36 segments echo the 36-sided tower. */
export const MAHLIGAI_SHAFT: readonly (readonly [number, number])[] = [
  [0, 0],
  [2.55, 0],
  [2.95, 0.28],
  [2.95, 0.85],
  [2.58, 1.3],
  [2.4, 3.0],
  [2.26, 5.0],
  [2.3, 6.4],
];

/** Bulbous lotus cushion and round top; with the shaft and plinth this reaches the published 14.30 m. */
export const MAHLIGAI_CROWN: readonly (readonly [number, number])[] = [
  [2.3, 6.4],
  [2.85, 7.0],
  [3.45, 7.7],
  [3.62, 8.4],
  [3.3, 9.1],
  [2.55, 9.8],
  [1.9, 10.35],
  [1.7, 10.65],
  [1.88, 10.95],
  [1.88, 11.25],
  [1.35, 11.7],
  [0, 11.7],
];

export const BUNGSU = {
  cx: -17,
  cz: -7,
  t1: { halfX: 6.6, halfZ: 8.1, chamfer: 2.8, bottom: 0, top: 2.2 } satisfies Tier,
  t2: { halfX: 4.9, halfZ: 6.2, chamfer: 2.0, bottom: 2.2, top: 3.9 } satisfies Tier,
  t3: { halfX: 3.6, halfZ: 4.4, chamfer: 0, bottom: 3.9, top: 5.3 } satisfies Tier,
  t4: { halfX: 2.6, halfZ: 3.2, chamfer: 0, bottom: 5.3, top: 6.2 } satisfies Tier,
  stairWidth: 1.8,
};

export const PALANGKA = {
  cx: 13.5,
  cz: -10,
  t1: { halfX: 2.85, halfZ: 2.55, chamfer: 0.8, bottom: 0, top: 0.9 } satisfies Tier,
  t2: { halfX: 2.35, halfZ: 2.05, chamfer: 0.6, bottom: 0.9, top: 1.45 } satisfies Tier,
  portal: { width: 1.0, height: 1.0 },
};

/** Small stupas east of Candi Bungsu (positions estimated from site photos). */
export const SMALL_STUPAS: readonly Vec2[] = [
  { x: -6.8, z: -12 },
  { x: -6.8, z: -8 },
  { x: -6.8, z: -4 },
];

/** Bulb of the small stupas, above a 0.5 m moulded base. */
export const STUPA_BULB: readonly (readonly [number, number])[] = [
  [0, 0],
  [0.7, 0],
  [0.8, 0.12],
  [0.74, 0.5],
  [0.5, 0.85],
  [0.28, 1.05],
  [0.32, 1.2],
  [0, 1.3],
];
