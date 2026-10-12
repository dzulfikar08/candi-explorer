import { eye, loop, path } from "../kit/tour";
import type { TourSection } from "../types";
import { ADVISERS, BATUR, COURT, GATE1, GATE2, LEVELS, PENDAPA, PETILASAN, PUNDEN, RELIEF_LEVELS, ROYAL, TURTLE } from "./layout";

/** Up the west stair of terrace i (0-based): bottom and top of the flight. */
function climb(i: number) {
  const l = LEVELS[i];
  return [eye(l.west - 2.7, i === 0 ? 0 : LEVELS[i - 1].y, 0), eye(l.west + 0.3, l.y, 0)];
}

/**
 * The long ascent: lawn, guardians, great gate, then stair after stair — petilasan, turtle floor,
 * story panels, pendapa, the inscribed gate, the royal statues, and finally the prayer court with
 * its cube building and the Saraswati platform.
 */
export function buildTour(): TourSection[] {
  const t1 = LEVELS[0];
  const top = LEVELS[12];
  return [
    {
      topic: "overview",
      label: "Through the great gate",
      points: [
        ...path(0, [t1.west - 20, 0]),
        ...climb(0),
        eye(GATE1.x - 1.5, t1.y, 0),
        eye(GATE1.x + 3, t1.y, 0),
        ...climb(1),
        eye(PETILASAN.x, LEVELS[1].y, -4),
        ...climb(2),
        eye(TURTLE.x - 1, LEVELS[2].y, 0),
      ],
      lookRight: 0.2,
    },
    {
      topic: "reliefs",
      label: "Turtle, sun and lingga",
      points: [
        ...loop(4.6, LEVELS[2].y, { cx: TURTLE.x, start: "west" }),
        ...climb(3),
        eye(RELIEF_LEVELS[0].mid, LEVELS[3].y, 0),
        ...climb(4),
        eye(RELIEF_LEVELS[1].mid, LEVELS[4].y, 0),
      ],
      lookRight: 0.3,
    },
    {
      topic: "ascent",
      label: "Pendapa and the inscribed gate",
      points: [
        ...climb(5),
        eye(PENDAPA[0].x, LEVELS[5].y, 0),
        ...climb(6),
        eye(PENDAPA[2].x, LEVELS[6].y, 0),
        ...climb(7),
        eye(GATE2.x + 2, LEVELS[7].y, 0),
      ],
      lookRight: 0.25,
    },
    {
      topic: "statues",
      label: "Advisers of the last king",
      points: [
        eye(ADVISERS.x, LEVELS[7].y, -2),
        ...climb(8),
        eye(ROYAL.x, LEVELS[8].y, 0),
        ...loop(4.5, LEVELS[8].y, { cx: ROYAL.x, start: "west" }),
      ],
      lookRight: 0.3,
    },
    {
      topic: "summit",
      label: "The prayer court",
      points: [
        ...climb(9),
        ...climb(10),
        ...climb(11),
        ...climb(12),
        eye(COURT.cx - 5.5, top.y, 0),
        eye(BATUR.x - 5.4, top.y, 0),
        eye(BATUR.x - 4.4, top.y + BATUR.height, 0),
        eye(BATUR.x - 1.3, top.y + BATUR.height, 0),
        eye(BATUR.x - 4.4, top.y + BATUR.height, 0),
        eye(PUNDEN.x - 5.8, top.y, 0),
        eye(PUNDEN.x - 2.3, top.y + PUNDEN.height, 0),
      ],
      lookRight: 0.25,
    },
  ];
}
