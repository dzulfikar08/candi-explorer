import { describe, expect, it } from "vitest";
import {
  BALUSTRADE,
  CIRCULAR_TERRACES,
  SQUARE_LEVELS,
  STAIR_HALF_WIDTH,
  type Vec2,
  facingDirection,
  nichePlacements,
  offsetOrthogonal,
  redentedOutline,
  ringPlacements,
} from "./layout";

function segmentDistance(p: Vec2, a: Vec2, b: Vec2): number {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(p.x - (a.x + dx * t), p.z - (a.z + dz * t));
}

function loopDistance(inner: Vec2[], outer: Vec2[]): number {
  let min = Infinity;
  for (const [from, to] of [
    [inner, outer],
    [outer, inner],
  ]) {
    for (const p of from) {
      for (let i = 0; i < to.length; i++) {
        min = Math.min(min, segmentDistance(p, to[i], to[(i + 1) % to.length]));
      }
    }
  }
  return min;
}

describe("Borobudur layout", () => {
  it("places the published niche counts, a quarter facing each direction, clear of the stairways", () => {
    const counts = SQUARE_LEVELS.map((level) => nichePlacements(level).length);
    expect(counts).toEqual([0, 104, 104, 88, 72, 64]);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(432);

    for (const level of SQUARE_LEVELS.slice(1)) {
      const niches = nichePlacements(level);
      const perDirection = new Map<string, number>();
      for (const { position, normal } of niches) {
        const dir = facingDirection(normal);
        perDirection.set(dir, (perDirection.get(dir) ?? 0) + 1);
        // Distance from the stair axis that runs through this face.
        const lateral = Math.abs(normal.x !== 0 ? position.z : position.x);
        expect(lateral).toBeGreaterThan(STAIR_HALF_WIDTH);
      }
      expect([...perDirection.values()]).toEqual(Array(4).fill(level.niches / 4));
    }
  });

  it("keeps every terrace corridor at least 2 m wide inside its balustrade", () => {
    for (let i = 1; i < SQUARE_LEVELS.length - 1; i++) {
      const balustradeInner = offsetOrthogonal(redentedOutline(SQUARE_LEVELS[i].half), -BALUSTRADE.thickness);
      const nextWall = redentedOutline(SQUARE_LEVELS[i + 1].half);
      expect(loopDistance(balustradeInner, nextWall)).toBeGreaterThanOrEqual(2 - 1e-9);
    }
  });

  it("rings 72 stupas with every stair axis passing between two of them", () => {
    expect(CIRCULAR_TERRACES.map((t) => ringPlacements(t).length)).toEqual([32, 24, 16]);
    for (const terrace of CIRCULAR_TERRACES) {
      for (const { position } of ringPlacements(terrace)) {
        expect(Math.min(Math.abs(position.x), Math.abs(position.z))).toBeGreaterThan(2);
      }
    }
  });
});
