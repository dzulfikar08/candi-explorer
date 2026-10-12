import { describe, expect, it } from "vitest";
import { bayOutline, edgeNormal, offsetLoop, squareRing } from "./plan";

const area = (loop: { x: number; z: number }[]) =>
  Math.abs(loop.reduce((sum, p, i) => sum + p.x * loop[(i + 1) % loop.length].z - loop[(i + 1) % loop.length].x * p.z, 0)) / 2;

describe("plan helpers", () => {
  it("points every bay-outline normal away from the centre", () => {
    const loop = bayOutline(10, 4, 1, 15, 6);
    loop.forEach((p, i) => {
      const q = loop[(i + 1) % loop.length];
      const n = edgeNormal(loop, i);
      const mid = { x: (p.x + q.x) / 2, z: (p.z + q.z) / 2 };
      // Stepping outward from an edge midpoint must not move toward the centre on that axis.
      expect(n.x * mid.x + n.z * mid.z).toBeGreaterThan(0);
    });
  });

  it("grows a loop outward with a positive offset", () => {
    const loop = bayOutline(10, 4, 1);
    expect(area(offsetLoop(loop, 0.5))).toBeGreaterThan(area(loop));
    expect(area(offsetLoop(loop, -0.5))).toBeLessThan(area(loop));
  });

  it("puts 2 × (perSide + perSideZ) − 4 items on a ring, all on its edge", () => {
    const ring = squareRing(20, 6, 30, 9);
    expect(ring).toHaveLength(2 * (6 + 9) - 4);
    for (const { position } of ring) {
      expect(Math.abs(position.x) === 20 || Math.abs(position.z) === 30).toBe(true);
    }
    expect(new Set(ring.map(({ position }) => `${position.x},${position.z}`)).size).toBe(ring.length);
  });
});
