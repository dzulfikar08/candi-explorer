import { path } from "../kit/tour";
import type { TourSection } from "../types";

/**
 * The pilgrim comes down from the Tampaksiring road (drawn at valley-floor grade), passes the
 * split gate onto the east bank, walks the five eastern shrines, crosses the footbridge to the
 * four western ones and the hermitage caves, then returns along the Pakerisan.
 */
export function buildTour(): TourSection[] {
  return [
    {
      topic: "overview",
      label: "Down into the gorge",
      points: [...path(0, [3, -58], [3, -47], [3, -38], [3, -31.5], [3.4, -25])],
      lookRight: 0,
    },
    {
      topic: "east",
      label: "Five shrines on the east bank",
      points: [...path(0, [3.6, -22], [4.2, -17], [4.4, -13], [4.2, -8.5], [4.6, -4.5], [5, -1])],
      lookRight: -0.45,
    },
    {
      topic: "west",
      label: "Across the river · four western shrines",
      points: [...path(0, [4, -14.6], [0.5, -15.2], [-3.5, -15.2], [-6.5, -15.4], [-8.3, -17.5], [-8.5, -21.5])],
      lookRight: 0.35,
    },
    {
      topic: "hermits",
      label: "Hermitage caves",
      points: [...path(0, [-8.5, -16], [-8.5, -8], [-8.3, -1], [-8.3, 6], [-8.5, 13])],
      lookRight: -0.5,
    },
    {
      topic: "water",
      label: "The sacred Pakerisan",
      points: [...path(0, [-8.3, 5], [-7.8, -10], [-6.8, -14.8], [-3, -15.4], [0.6, -15.2], [3, -11], [3.2, 0], [3, 9])],
      lookRight: 0.4,
    },
  ];
}
