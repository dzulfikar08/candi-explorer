import type { Vec2 } from "../kit/plan";

/**
 * The climb. Cetho ascends its hill as a chain of terraces running west (lowest, the entrance) to
 * east (the prayer court): id.wikipedia reports ruins "on 14 terraces stretching from west to
 * east", 13 still traceable today, nine of them rebuilt. No terrace dimensions are published, so
 * the plan below is an approximation: every level rises the same 1.7 m and the whole 158 m complex
 * is compressed onto the modelled hill. The features of the nine rebuilt levels (Indonesia Kaya's
 * terrace list) are laid out in the same order across the thirteen drawn terraces.
 */

/** Rise of every terrace; the real levels are cut into the slope and differ. */
export const RISE = 1.7;

const SIZES = [
  { d: 12, hz: 20 }, // 1 · great bentar gate and guardian statues
  { d: 12, hz: 19 }, // 2 · petilasan of Ki Ageng Krincingwesi
  { d: 12, hz: 18 }, // 3 · turtle, Surya Majapahit and phallus floor relief
  { d: 11, hz: 17 }, // 4 · carved story panels
  { d: 11, hz: 16 }, // 5 · carved story panels, second level
  { d: 10, hz: 15 }, // 6 · pendapa
  { d: 10, hz: 14 }, // 7 · pendapa
  { d: 10, hz: 13 }, // 8 · inscribed gate, Sabdapalon and Nayagenggong
  { d: 11, hz: 12 }, // 9 · kuntobimo and Brawijaya V
  { d: 12, hz: 12 }, // 10–12 · quiet unrestored terraces
  { d: 13, hz: 12 },
  { d: 14, hz: 12 },
  { d: 22, hz: 12 }, // 13 · prayer court: paduraksa, batur, cube building, Saraswati
] as const;

export interface Level {
  /** Depth along x and half width along z. */
  d: number;
  hz: number;
  /** West edge, mid and floor height of this terrace. */
  west: number;
  mid: number;
  y: number;
}

const SPAN = SIZES.reduce((sum, s) => sum + s.d, 0);

export const LEVELS: Level[] = SIZES.map((s, i) => {
  const west = -SPAN / 2 + SIZES.slice(0, i).reduce((sum, u) => sum + u.d, 0);
  return { d: s.d, hz: s.hz, west, mid: west + s.d / 2, y: (i + 1) * RISE };
});

/** The great candi bentar at the foot of the climb (a 1970s addition). */
export const GATE1 = { x: LEVELS[0].west + 4.5, y: LEVELS[0].y, halfGap: 2.9, height: 8.5 };

/** Guardian statues before the great gate, on terrace 1's floor. */
export const GUARDIANS: readonly Vec2[] = [
  { x: LEVELS[0].west + 2.2, z: -2.8 },
  { x: LEVELS[0].west + 2.2, z: 2.8 },
  { x: LEVELS[0].west + 2.2, z: -6.2 },
  { x: LEVELS[0].west + 2.2, z: 6.2 },
];

/** Memorial shrine (petilasan) of Ki Ageng Krincingwesi, north of the path. */
export const PETILASAN: Vec2 = { x: LEVELS[1].mid - 1, z: -9 };

/** Floor relief of terrace 3: turtle, Surya Majapahit disk and a ~2 m phallus. */
export const TURTLE = { x: LEVELS[2].mid, z: 0 };

/** Terraces with rows of story panels flanking the path. */
export const RELIEF_LEVELS = [LEVELS[3], LEVELS[4]];
export const RELIEF_Z = 5.2;

/** Wooden pendapa flanking the path on two levels. */
export const PENDAPA: readonly { x: number; z: number; y: number }[] = [
  { x: LEVELS[5].mid, z: -8.5, y: LEVELS[5].y },
  { x: LEVELS[5].mid, z: 8.5, y: LEVELS[5].y },
  { x: LEVELS[6].mid, z: -8, y: LEVELS[6].y },
  { x: LEVELS[6].mid, z: 8, y: LEVELS[6].y },
];

/** Second split gate; sources place the Old Javanese inscription on its right (south) wall. */
export const GATE2 = { x: LEVELS[7].west + 2.5, y: LEVELS[7].y, halfGap: 2.2, height: 7.5 };

/** Sabdapalon (north) and Nayagenggong (south) behind the inscribed gate. */
export const ADVISERS = { x: LEVELS[7].mid + 1.5, z: 7.8 };

/** Kuntobimo phallus (north) and Brawijaya V as Mahadewa (south). */
export const ROYAL = { x: LEVELS[8].mid - 0.5, z: 7 };

/** The walled prayer court on the top terrace; its closing gate is drawn as a paduraksa — sources
 * only say the gate is locked outside ceremony days. */
export const COURT = { cx: LEVELS[12].west + 6.5, halfX: 5.6, halfZ: 4.6, height: 2.4, gateWidth: 2.2 };

/** Moulded platform inside the court carrying the cube building. */
export const BATUR = { x: COURT.cx + 1, halfX: 3.4, halfZ: 3, height: 1.2 };

/** Raised platform east of the court with the Saraswati statue (placed in the 2000s). */
export const PUNDEN = { x: LEVELS[12].west + 18.5, halfX: 2.6, halfZ: 2.6, height: 2.3 };
