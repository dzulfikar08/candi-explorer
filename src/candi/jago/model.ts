import { LatheGeometry, Vector2, Vector3 } from "three";
import type { StoneTextures } from "../../render/stone";
import { court } from "../kit/enclosure";
import { offsetLoop, placement, rectOutline } from "../kit/plan";
import { block, stairFlight, stairRun, walls, type Flight } from "../kit/shrine";
import { type Part, Parts, Site } from "../kit/site";
import type { CandiModel } from "../types";
import { buildTour } from "./tour";

/**
 * Ground plan from the published figures (id-Wikipedia, citing Sri Pare 2017): base 23.71 m long,
 * 14 m deep, 9.97 m surviving height, facing west. The long side is the broad west front seen in
 * photographs; the three terraces step back toward the rear (east) and the body stands on the
 * third. Each terrace is an oblong moulded block whose walls carry narrative reliefs.
 */
export interface TerraceLevel {
  halfX: number;
  halfZ: number;
  /** Centre offset to the east, so each level recedes from the west front. */
  cx: number;
  height: number;
}

export const TERRACES: readonly TerraceLevel[] = [
  { halfX: 7, halfZ: 11.85, cx: 0, height: 2.4 },
  { halfX: 5.2, halfZ: 8.4, cx: 0.6, height: 2.4 },
  { halfX: 3.6, halfZ: 6.2, cx: 1.2, height: 2.2 },
];

export const TERRACE_TOP = TERRACES.reduce((y, t) => y + t.height, 0);

export const BODY = { halfX: 2.6, halfZ: 2.8, cx: 1.2, wall: 0.8 };
/** The ruin ends 9.97 m above the yard, just above the doorway (id-Wikipedia, Sri Pare 2017). */
export const BODY_TOP = TERRACE_TOP + 2.97;

const DOOR = { width: 1.5, height: 2.6 };
const STAIR_WIDTH = 1.1;

/** West stair of one terrace level: s measures westward from the centre, as `stairFlight` expects. */
function westFlight(i: number): Flight {
  const t = TERRACES[i];
  const yLow = TERRACES.slice(0, i).reduce((y, u) => y + u.height, 0);
  const sTop = t.halfX - t.cx;
  return { sTop, sBottom: sTop + stairRun(t.height), yLow, yHigh: yLow + t.height, landingFrom: sTop };
}

export const FLIGHTS: readonly Flight[] = TERRACES.map((_, i) => westFlight(i));

/**
 * Giant lotus pedestal in the yard, 6 m west of the foot, about 1 m across, with a padma bud on
 * top (tirto.id, Setyawan 2023). It carried a (lost) image; only the pedestal stands.
 */
function padmaPedestal() {
  return new LatheGeometry(
    [
      [0.5, 0],
      [0.56, 0.1],
      [0.44, 0.22],
      [0.5, 0.36],
      [0.54, 0.5],
      [0.44, 0.6],
      [0.48, 0.72],
      [0.3, 0.82],
      [0.02, 0.9],
    ].map(([r, y]) => new Vector2(r, y)),
    12,
  );
}

/** Build the two side-by-side flights of one terrace stair as parts facing west. */
function doubleStair(f: Flight): { parts: Part[]; halfGap: number } {
  const parts = new Parts();
  stairFlight(parts, "lower", "east", f, STAIR_WIDTH);
  return { parts: parts.build(), halfGap: 1.05 };
}

/**
 * Candi Jago: Singhasari memorial of king Wisnuwardhana (d. 1268). Three relief terraces stepped
 * back toward the east, west stairs, and the fragmentary body on the third terrace. The original
 * superstructure is lost and its form unknown; nothing above the surviving height is invented.
 */
export function buildJago(textures: StoneTextures): CandiModel {
  const site = new Site("Jago", textures);

  // Paved yard, wider to the west where the pedestal stands.
  court(site, 19, 17, -1.5, 0);

  // The three terraces, bottom first. All belong to the foot (kaki): the realm overlay reads
  // Kamadhatu for the whole stepped base, Rupadhatu for the body; the roof realm stays empty
  // because the superstructure is lost.
  let y = 0;
  for (const t of TERRACES) {
    block(site, "lower", rectOutline(t.halfX, t.halfZ, t.cx, 0), y, y + t.height, { relief: true });
    y += t.height;
  }

  // Stairs, two flights side by side per level, each landing on the terrace below it. The real
  // stair bay projects slightly from the front wall; here the flights lean on it as the kit's
  // terrace stairs do.
  TERRACES.forEach((_, i) => {
    const f = FLIGHTS[i];
    const { parts, halfGap } = doubleStair(f);
    site.place(parts, placement(0, f.yLow, -halfGap, "west"));
    site.place(parts, placement(0, f.yLow, halfGap, "west"));
  });

  // Body fragment: plain walls with a west doorway and a relief frieze band near the broken top.
  // Sources describe the body as reduced to the door threshold (Sri Pare via tirto.id); the top
  // edge is drawn level although the real ruin is ragged.
  const masonry = site.get("middle", "masonry");
  const bodyLoop = rectOutline(BODY.halfX, BODY.halfZ, BODY.cx, 0);
  // walls() keys openings by edge index; edge 2 of rectOutline is the west face.
  const openings = new Map([[2, DOOR]]);
  walls(masonry, bodyLoop, TERRACE_TOP, BODY_TOP, { openings });
  walls(masonry, rectOutline(BODY.halfX - BODY.wall, BODY.halfZ - BODY.wall, BODY.cx, 0), TERRACE_TOP, BODY_TOP, { inward: true, openings });
  walls(site.get("middle", "reliefSingle"), offsetLoop(bodyLoop, 0.03), BODY_TOP - 1.0, BODY_TOP - 0.3, { panel: true });
  site.get("middle", "floor").cap(bodyLoop, BODY_TOP);

  // Door reveal through the wall thickness, frame piers, lintel and the surviving threshold.
  const west = BODY.cx - BODY.halfX;
  const inner = west + BODY.wall;
  const dw = DOOR.width / 2;
  const dh = DOOR.height;
  for (const side of [-1, 1]) {
    masonry.quad([inner, TERRACE_TOP, side * dw], [west, TERRACE_TOP, side * dw], [west, TERRACE_TOP + dh, side * dw], [inner, TERRACE_TOP + dh, side * dw], [0, 0, -side]);
    masonry.box([west - 0.12, TERRACE_TOP, Math.min(side * dw, side * (dw + 0.3))], [west + 0.18, TERRACE_TOP + dh + 0.3, Math.max(side * dw, side * (dw + 0.3))], {});
  }
  masonry.quad([inner, TERRACE_TOP + dh, -dw], [west, TERRACE_TOP + dh, -dw], [west, TERRACE_TOP + dh, dw], [inner, TERRACE_TOP + dh, dw], [0, -1, 0]);
  masonry.box([west - 0.12, TERRACE_TOP + dh, -dw - 0.3], [west + 0.18, TERRACE_TOP + dh + 0.3, dw + 0.3], {});
  masonry.box([west, TERRACE_TOP, -dw], [inner, TERRACE_TOP + 0.12, dw], {});

  // The lotus pedestal out in the yard.
  site.get("lower", "statue").geometry(padmaPedestal(), placement(-13, 0, 0));

  return {
    ...site.finish(),
    tour: buildTour(),
    walkSpawn: { position: new Vector3(-26, 0, 0), yaw: -Math.PI / 2 },
  };
}
