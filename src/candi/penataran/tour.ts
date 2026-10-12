import { Vector3 } from "three";
import { type Direction, DIRECTIONS, type Vec2 } from "../kit/plan";
import { type ShrineSpec, shrineLayout } from "../kit/shrine";
import { eye, loop } from "../kit/tour";
import type { TourSection } from "../types";
import { CELLA, DATED, NAGA } from "./model";

/**
 * Walk in from the west, through the pendopo terraces of the first courtyard, then climb the
 * Dated Temple, the Naga Temple and finally the main temple, court by rising court.
 */

/** Climb a shrine's front stair, circle its body, look in at the door, come back down. */
function shrineWalk(spec: ShrineSpec, at: Vec2, baseY: number, front: Direction, ringHalfZ?: number): Vector3[] {
  const layout = shrineLayout(spec);
  const v = DIRECTIONS[front];
  const p = (dist: number, h: number) => eye(at.x + v.x * dist, baseY + h, at.z + v.z * dist);
  const climb = layout.flights.flatMap((f) => [p(f.sBottom + 0.3, f.yLow), p(f.sTop - 0.4, f.yHigh)]);
  const ring = (layout.levels.at(-1)!.half + spec.body.half) / 2 + 0.15;
  return [
    p(layout.stairReach + 4, 0),
    ...climb,
    ...loop(ring, baseY + layout.footTop, { halfZ: ringHalfZ ?? ring, cx: at.x, cz: at.z, start: front }),
    p(spec.body.half * 0.55, layout.footTop),
    p(ring, layout.footTop),
    ...[...climb].reverse(),
    p(layout.stairReach + 4, 0),
  ];
}

export function buildTour(): TourSection[] {
  const dated = shrineWalk(DATED, { x: -21, z: 16 }, 0, "west");
  const naga = shrineWalk(NAGA, { x: 2, z: 3 }, 1.2, "west", 2.5);
  const cella = shrineWalk(CELLA, { x: 48, z: 0 }, 9.79, "west");

  return [
    {
      topic: "overview",
      label: "Approach from the west",
      lookRight: 0,
      points: [eye(-120, 0, 0), eye(-100, 0, 0), eye(-88, 0, 0), eye(-74, 0, 0)],
    },
    {
      topic: "pendopo",
      label: "The pendopo terraces",
      lookRight: 0.3,
      points: [
        eye(-52, 0, 7),
        eye(-52, 0.72, 4.6),
        eye(-52, 1.5, 0),
        ...loop(18.5, 1.44, { halfZ: 9.42, cx: -52, cz: -8, start: "south" }),
        eye(-33.5, 1.5, -8),
        eye(-31.5, 0.7, -8),
        eye(-29, 0, -8),
        eye(-38, 0, 4),
        eye(-47, 0, 11),
        eye(-57.5, 0, 13),
        eye(-56, 0.75, 13),
        eye(-53, 1.56, 13),
        ...loop(14.5, 1.5, { halfZ: 4.6, cx: -40, cz: 13, start: "west" }),
        eye(-55.5, 0.75, 13),
        eye(-58, 0, 13),
      ],
    },
    {
      topic: "dated",
      label: "The Dated Temple",
      lookRight: 0.3,
      points: [eye(-28, 0, 16), ...dated],
    },
    {
      topic: "naga",
      label: "The Naga Temple",
      lookRight: 0.3,
      points: [
        eye(-30, 0, 8),
        eye(-27.5, 0, 0),
        eye(-26, 0.6, 0),
        eye(-23.5, 1.26, 0),
        eye(-8, 1.26, 2),
        ...naga,
        eye(6, 1.26, 0),
        eye(14, 1.26, 0),
      ],
    },
    {
      topic: "reliefs",
      label: "Climbing the main temple",
      lookRight: 0.3,
      points: [
        eye(19, 1.26, 0),
        eye(23, 1.9, 0),
        eye(26, 2.66, 0),
        eye(28.4, 2.9, 0),
        eye(30.6, 4.8, 0),
        eye(32.4, 5.4, 0),
        eye(34.6, 7.2, 0),
        ...loop(13, 7.4, { halfZ: 10, cx: 48, cz: 0, start: "west" }),
      ],
    },
    {
      topic: "summit",
      label: "The top shrine",
      lookRight: 0.3,
      points: [eye(36, 7.9, 0), eye(38.1, 9.6, 0), ...cella, eye(38, 7.46, 0), eye(32, 5.06, 0), eye(28, 2.66, 8)],
    },
  ];
}
