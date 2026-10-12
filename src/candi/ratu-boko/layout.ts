import type { ShrineSpec } from "../kit/shrine";

/**
 * Kraton Ratu Boko plan, metres; origin between the two western gate rows on the entrance axis,
 * +x east, +z south. Sources: English Wikipedia "Ratu Boko" (196 m elevation, roughly 250,000 m²,
 * three terraces, gate rows of three and five paduraksa, the 792 CE Abhayagiri Vihara inscription
 * for Rakai Panangkaran (r. 746–784), the 856 Shivagrha reference to the fortified hill, Candi
 * Pembakaran 26 × 26 m with a central square pit); Indonesian Wikipedia "Situs Ratu Boko" (≈ 25 ha,
 * 8th-century Sailendra origins); the BPCB Yogyakarta site description republished at
 * 1001indonesia.net (outer row of three roofless paduraksa on a terrace reached by two ~2.5 m
 * flights, main row of five paduraksa ~15 m east with only three stairways, hip roofs with ratna
 * on the flanking gates only, Pembakaran ~37 m NE of the main gate with a 4 × 4 m burning pit and
 * the Amerta Mantana well, paseban 38 × 7 × 1.5 m with 20 umpak, pendopo court 40 × 30 m walled
 * 3 m with paduraksa gates N/W/S, a 1.46 m stage with 24 umpak and a 20 × 6 m pringgitan with 12,
 * keputren with square/rectangular and round basins, three miniature shrines with the larger
 * centre one dedicated to Vishnu).
 *
 * The real compound spreads over roughly 250,000 m² on three terraces; the model compresses it to
 * a walkable core: the gate terrace and one great plateau, with published platform, pit and basin
 * sizes kept. Gate pylon heights are not published; they are scaled to the photographs.
 */

export const PLATEAU = { cx: 35, halfX: 61, halfZ: 55, top: 9.5 };

/** The high terrace both gate rows stand on, built as two 2.5 m steps (the published flights). */
export const GATE_TERRACE = { cx: -33, lowerHalfX: 16.5, upperHalfX: 13.5, lowerHalfZ: 18, upperHalfZ: 16, step: 2.5, top: 5 };

/** A row of paduraksa gateways: each cell is one passage; roofed cells get tiered hip roofs. */
export interface GateCell {
  opening: number;
  roofed: boolean;
}

export const OUTER_GATE = { x: -41, base: GATE_TERRACE.top, top: 11.5, depth: 2.4, pylon: 1 };
export const OUTER_CELLS: readonly GateCell[] = [
  { opening: 1.4, roofed: false },
  { opening: 2.6, roofed: false },
  { opening: 1.4, roofed: false },
];

export const INNER_GATE = { x: -26, base: PLATEAU.top, top: 17, depth: 3, pylon: 1.2 };
export const INNER_CELLS: readonly GateCell[] = [
  { opening: 1.4, roofed: false },
  { opening: 2, roofed: true },
  { opening: 3, roofed: false },
  { opening: 2, roofed: true },
  { opening: 1.4, roofed: false },
];

/** Stairways through the main row: the central and inner flanking gates only, per the survey. */
export const INNER_STAIRS: readonly { z: number; width: number }[] = [
  { z: 0, width: 2.6 },
  { z: -3.7, width: 1.7 },
  { z: 3.7, width: 1.7 },
];

/** Two-terrace square platform ~37 m NE of the main gate, with the 4 × 4 m burning pit. */
export const PEMBAKARAN = { x: 10, z: -18, half: 13, upperHalf: 9, lowerH: 1.8, upperH: 1.25, pitHalf: 2, base: PLATEAU.top };

/** Reception terrace 38 m long N–S, 7 m wide, 1.5 m high, with 20 column bases. */
export const PASEBAN = { x: -12, z: 42, halfX: 3.5, halfZ: 19, height: 1.5 };

/** Walled audience court: stage (pendopo) 1.46 m high with 24 umpak, pringgitan behind it. */
export const PENDOPO = {
  cx: 43,
  cz: 34,
  halfX: 20,
  halfZ: 15,
  wall: 3,
  stage: { x: 43, z: 30.3, halfX: 10, halfZ: 10, height: 1.46 },
  pringgitan: { x: 43, z: 44, halfX: 10, halfZ: 3, height: 1 },
};

/** Walled bathing courtyards east of the pendopo; basins sink below the raised paving. */
export const KEPUTREN = { cx: 77.5, cz: 34, halfX: 12.5, halfZ: 12, wall: 2 };
export const SQUARE_POOLS: readonly { x: number; z: number; hx: number; hz: number }[] = [
  { x: 69.8, z: 29, hx: 2.8, hz: 2.8 },
  { x: 75.2, z: 26.5, hx: 1.4, hz: 3 },
  { x: 75.2, z: 39.5, hx: 1.4, hz: 3 },
];
/** Eight round basins in three rows in the eastern court. */
export const ROUND_POOLS: readonly { x: number; z: number }[] = [
  { x: 80.5, z: 27.5 },
  { x: 84, z: 27.5 },
  { x: 87.5, z: 27.5 },
  { x: 80.5, z: 34 },
  { x: 84, z: 34 },
  { x: 87.5, z: 34 },
  { x: 82.25, z: 40.5 },
  { x: 85.75, z: 40.5 },
];
export const POOL_DEPTH = 1.35;

/** Stone terrace outside the pendopo's south-east corner with the three miniature shrines. */
export const KECIL_TERRACE = { x: 74, z: 58, halfX: 9, halfZ: 4.5, height: 1.2, top: PLATEAU.top + 1.2 };

/** Central shrine of the row, dedicated to Vishnu; its flanking shrines to Shiva and Brahma. */
export const KECIL_BESAR: ShrineSpec = {
  foot: { half: 1.7, height: 0.7 },
  body: { half: 1.2, height: 1.9, wall: 0.4 },
  door: { width: 0.6, height: 1.3 },
  doors: ["west"],
  stairWidth: 1,
  roof: { tiers: 2, first: 1.3, shrink: 0.78, finial: "ratna" },
  crown: { kind: "ratna", height: 0.9 },
  niches: "deity",
};

export const KECIL: ShrineSpec = {
  foot: { half: 1.3, height: 0.55 },
  body: { half: 0.9, height: 1.5, wall: 0.35 },
  door: { width: 0.5, height: 1.1 },
  doors: ["west"],
  stairWidth: 0.9,
  roof: { tiers: 2, first: 1, shrink: 0.78, finial: "ratna" },
  crown: { kind: "ratna", height: 0.7 },
  niches: "deity",
};

export const KECIL_SPECS: Record<"kecil" | "besar", ShrineSpec> = { kecil: KECIL, besar: KECIL_BESAR };

export const KECILS: readonly { key: "kecil" | "besar"; z: number }[] = [
  { key: "kecil", z: 54.5 },
  { key: "besar", z: 58 },
  { key: "kecil", z: 61.5 },
];
