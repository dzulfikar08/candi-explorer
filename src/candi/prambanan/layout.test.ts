import { describe, expect, it } from "vitest";
import { shrineLayout } from "../kit/shrine";
import { INNER, PERWARA, PERWARA_ROWS, SHIVA, TRIMURTI_FLANK, VAHANA, perwaraPlacements } from "./layout";

describe("Prambanan layout", () => {
  it("has 224 perwara in rows of 44, 52, 60 and 68", () => {
    expect(PERWARA_ROWS.map((r) => 4 * (r.perSide - 1))).toEqual([44, 52, 60, 68]);
    expect(perwaraPlacements()).toHaveLength(224);
  });

  it("has sixteen temples in the inner court, 240 in all", () => {
    expect(INNER).toHaveLength(16);
    expect(INNER.length + perwaraPlacements().length).toBe(240);
  });

  it("matches the published heights within 5%", () => {
    const close = (actual: number, published: number) => expect(Math.abs(actual - published) / published).toBeLessThan(0.05);
    close(shrineLayout(SHIVA).height, 47);
    close(shrineLayout(TRIMURTI_FLANK).height, 33);
    close(shrineLayout(VAHANA).height, 25);
    close(shrineLayout(PERWARA).height, 14);
  });

  it("keeps the Shiva temple's stairs clear of the flanking temples", () => {
    const reach = shrineLayout(SHIVA).stairReach;
    const flank = shrineLayout(TRIMURTI_FLANK).levels[0].half;
    const brahma = INNER.find((t) => t.key === "brahma")!;
    expect(brahma.at.z - flank).toBeGreaterThan(reach);
  });
});
