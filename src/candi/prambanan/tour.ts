import type { Vector3 } from "three";
import { shrineLayout } from "../kit/shrine";
import { eye, loop, path } from "../kit/tour";
import type { TourSection } from "../types";
import { PERWARA_ROWS, SHIVA, VAHANA } from "./layout";

/**
 * Enter by the east gate, step round the kelir screen, greet Nandi, then circle the Shiva temple
 * clockwise on its gallery and body terrace, look into the east chamber, circle Brahma and Vishnu
 * and finish between the perwara rows.
 */
export function buildTour(): TourSection[] {
  const shiva = shrineLayout(SHIVA);
  const [gallery, foot] = shiva.levels;
  const [galleryFlight, footFlight] = shiva.flights;
  const nandi = shrineLayout(VAHANA);
  const nandiX = 40;

  // Climbing a flight on the east axis (Shiva) or the west axis of Nandi.
  const east = (s: number, y: number) => eye(s, y, 0);
  const climbGallery = [east(galleryFlight.sBottom + 0.3, 0), east(galleryFlight.sTop - 0.4, galleryFlight.yHigh)];
  const climbFoot = [east(footFlight.sBottom + 0.3, footFlight.yLow), east(footFlight.sTop - 0.4, footFlight.yHigh)];
  const nandiClimb = nandi.flights.flatMap((f) => [eye(nandiX - f.sBottom - 0.3, f.yLow, 0), eye(nandiX - f.sTop + 0.4, f.yHigh, 0)]);
  const reverse = (points: Vector3[]) => [...points].reverse();

  const galleryWalk = (gallery.half + foot.half) / 2 + 0.2;
  const terraceWalk = (foot.half + SHIVA.body.half) / 2 + 0.2;
  const ring = (PERWARA_ROWS[0].half + PERWARA_ROWS[1].half) / 2;

  return [
    {
      topic: "overview",
      label: "Approach from the east",
      points: [...path(0, [150, 0], [53.6, 0], [53.2, 3.5], [48, 12], [30, 12], [26, 2])],
      lookRight: 0,
    },
    {
      topic: "nandi",
      label: "Nandi, facing Shiva",
      points: [...nandiClimb, eye(nandiX - VAHANA.body.half + 0.6, nandi.footTop, 0), ...reverse(nandiClimb), eye(25, 0, 0)],
      lookRight: 0,
    },
    {
      topic: "ramayana",
      label: "Shiva temple · gallery",
      points: [...climbGallery, ...loop(galleryWalk, gallery.top)],
      lookRight: -0.35,
    },
    {
      topic: "shiva",
      label: "Shiva temple · body and chambers",
      points: [...climbFoot, ...loop(terraceWalk, foot.top), east(SHIVA.body.half * 0.5, foot.top)],
      lookRight: 0.3,
    },
    {
      topic: "trimurti",
      label: "Brahma, then Vishnu",
      points: [
        east(terraceWalk, foot.top),
        ...reverse(climbFoot),
        ...reverse(climbGallery),
        ...path(0, [24, 20], [24, 30]),
        ...loop(16, 0, { halfZ: 12, cz: 36 }),
        ...path(0, [24, 22], [24, -22], [24, -30]),
        ...loop(16, 0, { halfZ: 12, cz: -36 }),
      ],
      lookRight: 0.3,
    },
    {
      topic: "perwara",
      label: "Between the perwara rows",
      points: [...path(0, [16, -36], [6, -47], [3.2, -53], [0, -57], [0, -ring]), ...loop(ring, 0, { start: "north" })],
      lookRight: 0.2,
    },
  ];
}
