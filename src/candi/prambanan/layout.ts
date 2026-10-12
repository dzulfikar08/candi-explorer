import type { Direction, Vec2 } from "../kit/plan";
import { squareRing } from "../kit/plan";
import type { ShrineSpec } from "../kit/shrine";

/**
 * Prambanan (Shivagrha) plan, metres, centred on the Shiva temple; +x east, +z south.
 * Sources: Wikipedia "Prambanan" (citing Dumarçay, Soekmono and the BPCB Yogyakarta site notes).
 * Published figures: Shiva temple 47 m high and 34 m wide; Brahma and Vishnu 33 m high and 20 m
 * wide; vahana temples about 25 m; perwara about 14 m; the inner court 110 m square; 224 perwara
 * in four concentric rows of 44, 52, 60 and 68. Positions inside the courts are approximated.
 */

const RATNA_ROOF = { finial: "ratna" as const, shrink: 0.8 };

export const SHIVA: ShrineSpec = {
  plinths: [{ half: 17, height: 3, balustrade: 1.7, balustradeRelief: true }],
  foot: { half: 12.5, height: 3.5, relief: true },
  body: { half: 8.5, height: 9.5, wall: 2 },
  door: { width: 2, height: 3.6 },
  doors: ["east", "south", "west", "north"],
  stairWidth: 3,
  roof: { tiers: 6, first: 6.9, ...RATNA_ROOF },
  crown: { kind: "ratna", height: 5 },
  image: { kind: "deity", height: 3 },
};

/** Brahma (south) and Vishnu (north): one chamber, stairs on the east only. */
export const TRIMURTI_FLANK: ShrineSpec = {
  plinths: [{ half: 10, height: 2.2, balustrade: 1.4, balustradeRelief: true }],
  foot: { half: 7.4, height: 2.6, relief: true },
  body: { half: 5.2, height: 7, wall: 1.4 },
  door: { width: 1.6, height: 2.8 },
  doors: ["east"],
  stairWidth: 2.4,
  roof: { tiers: 5, first: 4.9, ...RATNA_ROOF },
  crown: { kind: "ratna", height: 4.2 },
  image: { kind: "deity", height: 2.4 },
  niches: "deity",
};

/** Vahana temples for Nandi, Garuda and Hamsa, facing the main row. */
export const VAHANA: ShrineSpec = {
  plinths: [{ half: 7.5, height: 1.8, balustrade: 1.1 }],
  foot: { half: 5.6, height: 2 },
  body: { half: 4, height: 5.5, wall: 1.1 },
  door: { width: 1.4, height: 2.4 },
  doors: ["east"],
  stairWidth: 2,
  roof: { tiers: 5, first: 3.5, ...RATNA_ROOF },
  crown: { kind: "ratna", height: 3.4 },
  niches: "empty",
};

export const APIT: ShrineSpec = {
  foot: { half: 4, height: 2 },
  body: { half: 2.8, height: 4.2, wall: 0.8 },
  door: { width: 1.1, height: 2 },
  doors: ["east"],
  stairWidth: 1.4,
  roof: { tiers: 4, first: 2.6, ...RATNA_ROOF },
  crown: { kind: "ratna", height: 2.4 },
  niches: "empty",
};

/** Kelir (screen shrines inside the gates) and patok (corner shrines): small, closed. */
export const SMALL: ShrineSpec = {
  foot: { half: 1.5, height: 0.9 },
  body: { half: 1, height: 1.6, wall: 0.4 },
  door: { width: 0.5, height: 1 },
  doors: [],
  stairWidth: 1,
  roof: { tiers: 2, first: 0.8, ...RATNA_ROOF },
  crown: { kind: "ratna", height: 1 },
  niches: "empty",
};

export const PERWARA: ShrineSpec = {
  foot: { half: 3, height: 1.6 },
  body: { half: 2.1, height: 3.4, wall: 0.6 },
  door: { width: 0.9, height: 1.8 },
  doors: ["east"],
  stairWidth: 1.2,
  roof: { tiers: 4, first: 2.3, ...RATNA_ROOF },
  crown: { kind: "ratna", height: 2.2 },
  niches: "empty",
};

export interface Placed {
  key: string;
  label: string;
  at: Vec2;
  facing: Direction;
}

export const INNER_HALF = 55;
export const MIDDLE_HALF = 111;

/** The sixteen temples of the inner court. */
export const INNER: readonly Placed[] = [
  { key: "shiva", label: "Shiva", at: { x: 0, z: 0 }, facing: "east" },
  { key: "brahma", label: "Brahma", at: { x: 0, z: 36 }, facing: "east" },
  { key: "vishnu", label: "Vishnu", at: { x: 0, z: -36 }, facing: "east" },
  { key: "nandi", label: "Nandi", at: { x: 40, z: 0 }, facing: "west" },
  { key: "hamsa", label: "Hamsa", at: { x: 40, z: 36 }, facing: "west" },
  { key: "garuda", label: "Garuda", at: { x: 40, z: -36 }, facing: "west" },
  { key: "apit", label: "Apit (south)", at: { x: 22, z: 49 }, facing: "north" },
  { key: "apit", label: "Apit (north)", at: { x: 22, z: -49 }, facing: "south" },
  { key: "small", label: "Kelir (east)", at: { x: 51, z: 0 }, facing: "east" },
  { key: "small", label: "Kelir (south)", at: { x: 0, z: 51 }, facing: "south" },
  { key: "small", label: "Kelir (west)", at: { x: -51, z: 0 }, facing: "west" },
  { key: "small", label: "Kelir (north)", at: { x: 0, z: -51 }, facing: "north" },
  { key: "small", label: "Patok", at: { x: 51, z: 51 }, facing: "east" },
  { key: "small", label: "Patok", at: { x: -51, z: 51 }, facing: "east" },
  { key: "small", label: "Patok", at: { x: -51, z: -51 }, facing: "east" },
  { key: "small", label: "Patok", at: { x: 51, z: -51 }, facing: "east" },
];

/** Perwara rows from the inside out: 44, 52, 60, 68 shrines on a regular grid. */
export const PERWARA_PITCH = 11.5;
export const PERWARA_ROWS = [12, 14, 16, 18].map((perSide, i) => ({
  perSide,
  half: (5.5 + i) * PERWARA_PITCH,
}));

/**
 * Most perwara are still heaps of stone; a few have been rebuilt. Which ones is not modelled:
 * the pair either side of each inner-row axis stands in for the restored ones.
 */
export function perwaraPlacements(): { at: Vec2; facing: Direction; restored: boolean }[] {
  return PERWARA_ROWS.flatMap(({ perSide, half }, row) =>
    squareRing(half, perSide).map(({ position, facing }) => {
      const lateral = facing === "east" || facing === "west" ? position.z : position.x;
      return { at: position, facing, restored: row === 0 && Math.abs(Math.abs(lateral) - PERWARA_PITCH / 2) < 1e-6 };
    }),
  );
}
