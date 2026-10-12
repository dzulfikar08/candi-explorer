import { CircleGeometry, CylinderGeometry, Matrix4, Quaternion, Vector3, type BufferGeometry } from "three";
import type { MeshBuilder, V3 } from "../../render/mesh-builder";
import type { StoneMaterialKey, StoneTextures } from "../../render/stone";
import { Site } from "../kit/site";
import type { CandiModel, Realm } from "../types";
import {
  AXES,
  BALUSTRADE,
  CIRCULAR_TERRACES,
  SQUARE_LEVELS,
  STAIR_HALF_WIDTH,
  STAIR_NOTCH_DEPTH,
  type Direction,
  type Flight,
  type Vec2,
  cornerRuns,
  edgeNormal,
  facingDirection,
  flightsForAxis,
  hiddenFootWindows,
  nichePlacements,
  offsetOrthogonal,
  redentedOutline,
  ringPlacements,
} from "./layout";
import {
  type Mudra,
  PERFORATED_STUPA,
  buddhaGeometry,
  finialGeometry,
  mainStupaGeometry,
  nicheFrameGeometry,
  nicheShadowGeometry,
  perforatedStupaBellGeometry,
  perforatedStupaSolidGeometry,
} from "./sculpture";
import { buildTour } from "./tour";

/** Width of one carved panel along a relief wall. */
const PANEL_WIDTH = 2.4;

const MUDRA_BY_DIRECTION: Record<Direction, Mudra> = {
  east: "bhumisparsa",
  south: "vara",
  west: "dhyana",
  north: "abhaya",
};

const W = STAIR_HALF_WIDTH;

/** Map stair-local coordinates (s along the outward axis, u lateral) to world space. */
function axisPoint(axis: Vec2, s: number, u: number, y: number): V3 {
  return axis.x !== 0 ? [axis.x * s, y, u] : [u, y, axis.z * s];
}

function axisBox(b: MeshBuilder, axis: Vec2, s: [number, number], u: [number, number], y: [number, number]): void {
  const p0 = axisPoint(axis, s[0], u[0], y[0]);
  const p1 = axisPoint(axis, s[1], u[1], y[1]);
  b.box(
    [Math.min(p0[0], p1[0]), y[0], Math.min(p0[2], p1[2])],
    [Math.max(p0[0], p1[0]), y[1], Math.max(p0[2], p1[2])],
  );
}

/** Vertical walls around a loop. Relief walls get panel UVs; stair-notch faces stay plain masonry. */
function loopWalls(relief: MeshBuilder | null, plain: MeshBuilder, loop: Vec2[], y0: number, y1: number): void {
  let along = 0;
  for (let i = 0; i < loop.length; i++) {
    const p = loop[i];
    const q = loop[(i + 1) % loop.length];
    const n = edgeNormal(loop, i);
    const len = Math.hypot(q.x - p.x, q.z - p.z);
    const inNotch = Math.min(Math.abs(p.x), Math.abs(p.z)) <= W + 1e-6 && Math.min(Math.abs(q.x), Math.abs(q.z)) <= W + 1e-6;
    const corners: [V3, V3, V3, V3] = [
      [p.x, y0, p.z],
      [q.x, y0, q.z],
      [q.x, y1, q.z],
      [p.x, y1, p.z],
    ];
    if (relief && !inNotch) {
      const u0 = along / PANEL_WIDTH;
      const u1 = (along + len) / PANEL_WIDTH;
      relief.quad(...corners, [n.x, 0, n.z], [
        [u0, 0],
        [u1, 0],
        [u1, 1],
        [u0, 1],
      ]);
    } else {
      plain.quad(...corners, [n.x, 0, n.z]);
    }
    along += len;
  }
}

/** Projecting moulding band around a loop, with its ledge on top. */
function moulding(b: MeshBuilder, loop: Vec2[], out: number, y0: number, y1: number): void {
  const ring = offsetOrthogonal(loop, out);
  loopWalls(null, b, ring, y0, y1);
  b.cap(ring, y1, [loop]);
  if (y0 > 0.01) b.cap(ring, y0, [loop], false);
}

