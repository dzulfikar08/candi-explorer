import {
  ACESFilmicToneMapping,
  BufferGeometry,
  PCFShadowMap,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  SRGBColorSpace,
  Scene,
  Vector3,
  Timer,
  WebGLRenderer,
  type Object3D,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { acceleratedRaycast, computeBoundsTree } from "three-mesh-bvh";
import type { CameraView, CandiDefinition, CandiModel } from "../candi/types";
import { TourController } from "../controls/tour";
import { WalkController } from "../controls/walk";
import { createEnvironment } from "../render/environment";
import { createStoneTextures } from "../render/stone";

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

export type Mode = "orbit" | "walk" | "tour";

/** Callbacks the React UI subscribes to; the engine never touches the DOM beyond canvas + markers. */
export interface EngineEvents {
  /** A topic (overview, hotspot or tour section) should be shown in the notes panel. */
  onTopic(key: string): void;
  onMode(mode: Mode): void;
  onWalkLock(locked: boolean): void;
  onTourSection(index: number): void;
  onTourProgress(fraction: number): void;
  onTourEnd(): void;
}

export interface Engine {
  /** False on pointer-lock-less devices (e.g. iPadOS + trackpad): Walk stays disabled. */
  readonly canWalk: boolean;
  readonly tourSections: number;
  /** Labels in walk order, for the tour bar's "2 / 5 · Label" line. */
  readonly tourSectionLabels: readonly string[];
  setMode(mode: Mode, resetView?: boolean): void;
  /** Orbit to a hotspot's viewpoint and show its topic. */
  goToHotspot(index: number): void;
  /** Show a topic's notes (and mark its marker) without moving the camera. */
  setTopic(key: string): void;
  setRealms(on: boolean): void;
  /** Minutes since midnight (300–1140); relights the scene. */
  setTime(minutes: number): void;
  setTourPlaying(on: boolean): void;
  restartTour(): void;
  nextTourSection(): void;
  setTourSpeed(speed: number): void;
  /**
   * Hands the React-rendered marker buttons to the engine, which positions, hides and
   * marks occluded/active ones every frame — no React state per frame.
   */
  setHotspotElements(els: readonly HTMLButtonElement[]): void;
  dispose(): void;
}

/** Lets the browser paint and run timers between the long synchronous build stages. */
const breathe = () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

/**
 * Builds the 3D scene for `candi` on `canvas`, yielding between the heavy stages so the loading
 * screen stays responsive. Rejects if WebGL is unavailable.
 */
export async function createEngine(canvas: HTMLCanvasElement, candi: CandiDefinition, events: EngineEvents): Promise<Engine> {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 30000);

  const textures = createStoneTextures();
  await breathe();
  const model: CandiModel = candi.build(textures);
  scene.add(model.group);
  await breathe();
  const env = createEnvironment(scene, renderer, candi);
  await breathe();

  const solids: Object3D[] = [...model.collidables, env.ground];
  for (const o of solids) (o as Mesh).geometry.computeBoundsTree();

  // Orbit camera.
  const orbit = new OrbitControls(camera, canvas);
  orbit.enableDamping = true;
  orbit.maxPolarAngle = Math.PI * 0.495;
  orbit.minDistance = 4;
  orbit.maxDistance = 900;
  // Portrait screens see less width; back the home view off so the whole monument fits.
  const aspect = window.innerWidth / window.innerHeight;
  const backOff = aspect < 1 ? 1 / Math.sqrt(aspect) : 1;
  const target = new Vector3(...candi.orbit.target);
  const home: CameraView = {
    position: new Vector3(...candi.orbit.position).sub(target).multiplyScalar(backOff).add(target).toArray(),
    target: candi.orbit.target,
  };
  camera.position.set(...home.position);
  orbit.target.copy(target);
  orbit.update();
  // Slow showcase spin (~100 s per lap) until the visitor first takes control.
  orbit.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  orbit.autoRotateSpeed = 0.6;
  const stopAutoRotate = () => {
    orbit.autoRotate = false;
  };
  orbit.addEventListener("start", stopAutoRotate);

  let flight: { from: CameraView; to: CameraView; t: number } | null = null;
  const flyTo = (view: CameraView) => {
    flight = {
      from: { position: camera.position.toArray(), target: orbit.target.toArray() },
      to: view,
      t: 0,
    };
  };

  // Marker buttons; the notes panel mirrors them as the "Places to look at" list.
  let hotspotEls: readonly HTMLButtonElement[] = [];
  let activeTopic = "";
  const markActiveTopic = () => {
    candi.hotspots.forEach((h, i) => {
      const el = hotspotEls[i];
      if (!el) return;
      el.classList.toggle("active", h.topic === activeTopic);
    });
  };
  const showTopic = (key: string) => {
    activeTopic = key;
    markActiveTopic();
    events.onTopic(key);
  };

  // Walk and tour.
  const walk = new WalkController(camera, canvas, solids, (locked) => {
    events.onWalkLock(locked);
  });
  const onCanvasClick = () => {
    if (mode === "walk" && !walk.locked) walk.lock();
  };
  canvas.addEventListener("click", onCanvasClick);
  // iPadOS with a trackpad matches a fine pointer but has no Pointer Lock.
  const canWalk = window.matchMedia("(any-pointer: fine)").matches && "requestPointerLock" in canvas;

  const tour = new TourController(camera, model.tour, {
    onSection(i) {
      events.onTourSection(i);
      showTopic(model.tour[i].topic);
    },
    onProgress(f) {
      events.onTourProgress(f);
    },
    onEnd() {
      tour.playing = false;
      events.onTourEnd();
    },
  });

  let mode: Mode = "orbit";
  function setMode(next: Mode, resetView = true): void {
    if (next === "walk" && !canWalk) return;
    const previous = mode;
    mode = next;
    stopAutoRotate();
    events.onMode(next);
    orbit.enabled = next === "orbit";
    if (previous === "walk" && next !== "walk") walk.stop();
    if (previous === "tour" && next !== "tour") tour.playing = false;
    if (next === "walk") {
      flight = null;
      walk.start(model.walkSpawn.position, model.walkSpawn.yaw);
    } else if (next === "tour") {
      flight = null;
      tour.start();
    } else if (previous !== "orbit") {
      // Hand the camera back to orbit from wherever the walk or tour left it.
      const forward = new Vector3();
      camera.getWorldDirection(forward);
      orbit.target.copy(camera.position).addScaledVector(forward, 20);
      orbit.update();
      if (resetView) flyTo(home);
    }
  }

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  const occlusion = new Raycaster();
  occlusion.firstHitOnly = true;
  const projected = new Vector3();
  const toAnchor = new Vector3();
  const anchors = candi.hotspots.map((h) => new Vector3(...h.anchor));
  const updateHotspots = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    anchors.forEach((anchor, i) => {
      const el = hotspotEls[i];
      if (!el) return;
      projected.copy(anchor).project(camera);
      const visible = projected.z < 1 && Math.abs(projected.x) < 1.1 && Math.abs(projected.y) < 1.1;
      el.hidden = !visible;
      if (!visible) return;
      el.style.transform = `translate(${((projected.x + 1) / 2) * w - 13}px, ${((1 - projected.y) / 2) * h - 13}px)`;
      toAnchor.subVectors(anchor, camera.position);
      const dist = toAnchor.length();
      occlusion.set(camera.position, toAnchor.normalize());
      occlusion.far = Math.max(0, dist - 1.5);
      el.classList.toggle("occluded", occlusion.intersectObjects(model.collidables, false).length > 0);
    });
  };

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const timer = new Timer();
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    const dt = Math.min(timer.getDelta(), 0.1);
    if (mode === "orbit") {
      if (flight) {
        flight.t = Math.min(1, flight.t + dt / 1.6);
        const k = ease(flight.t);
        camera.position.fromArray(flight.from.position).lerp(new Vector3(...flight.to.position), k);
        orbit.target.fromArray(flight.from.target).lerp(new Vector3(...flight.to.target), k);
        if (flight.t >= 1) flight = null;
      }
      orbit.update(dt);
      updateHotspots();
    } else if (mode === "walk") {
      walk.update(dt);
    } else {
      tour.update(dt);
    }
    renderer.render(scene, camera);
  });

  showTopic(candi.overviewTopic);

  return {
    canWalk,
    tourSections: model.tour.length,
    tourSectionLabels: model.tour.map((s) => s.label),
    setMode,
    goToHotspot(i) {
      const spot = candi.hotspots[i];
      setMode("orbit", false);
      flyTo(spot.view);
      showTopic(spot.topic);
    },
    setTopic(key) {
      showTopic(key);
    },
    setRealms(on) {
      model.setRealmHighlight(on);
    },
    setTime(minutes) {
      env.setTime(minutes);
    },
    setTourPlaying(on) {
      tour.playing = on;
    },
    restartTour() {
      tour.start();
    },
    nextTourSection() {
      tour.nextSection();
    },
    setTourSpeed(speed) {
      tour.speed = speed;
    },
    setHotspotElements(els) {
      hotspotEls = els;
      markActiveTopic();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onCanvasClick);
      orbit.removeEventListener("start", stopAutoRotate);
      orbit.dispose();
      walk.stop();
      renderer.dispose();
    },
  };
}
