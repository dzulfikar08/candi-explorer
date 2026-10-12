import "./style.css";
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
import { borobudur } from "./candi/borobudur";
import type { CameraView, CandiDefinition, CandiModel } from "./candi/types";
import { TourController } from "./controls/tour";
import { WalkController } from "./controls/walk";
import { createEnvironment } from "./render/environment";
import { createStoneTextures } from "./render/stone";

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

type Mode = "orbit" | "walk" | "tour";

function element<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} missing from index.html`);
  return el as T;
}

const ui = {
  canvas: element<HTMLCanvasElement>("scene"),
  loading: element("loading"),
  name: element("candi-name"),
  location: element("candi-location"),
  info: element("info"),
  infoToggle: element<HTMLButtonElement>("info-toggle"),
  kicker: element("info-kicker"),
  title: element("info-title"),
  body: element("info-body"),
  facts: element("info-facts"),
  overview: element<HTMLButtonElement>("info-overview"),
  hotspots: element("hotspots"),
  modeButtons: [...document.querySelectorAll<HTMLButtonElement>("[data-mode]")],
  realms: element<HTMLButtonElement>("realms-toggle"),
  legend: element("realm-legend"),
  time: element<HTMLInputElement>("time"),
  timeLabel: element<HTMLOutputElement>("time-label"),
  walkHint: element("walk-hint"),
  walkHintText: element("walk-hint-text"),
  tourBar: element("tour-bar"),
  tourPlay: element<HTMLButtonElement>("tour-play"),
  tourNext: element<HTMLButtonElement>("tour-next"),
  tourSpeed: element<HTMLSelectElement>("tour-speed"),
  tourExit: element<HTMLButtonElement>("tour-exit"),
  tourFill: element("tour-progress-fill"),
  tourProgress: element("tour-progress"),
  tourSection: element("tour-section"),
};

function start(candi: CandiDefinition): void {
  const renderer = new WebGLRenderer({ canvas: ui.canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 30000);

  const model: CandiModel = candi.build(createStoneTextures());
  scene.add(model.group);
  const env = createEnvironment(scene, renderer, candi);

  const solids: Object3D[] = [...model.collidables, env.ground];
  for (const o of solids) (o as Mesh).geometry.computeBoundsTree();

  ui.name.textContent = candi.name;
  ui.location.textContent = candi.location;
  document.title = `Candi Explorer · ${candi.name}`;

  // Orbit camera.
  const orbit = new OrbitControls(camera, ui.canvas);
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

  let flight: { from: CameraView; to: CameraView; t: number } | null = null;
  const flyTo = (view: CameraView) => {
    flight = {
      from: { position: camera.position.toArray(), target: orbit.target.toArray() },
      to: view,
      t: 0,
    };
  };

  // Info panel.
  const showTopic = (key: string) => {
    const topic = candi.topics[key];
    ui.kicker.textContent = topic.kicker;
    ui.title.textContent = topic.title;
    ui.body.replaceChildren(
      ...topic.paragraphs.map((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        return p;
      }),
    );
    ui.facts.replaceChildren(
      ...(topic.facts ?? []).flatMap(([label, value]) => {
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        return [dt, dd];
      }),
    );
    ui.overview.hidden = key === candi.overviewTopic;
    ui.info.classList.remove("collapsed");
    ui.infoToggle.setAttribute("aria-expanded", "true");
    ui.infoToggle.textContent = "Hide notes";
    for (const h of hotspotEls) h.el.classList.toggle("active", h.topic === key);
  };
  ui.overview.addEventListener("click", () => showTopic(candi.overviewTopic));
  ui.infoToggle.addEventListener("click", () => {
    const collapsed = ui.info.classList.toggle("collapsed");
    ui.infoToggle.setAttribute("aria-expanded", String(!collapsed));
    ui.infoToggle.textContent = collapsed ? "Show notes" : "Hide notes";
  });

  // Hotspot markers.
  const hotspotEls = candi.hotspots.map((h, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "hotspot";
    el.innerHTML = `<span class="hotspot-dot" aria-hidden="true">${i + 1}</span><span class="hotspot-label"></span>`;
    el.querySelector(".hotspot-label")!.textContent = h.label;
    el.setAttribute("aria-label", h.label);
    el.addEventListener("click", () => {
      setMode("orbit", false);
      flyTo(h.view);
      showTopic(h.topic);
    });
    ui.hotspots.append(el);
    return { el, topic: h.topic, anchor: new Vector3(...h.anchor) };
  });

  // Walk and tour.
  const walk = new WalkController(camera, ui.canvas, solids, (locked) => {
    ui.walkHint.hidden = locked || mode !== "walk";
  });
  ui.canvas.addEventListener("click", () => {
    if (mode === "walk" && !walk.locked) walk.lock();
  });
  const canWalk = window.matchMedia("(any-pointer: fine)").matches;

  const tour = new TourController(camera, model.tour, {
    onSection(i) {
      const section = model.tour[i];
      ui.tourSection.textContent = `${i + 1} / ${model.tour.length} · ${section.label}`;
      showTopic(section.topic);
    },
    onProgress(f) {
      const pct = Math.round(f * 1000) / 10;
      ui.tourFill.style.width = `${pct}%`;
      ui.tourProgress.setAttribute("aria-valuenow", String(Math.round(pct)));
    },
    onEnd() {
      tour.playing = false;
      ui.tourPlay.textContent = "Replay";
    },
  });
  ui.tourPlay.addEventListener("click", () => {
    if (ui.tourPlay.textContent === "Replay") {
      tour.start();
      ui.tourPlay.textContent = "Pause";
      return;
    }
    tour.playing = !tour.playing;
    ui.tourPlay.textContent = tour.playing ? "Pause" : "Resume";
  });
  ui.tourNext.addEventListener("click", () => tour.nextSection());
  ui.tourSpeed.addEventListener("change", () => {
    tour.speed = Number(ui.tourSpeed.value);
  });
  tour.speed = Number(ui.tourSpeed.value);
  ui.tourExit.addEventListener("click", () => setMode("orbit"));

  let mode: Mode = "orbit";
  function setMode(next: Mode, resetView = true): void {
    if (next === "walk" && !canWalk) return;
    const previous = mode;
    mode = next;
    for (const b of ui.modeButtons) b.setAttribute("aria-pressed", String(b.dataset.mode === next));
    orbit.enabled = next === "orbit";
    ui.hotspots.hidden = next !== "orbit";
    ui.tourBar.hidden = next !== "tour";
    ui.walkHint.hidden = next !== "walk";
    if (previous === "walk" && next !== "walk") walk.stop();
    if (previous === "tour" && next !== "tour") tour.playing = false;
    if (next === "walk") {
      flight = null;
      walk.start(model.walkSpawn.position, model.walkSpawn.yaw);
    } else if (next === "tour") {
      flight = null;
      ui.tourPlay.textContent = "Pause";
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
  for (const b of ui.modeButtons) b.addEventListener("click", () => setMode(b.dataset.mode as Mode));
  if (!canWalk) {
    const walkButton = ui.modeButtons.find((b) => b.dataset.mode === "walk")!;
    walkButton.disabled = true;
    walkButton.title = "Walking needs a keyboard and mouse";
  }

  // Realms overlay.
  ui.realms.addEventListener("click", () => {
    const on = ui.realms.getAttribute("aria-pressed") !== "true";
    ui.realms.setAttribute("aria-pressed", String(on));
    ui.legend.hidden = !on;
    model.setRealmHighlight(on);
  });

  // Time of day.
  const applyTime = () => {
    const minutes = Number(ui.time.value);
    ui.timeLabel.textContent = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    env.setTime(minutes);
  };
  ui.time.addEventListener("input", applyTime);
  applyTime();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const occlusion = new Raycaster();
  occlusion.firstHitOnly = true;
  const projected = new Vector3();
  const toAnchor = new Vector3();
  const updateHotspots = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const { el, anchor } of hotspotEls) {
      projected.copy(anchor).project(camera);
      const visible = projected.z < 1 && Math.abs(projected.x) < 1.1 && Math.abs(projected.y) < 1.1;
      el.hidden = !visible;
      if (!visible) continue;
      el.style.transform = `translate(${((projected.x + 1) / 2) * w - 13}px, ${((1 - projected.y) / 2) * h - 13}px)`;
      toAnchor.subVectors(anchor, camera.position);
      const dist = toAnchor.length();
      occlusion.set(camera.position, toAnchor.normalize());
      occlusion.far = Math.max(0, dist - 1.5);
      el.classList.toggle("occluded", occlusion.intersectObjects(model.collidables, false).length > 0);
    }
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
      orbit.update();
      updateHotspots();
    } else if (mode === "walk") {
      walk.update(dt);
    } else {
      tour.update(dt);
    }
    renderer.render(scene, camera);
  });

  showTopic(candi.overviewTopic);
  // On phones the notes sheet would cover the monument; start it folded.
  if (window.matchMedia("(max-width: 760px)").matches) ui.infoToggle.click();
  ui.loading.hidden = true;
}

// Let the loading message paint before the synchronous build.
requestAnimationFrame(() =>
  setTimeout(() => {
    try {
      start(borobudur);
    } catch (err) {
      console.error(err);
      ui.loading.textContent =
        err instanceof Error && /WebGL/i.test(err.message)
          ? "This browser could not start WebGL, which the 3D view needs. Try a current Chrome, Firefox or Safari."
          : "The temple failed to load. Reload the page to try again.";
    }
  }, 0),
);
