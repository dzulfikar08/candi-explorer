import { BufferGeometry, Float32BufferAttribute, Matrix3, Matrix4, ShapeUtils, Vector2, Vector3 } from "three";

export type V3 = readonly [number, number, number];
export type UV = readonly [number, number];

/** Planar UV in metres chosen by the dominant normal axis (cheap tri-planar). */
function projectUV(p: Vector3, n: Vector3): UV {
  const ax = Math.abs(n.x);
  const ay = Math.abs(n.y);
  const az = Math.abs(n.z);
  if (ay >= ax && ay >= az) return [p.x, p.z];
  if (ax >= az) return [p.z, p.y];
  return [p.x, p.y];
}

const _a = new Vector3();
const _b = new Vector3();
const _c = new Vector3();
const _n = new Vector3();

/**
 * Accumulates non-indexed triangles for one material, then emits a single merged geometry.
 * Every helper either takes explicit UVs or projects world-space metres.
 */
export class MeshBuilder {
  private readonly positions: number[] = [];
  private readonly normals: number[] = [];
  private readonly uvs: number[] = [];

  get empty(): boolean {
    return this.positions.length === 0;
  }

  private vertex(p: Vector3, n: Vector3, uv: UV): void {
    this.positions.push(p.x, p.y, p.z);
    this.normals.push(n.x, n.y, n.z);
    this.uvs.push(uv[0], uv[1]);
  }

  /** Quad a→b→c→d (either winding); faces `normal`. UVs default to world projection. */
  quad(a: V3, b: V3, c: V3, d: V3, normal: V3, uv?: readonly [UV, UV, UV, UV]): void {
    const pts = [a, b, c, d].map((p) => new Vector3(...p));
    const uvs = uv ?? pts.map((p) => projectUV(p, _n.set(...normal)));
    _n.set(...normal);
    const facing = _a.subVectors(pts[1], pts[0]).cross(_b.subVectors(pts[2], pts[0])).dot(_n) >= 0;
    const order = facing ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
    for (const i of order) this.vertex(pts[i], _n, uvs[i]);
  }

  /** Axis-aligned box. `skip` omits faces that are always hidden (e.g. the bottom). */
  box(min: V3, max: V3, skip: { bottom?: boolean; top?: boolean } = { bottom: true }): void {
    const [x0, y0, z0] = min;
    const [x1, y1, z1] = max;
    this.quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0]);
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]);
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1]);
    this.quad([x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [0, 0, -1]);
    if (!skip.top) this.quad([x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [0, 1, 0]);
    if (!skip.bottom) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0]);
  }

  /** Horizontal polygon (x/z loop with optional holes) at height y, facing up or down. */
  cap(contour: readonly { x: number; z: number }[], y: number, holes: readonly { x: number; z: number }[][] = [], up = true): void {
    const toV2 = (p: { x: number; z: number }) => new Vector2(p.x, p.z);
    const c2 = contour.map(toV2);
    const h2 = holes.map((h) => h.map(toV2));
    const all = [...c2, ...h2.flat()];
    _n.set(0, up ? 1 : -1, 0);
    for (const [i, j, k] of ShapeUtils.triangulateShape(c2, h2)) {
      const tri = [all[i], all[j], all[k]].map((p) => new Vector3(p.x, y, p.y));
      const facing = _a.subVectors(tri[1], tri[0]).cross(_b.subVectors(tri[2], tri[0])).y >= 0 === up;
      const order = facing ? [0, 1, 2] : [0, 2, 1];
      for (const o of order) this.vertex(tri[o], _n, [tri[o].x, tri[o].z]);
    }
  }

  /** Append a primitive geometry transformed by `matrix`; `keepUV` preserves its own UVs. */
  geometry(source: BufferGeometry, matrix: Matrix4, keepUV = false): void {
    const g = source.index ? source.toNonIndexed() : source;
    const pos = g.getAttribute("position");
    const nor = g.getAttribute("normal");
    const uv = g.getAttribute("uv");
    const normalMatrix = new Matrix3().getNormalMatrix(matrix);
    for (let i = 0; i < pos.count; i++) {
      _c.fromBufferAttribute(pos, i).applyMatrix4(matrix);
      _n.fromBufferAttribute(nor, i).applyMatrix3(normalMatrix).normalize();
      this.vertex(_c, _n, keepUV ? [uv.getX(i), uv.getY(i)] : projectUV(_c, _n));
    }
    if (g !== source) g.dispose();
  }

  build(): BufferGeometry {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(this.positions, 3));
    g.setAttribute("normal", new Float32BufferAttribute(this.normals, 3));
    g.setAttribute("uv", new Float32BufferAttribute(this.uvs, 2));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
}
