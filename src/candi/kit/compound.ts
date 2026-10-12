import { Vector3, type Matrix4 } from "three";
import type { Fabric, StoneTextures } from "../../render/stone";
import type { CandiModel, TourSection } from "../types";
import { type EnclosureSpec, type TerraceSpec, court, enclosure, terrace } from "./enclosure";
import { type Direction, DIRECTIONS, type Vec2, placement, turn } from "./plan";
import { ruin } from "./ruin";
import { type ShrineLayout, type ShrineSpec, shrine, shrineLayout } from "./shrine";
import { type Part, Site } from "./site";
import { eye, loop } from "./tour";

/**
 * A temple site as data: shrines placed in a compound with walls, courts and terraces, and a
 * pradaksina tour generated from it (walk in, climb each toured shrine's front stair, circle its
 * body clockwise, look into the chamber, come down, move on).
 */

export interface CompoundShrine {
  spec: ShrineSpec;
  at: Vec2;
  facing: Direction;
  /** Ground level under the shrine (on a terrace or a hill step). */
  y?: number;
  /** Collapsed: foot standing, the rest a heap. Ruins are instanced and never toured. */
  ruined?: boolean;
  /** Visited by the tour, with this topic and label. */
  tour?: { topic: string; label: string };
}

export interface CompoundSpec {
  name: string;
  fabric?: Fabric;
  shrines: CompoundShrine[];
  enclosures?: EnclosureSpec[];
  courts?: { halfX: number; halfZ: number; cx?: number; cz?: number; y?: number }[];
  terraces?: { spec: TerraceSpec; at: Vec2 }[];
  /** Site-specific geometry the kit has no piece for. */
  extra?(site: Site): void;
  /** Where the tour starts walking in from (ground level), waypoints (with heights), first section. */
  approach: { from: Vec2; topic: string; label: string; via?: { x: number; z: number; y?: number }[] };
  walkSpawn?: { position: Vector3; yaw: number };
}

/** Climb the front stair, circle the body clockwise, look in at the door, come back down. */
function shrineTour(s: CompoundShrine, layout: ShrineLayout): Vector3[] {
  const front = turn((s.spec.stairs ?? s.spec.doors)[0] ?? "east", s.facing);
  const v = DIRECTIONS[front];
  const y = s.y ?? 0;
  const at = (dist: number, h: number) => eye(s.at.x + v.x * dist, y + h, s.at.z + v.z * dist);
  const climb = layout.flights.flatMap((f) => [at(f.sBottom + 0.3, f.yLow), at(f.sTop - 0.4, f.yHigh)]);
  const ring = (layout.levels.at(-1)!.half + s.spec.body.half) / 2 + 0.15;
  const door = s.spec.doors.length ? [at(s.spec.body.half * 0.55, layout.footTop), at(ring, layout.footTop)] : [];
  return [
    at(layout.stairReach + 4, 0),
    ...climb,
    ...loop(ring, y + layout.footTop, { cx: s.at.x, cz: s.at.z, start: front }),
    ...door,
    ...[...climb].reverse(),
    at(layout.stairReach + 4, 0),
  ];
}

export function buildCompound(spec: CompoundSpec, textures: StoneTextures): CandiModel {
  const site = new Site(spec.name, textures, spec.fabric);
  for (const c of spec.courts ?? []) court(site, c.halfX, c.halfZ, c.cx, c.cz, c.y);
  for (const e of spec.enclosures ?? []) enclosure(site, e);
  for (const t of spec.terraces ?? []) site.place(terrace(t.spec), placement(t.at.x, 0, t.at.z));
  spec.extra?.(site);

  const built = new Map<ShrineSpec, Part[]>();
  const ruins = new Map<ShrineSpec, Matrix4[]>();
  const sections: TourSection[] = [];
  for (const s of spec.shrines) {
    const m = placement(s.at.x, s.y ?? 0, s.at.z, s.facing);
    if (s.ruined) {
      ruins.set(s.spec, [...(ruins.get(s.spec) ?? []), m]);
      continue;
    }
    let parts = built.get(s.spec);
    if (!parts) {
      parts = shrine(s.spec).parts;
      built.set(s.spec, parts);
    }
    site.place(parts, m);
    if (s.tour) sections.push({ topic: s.tour.topic, label: s.tour.label, points: shrineTour(s, shrineLayout(s.spec)), lookRight: 0.3 });
  }
  let seed = 3;
  for (const [s, matrices] of ruins) site.instance(ruin(s, (seed += 11)), matrices);

  const { from, via = [] } = spec.approach;
  const first = sections[0]?.points[0];
  const approach = [eye(from.x, 0, from.z), ...via.map((p) => eye(p.x, p.y ?? 0, p.z)), ...(first ? [first] : [])];
  return {
    ...site.finish(),
    tour: [{ topic: spec.approach.topic, label: spec.approach.label, points: approach, lookRight: 0 }, ...sections],
    walkSpawn: spec.walkSpawn ?? { position: new Vector3(from.x, 0, from.z), yaw: Math.atan2(from.x, from.z) },
  };
}
