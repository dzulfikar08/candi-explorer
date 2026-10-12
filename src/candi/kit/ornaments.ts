import {
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  SphereGeometry,
  Vector2,
  type BufferGeometry,
} from "three";
import { MeshBuilder } from "../../render/mesh-builder";
import { buddhaGeometry, type Mudra } from "../borobudur/sculpture";

/**
 * Unit-sized ornaments for the kit: base at y = 0, height 1 unless noted, front facing +x. Callers
 * scale and place them with a matrix.
 */

const lathe = (profile: [number, number][], segments: number) =>
  new LatheGeometry(
    profile.map(([r, y]) => new Vector2(r, y)),
    segments,
  );

function memo<T>(make: () => T): () => T {
  let value: T | undefined;
  return () => (value ??= make());
}

/**
 * Ratna: the jewel-shaped pinnacle of Hindu Javanese roofs, a stack of cushions narrowing to a
 * point. Octagonal so it reads as cut stone.
 */
export const ratna = memo(() =>
  lathe(
    [
      [0, 0],
      [0.5, 0],
      [0.5, 0.08],
      [0.38, 0.12],
      [0.47, 0.24],
      [0.42, 0.34],
      [0.26, 0.4],
      [0.31, 0.48],
      [0.2, 0.55],
      [0.24, 0.62],
      [0.13, 0.72],
      [0.09, 0.86],
      [0.02, 1],
      [0, 1],
    ],
    8,
  ),
);

/** Bell stupa with square harmika and spire: Buddhist crowns and roof finials. */
export const stupa = memo(() => {
  const b = new MeshBuilder();
  const id = new Matrix4();
  b.geometry(
    lathe(
      [
        [0, 0],
        [0.5, 0],
        [0.5, 0.08],
        [0.42, 0.1],
        [0.46, 0.2],
        [0.44, 0.38],
        [0.33, 0.52],
        [0.16, 0.6],
        [0, 0.61],
      ],
      16,
    ),
    id,
  );
  b.box([-0.14, 0.58, -0.14], [0.14, 0.72, 0.14], {});
  b.geometry(new CylinderGeometry(0.015, 0.09, 0.28, 8), new Matrix4().makeTranslation(0, 0.86, 0));
  return b.build();
});

/** Lingga on its yoni, spout to the north as in Javanese shrines (local -z). Height 1. */
export const linggaYoni = memo(() => {
  const b = new MeshBuilder();
  b.box([-0.5, 0, -0.5], [0.5, 0.12, 0.5], {});
  b.box([-0.42, 0.12, -0.42], [0.42, 0.42, 0.42], {});
  b.box([-0.5, 0.42, -0.5], [0.5, 0.52, 0.5], {});
  b.box([-0.1, 0.36, -0.82], [0.1, 0.48, -0.5], {});
  b.box([-0.17, 0.52, -0.17], [0.17, 0.68, 0.17], {});
  b.geometry(new CapsuleGeometry(0.14, 0.24, 4, 12), new Matrix4().makeTranslation(0, 0.82, 0));
  return b.build();
});

/** Standing deity on a lotus pedestal, crowned; arms at the sides. Height 1. */
export const deity = memo(() => {
  const b = new MeshBuilder();
  b.geometry(new CylinderGeometry(0.2, 0.24, 0.1, 16), new Matrix4().makeTranslation(0, 0.05, 0));
  b.geometry(new CapsuleGeometry(0.075, 0.36, 4, 10), new Matrix4().makeTranslation(0, 0.33, 0).multiply(new Matrix4().makeScale(1.6, 1, 1)));
  b.geometry(new CapsuleGeometry(0.09, 0.2, 4, 10), new Matrix4().makeTranslation(0, 0.6, 0).multiply(new Matrix4().makeScale(1.4, 1, 0.9)));
  for (const side of [-1, 1]) {
    b.geometry(new CapsuleGeometry(0.03, 0.26, 3, 8), new Matrix4().makeTranslation(0, 0.56, side * 0.16));
  }
  b.geometry(new SphereGeometry(0.075, 12, 8), new Matrix4().makeTranslation(0, 0.8, 0));
  b.geometry(new CylinderGeometry(0.04, 0.065, 0.13, 10), new Matrix4().makeTranslation(0, 0.92, 0));
  // Aureole behind the figure.
  b.box([-0.06, 0.1, -0.22], [-0.03, 0.98, 0.22], {});
  return b.build();
});

