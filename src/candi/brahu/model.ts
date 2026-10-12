import { CylinderGeometry, LatheGeometry, Matrix4, Vector2, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import type { MeshBuilder, V3 } from "../../render/mesh-builder";
import { type Direction, DIRECTIONS, rectOutline, type Vec2 } from "../kit/plan";
import { block, walls } from "../kit/shrine";
import { Site } from "../kit/site";
import { eye, loop } from "../kit/tour";
import type { CandiModel, Realm, TourSection } from "../types";

/**
 * Sources: Indonesian Wikipedia "Candi Brahu" (base 22.5 × 18 m, height about 20 m, faces west,
 * Buddhist) and Buddhazine's restoration summary (Jo Priastana, 2012, from the 1990/91–1994/95
 * excavation and reconstruction): body 10 × 10.5 m and 9.6 m tall with boldly rounded corners,
 * roof about 6 m ending flat with the remains of a circular stupa ornament at its south-east
 * corner, a 4 × 4 m chamber with no surviving access, and a west stair whose original form is
 * unknown. The same survey gives an azimuth of 227° (WSW) — snapped to west here — and a total
 * height of 25.7 m; the commonly published 20 m is modelled. The two base steps approximate the
 * published 22.5 × 18 m overall base and the 17 × 17 m foot of the earlier building phase found
 * beneath it.
 */

/** Square plan with strongly rounded corners, as Brahu's body; same winding as rectOutline. */
function roundedSquare(halfX: number, halfZ: number, r: number): Vec2[] {
  const loop: Vec2[] = [];
  const arc = (cx: number, cz: number, a0: number, a1: number) => {
    for (let k = 1; k <= 4; k++) {
      const a = a0 + ((a1 - a0) * k) / 4;
      loop.push({ x: cx + r * Math.cos(a), z: cz + r * Math.sin(a) });
    }
  };
  loop.push({ x: -(halfX - r), z: halfZ });
  loop.push({ x: halfX - r, z: halfZ });
  arc(halfX - r, halfZ - r, Math.PI / 2, 0);
  loop.push({ x: halfX, z: -(halfZ - r) });
  arc(halfX - r, -(halfZ - r), 0, -Math.PI / 2);
  loop.push({ x: -(halfX - r), z: -halfZ });
  arc(-(halfX - r), -(halfZ - r), -Math.PI / 2, -Math.PI);
  loop.push({ x: -halfX, z: halfZ - r });
  arc(-(halfX - r), halfZ - r, Math.PI, Math.PI / 2);
  return loop;
}

/** One stage of Brahu's rounded mass: wall with a projecting moulded band on top and a floor. */
function tier(site: Site, realm: Realm, halfX: number, halfZ: number, r: number, y0: number, y1: number): void {
  const masonry = site.get(realm, "masonry");
  const loop = roundedSquare(halfX, halfZ, r);
  const grown = roundedSquare(halfX + 0.32, halfZ + 0.32, r + 0.32);
  walls(masonry, loop, y0, y1 - 0.45);
  masonry.cap(grown, y1 - 0.45, [loop], true);
  walls(masonry, grown, y1 - 0.45, y1);
  site.get(realm, "floor").cap(grown, y1);
}

/** Map face-local coordinates (s outward along the face axis, u lateral) to world space. */
function axisPoint(d: Direction, s: number, u: number, y: number): V3 {
  const v = DIRECTIONS[d];
  return v.x !== 0 ? [v.x * s, y, u] : [u, y, v.z * s];
}

function axisBox(b: MeshBuilder, d: Direction, s: [number, number], u: [number, number], y: [number, number]): void {
  const p = axisPoint(d, s[0], u[0], y[0]);
  const q = axisPoint(d, s[1], u[1], y[1]);
  b.box([Math.min(p[0], q[0]), y[0], Math.min(p[2], q[2])], [Math.max(p[0], q[0]), y[1], Math.max(p[2], q[2])], {});
}

/**
 * Tall blind panel with a stepped brick frame, as on Brahu's faces. The west one marks the
 * original entrance, now sealed: the chamber has no surviving access.
 */
function blindPanel(site: Site, d: Direction, face: number, y0: number, y1: number, halfWidth: number): void {
  const masonry = site.get("middle", "masonry");
  axisBox(masonry, d, [face - 0.15, face + 0.15], [-halfWidth - 0.3, -halfWidth], [y0 - 0.3, y1 + 0.3]);
  axisBox(masonry, d, [face - 0.15, face + 0.15], [halfWidth, halfWidth + 0.3], [y0 - 0.3, y1 + 0.3]);
  axisBox(masonry, d, [face - 0.15, face + 0.15], [-halfWidth - 0.3, halfWidth + 0.3], [y0 - 0.3, y0]);
  axisBox(masonry, d, [face - 0.15, face + 0.15], [-halfWidth - 0.3, halfWidth + 0.3], [y1, y1 + 0.3]);
  const shadow = site.get("middle", "nicheShadow");
  const a = axisPoint(d, face + 0.01, -halfWidth, y0);
  const b = axisPoint(d, face + 0.01, halfWidth, y0);
  const c = axisPoint(d, face + 0.01, halfWidth, y1);
  const e = axisPoint(d, face + 0.01, -halfWidth, y1);
  const v = DIRECTIONS[d];
  shadow.quad(a, b, c, e, [v.x, 0, v.z]);
}

/** Straight stepped brick flight with stepped cheeks; the form of Brahu's west stair is unknown. */
function stairFlight(site: Site, sTop: number, run: number, yLow: number, yHigh: number, width: number): void {
  const masonry = site.get("lower", "masonry");
  const floor = site.get("lower", "floor");
  const rise = yHigh - yLow;
  const n = Math.ceil(rise / 0.26);
  const riser = rise / n;
  const tread = run / n;
  const w = width / 2;
  const cheek = 0.5;
  // Overlap into the wall behind so no gap shows at the top step.
  for (let j = 1; j <= n; j++) {
    const s1 = sTop + (n - j + 1) * tread;
    floor.box([-s1, yLow, -w], [-sTop, yLow + j * riser, w], {});
    for (const side of [-1, 1]) {
      const u0 = side < 0 ? -w - cheek : w;
      const u1 = side < 0 ? -w : w + cheek;
      masonry.box([-s1, yLow, Math.min(u0, u1)], [-sTop + 0.02, Math.min(yLow + j * riser + 0.7, yHigh + 0.7), Math.max(u0, u1)], {});
    }
  }
}

/** Crown profile: radius, height above the top tier. LatheGeometry turns it around the y axis. */
const CROWN_PROFILE: [number, number][] = [
  [2.55, 0],
  [2.75, 0.2],
  [2.7, 0.45],
  [2.35, 1.1],
  [1.85, 1.8],
  [1.35, 2.4],
  [1.1, 2.75],
  [1.1, 2.95],
  [0, 2.95],
];

export function buildBrahu(textures: StoneTextures): CandiModel {
  const site = new Site("Brahu", textures, "brick");

  // Foot: two moulded steps, 22.5 × 18 m overall; the upper step stands for the 17 × 17 m
  // foot of the earlier building phase found beneath the present one.
  block(site, "lower", rectOutline(11.25, 9), 0, 1.5);
  block(site, "lower", rectOutline(8.5, 8.5), 1.5, 4.4);

  // West stair, form unknown — two straight flights chained across the steps.
  stairFlight(site, 11.25, 2.1, 0, 1.5, 2.6);
  stairFlight(site, 8.75, 3.9, 1.5, 4.4, 2.6);
  // Solid base under the lower flight's end, which reaches past the first step's edge.
  site.get("lower", "masonry").box([-12.95, 0, -1.8], [-10.95, 1.55, 1.8], {});

  // Body, 10 × 10.5 m and 9.6 m tall: two stages for the slight taper, corners rounded.
  tier(site, "middle", 5.3, 5.45, 2.65, 4.4, 9.2);
  tier(site, "middle", 5.0, 5.25, 2.5, 9.2, 14.0);
  blindPanel(site, "west", 5.0, 9.6, 13.4, 1.1);
  blindPanel(site, "east", 5.0, 9.7, 12.9, 1.2);
  blindPanel(site, "north", 5.25, 9.7, 12.9, 1.2);
  blindPanel(site, "south", 5.25, 9.7, 12.9, 1.2);

  // Roof, about 6 m: rounded tiers closing into a stupa-like drum, flat on top.
  tier(site, "upper", 4.3, 4.5, 2.3, 14.0, 15.7);
  tier(site, "upper", 3.3, 3.5, 2.0, 15.7, 17.1);
  const crown = new LatheGeometry(
    CROWN_PROFILE.map(([r, y]) => new Vector2(r, y)),
    48,
  );
  site.get("upper", "masonry").geometry(crown, new Matrix4().makeTranslation(0, 17.1, 0));
  // The circular ornament at the roof's south-east corner, read as the base of a stupa.
  site
    .get("upper", "masonry")
    .geometry(new CylinderGeometry(0.85, 0.9, 1.2, 16), new Matrix4().makeTranslation(2.45, 17.7, 2.45));

  const tour: TourSection[] = [
    { topic: "overview", label: "Approach from the west", points: [eye(-48, 0, 0), eye(-30, 0, 0), eye(-17, 0, 0)], lookRight: 0 },
    {
      topic: "chamber",
      label: "Around the foot",
      points: [
        eye(-15.4, 0.1, 0),
        eye(-13.5, 0.2, 0),
        eye(-11.4, 1.55, 0),
        eye(-12.8, 1.6, 0),
        eye(-8.9, 4.45, 0),
        ...loop(6.9, 4.4, { halfZ: 7.1, start: "west" }),
        eye(-8.9, 4.45, 0),
        eye(-12.8, 1.6, 0),
        eye(-11.4, 1.55, 0),
        eye(-13.5, 0.2, 0),
        eye(-15.4, 0.1, 0),
      ],
      lookRight: 0.3,
    },
  ];

  return {
    ...site.finish(),
    tour,
    walkSpawn: { position: new Vector3(-48, 0, 0), yaw: Math.atan2(-48, 0) },
  };
}