export function buildBorobudur(textures: StoneTextures): CandiModel {
  const site = new Site("Borobudur", textures);

  // Square levels: base (Kamadhatu) and five terraces (Rupadhatu).
  for (const level of SQUARE_LEVELS) {
    const realm: Realm = level.index === 0 ? "lower" : "middle";
    const outline = redentedOutline(level.half, STAIR_NOTCH_DEPTH);
    const masonry = site.get(realm, "masonry");
    // Terrace 2's face is the first gallery's main wall (two narrative rows); 3-5 carry one row.
    const relief = level.index === 2 ? site.get(realm, "reliefDouble") : level.index > 2 ? site.get(realm, "reliefSingle") : null;
    loopWalls(relief, masonry, outline, level.bottom, level.top);
    site.get(realm, "floor").cap(outline, level.top);
    if (!relief) {
      moulding(masonry, outline, 0.28, level.top - 0.5, level.top - 0.18);
      moulding(masonry, outline, 0.22, level.bottom, level.bottom + 0.45);
    }
  }

  // Exposed corner of the hidden foot.
  for (const { from, to, normal } of hiddenFootWindows()) {
    const len = Math.hypot(to.x - from.x, to.z - from.z);
    const o = 0.03;
    site.get("lower", "reliefSingle").quad(
      [from.x + normal.x * o, 0.5, from.z + normal.z * o],
      [to.x + normal.x * o, 0.5, to.z + normal.z * o],
      [to.x + normal.x * o, 3.0, to.z + normal.z * o],
      [from.x + normal.x * o, 3.0, from.z + normal.z * o],
      [normal.x, 0, normal.z],
      [
        [0, 0],
        [len / PANEL_WIDTH, 0],
        [len / PANEL_WIDTH, 1],
        [0, 1],
      ],
    );
  }

  // Balustrades with niched Buddhas on their outer faces.
  const nicheMatrices: Matrix4[] = [];
  const buddhaMatrices: Record<Mudra, Matrix4[]> = {
    bhumisparsa: [],
    vara: [],
    dhyana: [],
    abhaya: [],
    vitarka: [],
    dharmachakra: [],
  };
  const t = BALUSTRADE.thickness;
  const H = BALUSTRADE.height;
  for (const level of SQUARE_LEVELS.slice(1)) {
    const y0 = level.top;
    const y1 = level.top + H;
    const centre = offsetOrthogonal(redentedOutline(level.half), -t / 2);
    const outer = site.get("middle", "masonry");
    const inner = site.get("middle", "reliefSingle");
    for (const run of cornerRuns(centre, W)) {
      let along = 0;
      const last = run.normals.length - 1;
      run.normals.forEach((n, i) => {
        const p = run.points[i];
        const q = run.points[i + 1];
        const len = Math.hypot(q.x - p.x, q.z - p.z);
        const dx = (q.x - p.x) / len;
        const dz = (q.z - p.z) / len;
        // Overlap interior corners by half the thickness so the wall stays closed.
        const a0 = i === 0 ? 0 : t / 2;
        const a1 = i === last ? 0 : t / 2;
        const a = { x: p.x - dx * a0, z: p.z - dz * a0 };
        const b = { x: q.x + dx * a1, z: q.z + dz * a1 };
        const off = (pt: Vec2, side: number, y: number): V3 => [pt.x + n.x * side * (t / 2), y, pt.z + n.z * side * (t / 2)];
        outer.quad(off(a, 1, y0), off(b, 1, y0), off(b, 1, y1), off(a, 1, y1), [n.x, 0, n.z]);
        const u0 = along / PANEL_WIDTH;
        const u1 = (along + len + a0 + a1) / PANEL_WIDTH;
        inner.quad(off(a, -1, y0), off(b, -1, y0), off(b, -1, y1), off(a, -1, y1), [-n.x, 0, -n.z], [
          [u0, 0],
          [u1, 0],
          [u1, 1],
          [u0, 1],
        ]);
        along += len;
        if (i === 0) outer.quad(off(a, 1, y0), off(a, -1, y0), off(a, -1, y1), off(a, 1, y1), [-dx, 0, -dz]);
        if (i === last) outer.quad(off(b, 1, y0), off(b, -1, y0), off(b, -1, y1), off(b, 1, y1), [dx, 0, dz]);
        const corners = [off(a, 1.25, 0), off(b, 1.25, 0), off(a, -1.25, 0), off(b, -1.25, 0)];
        outer.box(
          [Math.min(...corners.map((c) => c[0])), y1, Math.min(...corners.map((c) => c[2]))],
          [Math.max(...corners.map((c) => c[0])), y1 + 0.22, Math.max(...corners.map((c) => c[2]))],
          {},
        );
      });
    }

    for (const { position, normal } of nichePlacements(level)) {
      const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.atan2(normal.x, normal.z));
      const base = new Vector3(position.x + normal.x * 0.2, y0 + 0.55, position.z + normal.z * 0.2);
      nicheMatrices.push(new Matrix4().compose(base, rotation, new Vector3(1, 1, 1)));
      const mudra = level.index === 5 ? "vitarka" : MUDRA_BY_DIRECTION[facingDirection(normal)];
      const seat = new Vector3(0, 0.04, -0.06).applyQuaternion(rotation).add(base);
      buddhaMatrices[mudra].push(new Matrix4().compose(seat, rotation, new Vector3(0.95, 0.95, 0.95)));
    }
  }

  // Stairways, cheek walls and corbelled Kala gates on all four axes.
  const finial = finialGeometry(1.3);
  for (const axis of AXES) {
    flightsForAxis(axis).forEach((flight, i) => {
      const realm: Realm = i === 0 ? "lower" : i <= 5 ? "middle" : "upper";
      // Flights that start on a wide floor get projecting cheeks with makara ends.
      const open = i === 0 || i === 1 || i === 6;
      addFlight(site.get(realm, "floor"), site.get(realm, "masonry"), flight, open);
      if (i >= 1 && i <= 5) addGate(site.get(realm, "masonry"), axis, SQUARE_LEVELS[i].half, SQUARE_LEVELS[i].top, finial);
    });
  }

  // Circular terraces (Arupadhatu).
  const circular = site.get("upper", "masonry");
  for (const terrace of CIRCULAR_TERRACES) {
    const h = terrace.top - terrace.bottom;
    circular.geometry(new CylinderGeometry(terrace.radius, terrace.radius, h, 128, 1, true), translate(0, terrace.bottom + h / 2, 0));
    circular.geometry(new CylinderGeometry(terrace.radius + 0.22, terrace.radius + 0.22, 0.3, 128), translate(0, terrace.top - 0.3, 0));
    circular.geometry(new CylinderGeometry(terrace.radius + 0.18, terrace.radius + 0.18, 0.4, 128), translate(0, terrace.bottom + 0.2, 0));
    site.get("upper", "floor").geometry(
      new CircleGeometry(terrace.radius, 128),
      new Matrix4().makeTranslation(0, terrace.top, 0).multiply(new Matrix4().makeRotationX(-Math.PI / 2)),
    );
  }
  circular.geometry(mainStupaGeometry(), translate(0, CIRCULAR_TERRACES[2].top, 0));

  const stupaMatrices: Record<"diamond" | "square", Matrix4[]> = { diamond: [], square: [] };
  for (const terrace of CIRCULAR_TERRACES) {
    for (const { angle, position } of ringPlacements(terrace)) {
      const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.atan2(Math.cos(angle), Math.sin(angle)));
      const m = new Matrix4().compose(new Vector3(position.x, terrace.top, position.z), rotation, new Vector3(1, 1, 1));
      stupaMatrices[terrace.lattice].push(m);
      const s = PERFORATED_STUPA.statueScale;
      buddhaMatrices.dharmachakra.push(
        m.clone().multiply(new Matrix4().compose(new Vector3(0, PERFORATED_STUPA.bellBase, 0), new Quaternion(), new Vector3(s, s, s))),
      );
    }
  }

  const instanced = (geometry: BufferGeometry, realm: Realm, key: StoneMaterialKey, matrices: Matrix4[], collide: boolean) => {
    if (matrices.length > 0) site.instanceGeometry(geometry, site.material(realm, key), matrices, collide);
  };
  instanced(nicheFrameGeometry(), "middle", "masonry", nicheMatrices, false);
  instanced(nicheShadowGeometry(), "middle", "nicheShadow", nicheMatrices, false);
  for (const [mudra, matrices] of Object.entries(buddhaMatrices) as [Mudra, Matrix4[]][]) {
    instanced(buddhaGeometry(mudra), mudra === "dharmachakra" ? "upper" : "middle", "statue", matrices, false);
  }
  const allStupas = [...stupaMatrices.diamond, ...stupaMatrices.square];
  instanced(perforatedStupaSolidGeometry(), "upper", "masonry", allStupas, true);
  const bell = perforatedStupaBellGeometry();
  instanced(bell, "upper", "latticeDiamond", stupaMatrices.diamond, true);
  instanced(bell, "upper", "latticeSquare", stupaMatrices.square, true);

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(92, 0, 0), yaw: Math.PI / 2 },
  };
}

