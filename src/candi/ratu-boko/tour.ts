import { eye, loop, path } from "../kit/tour";
import { stairRun } from "../kit/shrine";
import type { TourSection } from "../types";
import { GATE_TERRACE, INNER_GATE, KEPUTREN, KECIL_TERRACE, PASEBAN, PEMBAKARAN, PENDOPO, PLATEAU } from "./layout";

/**
 * The pilgrim's walk, west to east: up the two talud flights to the outer gate row, through it
 * and across the paving to the five-arched main row, then over the plateau to the burning
 * platform, the paseban, the pendopo court and the keputren pools, ending at the miniature
 * shrines. Stair positions follow the constants in layout.ts.
 */
export function buildTour(): TourSection[] {
  // West front stairs: two 2.5 m flights (run 3.3 each), then 4.5 m up to the plateau (run 5.7).
  const t0Edge = GATE_TERRACE.cx - GATE_TERRACE.lowerHalfX;
  const t1Edge = GATE_TERRACE.cx - GATE_TERRACE.upperHalfX;
  const run25 = stairRun(GATE_TERRACE.step);
  const runUp = stairRun(PLATEAU.top - GATE_TERRACE.top);
  // Pembakaran stairs: 1.8 m lower flight, 1.25 m upper flight.
  const pLower = PEMBAKARAN.x - PEMBAKARAN.half;
  const pUpper = PEMBAKARAN.x - PEMBAKARAN.upperHalf;
  const pTop = PEMBAKARAN.base + PEMBAKARAN.lowerH + PEMBAKARAN.upperH;
  const sLower = PASEBAN.x - PASEBAN.halfX;
  const kStage = PENDOPO.stage.z - PENDOPO.stage.halfZ;
  const kStair = KECIL_TERRACE.x - KECIL_TERRACE.halfX;

  return [
    {
      topic: "overview",
      label: "The climb to the western gates",
      points: [
        ...path(0, [-66, -14], [-56, -4], [-52.4, -0.9], [t0Edge - run25 + 0.6, -0.5]),
        eye(t0Edge - 0.6, 2.5, -0.3),
        eye(t1Edge + 0.3, 2.8, 0),
        eye(t1Edge + 1.5, GATE_TERRACE.top, 0),
        ...path(GATE_TERRACE.top, [-41, 0], [-36, 0], [-31.5, 0]),
        eye(INNER_GATE.x - runUp + 0.4, GATE_TERRACE.top + 0.3, 0),
        eye(INNER_GATE.x + 0.6, PLATEAU.top - 0.2, 0),
        ...path(PLATEAU.top, [-20, 0], [-14, 0]),
      ],
      lookRight: 0,
    },
    {
      topic: "gates",
      label: "Between the two gate rows",
      points: [
        ...path(PLATEAU.top, [-18, -3.7]),
        eye(INNER_GATE.x + 0.6, PLATEAU.top - 0.2, -3.7),
        eye(INNER_GATE.x - runUp + 0.4, GATE_TERRACE.top + 0.3, -3.7),
        ...path(GATE_TERRACE.top, [-33.5, -2.6], [-33.5, 2.8]),
        eye(INNER_GATE.x - runUp + 0.4, GATE_TERRACE.top + 0.3, 3.7),
        eye(INNER_GATE.x + 0.6, PLATEAU.top - 0.2, 3.7),
        ...path(PLATEAU.top, [-20, 3.7], [-16, 0]),
      ],
      lookRight: 0.35,
    },
    {
      topic: "pembakaran",
      label: "Candi Pembakaran",
      points: [
        ...path(PLATEAU.top, [-10, -6], [-4, -16]),
        eye(pLower - 0.8, PLATEAU.top + 0.1, PEMBAKARAN.z),
        eye(pLower + 1.4, PEMBAKARAN.base + PEMBAKARAN.lowerH - 0.2, PEMBAKARAN.z),
        eye(pUpper - 1.4, PEMBAKARAN.base + PEMBAKARAN.lowerH, PEMBAKARAN.z),
        eye(pUpper + 0.9, pTop - 0.5, PEMBAKARAN.z),
        ...path(pTop, [PEMBAKARAN.x - 6, PEMBAKARAN.z]),
        ...loop(6.4, pTop, { cx: PEMBAKARAN.x, cz: PEMBAKARAN.z }),
      ],
      lookRight: 0.2,
    },
    {
      topic: "pendopo",
      label: "Paseban, then the audience hall",
      points: [
        eye(pUpper + 0.9, pTop - 0.5, PEMBAKARAN.z - 4),
        eye(pUpper - 1.4, PEMBAKARAN.base + PEMBAKARAN.lowerH, PEMBAKARAN.z),
        eye(pLower + 1.4, PEMBAKARAN.base + PEMBAKARAN.lowerH - 0.2, PEMBAKARAN.z),
        eye(pLower - 0.8, PLATEAU.top + 0.1, PEMBAKARAN.z),
        ...path(PLATEAU.top, [-12, 12], [-18, 34]),
        eye(sLower - 0.8, PLATEAU.top + 0.1, PASEBAN.z),
        eye(sLower + 1.2, PLATEAU.top + PASEBAN.height - 0.6, PASEBAN.z),
        ...path(PLATEAU.top + PASEBAN.height, [PASEBAN.x + 1.8, PASEBAN.z]),
        ...loop(2.5, PLATEAU.top + PASEBAN.height, { cx: PASEBAN.x, cz: PASEBAN.z, halfZ: 18 }),
        ...path(PLATEAU.top + PASEBAN.height, [PASEBAN.x + 1.8, PASEBAN.z]),
        eye(sLower + 1.2, PLATEAU.top + PASEBAN.height - 0.6, PASEBAN.z),
        eye(sLower - 0.8, PLATEAU.top + 0.1, PASEBAN.z),
        ...path(PLATEAU.top, [-6, 40], [10, 32], [24, 24], [36, 18.6]),
        eye(PENDOPO.cx, PLATEAU.top, PENDOPO.cz - PENDOPO.halfZ - 3.2),
        eye(PENDOPO.cx, PLATEAU.top, PENDOPO.cz - PENDOPO.halfZ + 2.6),
        eye(PENDOPO.stage.x - 5, PLATEAU.top + 0.1, kStage - 0.5),
        eye(PENDOPO.stage.x - 5, PLATEAU.top + PENDOPO.stage.height - 0.2, kStage + 1.4),
        ...loop(9.1, PLATEAU.top + PENDOPO.stage.height, { cx: PENDOPO.stage.x, cz: PENDOPO.stage.z }),
      ],
      lookRight: 0.25,
    },
    {
      topic: "keputren",
      label: "The bathing courtyards",
      points: [
        eye(PENDOPO.stage.x + 5, PLATEAU.top + PENDOPO.stage.height - 0.2, kStage + 1.4),
        eye(PENDOPO.stage.x + 5, PLATEAU.top + 0.1, kStage - 0.5),
        ...path(PLATEAU.top, [52, 18.6], [60, 26]),
        eye(KEPUTREN.cx - KEPUTREN.halfX - 1.4, PLATEAU.top, PENDOPO.cz),
        eye(KEPUTREN.cx - KEPUTREN.halfX + 2.5, PLATEAU.top, PENDOPO.cz),
        eye(70, PLATEAU.top, 25.5),
        eye(73.2, PLATEAU.top, 24),
        eye(73.2, PLATEAU.top, 33),
        eye(KEPUTREN.cx, PLATEAU.top, PENDOPO.cz),
        eye(79.2, PLATEAU.top, 30.9),
        eye(84, PLATEAU.top, 30.75),
        eye(89, PLATEAU.top, 31),
        eye(89, PLATEAU.top, 36),
        eye(KEPUTREN.cx + KEPUTREN.halfX + 1.8, PLATEAU.top, PENDOPO.cz + 0.5),
      ],
      lookRight: 0.3,
    },
    {
      topic: "kecil",
      label: "Three miniature shrines",
      points: [
        ...path(PLATEAU.top, [92, 42], [88, 54], [64, 50]),
        eye(kStair - 1.1, PLATEAU.top, KECIL_TERRACE.z),
        eye(kStair - 1.1 + 1.4, KECIL_TERRACE.top - 0.3, KECIL_TERRACE.z),
        eye(kStair + 1.4, KECIL_TERRACE.top, KECIL_TERRACE.z),
        ...loop(7.6, KECIL_TERRACE.top, { cx: KECIL_TERRACE.x, cz: KECIL_TERRACE.z, halfZ: 3.4 }),
      ],
      lookRight: 0.2,
    },
  ];
}
