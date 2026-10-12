import { LatheGeometry, Vector2, Vector3, type BufferGeometry } from "three";
import type { StoneTextures } from "../../render/stone";
import { court, enclosure, terrace } from "../kit/enclosure";
import { kala, ratna } from "../kit/ornaments";
import { placement, rectOutline } from "../kit/plan";
import { block, shrine, stairFlight, stairRun, walls } from "../kit/shrine";
import { type Part, Parts, Site } from "../kit/site";
import type { CandiModel } from "../types";
import { buildTour } from "./tour";
import {
  GATE_TERRACE,
  INNER_CELLS,
  INNER_GATE,
  INNER_STAIRS,
  KECILS,
  KECIL_SPECS,
  KECIL_TERRACE,
  KEPUTREN,
  OUTER_CELLS,
  OUTER_GATE,
  PASEBAN,
  PEMBAKARAN,
  PENDOPO,
  PLATEAU,
  POOL_DEPTH,
  ROUND_POOLS,
  SQUARE_POOLS,
  type GateCell,
} from "./layout";

/** Stone column base (umpak) standing on a floor at `y`. */
function umpak(parts: Parts, x: number, y: number, z: number): void {
  parts.get("middle", "masonry").box([x - 0.35, y, z - 0.35], [x + 0.35, y + 0.55, z + 0.35], {});
}

/**
 * Basin sunk below the raised courtyard paving: the courtyard cap is laid with a hole over the
 * basin (done by the caller), this builds the plastered walls and the floor below it.
 */
function basin(parts: Parts, cx: number, cz: number, hx: number, hz: number, top: number): void {
  parts.get("lower", "floor").cap(rectOutline(hx, hz, cx, cz), top - POOL_DEPTH + 0.02);
  walls(parts.get("lower", "masonry"), rectOutline(hx, hz, cx, cz), top - POOL_DEPTH, top + 0.08, { inward: true });
}

function circleLoop(r: number, cx: number, cz: number): { x: number; z: number }[] {
  return Array.from({ length: 16 }, (_, i) => {
    const a = (2 * Math.PI * i) / 16;
    return { x: cx + r * Math.cos(a), z: cz + r * Math.sin(a) };
  });
}

/** Revetted round pool shell (outer wall, rim, inner wall, floor) as one lathe; rim at +1.5. */
function poolShell(): BufferGeometry {
  return new LatheGeometry(
    [
      new Vector2(0.55, 0),
      new Vector2(0.95, 0),
      new Vector2(0.95, 1.5),
      new Vector2(0.84, 1.5),
      new Vector2(0.84, 0.06),
      new Vector2(0, 0.06),
    ],
    20,
  );
}

/**
 * One row of paduraksa gateways standing on the ground at `base`, facing east. Pylons rise
 * `top - base` with two stepped coping tiers; roofed cells' pylons get three more shrinking tiers
 * and a ratna (the surveyed "limasan roofs with ratna finials"), lost roofs get a flat coping at
 * the same height. A lintel leaves each opening `top - base - 2.1` tall.
 */
function gateRow(parts: Parts, x: number, base: number, top: number, depth: number, pylonWidth: number, cells: readonly GateCell[]): void {
  const body = parts.get("middle", "masonry");
  const crown = parts.get("upper", "masonry");
  const openings = cells.reduce((sum, c) => sum + c.opening, 0);
  let z = -(openings + pylonWidth * (cells.length + 1)) / 2;
  const pylon = (za: number, zb: number, roofed: boolean) => {
    body.box([x - depth / 2, base, za], [x + depth / 2, top, zb], {});
    for (let k = 0; k < 2; k++) {
      const inset = 0.2 + k * 0.2;
      crown.box([x - depth / 2 + inset, top + k * 0.42, za + inset], [x + depth / 2 - inset, top + (k + 1) * 0.42, zb - inset], {});
    }
    if (roofed) {
      // Stepped hip roof: shrink faster across the depth than along the row.
      for (let k = 0; k < 3; k++) {
        const zx = 0.62 + k * 0.28;
        const zz = 0.62 + k * 0.16;
        crown.box(
          [x - depth / 2 + zx, top + 0.84 + k * 0.5, za + zz],
          [x + depth / 2 - zx, top + 1.34 + k * 0.5, zb - zz],
          {},
        );
      }
      crown.geometry(ratna(), placement(x, top + 2.34, (za + zb) / 2, "east", 0.55));
    } else {
      crown.box([x - depth / 2 - 0.08, top + 2.04, za - 0.08], [x + depth / 2 + 0.08, top + 2.34, zb + 0.08], {});
    }
  };
  for (const [i, cell] of cells.entries()) {
    pylon(z, z + pylonWidth, (cells[i - 1]?.roofed ?? false) || cell.roofed);
    z += pylonWidth;
    body.box([x - depth / 2, top - 2.1, z], [x + depth / 2, top - 1.05, z + cell.opening], {});
    z += cell.opening;
  }
  pylon(z, z + pylonWidth, cells[cells.length - 1]?.roofed ?? false);
}