function translate(x: number, y: number, z: number): Matrix4 {
  return new Matrix4().makeTranslation(x, y, z);
}

function addFlight(steps: MeshBuilder, masonry: MeshBuilder, f: Flight, open: boolean): void {
  const rise = f.yHigh - f.yLow;
  const n = Math.max(1, Math.round(rise / 0.27));
  const riser = rise / n;
  const tread = (f.sBottom - f.sTop) / n;
  for (let k = 0; k < n; k++) {
    axisBox(steps, f.axis, [f.sTop, f.sBottom - k * tread], [-W + 0.02, W - 0.02], [f.yLow + k * riser, f.yLow + (k + 1) * riser]);
  }

  // Sloped cheek walls: profile A-B-C-D in (s, y), extruded across the cheek width.
  const end = f.sBottom + (open ? 0.35 : 0);
  const A: [number, number] = [f.sTop, f.yLow];
  const B: [number, number] = [end, f.yLow];
  const C: [number, number] = [end, f.yLow + 0.9];
  const D: [number, number] = [f.sTop, f.yHigh + 0.9];
  const ds = D[0] - C[0];
  const dy = D[1] - C[1];
  const len = Math.hypot(ds, dy);
  // C→D climbs inward (ds < 0, dy > 0); (dy, -ds) is its upward, outward-facing normal.
  // axisPoint is linear, so it maps (s, u, y) directions as well as points.
  const slopeNormal = axisPoint(f.axis, dy / len, 0, -ds / len);
  for (const side of [-1, 1]) {
    const u0 = side * W;
    const u1 = side * (W + 0.4);
    const P = (pt: [number, number], u: number) => axisPoint(f.axis, pt[0], u, pt[1]);
    masonry.quad(P(A, u0), P(B, u0), P(C, u0), P(D, u0), axisPoint(f.axis, 0, -side, 0));
    masonry.quad(P(A, u1), P(B, u1), P(C, u1), P(D, u1), axisPoint(f.axis, 0, side, 0));
    masonry.quad(P(C, u0), P(C, u1), P(D, u1), P(D, u0), slopeNormal);
    masonry.quad(P(B, u0), P(B, u1), P(C, u1), P(C, u0), axisPoint(f.axis, 1, 0, 0));
    if (open) {
      const lo = Math.min(u0, u1) - 0.05;
      const hi = Math.max(u0, u1) + 0.05;
      axisBox(masonry, f.axis, [end, end + 0.45], [lo, hi], [f.yLow, f.yLow + 1.25]);
    }
  }
}

