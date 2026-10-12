import { describe, expect, it } from "vitest";
import { sewuShrines } from "./index";

describe("Sewu layout", () => {
  it("has 249 temples: the main temple, 8 apit and 240 perwara", () => {
    const shrines = sewuShrines();
    expect(shrines).toHaveLength(249);
    const bySpec = new Map<unknown, number>();
    for (const s of shrines) bySpec.set(s.spec, (bySpec.get(s.spec) ?? 0) + 1);
    expect([...bySpec.values()].sort((a, b) => a - b)).toEqual([1, 8, 240]);
  });

  it("keeps every perwara inside the compound wall", () => {
    for (const { at } of sewuShrines()) {
      expect(Math.abs(at.x)).toBeLessThan(82.5 - 3);
      expect(Math.abs(at.z)).toBeLessThan(92.5 - 3);
    }
  });
});
