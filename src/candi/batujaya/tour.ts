import type { Vector3 } from "three";
import { eye, loop, path } from "../kit/tour";
import type { TourSection } from "../types";
import { BLANDONGAN, BLANDONGAN_HALF, BLANDONGAN_RUN, BLANDONGAN_TOP, JIWA } from "./model";

/** Climb the east flight: ground beyond the flight, then the platform top at its edge. */
const STAIR_BOTTOM = BLANDONGAN_HALF + BLANDONGAN_RUN + 0.3;
const STAIR_TOP = BLANDONGAN_HALF - 0.4;

/**
 * No stairs at Jiwa — the walk keeps to its pradaksina path — then across the paddies to
 * Blandongan, up its east flight, a clockwise turn of the hallway, and down on the west side.
 */
export function buildTour(): TourSection[] {
  const jiwa: Vector3[] = loop(10.9, 0, { cx: JIWA.x, cz: JIWA.z, start: "south" });
  return [
    {
      topic: "overview",
      label: "Across the rice paddies to Candi Jiwa",
      points: path(0, [82.5, 124.5], [72, 100], [64, 90]),
      lookRight: 0,
    },
    {
      topic: "jiwa",
      label: "Pradaksina around the lotus platform",
      points: jiwa,
      lookRight: 0.3,
    },
    {
      topic: "brick",
      label: "North-west across the fields to Blandongan",
      points: path(0, [64, 90], [34, 52], [-2, 8], [-30, -40], [BLANDONGAN.x + STAIR_BOTTOM + 2, BLANDONGAN.z]),
      lookRight: 0.2,
    },
    {
      topic: "blandongan",
      label: "On Candi Blandongan's platform",
      points: [
        eye(BLANDONGAN.x + STAIR_BOTTOM, 0, BLANDONGAN.z),
        eye(BLANDONGAN.x + STAIR_TOP, BLANDONGAN_TOP, BLANDONGAN.z),
        ...loop(8.8, BLANDONGAN_TOP, { cx: BLANDONGAN.x, cz: BLANDONGAN.z, start: "east" }),
        eye(BLANDONGAN.x - STAIR_TOP, BLANDONGAN_TOP, BLANDONGAN.z),
        eye(BLANDONGAN.x - STAIR_BOTTOM, 0, BLANDONGAN.z),
      ],
      lookRight: 0.3,
    },
  ];
}
