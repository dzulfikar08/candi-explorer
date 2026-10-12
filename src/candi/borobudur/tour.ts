import { Vector3 } from "three";
import type { TourSection } from "../types";
import { AXES, CIRCULAR_TERRACES, SQUARE_LEVELS, type Vec2, flightsForAxis, redentedOutline } from "./layout";

const EYE = 1.65;

/**
 * Pradaksina: enter from the east, walk each level clockwise (monument on the right), and climb the
 * east stairway to the next level, ending beside the main stupa.
 */
export function buildTour(): TourSection[] {
  const flights = flightsForAxis(AXES[0]);
  const eye = (x: number, y: number, z: number) => new Vector3(x, y + EYE, z);
  const climb = (i: number) => [eye(flights[i].sBottom, flights[i].yLow, 0), eye(flights[i].sTop, flights[i].yHigh, 0)];

  /** A loop starting and ending on the east axis, walked clockwise as seen from above. */
  const squareLoop = (half: number, y: number) => {
    // redentedOutline runs south → east → north → west; reversed it runs clockwise.
    const loop = redentedOutline(half).reverse();
    const start = loop.findIndex((p) => p.z === 0 && p.x > 0);
    const ordered: Vec2[] = [...loop.slice(start), ...loop.slice(0, start + 1)];
    return ordered.map((p) => eye(p.x, y, p.z));
  };
  const circleLoop = (r: number, y: number) =>
    Array.from({ length: 97 }, (_, i) => {
      // Increasing angle from +x toward +z is clockwise from above (east → south).
      const a = (i / 96) * Math.PI * 2;
      return eye(Math.cos(a) * r, y, Math.sin(a) * r);
    });

  const corridor = (level: number) => squareLoop(SQUARE_LEVELS[level + 1].half + 1.15, SQUARE_LEVELS[level].top);
  const [c1, c2, c3] = CIRCULAR_TERRACES;
  const platform = SQUARE_LEVELS[5].top;

  return [
    {
      topic: "landscape",
      label: "Approach from the east",
      points: [eye(110, 0, 0), ...climb(0)],
      lookRight: 0,
    },
    {
      topic: "kamadhatu",
      label: "Base terrace · Kamadhatu",
      points: [...squareLoop(58, SQUARE_LEVELS[0].top), ...climb(1)],
      lookRight: 0.3,
    },
    { topic: "gallery1", label: "First gallery", points: [...corridor(1), ...climb(2)], lookRight: 0.35 },
    { topic: "gallery2", label: "Second gallery", points: [...corridor(2), ...climb(3)], lookRight: 0.35 },
    { topic: "gallery34", label: "Third gallery", points: [...corridor(3), ...climb(4)], lookRight: 0.35 },
    { topic: "gallery34", label: "Fourth gallery", points: [...corridor(4), ...climb(5)], lookRight: 0.35 },
    {
      topic: "arupadhatu",
      label: "Top platform · Arupadhatu",
      points: [...circleLoop(34, platform), ...climb(6)],
      lookRight: 0.45,
    },
    {
      topic: "stupas",
      label: "First and second circular terraces",
      points: [...circleLoop(22.2, c1.top), ...climb(7), ...circleLoop(15.7, c2.top), ...climb(8)],
      lookRight: 0.5,
    },
    { topic: "mainStupa", label: "Main stupa", points: circleLoop(8.8, c3.top), lookRight: 0.75 },
  ];
}
