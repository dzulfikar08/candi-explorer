import { MathUtils, Raycaster, Vector3, type Object3D, type PerspectiveCamera } from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const EYE_HEIGHT = 1.62;
/** Highest ledge the walker steps onto without stairs; the steepest risers are ~0.3 m. */
const STEP_UP = 0.9;
/**
 * Wall probe sits just under STEP_UP so every ledge is either stepped onto (ground probe starts at
 * STEP_UP) or blocked; nothing slips between the two.
 */
const WALL_PROBE = STEP_UP - 0.02;
const RADIUS = 0.3;
/**
 * Longest move tested in one probe. With RADIUS it keeps the probe within ~0.42 m, where even the
 * steepest flight (0.16 m treads, 0.27 m risers) stays below WALL_PROBE.
 */
const MAX_SUBSTEP = 0.12;
const WALK_SPEED = 2.4;
const RUN_SPEED = 6;
const GRAVITY = 9.8;

const DOWN = new Vector3(0, -1, 0);

/**
 * First-person walking: pointer-lock mouse look, WASD movement, stairs climbed by snapping to the
 * ground under the feet, and walls blocked by short rays at knee-to-hip height.
 */
export class WalkController {
  private readonly controls: PointerLockControls;
  private readonly feet = new Vector3();
  private readonly ray = new Raycaster();
  private readonly pressed = new Set<string>();
  private fallSpeed = 0;
  private eyeY = 0;
  private active = false;

  constructor(
    private readonly camera: PerspectiveCamera,
    dom: HTMLElement,
    private readonly solids: Object3D[],
    onLockChange: (locked: boolean) => void,
  ) {
    this.controls = new PointerLockControls(camera, dom);
    this.controls.addEventListener("lock", () => onLockChange(true));
    this.controls.addEventListener("unlock", () => onLockChange(false));
    this.ray.firstHitOnly = true;
    window.addEventListener("keydown", (e) => {
      // Only while looking around: otherwise arrow keys belong to focused page controls.
      if (this.active && this.controls.isLocked) this.pressed.add(e.code);
    });
    this.controls.addEventListener("unlock", () => this.pressed.clear());
    window.addEventListener("keyup", (e) => this.pressed.delete(e.code));
    window.addEventListener("blur", () => this.pressed.clear());
  }

  get locked(): boolean {
    return this.controls.isLocked;
  }

  start(position: Vector3, yaw: number): void {
    this.active = true;
    this.feet.copy(position);
    this.feet.y = this.groundBelow(this.feet.x, this.feet.y + 50, this.feet.z) ?? position.y;
    this.eyeY = this.feet.y + EYE_HEIGHT;
    this.fallSpeed = 0;
    this.camera.rotation.set(0, yaw, 0, "YXZ");
    this.camera.position.set(this.feet.x, this.eyeY, this.feet.z);
  }

  stop(): void {
    this.active = false;
    this.pressed.clear();
    if (this.controls.isLocked) this.controls.unlock();
  }

  lock(): void {
    this.controls.lock();
  }

  update(dt: number): void {
    if (!this.active) return;
    const yaw = this.camera.rotation.y;
    const forward = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const move = new Vector3();
    const p = this.pressed;
    if (p.has("KeyW") || p.has("ArrowUp")) move.add(forward);
    if (p.has("KeyS") || p.has("ArrowDown")) move.sub(forward);
    if (p.has("KeyD") || p.has("ArrowRight")) move.add(right);
    if (p.has("KeyA") || p.has("ArrowLeft")) move.sub(right);
    if (move.lengthSq() > 0) {
      const speed = p.has("ShiftLeft") || p.has("ShiftRight") ? RUN_SPEED : WALK_SPEED;
      move.normalize().multiplyScalar(speed * dt);
      // Sub-step so the wall probe never reaches past the next steppable riser on steep stairs.
      const steps = Math.ceil(move.length() / MAX_SUBSTEP);
      const sub = move.divideScalar(steps);
      for (let i = 0; i < steps; i++) {
        // Try the full step, then slide along whichever axis is still free.
        const free = [sub, new Vector3(sub.x, 0, 0), new Vector3(0, 0, sub.z)].find(
          (c) => c.lengthSq() > 0 && !this.blocked(c),
        );
        if (!free) break;
        this.feet.add(free);
        const ground = this.groundBelow(this.feet.x, this.feet.y + STEP_UP, this.feet.z);
        if (ground !== null && ground > this.feet.y) this.feet.y = ground;
      }
    }

    const ground = this.groundBelow(this.feet.x, this.feet.y + STEP_UP, this.feet.z);
    if (ground !== null && ground >= this.feet.y - 0.05) {
      this.feet.y = ground;
      this.fallSpeed = 0;
    } else {
      this.fallSpeed += GRAVITY * dt;
      this.feet.y -= this.fallSpeed * dt;
      if (ground !== null && this.feet.y < ground) {
        this.feet.y = ground;
        this.fallSpeed = 0;
      }
    }
    // Ease the eye over each stair riser instead of jumping.
    this.eyeY = MathUtils.damp(this.eyeY, this.feet.y + EYE_HEIGHT, 14, dt);
    this.camera.position.set(this.feet.x, this.eyeY, this.feet.z);
  }

  private blocked(step: Vector3): boolean {
    const dir = step.clone().normalize();
    this.ray.far = step.length() + RADIUS;
    for (const h of [WALL_PROBE, 1.5]) {
      this.ray.set(new Vector3(this.feet.x, this.feet.y + h, this.feet.z), dir);
      if (this.ray.intersectObjects(this.solids, false).length > 0) return true;
    }
    return false;
  }

  private groundBelow(x: number, fromY: number, z: number): number | null {
    this.ray.set(new Vector3(x, fromY, z), DOWN);
    this.ray.far = 400;
    const hit = this.ray.intersectObjects(this.solids, false)[0];
    return hit ? hit.point.y : null;
  }
}
