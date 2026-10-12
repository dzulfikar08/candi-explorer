import type { Vector3 } from "three";
import type { Flight } from "../kit/shrine";
import { eye, loop, path } from "../kit/tour";
import type { TourSection } from "../types";
import { FLIGHTS, TERRACE_TOP } from "./model";

/**
 * Climb level by level. On the ground the walk follows the story order of the terrace walls:
 * the Tantri fables begin at the north-west corner and Kunjarakarna at the north-east
 * (id-Wikipedia). The sources disagree on the ritual direction, clockwise pradaksina (id) or
 * counter-clockwise prasawya (en), so the topic text avoids the claim and the walk simply
 * follows the corners in that published order.
 */
export function buildTour(): TourSection[] {
  // Each stair is a double flight; the walk uses the north one.
  const climbs = FLIGHTS.map((f: Flight) => [eye(-(f.sBottom + 0.5), f.yLow, -1.05), eye(-(f.sTop - 0.45), f.yHigh, -1.05)]);
  const descend = [...climbs].reverse().flatMap((c) => [...c].reverse());
  const approach = path(0, [-32, 0], [-22, 0], [-14.5, 0]);

  return [
    {
      topic: "overview",
      label: "Approach from the west",
      points: [...approach],
      lookRight: 0,
    },
    {
      topic: "reliefs",
      label: "Fables around the first terrace",
      points: [...loop(8.4, 0, { halfZ: 13.3, start: "west" })],
      lookRight: -0.3,
    },
    {
      topic: "reliefs",
      label: "Kunjarakarna · first terrace",
      points: [...climbs[0], ...loop(6.1, 2.4, { halfZ: 10.1, cx: 0.5 })],
      lookRight: -0.3,
    },
    {
      topic: "reliefs",
      label: "Parthayajna · second terrace",
      points: [...climbs[1], ...loop(4.4, 4.8, { halfZ: 7.3, cx: 0.9 })],
      lookRight: -0.3,
    },
    {
      topic: "reliefs",
      label: "Arjunawiwaha · third terrace",
      points: [...climbs[2], ...loop(3.1, TERRACE_TOP, { halfZ: 4.4, cx: 1.2 })],
      lookRight: -0.3,
    },
    {
      topic: "kingdom",
      label: "The chamber threshold and the lost roof",
      points: [eye(-0.9, TERRACE_TOP, 0), eye(0.8, TERRACE_TOP, 0), eye(-1.9, TERRACE_TOP, 0), ...descend, eye(-13, 0, 0)],
      lookRight: 0,
    },
  ];
}