/**
 * Kraton Ratu Boko: a fortified hilltop palace, not a temple. The walk climbs the west front
 * through the two multi-arched gate rows, then crosses the great plateau past the Candi
 * Pembakaran, the paseban, the walled pendopo court and the keputren bathing pools.
 */
export function buildRatuBoko(textures: StoneTextures): CandiModel {
  const site = new Site("Ratu Boko", textures);
  const masonry = site.get("lower", "masonry");
  const floor = site.get("lower", "floor");

  // West front: two 2.5 m talud steps up to the gate terrace, then the great plateau.
  site.place(
    terrace({ halfX: GATE_TERRACE.lowerHalfX, halfZ: GATE_TERRACE.lowerHalfZ, height: GATE_TERRACE.step, stairs: ["west"], stairWidth: 4.4 }),
    placement(GATE_TERRACE.cx, 0, 0),
  );
  site.place(
    terrace({
      halfX: GATE_TERRACE.upperHalfX,
      halfZ: GATE_TERRACE.upperHalfZ,
      height: GATE_TERRACE.step,
      y: GATE_TERRACE.step,
      stairs: ["west"],
      stairWidth: 4.4,
    }),
    placement(GATE_TERRACE.cx, 0, 0),
  );
  site.place(terrace({ halfX: PLATEAU.halfX, halfZ: PLATEAU.halfZ, height: PLATEAU.top, stairs: [] }), placement(PLATEAU.cx, 0, 0));

  // Stone paving between the two gate rows, then the rows themselves: three roofless gateways,
  // and 15 m east the five-arched main row at the plateau edge.
  floor.cap(rectOutline(8, 8.4, -34, 0), GATE_TERRACE.top + 0.06);
  gateRow(site, OUTER_GATE.x, OUTER_GATE.base, OUTER_GATE.top, OUTER_GATE.depth, OUTER_GATE.pylon, OUTER_CELLS);
  gateRow(site, INNER_GATE.x, INNER_GATE.base, INNER_GATE.top, INNER_GATE.depth, INNER_GATE.pylon, INNER_CELLS);

  // Three stairways climb to and through the main row; the end flanker gates have none.
  for (const s of INNER_STAIRS) {
    const flight = new Parts();
    stairFlight(
      flight,
      "lower",
      "east",
      { sTop: INNER_GATE.x, sBottom: INNER_GATE.x - stairRun(PLATEAU.top - GATE_TERRACE.top), yLow: GATE_TERRACE.top, yHigh: PLATEAU.top, landingFrom: INNER_GATE.x },
      s.width,
      0.4,
    );
    site.place(flight.build(), placement(0, 0, s.z));
  }

  // Candi Pembakaran: two revetted terraces 26 × 26 m and 3 m tall with a west stair; the upper
  // terrace is capped with a hole over the 4 × 4 m burning pit.
  site.place(
    terrace({ halfX: PEMBAKARAN.half, halfZ: PEMBAKARAN.half, height: PEMBAKARAN.lowerH, y: PEMBAKARAN.base, stairs: ["west"], stairWidth: 2.4 }),
    placement(PEMBAKARAN.x, 0, PEMBAKARAN.z),
  );
  const px = PEMBAKARAN.x;
  const pz = PEMBAKARAN.z;
  const p = PEMBAKARAN.pitHalf;
  const uTop = PEMBAKARAN.base + PEMBAKARAN.lowerH + PEMBAKARAN.upperH;
  masonry.box([px - PEMBAKARAN.upperHalf, PEMBAKARAN.base + PEMBAKARAN.lowerH, pz - PEMBAKARAN.upperHalf], [px - p, uTop, pz + PEMBAKARAN.upperHalf], {});
  masonry.box([px + p, PEMBAKARAN.base + PEMBAKARAN.lowerH, pz - PEMBAKARAN.upperHalf], [px + PEMBAKARAN.upperHalf, uTop, pz + PEMBAKARAN.upperHalf], {});
  masonry.box([px - p, PEMBAKARAN.base + PEMBAKARAN.lowerH, pz - PEMBAKARAN.upperHalf], [px + PEMBAKARAN.upperHalf, uTop, pz - p], {});
  masonry.box([px - PEMBAKARAN.upperHalf, PEMBAKARAN.base + PEMBAKARAN.lowerH, pz + p], [px + PEMBAKARAN.upperHalf, uTop, pz + PEMBAKARAN.upperHalf], {});
  masonry.cap(rectOutline(PEMBAKARAN.upperHalf, PEMBAKARAN.upperHalf, px, pz), uTop + 0.01, [rectOutline(p, p, px, pz)]);
  floor.cap(rectOutline(p, p, px, pz), PEMBAKARAN.base + PEMBAKARAN.lowerH + 0.02);
  const upperStair = new Parts();
  stairFlight(
    upperStair,
    "lower",
    "east",
    {
      sTop: px - PEMBAKARAN.upperHalf,
      sBottom: px - PEMBAKARAN.upperHalf + stairRun(PEMBAKARAN.upperH),
      yLow: PEMBAKARAN.base + PEMBAKARAN.lowerH,
      yHigh: uTop,
      landingFrom: px - PEMBAKARAN.upperHalf,
    },
    2,
    0.4,
  );
  site.place(upperStair.build(), placement(0, 0, pz));
  // The Amerta Mantana well south-east of the platform, still used in the Tawur Agung rite.
  site.instanceGeometry(poolShell(), site.material("lower", "masonry"), [placement(px + 11.5, PEMBAKARAN.base, pz + 8, "east", 0.7)], false);

  // Candi Batu Putih ("white stone"): a 5 × 5 m foundation NE of the outer gate; it is white
  // limestone on site, drawn here in the kit's andesite.
  block(site, "lower", rectOutline(2.5, 2.5, -8, -34), PLATEAU.top, PLATEAU.top + 0.8);

  // Paseban reception terrace with its twenty column bases.
  site.place(terrace({ halfX: PASEBAN.halfX, halfZ: PASEBAN.halfZ, height: PASEBAN.height, y: PLATEAU.top, stairs: ["west"], stairWidth: 2 }), placement(PASEBAN.x, 0, PASEBAN.z));
  for (const x of [PASEBAN.x - 1.6, PASEBAN.x + 1.6]) {
    for (let k = 0; k < 10; k++) umpak(site, x, PLATEAU.top + PASEBAN.height, PASEBAN.z - 17 + k * 3.8);
  }

  // Pendopo court: 3 m walls with paduraksa gates N/W/S, jaladwara spouts outside, paved floor,
  // the 1.46 m pendopo stage with 24 umpak and the smaller pringgitan terrace with 12.
  enclosure(site, { halfX: PENDOPO.halfX, halfZ: PENDOPO.halfZ, cx: PENDOPO.cx, cz: PENDOPO.cz, y: PLATEAU.top, height: PENDOPO.wall, thickness: 1.1, gates: ["north", "west", "south"], gateWidth: 2.4, gate: "paduraksa" });
  court(site, PENDOPO.halfX - 0.55, PENDOPO.halfZ - 0.55, PENDOPO.cx, PENDOPO.cz, PLATEAU.top + 0.06);
  block(site, "middle", rectOutline(PENDOPO.stage.halfX, PENDOPO.stage.halfZ, PENDOPO.stage.x, PENDOPO.stage.z), PLATEAU.top, PLATEAU.top + PENDOPO.stage.height);
  block(site, "middle", rectOutline(PENDOPO.pringgitan.halfX, PENDOPO.pringgitan.halfZ, PENDOPO.pringgitan.x, PENDOPO.pringgitan.z), PLATEAU.top, PLATEAU.top + PENDOPO.pringgitan.height);
  const stageStair = new Parts();
  stairFlight(
    stageStair,
    "middle",
    "south",
    {
      sTop: PENDOPO.stage.z - PENDOPO.stage.halfZ,
      sBottom: PENDOPO.stage.z - PENDOPO.stage.halfZ + stairRun(PENDOPO.stage.height),
      yLow: PLATEAU.top,
      yHigh: PLATEAU.top + PENDOPO.stage.height,
      landingFrom: PENDOPO.stage.z - PENDOPO.stage.halfZ,
    },
    2.2,
    0.4,
  );
  for (const x of [PENDOPO.stage.x - 5, PENDOPO.stage.x + 5]) site.place(stageStair.build(), placement(x, 0, 0));
  for (const x of [35, 38.2, 41.4, 44.6, 47.8, 51]) {
    for (const z of [23.5, 28, 32.5, 37]) umpak(site, x, PLATEAU.top + PENDOPO.stage.height, z);
  }
  for (const x of [36, 40.6, 45.2, 49.8]) {
    for (const z of [42, 44, 46]) umpak(site, x, PLATEAU.top + PENDOPO.pringgitan.height, z);
  }
  for (const x of [30, 38, 46, 54]) site.get("middle", "masonry").box([x - 0.25, 10.7, PENDOPO.cz + PENDOPO.halfZ - 0.15], [x + 0.25, 11.05, PENDOPO.cz + PENDOPO.halfZ + 0.65], {});

  // Keputren: walled bathing courts east of the pendopo, paduraksa doorways with kalamakara,
  // a dividing wall with a connecting door, square basins west and eight round basins east.
  enclosure(site, { halfX: KEPUTREN.halfX, halfZ: KEPUTREN.halfZ, cx: KEPUTREN.cx, cz: KEPUTREN.cz, y: PLATEAU.top, height: KEPUTREN.wall, thickness: 0.9, gates: ["west", "east"], gateWidth: 2, gate: "paduraksa" });
  const kx = KEPUTREN.cx - KEPUTREN.halfX;
  site.get("lower", "statue").geometry(kala(), placement(kx - 0.5, PLATEAU.top + 2.05, KEPUTREN.cz, "west", 0.7));
  site.get("lower", "statue").geometry(kala(), placement(kx + 2 * KEPUTREN.halfX + 0.5, PLATEAU.top + 2.05, KEPUTREN.cz, "east", 0.7));
  masonry.box([KEPUTREN.cx - 0.45, PLATEAU.top, KEPUTREN.cz - KEPUTREN.halfZ + 0.45], [KEPUTREN.cx + 0.45, PLATEAU.top + 2, KEPUTREN.cz - 1.1], {});
  masonry.box([KEPUTREN.cx - 0.45, PLATEAU.top, KEPUTREN.cz + 1.1], [KEPUTREN.cx + 0.45, PLATEAU.top + 2, KEPUTREN.cz + KEPUTREN.halfZ - 0.45], {});
  const westCourt = { x: KEPUTREN.cx - 6.25, halfX: 5.8, halfZ: 11.55 };
  floor.cap(
    rectOutline(westCourt.halfX, westCourt.halfZ, westCourt.x, KEPUTREN.cz),
    PLATEAU.top + 0.06,
    SQUARE_POOLS.map((b) => rectOutline(b.hx, b.hz, b.x, b.z)),
  );
  for (const b of SQUARE_POOLS) basin(site, b.x, b.z, b.hx, b.hz, PLATEAU.top + 0.06);
  const eastCourt = { x: KEPUTREN.cx + 6.25, halfX: 5.8, halfZ: 11.55 };
  floor.cap(
    rectOutline(eastCourt.halfX, eastCourt.halfZ, eastCourt.x, KEPUTREN.cz),
    PLATEAU.top + 0.06,
    ROUND_POOLS.map((r) => circleLoop(0.96, r.x, r.z)),
  );
  site.instanceGeometry(
    poolShell(),
    site.material("lower", "masonry"),
    ROUND_POOLS.map((r) => placement(r.x, PLATEAU.top - POOL_DEPTH + 0.2, r.z)),
    false,
  );

  // Three miniature shrines on their terrace outside the pendopo's south-east corner, and a
  // square stone basin before them.
  site.place(terrace({ halfX: KECIL_TERRACE.halfX, halfZ: KECIL_TERRACE.halfZ, height: KECIL_TERRACE.height, y: PLATEAU.top, stairs: ["west"], stairWidth: 2 }), placement(KECIL_TERRACE.x, 0, KECIL_TERRACE.z));
  const built: Record<string, Part[]> = {};
  for (const t of KECILS) {
    const parts = (built[t.key] ??= shrine(KECIL_SPECS[t.key]).parts);
    site.place(parts, placement(KECIL_TERRACE.x + 2, KECIL_TERRACE.top, t.z, "west"));
  }
  for (const [x0, z0, x1, z1] of [
    [KECIL_TERRACE.x - 4.8, KECIL_TERRACE.z - 0.8, KECIL_TERRACE.x - 3.2, KECIL_TERRACE.z - 0.65],
    [KECIL_TERRACE.x - 4.8, KECIL_TERRACE.z + 0.65, KECIL_TERRACE.x - 3.2, KECIL_TERRACE.z + 0.8],
    [KECIL_TERRACE.x - 4.8, KECIL_TERRACE.z - 0.65, KECIL_TERRACE.x - 4.65, KECIL_TERRACE.z + 0.65],
    [KECIL_TERRACE.x - 3.35, KECIL_TERRACE.z - 0.65, KECIL_TERRACE.x - 3.2, KECIL_TERRACE.z + 0.65],
  ] as const) {
    masonry.box([x0, KECIL_TERRACE.top, z0], [x1, KECIL_TERRACE.top + 0.35, z1], {});
  }
  floor.cap(rectOutline(0.65, 0.65, KECIL_TERRACE.x - 4, KECIL_TERRACE.z), KECIL_TERRACE.top + 0.02);

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(-66, 0, -14), yaw: Math.atan2(-25, -14) },
  };
}
