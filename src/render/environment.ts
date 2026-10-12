import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  FogExp2,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Path,
  PlaneGeometry,
  Quaternion,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  type Scene,
  type WebGLRenderer,
} from "three";
import { Sky } from "three/addons/objects/Sky.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { CandiDefinition, HorizonFeature } from "../candi/types";
import { sunDirection } from "./sun";

type Setting = CandiDefinition["setting"];

function hash(x: number, z: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, z: number): number {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const fx = x - xi;
  const fz = z - zi;
  const sx = fx * fx * (3 - 2 * fx);
  const sz = fz * fz * (3 - 2 * fz);
  const a = hash(xi, zi);
  const b = hash(xi + 1, zi);
  const c = hash(xi, zi + 1);
  const d = hash(xi + 1, zi + 1);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}

function fbm(x: number, z: number): number {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < 5; i++) {
    sum += amp * valueNoise(x * f, z * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

/** Distance along the approach road and distance off its centre line. */
function approachFrame(setting: Setting, x: number, z: number): { along: number; off: number } {
  const { x: ax, z: az } = setting.approach;
  return { along: x * ax + z * az, off: Math.abs(x * az - z * ax) };
}

/** Gentle farmland hills, flattened around the monument and along the approach road. */
function terrainHeight(setting: Setting, x: number, z: number): number {
  const r = Math.hypot(x, z);
  const rise = MathUtils.smoothstep(r, setting.plazaRadius, setting.plazaRadius + 360);
  const { along, off } = approachFrame(setting, x, z);
  const approach = along > 0 ? MathUtils.smoothstep(off, 10, 45) : 1;
  return (fbm(x / 420, z / 420) - 0.45) * 60 * rise * approach + rise * 4 * approach;
}

/** Terrain grid spacing in metres; pits are cut out in whole cells. */
const TERRAIN_SIZE = 14000;
const TERRAIN_CELLS = 280;
const CELL = TERRAIN_SIZE / TERRAIN_CELLS;

function buildTerrain(setting: Setting): Mesh {
  const geometry = new PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_CELLS, TERRAIN_CELLS);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.getAttribute("position");
  const colours: number[] = [];
  const lawn = new Color("#5f7f3c");
  const field = new Color("#6d8a3e");
  const forest = new Color("#3f5a2e");
  const c = new Color();
  const plaza = setting.plazaRadius;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainHeight(setting, x, z));
    const n = fbm(x / 160 + 9, z / 160 - 4);
    c.copy(field).lerp(forest, MathUtils.smoothstep(n, 0.45, 0.65));
    c.lerp(lawn, 1 - MathUtils.smoothstep(Math.hypot(x, z), plaza - 30, plaza + 60));
    colours.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new Float32BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  const terrain = setting.pit ? withPit(geometry, setting.pit, lawn) : geometry;
  const mesh = new Mesh(terrain, new MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  mesh.receiveShadow = true;
  mesh.name = "terrain";
  return mesh;
}

/**
 * Open a rectangular hole for a sunken court: drop the grid cells it touches, then fill them back
 * with a flat lawn that has the exact hole. The site models the pit's walls and floor.
 */
function withPit(grid: BufferGeometry, pit: { halfX: number; halfZ: number }, lawn: Color): BufferGeometry {
  const x0 = Math.floor(-pit.halfX / CELL) * CELL;
  const x1 = Math.ceil(pit.halfX / CELL) * CELL;
  const z0 = Math.floor(-pit.halfZ / CELL) * CELL;
  const z1 = Math.ceil(pit.halfZ / CELL) * CELL;
  const pos = grid.getAttribute("position");
  const index = grid.getIndex()!;
  const inside = (i: number) => pos.getX(i) >= x0 - 1e-6 && pos.getX(i) <= x1 + 1e-6 && pos.getZ(i) >= z0 - 1e-6 && pos.getZ(i) <= z1 + 1e-6;
  const kept: number[] = [];
  for (let t = 0; t < index.count; t += 3) {
    const [a, b, c] = [index.getX(t), index.getX(t + 1), index.getX(t + 2)];
    if (!(inside(a) && inside(b) && inside(c))) kept.push(a, b, c);
  }
  grid.setIndex(kept);
  // ShapeGeometry lies in x/y facing +z; turning it -90° about x sends y to -z and its face up,
  // so draw the shape at (x, -z).
  const v = (x: number, z: number) => new Vector2(x, -z);
  const outer = new Shape([v(x0, z0), v(x1, z0), v(x1, z1), v(x0, z1)]);
  outer.holes.push(new Path([v(-pit.halfX, -pit.halfZ), v(-pit.halfX, pit.halfZ), v(pit.halfX, pit.halfZ), v(pit.halfX, -pit.halfZ)]));
  const patch = new ShapeGeometry(outer).rotateX(-Math.PI / 2);
  const n = patch.getAttribute("position").count;
  patch.setAttribute("color", new Float32BufferAttribute(Array.from({ length: n * 3 }, (_, i) => [lawn.r, lawn.g, lawn.b][i % 3]), 3));
  return mergeGeometries([grid.toNonIndexed(), patch.toNonIndexed()]);
}

function buildApproach(setting: Setting): Mesh {
  const geometry = new PlaneGeometry(1400, 8);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(setting.approach.start + 700, 0.04, 0);
  geometry.rotateY(-Math.atan2(setting.approach.z, setting.approach.x));
  const mesh = new Mesh(geometry, new MeshStandardMaterial({ color: "#9c9282", roughness: 1 }));
  mesh.receiveShadow = true;
  return mesh;
}

function coloured(geometry: BufferGeometry, colour: string): BufferGeometry {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const c = new Color(colour);
  const n = g.getAttribute("position").count;
  g.setAttribute("color", new Float32BufferAttribute(Array.from({ length: n * 3 }, (_, i) => [c.r, c.g, c.b][i % 3]), 3));
  return g;
}

function buildTrees(setting: Setting): InstancedMesh {
  const trunk = new CylinderGeometry(0.35, 0.5, 6, 6);
  trunk.translate(0, 3, 0);
  const crownA = new IcosahedronGeometry(3.6, 1);
  crownA.scale(1.2, 0.8, 1.2);
  crownA.translate(0, 7.2, 0);
  const crownB = new IcosahedronGeometry(2.6, 1);
  crownB.translate(1.4, 9, 0.6);
  const geometry = mergeGeometries([coloured(trunk, "#5a4636"), coloured(crownA, "#ffffff"), coloured(crownB, "#ffffff")]);
  const material = new MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true });
  const count = 1600;
  const trees = new InstancedMesh(geometry, material, count);
  const m = new Matrix4();
  const q = new Quaternion();
  const greens = ["#3d5f2c", "#4a6b30", "#365526", "#55743a"].map((c) => new Color(c));
  let placed = 0;
  for (let attempt = 0; placed < count && attempt < count * 10; attempt++) {
    const a = hash(attempt, 1) * Math.PI * 2;
    const r = setting.plazaRadius + 35 + Math.pow(hash(attempt, 2), 1.4) * 1700;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const { along, off } = approachFrame(setting, x, z);
    if (along > 0 && off < 18) continue;
    // Cluster trees into groves rather than an even sprinkle.
    if (fbm(x / 160 + 9, z / 160 - 4) < 0.42 && r > setting.plazaRadius + 40) continue;
    const s = 0.8 + hash(attempt, 3) * 0.9;
    q.setFromAxisAngle(new Vector3(0, 1, 0), hash(attempt, 4) * Math.PI * 2);
    m.compose(new Vector3(x, terrainHeight(setting, x, z) - 0.3, z), q, new Vector3(s, s * (0.85 + hash(attempt, 5) * 0.4), s));
    trees.setMatrixAt(placed, m);
    trees.setColorAt(placed, greens[Math.floor(hash(attempt, 6) * greens.length)]);
    placed++;
  }
  trees.count = placed;
  trees.castShadow = true;
  trees.receiveShadow = true;
  trees.computeBoundingSphere();
  return trees;
}

