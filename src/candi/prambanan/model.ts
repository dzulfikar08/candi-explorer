import { Vector3, type Matrix4 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court, enclosure } from "../kit/enclosure";
import { placement } from "../kit/plan";
import { ruin } from "../kit/ruin";
import { type ShrineSpec, shrine } from "../kit/shrine";
import { type Part, Site } from "../kit/site";
import type { CandiModel } from "../types";
import { APIT, INNER, INNER_HALF, MIDDLE_HALF, PERWARA, SHIVA, SMALL, TRIMURTI_FLANK, VAHANA, perwaraPlacements } from "./layout";
import { buildTour } from "./tour";

const NANDI: ShrineSpec = { ...VAHANA, image: { kind: "bull", height: 1.5 } };

const SPECS: Record<string, ShrineSpec> = {
  shiva: SHIVA,
  brahma: TRIMURTI_FLANK,
  vishnu: TRIMURTI_FLANK,
  nandi: NANDI,
  hamsa: VAHANA,
  garuda: VAHANA,
  apit: APIT,
  small: SMALL,
};

export function buildPrambanan(textures: StoneTextures): CandiModel {
  const site = new Site("Prambanan", textures);

  // Inner court: paved, walled, a gate on each side.
  court(site, INNER_HALF, INNER_HALF);
  enclosure(site, { halfX: INNER_HALF, halfZ: INNER_HALF, height: 2.6, thickness: 1, gates: ["east", "south", "west", "north"], gateWidth: 3, gate: "paduraksa" });
  enclosure(site, { halfX: MIDDLE_HALF, halfZ: MIDDLE_HALF, height: 1.6, thickness: 0.9, gates: ["east", "south", "west", "north"], gateWidth: 3.5, gate: "paduraksa" });

  // Each distinct shrine is built once and merged where it stands.
  const built = new Map<ShrineSpec, Part[]>();
  for (const t of INNER) {
    const spec = SPECS[t.key];
    let parts = built.get(spec);
    if (!parts) {
      parts = shrine(spec).parts;
      built.set(spec, parts);
    }
    site.place(parts, placement(t.at.x, 0, t.at.z, t.facing));
  }

  // 224 perwara in the middle court: instanced, most as ruins.
  const intact = shrine(PERWARA).parts;
  const standing: Matrix4[] = [];
  const fallen: Matrix4[][] = [[], [], []];
  const rubble = [ruin(PERWARA, 7), ruin(PERWARA, 19), ruin(PERWARA, 31)];
  for (const [i, p] of perwaraPlacements().entries()) {
    const m = placement(p.at.x, 0, p.at.z, p.facing);
    if (p.restored) standing.push(m);
    else fallen[i % 3].push(m);
  }
  site.instance(intact, standing);
  rubble.forEach((parts, i) => site.instance(parts, fallen[i]));

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(130, 0, 0), yaw: Math.PI / 2 },
  };
}
