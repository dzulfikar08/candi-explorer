import { BoxGeometry, Matrix4, Quaternion, Vector3 } from "three";
import { block, outlineFor, type ShrineSpec, shrineLayout } from "./shrine";
import { type Part, Parts } from "./site";

/** Small deterministic PRNG so a ruin looks the same on every load. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A collapsed shrine: its foot still standing, the body and roof fallen into a heap of blocks on
 * top. How most perwara (guardian shrines) in Javanese compounds survive today.
 */
export function ruin(spec: ShrineSpec, seed: number): Part[] {
  const parts = new Parts();
  const layout = shrineLayout(spec);
  for (const level of layout.levels) block(parts, "lower", outlineFor(spec, level.half), level.bottom, level.top);
  const r = rng(seed);
  const heap = parts.get("middle", "masonry");
  const top = layout.footTop;
  const spread = spec.body.half * 1.15;
  const peak = Math.max(0.8, (layout.height - top) * 0.22);
  const unit = new BoxGeometry(1, 1, 1);
  const q = new Quaternion();
  const axis = new Vector3();
  for (let i = 0; i < 120; i++) {
    // Denser and higher toward the middle: a cone of rubble.
    const rr = Math.sqrt(r()) * spread;
    const a = r() * Math.PI * 2;
    const x = Math.cos(a) * rr;
    const z = Math.sin(a) * rr;
    const h = peak * (1 - rr / spread) * (0.5 + r() * 0.5);
    axis.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    q.setFromAxisAngle(axis, r() * 1.4);
    const size = new Vector3(0.45 + r() * 0.5, 0.25 + r() * 0.2, 0.3 + r() * 0.35).multiplyScalar(Math.max(0.7, spec.body.half / 2.5));
    heap.geometry(unit, new Matrix4().compose(new Vector3(x, top + h * 0.6 + size.y / 2, z), q, size));
  }
  // A stepped core so the heap reads as a mound rather than loose blocks; yawed off the plan grid.
  const yaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.4);
  [0.95, 0.65, 0.35].forEach((k, i) => {
    heap.geometry(unit, new Matrix4().compose(new Vector3(0, top + peak * (0.12 + i * 0.22), 0), yaw, new Vector3(spread * k * 1.4, peak * 0.24, spread * k * 1.4)));
  });
  return parts.build();
}