/**
 * Concave stratovolcano or ridge hill silhouette, scaled to keep its true angular size. Sites on a
 * volcano's own slope (Cetho, Sukuh on Lawu) put a tall peak at the minimum scene distance; its
 * base is then narrowed so the cone never reaches over the site and the camera.
 */
function buildHorizon(features: HorizonFeature[], site: { lat: number; lon: number }, setting: Setting): Mesh[] {
  const material = new MeshStandardMaterial({ color: "#4d5d48", roughness: 1, flatShading: true });
  return features.flatMap((f) => {
    const eastKm = (f.lon - site.lon) * 111.32 * Math.cos((site.lat * Math.PI) / 180);
    const northKm = (f.lat - site.lat) * 110.57;
    const distKm = Math.hypot(eastKm, northKm);
    const bearing = Math.atan2(eastKm, northKm);
    const sceneDist = MathUtils.clamp(distKm * 130, 1400, 4200);
    const height = (sceneDist * f.relativeHeight) / (distKm * 1000);
    // Outline noise widens the base by up to 17.5%; keep that clear of the plaza and a viewing margin.
    const maxRadius = (sceneDist - setting.plazaRadius - 400) / 1.175;
    const peak = (h: number, radius: number, seed: number) => {
      const profile = Array.from({ length: 18 }, (_, i) => {
        const t = i / 17;
        const r = f.kind === "volcano" ? radius * Math.pow(1 - t, 1.7) + radius * 0.03 : radius * Math.cos((t * Math.PI) / 2);
        return new Vector2(r, t * h);
      });
      const g = new LatheGeometry(profile, 48);
      const pos = g.getAttribute("position");
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const k = 1 + (valueNoise(x / 60 + seed, z / 60) - 0.5) * 0.35;
        pos.setXYZ(i, x * k, pos.getY(i), z * k);
      }
      g.computeVertexNormals();
      return g;
    };
    const centre = new Vector3(Math.sin(bearing) * sceneDist, -15, -Math.cos(bearing) * sceneDist);
    if (f.kind === "volcano") {
      const mesh = new Mesh(peak(height, Math.min(height * 3.4, maxRadius), distKm), material);
      mesh.position.copy(centre);
      mesh.name = f.name;
      return [mesh];
    }
    // Ridge: a chain of rounded hills across the line of sight.
    const across = new Vector3(Math.cos(bearing), 0, Math.sin(bearing));
    return Array.from({ length: 11 }, (_, i) => {
      const h = height * (0.55 + hash(i, 7) * 0.45);
      const mesh = new Mesh(peak(h, Math.min(h * 4.5, maxRadius), i * 3.1), material);
      mesh.position.copy(centre).addScaledVector(across, (i - 5) * sceneDist * 0.16);
      mesh.name = f.name;
      return mesh;
    });
  });
}