/** Seated Buddha (dhyana unless given) facing +x, about 1.05 tall. */
export function seatedBuddha(mudra: Mudra = "dhyana"): BufferGeometry {
  return buddhaGeometry(mudra).rotateY(Math.PI / 2);
}

/** Kala head over a doorway: a projecting mask block with brows and fangs. 1 wide. */
export const kala = memo(() => {
  const b = new MeshBuilder();
  b.box([0, 0, -0.5], [0.22, 0.75, 0.5], {});
  b.box([0.22, 0.42, -0.36], [0.34, 0.6, 0.36], {});
  b.geometry(new SphereGeometry(0.1, 10, 8), new Matrix4().makeTranslation(0.3, 0.32, -0.18));
  b.geometry(new SphereGeometry(0.1, 10, 8), new Matrix4().makeTranslation(0.3, 0.32, 0.18));
  b.box([0.22, 0.02, -0.3], [0.3, 0.14, 0.3], {});
  return b.build();
});

/** Makara: curled sea-creature terminal at the foot of a stair cheek. 1 tall. */
export const makara = memo(() => {
  const b = new MeshBuilder();
  b.box([-0.4, 0, -0.5], [0.4, 0.55, 0.5], {});
  b.geometry(new CylinderGeometry(0.42, 0.42, 0.9, 12, 1), new Matrix4().makeTranslation(0.1, 0.72, 0).multiply(new Matrix4().makeRotationX(Math.PI / 2)));
  b.geometry(new BoxGeometry(0.5, 0.25, 0.8), new Matrix4().makeTranslation(0.5, 0.95, 0));
  return b.build();
});

/** Reclining bull (Nandi, Shiva's mount) facing +x on a plinth. 1 tall, about 1.6 long. */
export const bull = memo(() => {
  const b = new MeshBuilder();
  b.box([-0.85, 0, -0.45], [0.85, 0.18, 0.45], {});
  b.geometry(new CapsuleGeometry(0.28, 0.75, 4, 12), new Matrix4().makeTranslation(-0.05, 0.48, 0).multiply(new Matrix4().makeRotationZ(Math.PI / 2)).multiply(new Matrix4().makeScale(1, 1, 1.2)));
  // Hump, neck and head with horns.
  b.geometry(new SphereGeometry(0.2, 12, 8), new Matrix4().makeTranslation(0.28, 0.76, 0));
  b.geometry(new CapsuleGeometry(0.13, 0.3, 4, 10), new Matrix4().makeTranslation(0.55, 0.72, 0).multiply(new Matrix4().makeRotationZ(-0.9)));
  b.geometry(new CapsuleGeometry(0.11, 0.18, 4, 10), new Matrix4().makeTranslation(0.74, 0.82, 0).multiply(new Matrix4().makeRotationZ(-1.3)));
  for (const side of [-1, 1]) {
    b.geometry(new CylinderGeometry(0.015, 0.035, 0.22, 6), new Matrix4().makeTranslation(0.68, 0.98, side * 0.09).multiply(new Matrix4().makeRotationX(side * 0.5)));
    // Folded legs.
    b.geometry(new CapsuleGeometry(0.07, 0.3, 3, 8), new Matrix4().makeTranslation(0.3, 0.26, side * 0.3).multiply(new Matrix4().makeRotationZ(Math.PI / 2)));
  }
  return b.build();
});