/** Corbelled gate on the balustrade line of a terrace, with Kala head and stupa finials. */
function addGate(b: MeshBuilder, axis: Vec2, half: number, floor: number, finial: BufferGeometry): void {
  const s: [number, number] = [half - 0.78, half + 0.06];
  const jamb = 0.55;
  const spring = floor + 2.6;
  for (const side of [-1, 1]) {
    const span = (inner: number): [number, number] => (side > 0 ? [inner, W + jamb] : [-W - jamb, -inner]);
    axisBox(b, axis, s, span(W), [floor, spring]);
    for (let j = 0; j < 4; j++) {
      axisBox(b, axis, s, span(W - 0.22 * (j + 1)), [spring + 0.22 * j, spring + 0.22 * (j + 1)]);
    }
  }
  const top = spring + 0.88;
  axisBox(b, axis, [s[0] - 0.05, s[1] + 0.05], [-W - jamb - 0.1, W + jamb + 0.1], [top, top + 0.42]);
  axisBox(b, axis, [half + 0.06, half + 0.32], [-0.55, 0.55], [spring + 0.1, top - 0.05]);
  const centre = (s[0] + s[1]) / 2;
  for (const u of [0, -W - 0.3, W + 0.3]) {
    const [x, , z] = axisPoint(axis, centre, u, 0);
    const scale = u === 0 ? 1 : 0.6;
    b.geometry(finial, new Matrix4().compose(new Vector3(x, top + 0.42, z), new Quaternion(), new Vector3(scale, scale, scale)));
  }
}
