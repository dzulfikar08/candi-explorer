import type { Vector3 } from "three";
import { stairRun } from "../kit/shrine";
import { eye, loop, path } from "../kit/tour";
import type { TourSection } from "../types";
import { BUNGSU, MAHLIGAI, PALANGKA, TUA, type Tier } from "./layout";

/**
 * Enter by the north gate, circle the Mahligai tower to its south door, cross to Palangka, then
 * climb Candi Tua by its east stair, walk around the crowning drum and descend by the west stair,
 * finishing at Candi Bungsu. Each structure is circled clockwise (centre on the pilgrim's right).
 */

/** Climb Tua's three flights on the given axis; `sign` 1 = east, −1 = west. */
function climbTua(sign: 1 | -1, lead: number): Vector3[] {
  const tiers: Tier[] = [TUA.t1, TUA.t2, TUA.t3];
  const out: Vector3[] = [];
  let prevTop = 0;
  for (const t of tiers) {
    out.push(eye(sign * (t.halfX + stairRun(t.top - t.bottom) + lead), prevTop, TUA.cz));
    out.push(eye(sign * (t.halfX - 0.4), t.top, TUA.cz));
    prevTop = t.top;
  }
  return out;
}

export function buildTour(): TourSection[] {
  const mahligaiDoor = eye(MAHLIGAI.cx, 0, MAHLIGAI.cz + MAHLIGAI.plinth.halfZ - 0.7);
  const drumLoop = loop(6.9, TUA.drum.bottom, { halfZ: 5.1, cz: TUA.cz, start: "east" });
  const ringTop = TUA.drum.bottom;

  return [
    {
      topic: "overview",
      label: "In through the north gate",
      points: path(0, [0, -55], [0, -37], [0, -27], [2, -20], [MAHLIGAI.cx, MAHLIGAI.cz - 6.3]),
      lookRight: 0,
    },
    {
      topic: "mahligai",
      label: "Stupa Mahligai, the lotus tower",
      points: [
        ...loop(5.7, 0, { halfZ: 6.3, cx: MAHLIGAI.cx, cz: MAHLIGAI.cz, start: "north" }),
        ...path(0, [7.2, -13], [7.2, -5.5], [mahligaiDoor.x, mahligaiDoor.z]),
      ],
      lookRight: 0.3,
    },
    {
      topic: "palangka",
      label: "Candi Palangka, the altar",
      points: [
        ...path(0, [mahligaiDoor.x, mahligaiDoor.z], [8.5, -4], [PALANGKA.cx, PALANGKA.cz + 3.25]),
        ...loop(3.55, 0, { halfZ: 3.25, cx: PALANGKA.cx, cz: PALANGKA.cz, start: "south" }),
      ],
      lookRight: 0.25,
    },
    {
      topic: "tua",
      label: "Candi Tua, up the terraces",
      points: [
        ...path(0, [15, -3], [17.5, 5], [TUA.t1.halfX + stairRun(TUA.t1.top) + 0.5, TUA.cz]),
        ...climbTua(1, 0.5),
        ...drumLoop,
        ...path(ringTop, [6.9, TUA.cz], [0, 16.5], [-6.9, TUA.cz], [-10, TUA.cz]),
        ...climbTua(-1, 0).reverse(),
      ],
      lookRight: 0.3,
    },
    {
      topic: "bungsu",
      label: "Candi Bungsu",
      points: [...path(0, [-22, 4], [-17, -1.5], [BUNGSU.cx + BUNGSU.t1.halfX + 0.8, BUNGSU.cz]), ...loop(7.4, 0, { halfZ: 8.9, cx: BUNGSU.cx, cz: BUNGSU.cz, start: "east" })],
      lookRight: 0.25,
    },
  ];
}
