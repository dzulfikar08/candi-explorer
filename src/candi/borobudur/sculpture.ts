import {
  BufferGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import { MeshBuilder } from "../../render/mesh-builder";

/**
 * Low-poly sculpture for instancing. Every piece is modelled facing +z with its base at y = 0.
 */

export type Mudra = "bhumisparsa" | "vara" | "dhyana" | "abhaya" | "vitarka" | "dharmachakra";

const at = (x: number, y: number, z: number) => new Matrix4().makeTranslation(x, y, z);
const up = new Vector3(0, 1, 0);

function limb(b: MeshBuilder, from: Vector3, to: Vector3, radius: number): void {
  const dir = new Vector3().subVectors(to, from);
  const length = dir.length();
  const m = new Matrix4().compose(
    from.clone().add(to).multiplyScalar(0.5),
    new Quaternion().setFromUnitVectors(up, dir.normalize()),
    new Vector3(1, 1, 1),
  );
  b.geometry(new CapsuleGeometry(radius, Math.max(0.01, length - radius), 3, 8), m);
}

/**
 * Hands follow the Borobudur mudra scheme (statue's right hand is at -x when it faces +z).
 * Left hand rests in the lap except where both hands form the gesture.
 */
const HANDS: Record<Mudra, { right: [number, number, number]; left: [number, number, number] }> = {
  dhyana: { right: [-0.05, 0.3, 0.17], left: [0.05, 0.31, 0.17] },
  bhumisparsa: { right: [-0.27, 0.17, 0.32], left: [0.06, 0.3, 0.17] },
  vara: { right: [-0.3, 0.25, 0.33], left: [0.06, 0.3, 0.17] },
  abhaya: { right: [-0.24, 0.66, 0.2], left: [0.06, 0.3, 0.17] },
  vitarka: { right: [-0.15, 0.58, 0.24], left: [0.06, 0.3, 0.17] },
  dharmachakra: { right: [-0.05, 0.57, 0.24], left: [0.06, 0.53, 0.24] },
};

/** Seated Buddha on a lotus cushion, about 1.05 m tall. */
export function buddhaGeometry(mudra: Mudra): BufferGeometry {
  const b = new MeshBuilder();
  b.geometry(new CylinderGeometry(0.4, 0.44, 0.12, 20), at(0, 0.06, 0));
  b.geometry(new CylinderGeometry(0.44, 0.4, 0.06, 20), at(0, 0.15, 0));
  // Crossed legs.
  b.geometry(
    new CapsuleGeometry(0.12, 0.5, 4, 12),
    new Matrix4().compose(
      new Vector3(0, 0.27, 0.07),
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2),
      new Vector3(1, 1, 1.35),
    ),
  );
  b.geometry(new CylinderGeometry(0.16, 0.22, 0.42, 16), at(0, 0.53, 0));
  b.geometry(new SphereGeometry(0.2, 16, 10), new Matrix4().compose(new Vector3(0, 0.71, 0), new Quaternion(), new Vector3(1.25, 0.55, 0.8)));
  b.geometry(new CylinderGeometry(0.055, 0.065, 0.08, 10), at(0, 0.8, 0));
  b.geometry(new SphereGeometry(0.115, 16, 12), new Matrix4().compose(new Vector3(0, 0.91, 0.01), new Quaternion(), new Vector3(1, 1.12, 1)));
  // Ushnisha and curls.
  b.geometry(new SphereGeometry(0.065, 12, 8), at(0, 1.03, 0));

  const hands = HANDS[mudra];
  for (const side of [-1, 1] as const) {
    const shoulder = new Vector3(0.21 * side, 0.7, 0);
    const elbow = new Vector3(0.27 * side, 0.47, 0.05);
    const hand = new Vector3(...(side < 0 ? hands.right : hands.left));
    limb(b, shoulder, elbow, 0.055);
    limb(b, elbow, hand, 0.048);
    b.geometry(new SphereGeometry(0.05, 10, 8), at(hand.x, hand.y, hand.z));
  }
  return b.build();
}

/** Niche surround with a stupa crown, sized for a 1 m Buddha. Back face sits at z = -0.2. */
export function nicheFrameGeometry(): BufferGeometry {
  const b = new MeshBuilder();
  b.box([-0.72, 0, -0.2], [-0.53, 1.5, 0.22], {});
  b.box([0.53, 0, -0.2], [0.72, 1.5, 0.22], {});
  b.box([-0.78, -0.12, -0.2], [0.78, 0.04, 0.26], {});
  b.box([-0.8, 1.5, -0.2], [0.8, 1.72, 0.26], {});
  b.box([-0.62, 1.72, -0.15], [0.62, 1.86, 0.18], {});
  b.geometry(stupaLathe(0.42, 0.62), at(0, 1.86, 0));
  b.geometry(new CylinderGeometry(0.035, 0.09, 0.32, 8), at(0, 2.64, 0));
  return b.build();
}