export interface Environment {
  /** Terrain the walker stands on outside the monument. */
  ground: Mesh;
  /** Minutes after midnight, WIB. */
  setTime(minutes: number): void;
}

export function createEnvironment(scene: Scene, renderer: WebGLRenderer, candi: CandiDefinition): Environment {
  const sky = new Sky();
  sky.scale.setScalar(20000);
  const u = sky.material.uniforms;
  u.turbidity.value = 7;
  u.rayleigh.value = 1.8;
  u.mieCoefficient.value = 0.006;
  u.mieDirectionalG.value = 0.82;
  scene.add(sky);

  const sun = new DirectionalLight("#ffffff", 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  const cam = sun.shadow.camera;
  const extent = candi.setting.shadowExtent;
  cam.left = -extent;
  cam.right = extent;
  cam.top = extent;
  cam.bottom = -extent;
  cam.near = 10;
  cam.far = 400 + extent * 2;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.05;
  scene.add(sun, sun.target);

  const hemi = new HemisphereLight("#bcd2e6", "#55583a", 0.6);
  scene.add(hemi);

  const fog = new FogExp2("#b7c9d6", 0.0002);
  scene.fog = fog;

  const ground = buildTerrain(candi.setting);
  scene.add(ground, buildApproach(candi.setting), buildTrees(candi.setting), ...buildHorizon(candi.horizon, candi.site, candi.setting));

  const dawn = new Color("#d9a27c");
  const day = new Color("#b4c6d4");
  const night = new Color("#1a2130");
  const warm = new Color("#ffa860");
  const white = new Color("#fff3e3");
  const skyDay = new Color("#bcd2e6");
  const skyDusk = new Color("#8d93b3");

  return {
    ground,
    setTime(minutes) {
      const [x, y, z] = sunDirection(new Date(), minutes, candi.site.lat, candi.site.lon);
      const dir = new Vector3(x, y, z);
      u.sunPosition.value.copy(dir);
      sun.position.copy(dir).multiplyScalar(400);
      const up = y;
      // Below the horizon the sun would light geometry from underneath; fade it out first.
      const daylight = MathUtils.smoothstep(up, 0, 0.12);
      sun.intensity = 3.2 * daylight;
      sun.color.copy(warm).lerp(white, MathUtils.smoothstep(up, 0.03, 0.4));
      // Sky fill: strong enough that shaded faces and twilight scenes stay readable.
      const fill = MathUtils.smoothstep(up, -0.2, 0.35);
      hemi.intensity = 1.4 + 0.8 * fill;
      hemi.color.copy(skyDusk).lerp(skyDay, fill);
      fog.color.copy(night).lerp(dawn, MathUtils.smoothstep(up, -0.12, 0.02)).lerp(day, MathUtils.smoothstep(up, 0.05, 0.35));
      // Kedu Plain mornings are misty; the haze burns off by mid-morning.
      const hours = minutes / 60;
      fog.density = 0.00016 + 0.00045 * (1 - MathUtils.smoothstep(hours, 5.75, 8.75));
      renderer.toneMappingExposure = 0.48 + 0.14 * MathUtils.smoothstep(up, -0.1, 0.3);
    },
  };
}
