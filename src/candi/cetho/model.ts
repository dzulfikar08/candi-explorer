import { BoxGeometry, CapsuleGeometry, CylinderGeometry, Matrix4, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { block, shrine, type ShrineSpec } from "../kit/shrine";
import { enclosure, terrace } from "../kit/enclosure";
import { deity, linggaYoni } from "../kit/ornaments";
import { placement, rectOutline } from "../kit/plan";
import { Site } from "../kit/site";
import type { CandiModel } from "../types";
import { ADVISERS, BATUR, COURT, GATE1, GATE2, GUARDIANS, LEVELS, PENDAPA, PETILASAN, PUNDEN, RELIEF_LEVELS, RELIEF_Z, ROYAL, TURTLE } from "./layout";
import { buildTour } from "./tour";

/**
 * Sources: Wikipedia "Candi Ceto" and "Ceto Temple"; Indonesia Kaya, "Candi Cetho, Candi Peruwatan
 * Agama Hindu"; karanganyarkab.go.id and pesonakaranganyar.karanganyarkab.go.id. Key figures: found
 * ruined on 14 terraces running west (lowest) to east, 13 still traceable today, 9 rebuilt in the
 * contested 1975–1976 restoration led by Sudjono Humardani; the second gate's inscription is dated
 * 1397 Saka (1475 CE); the floor-relief animal chronogram is read as 1373 Saka (1451 CE); the floor
 * phallus is about 2 m long; the site lies at 1,400–1,496 m (sources differ). Terrace dimensions
 * are not published — the drawn plan is an approximation. The great gate, the timber pavilions,
 * the identified statues and the summit cube building are all works of the 1970s rebuilding, which
 * the topics say explicitly.
 */

/** The summit building: a boxy shrine with a stepped top, facing west like the whole climb. No
 * image is recorded inside, so the chamber is left empty. */
const CUBE: ShrineSpec = {
  foot: { half: 2.7, height: 0.6 },
  body: { half: 2.3, height: 3.2, wall: 0.7 },
  door: { width: 1.3, height: 2.3 },
  doors: ["west"],
  stairWidth: 1.6,
  roof: { tiers: 2, first: 1, shrink: 0.72, finial: "none" },
  crown: { kind: "none", height: 0 },
};

/** Timber of the pendapa (Bali-style additions of the 1970s). The realm overlay only tints the
 * site's own stone materials, so the wood keeps its colour. */
const WOOD = new MeshStandardMaterial({ color: "#6a4f35", roughness: 0.85 });
const WOOD_ROOF = new MeshStandardMaterial({ color: "#463524", roughness: 0.9 });

/** The white statue of Saraswati, a gift from the regency of Gianyar. */
const WHITE = new MeshStandardMaterial({ color: "#d9d4c6", roughness: 0.65 });

/**
 * Freestanding candi bentar: two tapering towers flanking the axis, their inner faces stepping
 * apart as they rise — the split silhouette. Stands on a terrace floor at (x, y).
 */
function bentar(site: Site, x: number, y: number, halfGap: number, height: number): void {
  const b = site.get("lower", "masonry");
  const depth = height * 0.26;
  const w = height * 0.24;
  const tiers = 6;
  for (const side of [-1, 1]) {
    for (let k = 0; k < tiers; k++) {
      const h = height / tiers;
      const wk = w * (1 - k * 0.09);
      const dk = depth * (1 - k * 0.06);
      const zc = side * (halfGap + k * 0.18 + wk / 2);
      b.box([x - dk / 2, y + k * h, zc - wk / 2], [x + dk / 2, y + (k + 1) * h, zc + wk / 2], {});
    }
  }
}

/** A wooden pendapa on a stone base: platform, steps towards the path, four posts, tiered roof. */
function pendapa(site: Site, p: { x: number; z: number; y: number }, posts: Matrix4[], roofs: Matrix4[][]): void {
  const m = site.get("lower", "masonry");
  const { x, y, z } = p;
  m.box([x - 3.2, y, z - 3.2], [x + 3.2, y + 1, z + 3.2], {});
  const side = z > 0 ? -1 : 1;
  m.box([x - 1.1, y, z + side * 3.2], [x + 1.1, y + 0.5, z + side * 4], {});
  m.box([x - 1.1, y, z + side * 2.6], [x + 1.1, y + 1, z + side * 3.2], {});
  for (const sx of [-2.6, 2.6]) {
    for (const sz of [-2.6, 2.6]) posts.push(new Matrix4().makeTranslation(x + sx, y + 2.25, z + sz));
  }
  const roofY = [3.775, 4.3, 4.775];
  roofs.forEach((matrices, i) => matrices.push(new Matrix4().makeTranslation(x, y + roofY[i], z)));
}

export function buildCetho(textures: StoneTextures): CandiModel {
  const site = new Site("Cetho", textures);

  // The thirteen terraces, each with its stair against the west retaining wall.
  for (const l of LEVELS) {
    site.place(terrace({ halfX: l.d / 2, halfZ: l.hz, height: 1.7, y: l.y - 1.7, stairs: ["west"], stairWidth: 2.2 }), new Matrix4().makeTranslation(l.mid, 0, 0));
  }

  // Great bentar gate and its guardians on terrace 1.
  bentar(site, GATE1.x, GATE1.y, GATE1.halfGap, GATE1.height);
  const statue = site.get("lower", "statue");
  for (const g of GUARDIANS) statue.geometry(deity(), placement(g.x, GATE1.y, g.z, "west", 2.7));

  // Petilasan of Ki Ageng Krincingwesi: a plain moulded platform, its form not recorded.
  block(site, "lower", rectOutline(1.7, 1.7, PETILASAN.x, PETILASAN.z), LEVELS[1].y, LEVELS[1].y + 1.1);

  // Floor relief of terrace 3: giant turtle (creation of the universe), Surya Majapahit disk and
  // a phallus about 2 m long (creation of mankind), laid out on a flat stone setting.
  const stone = site.get("lower", "masonry");
  const ty = LEVELS[2].y;
  stone.box([TURTLE.x - 4, ty, TURTLE.z - 2.5], [TURTLE.x + 4, ty + 0.18, TURTLE.z + 2.5], { bottom: true });
  stone.geometry(
    new SphereGeometry(1, 20, 12),
    new Matrix4().makeTranslation(TURTLE.x - 0.9, ty + 0.6, TURTLE.z).multiply(new Matrix4().makeScale(2.5, 0.75, 1.8)),
  );
  stone.geometry(new CylinderGeometry(0.6, 0.66, 0.16, 24), new Matrix4().makeTranslation(TURTLE.x + 2.7, ty + 0.26, TURTLE.z));
  stone.box([TURTLE.x - 3.6, ty + 0.18, TURTLE.z + 1], [TURTLE.x - 1.2, ty + 0.38, TURTLE.z + 2], {});
  stone.geometry(
    new CapsuleGeometry(0.26, 1.5, 4, 12),
    new Matrix4().makeTranslation(TURTLE.x - 2.4, ty + 0.68, TURTLE.z + 1.5).multiply(new Matrix4().makeRotationZ(Math.PI / 2)),
  );

  // Rows of story panels flanking the path on two neighbouring levels (drawn as plain relief).
  for (const l of RELIEF_LEVELS) {
    for (const side of [-1, 1]) {
      block(site, "lower", rectOutline(3.4, 0.35, l.mid, side * RELIEF_Z), l.y, l.y + 1.15, { relief: true, scale: 0.55 });
    }
  }

  // Pendapa: stone bases merged, timber posts and roofs instanced with their own materials.
  const posts: Matrix4[] = [];
  const roofs: Matrix4[][] = [[], [], []];
  for (const p of PENDAPA) pendapa(site, p, posts, roofs);
  site.instanceGeometry(new BoxGeometry(0.2, 2.5, 0.2), WOOD, posts, true);
  const ROOF_W = [7.2, 5.4, 3.4];
  const ROOF_H = [0.55, 0.5, 0.45];
  roofs.forEach((matrices, i) => site.instanceGeometry(new BoxGeometry(ROOF_W[i], ROOF_H[i], ROOF_W[i]), WOOD_ROOF, matrices, true));

  // Inscribed second gate, then the counsellors of Brawijaya V behind it.
  bentar(site, GATE2.x, GATE2.y, GATE2.halfGap, GATE2.height);
  statue.geometry(deity(), placement(ADVISERS.x, LEVELS[7].y, -ADVISERS.z, "west", 2.7));
  statue.geometry(deity(), placement(ADVISERS.x, LEVELS[7].y, ADVISERS.z, "west", 2.7));

  // Kuntobimo (a phallus statue) north of the path, the king as Mahadewa south of it.
  statue.geometry(linggaYoni(), placement(ROYAL.x, LEVELS[8].y, -ROYAL.z, "west", 1.8));
  statue.geometry(deity(), placement(ROYAL.x, LEVELS[8].y, ROYAL.z, "west", 2.8));

  // The prayer court on terrace 13: walled, a closing gate, the batur and the cube building.
  const top = LEVELS[12];
  enclosure(site, { halfX: COURT.halfX, halfZ: COURT.halfZ, cx: COURT.cx, cz: 0, y: top.y, height: COURT.height, thickness: 0.8, gates: ["west"], gateWidth: COURT.gateWidth, gate: "paduraksa" });
  site.place(terrace({ halfX: BATUR.halfX, halfZ: BATUR.halfZ, height: BATUR.height, y: top.y, stairs: ["west"], stairWidth: 1.8 }), new Matrix4().makeTranslation(BATUR.x, 0, 0));
  site.place(shrine(CUBE).parts, placement(BATUR.x, top.y + BATUR.height, 0, "west"));

  // Saraswati on her raised platform east of the court, facing back down the complex.
  site.place(terrace({ halfX: PUNDEN.halfX, halfZ: PUNDEN.halfZ, height: PUNDEN.height, y: top.y, stairs: ["west"], stairWidth: 1.4 }), new Matrix4().makeTranslation(PUNDEN.x, 0, 0));
  site.instanceGeometry(deity(), WHITE, [placement(PUNDEN.x, top.y + PUNDEN.height, 0, "west", 2.4)], true);

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(LEVELS[0].west - 22, 0, 0), yaw: Math.PI / 2 },
  };
}
