import { Matrix4, Quaternion, Vector3, type PerspectiveCamera } from "three";
import type { TourSection } from "../candi/types";

/** Pilgrim's walking pace in m/s; the speed selector multiplies it. */
const PACE = 2;
const LOOK_AHEAD = 7;

interface TourEvents {
  onSection(index: number): void;
  onProgress(fraction: number): void;
  onEnd(): void;
}

/** Moves the camera along the concatenated tour path at constant speed, looking ahead. */
export class TourController {
  speed = 2;
  playing = false;
  private readonly points: Vector3[] = [];
  private readonly distances: number[] = [];
  private readonly sectionStarts: number[] = [];
  private readonly sectionOfPoint: number[] = [];
  private distance = 0;
  private section = -1;
  private readonly look = new Quaternion();

  constructor(
    private readonly camera: PerspectiveCamera,
    private readonly sections: TourSection[],
    private readonly events: TourEvents,
  ) {
    let total = 0;
    sections.forEach((s, si) => {
      s.points.forEach((p, pi) => {
        const prev = this.points[this.points.length - 1];
        if (prev) total += prev.distanceTo(p);
        if (pi === 0) this.sectionStarts.push(total);
        this.points.push(p);
        this.distances.push(total);
        this.sectionOfPoint.push(si);
      });
    });
  }

  get length(): number {
    return this.distances[this.distances.length - 1];
  }

  start(): void {
    this.distance = 0;
    this.section = -1;
    this.playing = true;
    this.place(true);
  }

  nextSection(): void {
    const next = this.sectionStarts.find((d) => d > this.distance + 0.01);
    if (next === undefined) {
      this.events.onEnd();
      return;
    }
    this.distance = next;
    this.place(true);
  }

  update(dt: number): void {
    if (!this.playing) return;
    this.distance += PACE * this.speed * dt;
    if (this.distance >= this.length) {
      this.distance = this.length;
      this.place(false);
      this.playing = false;
      this.events.onEnd();
      return;
    }
    this.place(false, dt);
  }

  private pointAt(d: number, out: Vector3): number {
    const clamped = Math.min(Math.max(d, 0), this.length);
    let lo = 0;
    let hi = this.distances.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (this.distances[mid] <= clamped) lo = mid;
      else hi = mid;
    }
    const span = this.distances[hi] - this.distances[lo];
    const t = span > 0 ? (clamped - this.distances[lo]) / span : 0;
    out.lerpVectors(this.points[lo], this.points[hi], t);
    return this.sectionOfPoint[lo];
  }

  private place(snap: boolean, dt = 0): void {
    const pos = new Vector3();
    const section = this.pointAt(this.distance, pos);
    const ahead = new Vector3();
    this.pointAt(this.distance + LOOK_AHEAD, ahead);
    const forward = ahead.sub(pos);
    forward.y *= 0.5;
    if (forward.lengthSq() < 1e-6) forward.set(-pos.x, 0, -pos.z);
    forward.normalize();
    // Turn toward the pilgrim's right, where the monument and its walls are.
    forward.applyAxisAngle(new Vector3(0, 1, 0), -this.sections[section].lookRight);
    // Matrix4.lookAt sets +z = eye - target, so aiming at `forward` points the camera's -z along it.
    const target = new Quaternion().setFromRotationMatrix(
      new Matrix4().lookAt(new Vector3(), forward, new Vector3(0, 1, 0)),
    );
    if (snap) this.look.copy(target);
    else this.look.slerp(target, 1 - Math.exp(-2.5 * dt));
    this.camera.position.copy(pos);
    this.camera.quaternion.copy(this.look);
    if (section !== this.section) {
      this.section = section;
      this.events.onSection(section);
    }
    this.events.onProgress(this.distance / this.length);
  }
}
