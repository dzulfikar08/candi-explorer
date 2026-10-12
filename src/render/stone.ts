import {
  CanvasTexture,
  Color,
  DoubleSide,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

/**
 * Procedural andesite textures. Each generator paints a height field first, then derives the colour
 * from it (cavities darker, weathering stains from low-frequency noise), so bump and albedo agree.
 */

/** World-projected UVs are in metres; masonry and paving tiles cover this many metres. */
export const STONE_TILE_METRES = 4;

const ANDESITE: [number, number, number] = [122, 116, 108];
const LICHEN: [number, number, number] = [48, 47, 44];
const MOSS: [number, number, number] = [86, 92, 62];

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tileable value noise on a `cells`×`cells` lattice, sampled at u, v ∈ [0, 1). */
function makeNoise(cells: number, seed: number): (u: number, v: number) => number {
  const r = rng(seed);
  const grid = Array.from({ length: cells * cells }, r);
  const at = (i: number, j: number) => grid[(((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)];
  return (u, v) => {
    const x = u * cells;
    const y = v * cells;
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const top = at(i, j) + (at(i + 1, j) - at(i, j)) * sx;
    const bottom = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * sx;
    return top + (bottom - top) * sy;
  };
}

function canvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  return [c, ctx];
}

function grey(level: number): string {
  const g = Math.round(Math.max(0, Math.min(1, level)) * 255);
  return `rgb(${g},${g},${g})`;
}

interface StoneMaps {
  map: Texture;
  bump: Texture;
}

/** Turn a painted height canvas into colour + bump textures. */
function weather(height: HTMLCanvasElement, seed: number, stainFromTop: boolean): StoneMaps {
  const { width, height: h } = height;
  const hctx = height.getContext("2d", { willReadFrequently: true })!;
  const heights = hctx.getImageData(0, 0, width, h).data;
  const [colour, cctx] = canvas(width, h);
  const out = cctx.createImageData(width, h);
  const broad = makeNoise(6, seed);
  const fine = makeNoise(64, seed + 1);
  const grain = rng(seed + 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const ht = heights[i] / 255;
      const u = x / width;
      const v = y / h;
      const stain = broad(u, v) * 0.7 + fine(u, v) * 0.3;
      // Rain streaks darken stone below ledges; on floors stains are just patchy.
      const streak = stainFromTop ? Math.max(0, stain - 0.35) * (0.6 + 0.4 * (1 - v)) : Math.max(0, stain - 0.45);
      const lichen = Math.min(1, streak * 1.6);
      const moss = Math.max(0, fine(u * 1.7, v * 1.7) - 0.72) * 2.2 * (1 - ht);
      // Gentle cavity darkening so carving still reads in shade; the bump map does the rest.
      const shade = 0.66 + 0.42 * Math.min(ht, 0.75) + (grain() - 0.5) * 0.08;
      for (let k = 0; k < 3; k++) {
        let c = ANDESITE[k] * shade;
        c = c + (LICHEN[k] - c) * lichen * 0.75;
        c = c + (MOSS[k] - c) * Math.min(1, moss);
        out.data[i + k] = Math.max(0, Math.min(255, c));
      }
      out.data[i + 3] = 255;
    }
  }
  cctx.putImageData(out, 0, 0);
  const map = new CanvasTexture(colour);
  map.colorSpace = SRGBColorSpace;
  const bump = new CanvasTexture(height);
  bump.colorSpace = NoColorSpace;
  for (const t of [map, bump]) {
    t.wrapS = t.wrapT = RepeatWrapping;
    t.anisotropy = 8;
  }
  return { map, bump };
}

/** Coursed ashlar: rows of blocks with thin joints. One tile = STONE_TILE_METRES square. */
function masonry(): StoneMaps {
  const size = 1024;
  const [c, ctx] = canvas(size, size);
  const r = rng(11);
  const rows = 11;
  const rowH = size / rows;
  ctx.fillStyle = grey(0.15);
  ctx.fillRect(0, 0, size, size);
  for (let row = 0; row < rows; row++) {
    let x = -r() * 120;
    while (x < size) {
      const w = 90 + r() * 140;
      ctx.fillStyle = grey(0.6 + r() * 0.2);
      // Wrap blocks that cross the right edge so the tile repeats seamlessly.
      for (const offset of [0, -size]) {
        ctx.fillRect(x + offset + 2, row * rowH + 2, w - 4, rowH - 4);
      }
      x += w;
    }
  }
  ctx.filter = "blur(1px)";
  ctx.drawImage(c, 0, 0);
  ctx.filter = "none";
  return weather(c, 12, true);
}

/** Paving slabs for floors. */
function paving(): StoneMaps {
  const size = 1024;
  const [c, ctx] = canvas(size, size);
  const r = rng(21);
  ctx.fillStyle = grey(0.12);
  ctx.fillRect(0, 0, size, size);
  const n = 6;
  const cell = size / n;
  for (let j = 0; j < n; j++) {
    const shift = j % 2 ? cell / 2 : 0;
    for (let i = -1; i < n; i++) {
      ctx.fillStyle = grey(0.55 + r() * 0.2);
      ctx.fillRect(i * cell + shift + 3, j * cell + 3, cell - 6, cell - 6);
    }
  }
  return weather(c, 22, false);
}

/** Paint one carved figure into a panel (all heights relative to the recessed field). */
function figure(ctx: CanvasRenderingContext2D, r: () => number, x: number, ground: number, scale: number): void {
  const kind = r();
  ctx.fillStyle = grey(0.72 + r() * 0.15);
  if (kind < 0.55) {
    // Standing or seated person: head, torso, arms, and a skirt or crossed legs.
    const seated = kind < 0.2;
    const body = (seated ? 95 : 150) * scale;
    const headR = 15 * scale;
    ctx.beginPath();
    ctx.arc(x, ground - body - headR, headR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 20 * scale, ground - body + 4);
    ctx.lineTo(x + 20 * scale, ground - body + 4);
    ctx.lineTo(x + (seated ? 40 : 26) * scale, ground);
    ctx.lineTo(x - (seated ? 40 : 26) * scale, ground);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 9 * scale;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(x - 18 * scale, ground - body + 12);
    ctx.lineTo(x - (30 + r() * 20) * scale, ground - body * (0.4 + r() * 0.5));
    ctx.moveTo(x + 18 * scale, ground - body + 12);
    ctx.lineTo(x + (30 + r() * 20) * scale, ground - body * (0.4 + r() * 0.5));
    ctx.stroke();
  } else if (kind < 0.8) {
    // Tree: trunk and clustered canopy.
    const h = (140 + r() * 60) * scale;
    ctx.fillRect(x - 6 * scale, ground - h * 0.6, 12 * scale, h * 0.6);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(x + (r() - 0.5) * 60 * scale, ground - h * (0.6 + r() * 0.35), (18 + r() * 14) * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Pavilion: posts and a stacked roof.
    const w = 70 * scale;
    const h = 120 * scale;
    ctx.fillRect(x - w / 2, ground - h * 0.55, 8 * scale, h * 0.55);
    ctx.fillRect(x + w / 2 - 8 * scale, ground - h * 0.55, 8 * scale, h * 0.55);
    for (let tier = 0; tier < 3; tier++) {
      const tw = w * (1.2 - tier * 0.3);
      const y = ground - h * (0.55 + tier * 0.15);
      ctx.beginPath();
      ctx.moveTo(x - tw / 2 - 10, y);
      ctx.lineTo(x + tw / 2 + 10, y);
      ctx.lineTo(x + tw / 3, y - h * 0.15);
      ctx.lineTo(x - tw / 3, y - h * 0.15);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/**
 * Relief wall: one tile spans one panel horizontally and the full wall height vertically
 * (explicit UVs, not world-projected). `rows` = stacked narrative series on the wall.
 */
function relief(rows: 1 | 2, seed: number): StoneMaps {
  const size = 1024;
  const [c, ctx] = canvas(size, size);
  const r = rng(seed);
  ctx.fillStyle = grey(0.5);
  ctx.fillRect(0, 0, size, size);

  // Mouldings: cornice at the top, plinth at the bottom (canvas y grows downward = wall top first).
  const band = (y: number, h: number, level: number) => {
    ctx.fillStyle = grey(level);
    ctx.fillRect(0, y, size, h);
  };
  band(0, 30, 0.78);
  band(30, 16, 0.4);
  band(46, 26, 0.68);
  band(size - 90, 22, 0.7);
  band(size - 68, 18, 0.42);
  band(size - 50, 50, 0.8);

  const top = 90;
  const bottom = size - 110;
  const rowH = (bottom - top) / rows;
  const [figures, fctx] = canvas(size, size);
  for (let row = 0; row < rows; row++) {
    const y0 = top + row * rowH + 10;
    const y1 = top + (row + 1) * rowH - 10;
    // Raised frame, recessed field.
    ctx.fillStyle = grey(0.74);
    ctx.fillRect(26, y0, size - 52, y1 - y0);
    ctx.fillStyle = grey(0.36);
    ctx.fillRect(48, y0 + 20, size - 96, y1 - y0 - 40);
    const ground = y1 - 26;
    const scale = (y1 - y0) / 330;
    const count = 3 + Math.floor(r() * 3);
    for (let i = 0; i < count; i++) {
      figure(fctx, r, 110 + ((i + 0.2 + r() * 0.6) / count) * (size - 220), ground, scale);
    }
  }
  ctx.filter = "blur(2.5px)";
  ctx.drawImage(figures, 0, 0);
  ctx.filter = "blur(1px)";
  ctx.drawImage(c, 0, 0);
  ctx.filter = "none";
  return weather(c, seed + 100, true);
}

/** Alpha map for a perforated stupa bell, laid out in LatheGeometry UV space (u around, v up). */
function lattice(kind: "diamond" | "square"): Texture {
  const w = 512;
  const h = 256;
  const [c, ctx] = canvas(w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  const columns = 16;
  const rowsV = kind === "diamond" ? [0.16, 0.3, 0.44, 0.58] : [0.2, 0.37, 0.54];
  rowsV.forEach((v, row) => {
    for (let i = 0; i < columns; i++) {
      const u = (i + 0.5 + (kind === "diamond" && row % 2 ? 0.5 : 0)) / columns;
      const cx = u * w;
      const cy = (1 - v) * h;
      if (kind === "diamond") {
        // Draw twice so half-offset diamonds wrap across the lathe seam.
        for (const x of [cx, cx - w]) {
          ctx.beginPath();
          ctx.moveTo(x, cy - 15);
          ctx.lineTo(x + 11, cy);
          ctx.lineTo(x, cy + 15);
          ctx.lineTo(x - 11, cy);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        ctx.fillRect(cx - 9, cy - 13, 18, 22);
      }
    }
  });
  const t = new CanvasTexture(c);
  t.colorSpace = NoColorSpace;
  t.wrapS = RepeatWrapping;
  return t;
}

export interface StoneTextures {
  masonry: StoneMaps;
  paving: StoneMaps;
  reliefDouble: StoneMaps;
  reliefSingle: StoneMaps;
  latticeDiamond: Texture;
  latticeSquare: Texture;
}

export function createStoneTextures(): StoneTextures {
  const textures = {
    masonry: masonry(),
    paving: paving(),
    reliefDouble: relief(2, 31),
    reliefSingle: relief(1, 41),
    latticeDiamond: lattice("diamond"),
    latticeSquare: lattice("square"),
  };
  for (const maps of [textures.masonry, textures.paving]) {
    for (const t of [maps.map, maps.bump]) t.repeat.set(1 / STONE_TILE_METRES, 1 / STONE_TILE_METRES);
  }
  return textures;
}

export type StoneMaterialKey =
  | "masonry"
  | "floor"
  | "reliefDouble"
  | "reliefSingle"
  | "statue"
  | "latticeDiamond"
  | "latticeSquare"
  | "nicheShadow";

export type StoneMaterials = Record<StoneMaterialKey, MeshStandardMaterial>;

/** One material set per realm, so the realm overlay can tint each set independently. */
export function createStoneMaterials(t: StoneTextures): StoneMaterials {
  const stone = (maps: StoneMaps, bumpScale: number) =>
    new MeshStandardMaterial({ map: maps.map, bumpMap: maps.bump, bumpScale, roughness: 0.93, metalness: 0 });
  const latticeMaterial = (alphaMap: Texture) =>
    new MeshStandardMaterial({
      map: t.masonry.map,
      bumpMap: t.masonry.bump,
      bumpScale: 1.5,
      alphaMap,
      alphaTest: 0.5,
      side: DoubleSide,
      roughness: 0.93,
    });
  const statue = stone(t.masonry, 0.6);
  statue.color = new Color("#cfc8bc");
  statue.roughness = 0.85;
  return {
    masonry: stone(t.masonry, 2),
    floor: stone(t.paving, 1.5),
    reliefDouble: stone(t.reliefDouble, 4),
    reliefSingle: stone(t.reliefSingle, 4),
    statue,
    latticeDiamond: latticeMaterial(t.latticeDiamond),
    latticeSquare: latticeMaterial(t.latticeSquare),
    nicheShadow: new MeshStandardMaterial({ color: "#1c1a17", roughness: 1 }),
  };
}