/** Dark recess behind the niche Buddha. */
export function nicheShadowGeometry(): BufferGeometry {
  const b = new MeshBuilder();
  b.quad([-0.53, 0.04, -0.18], [0.53, 0.04, -0.18], [0.53, 1.5, -0.18], [-0.53, 1.5, -0.18], [0, 0, 1]);
  return b.build();
}

/** Small solid bell stupa, used for niche crowns and gate finials. */
function stupaLathe(radius: number, height: number): LatheGeometry {
  const pts = [
    [0, 0],
    [radius, 0],
    [radius * 1.02, height * 0.2],
    [radius * 0.9, height * 0.55],
    [radius * 0.55, height * 0.85],
    [radius * 0.3, height * 0.95],
    [0, height],
  ].map(([x, y]) => new Vector2(x, y));
  return new LatheGeometry(pts, 16);
}

export function finialGeometry(scale: number): BufferGeometry {
  const b = new MeshBuilder();
  b.geometry(stupaLathe(0.42 * scale, 0.62 * scale), new Matrix4());
  b.geometry(new CylinderGeometry(0.035 * scale, 0.09 * scale, 0.32 * scale, 8), at(0, 0.78 * scale, 0));
  return b.build();
}

/** Perforated stupa: the bell is separate so it can take the lattice alpha map. */
export const PERFORATED_STUPA = { bellBase: 0.45, statueScale: 1.05 } as const;

export function perforatedStupaSolidGeometry(): BufferGeometry {
  const b = new MeshBuilder();
  b.geometry(new CylinderGeometry(1.5, 1.6, 0.3, 32), at(0, 0.15, 0));
  b.geometry(new CylinderGeometry(1.42, 1.5, 0.15, 32), at(0, 0.375, 0));
  b.geometry(new CylinderGeometry(0.34, 0.34, 0.36, 8), at(0, 2.73, 0));
  b.geometry(new CylinderGeometry(0.42, 0.42, 0.08, 8), at(0, 2.95, 0));
  b.geometry(new CylinderGeometry(0.04, 0.2, 0.95, 8), at(0, 3.46, 0));
  return b.build();
}

/** Bell with lathe UVs (u around, v up the profile) matching the lattice alpha maps. */
export function perforatedStupaBellGeometry(): BufferGeometry {
  const profile = [
    [1.42, 0],
    [1.46, 0.18],
    [1.44, 0.5],
    [1.35, 0.9],
    [1.17, 1.3],
    [0.93, 1.62],
    [0.64, 1.86],
    [0.36, 2.02],
    [0, 2.1],
  ].map(([x, y]) => new Vector2(x, y));
  const b = new MeshBuilder();
  b.geometry(new LatheGeometry(profile, 48), at(0, PERFORATED_STUPA.bellBase, 0), true);
  return b.build();
}

/** Main stupa from the top circular terrace up: lotus base, dome, harmika and yasti. */
export function mainStupaGeometry(): BufferGeometry {
  const profile = [
    [0, 0],
    [7.2, 0],
    [7.2, 0.5],
    [6.9, 0.6],
    [6.9, 1.0],
    [6.5, 1.15],
    [6.65, 1.5],
    [6.0, 1.62],
    [5.8, 1.8],
    [5.95, 2.6],
    [5.85, 3.6],
    [5.45, 4.6],
    [4.8, 5.5],
    [3.9, 6.3],
    [2.8, 6.9],
    [1.6, 7.25],
    [1.5, 7.3],
    [0, 7.3],
  ].map(([x, y]) => new Vector2(x, y));
  const b = new MeshBuilder();
  b.geometry(new LatheGeometry(profile, 96), new Matrix4());
  b.geometry(new CylinderGeometry(1.5, 1.6, 1.5, 8), at(0, 8.05, 0));
  b.geometry(new CylinderGeometry(1.85, 1.85, 0.25, 8), at(0, 8.92, 0));
  b.geometry(new CylinderGeometry(0.25, 0.6, 3.6, 16), at(0, 10.85, 0));
  return b.build();
}
