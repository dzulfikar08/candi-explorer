import { CANDI, TEMPLES } from "../candi";
import type { Temple } from "../candi";
import { FRAME, INDONESIA, NEIGHBOURS } from "./land";

/**
 * The imperative map engine behind the home page (no React): every known temple on a map of
 * Indonesia, the ones built in 3D in full colour and the rest marked "coming soon". Land is SVG in
 * degrees (x = longitude, y = −latitude); markers are HTML buttons laid over it so they keep their
 * size at any zoom. Temples closer than CLUSTER_PX on screen merge into one marker that zooms in
 * when clicked. The React page drives it through the `MapApi` and owns the list, card and controls.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const CLUSTER_PX = 34;
/** Closest zoom, in pixels per degree (≈ 9 m per pixel), enough to split Sewu from Lumbung. */
const MAX_SCALE = 12000;
/** Spacing a temple needs from its nearest neighbour before it gets its own marker. */
const SPLIT_PX = 44;

interface View {
  /** Map centre in degrees. */
  x: number;
  y: number;
  /** Pixels per degree. */
  scale: number;
}

interface Cluster {
  members: Temple[];
  x: number;
  y: number;
}

const point = (c: Temple) => ({ x: c.site.lon, y: -c.site.lat });

/** Accessible name for a group of temples, kept short for the big national clusters. */
const groupLabel = (members: Temple[]) => {
  const built = members.filter((m) => "load" in m).length;
  const names = members.slice(0, 5).map((m) => m.name);
  const rest = members.length - names.length;
  return `${members.length} temples, ${built} in 3D: ${names.join(", ")}${rest > 0 ? ` and ${rest} more` : ""}. Zoom in`;
};

export interface MapApi {
  /** Show only the temples built in 3D, on the map. */
  setBuiltOnly(builtOnly: boolean): void;
  /** Highlight and zoom to a temple; null clears the selection. */
  setSelected(id: string | null): void;
  setHovered(id: string | null): void;
  fitToTempleIds(ids: readonly string[], minScale?: number): void;
  /** The national zoom, in pixels per degree: a floor so a narrow search never zooms out past it. */
  fitScale(): number;
  showAll(): void;
  zoomBy(factor: number): void;
  destroy(): void;
}

export interface MapOptions {
  /** A single marker was clicked: zoom to it and open its card. */
  onSelect(id: string): void;
}

export function mountMap(stage: HTMLElement, options: MapOptions): MapApi {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("preserveAspectRatio", "none");
  for (const [d, cls] of [
    [NEIGHBOURS, "land-neighbour"],
    [INDONESIA, "land-indonesia"],
  ] as const) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", cls);
    svg.append(path);
  }
  const markers = document.createElement("div");
  markers.className = "atlas-markers";
  stage.append(svg, markers);

  // View state and projection.
  const size = { w: 1, h: 1 };
  const fitScale = () => Math.min(size.w / FRAME.width, size.h / FRAME.height);
  let view: View = { x: FRAME.x + FRAME.width / 2, y: FRAME.y + FRAME.height / 2, scale: 1 };
  const clamp = (v: View): View => {
    const scale = Math.min(MAX_SCALE, Math.max(fitScale(), v.scale));
    // Keep the frame on screen: the centre may not leave it.
    const x = Math.min(FRAME.x + FRAME.width, Math.max(FRAME.x, v.x));
    const y = Math.min(FRAME.y + FRAME.height, Math.max(FRAME.y, v.y));
    return { x, y, scale };
  };
  const toScreen = (p: { x: number; y: number }) => ({
    x: (p.x - view.x) * view.scale + size.w / 2,
    y: (p.y - view.y) * view.scale + size.h / 2,
  });

  let selected: string | null = null;
  let hovered: string | null = null;
  /** "In 3D" filter: hide the temples that are not built yet. */
  let builtOnly = false;
  const markerPool = new Map<string, HTMLButtonElement>();
  const shown = () => (builtOnly ? CANDI : TEMPLES);

  const clusters = (): Cluster[] => {
    const out: Cluster[] = [];
    for (const c of shown()) {
      const s = toScreen(point(c));
      const near = out.find((k) => Math.hypot(k.x - s.x, k.y - s.y) < CLUSTER_PX);
      if (near) near.members.push(c);
      else out.push({ members: [c], x: s.x, y: s.y });
    }
    return out;
  };

  const render = () => {
    svg.setAttribute(
      "viewBox",
      `${view.x - size.w / 2 / view.scale} ${view.y - size.h / 2 / view.scale} ${size.w / view.scale} ${size.h / view.scale}`,
    );
    const seen = new Set<string>();
    const placed: { k: Cluster; el: HTMLButtonElement; priority: number }[] = [];
    for (const k of clusters()) {
      const key = k.members.map((m) => m.id).join("+");
      seen.add(key);
      const built = k.members.filter((m) => "load" in m).length;
      let el = markerPool.get(key);
      if (!el) {
        el = document.createElement("button");
        el.type = "button";
        el.className = k.members.length > 1 ? "atlas-marker cluster" : "atlas-marker";
        // Muted when nothing in it can be opened yet.
        el.classList.toggle("planned", built === 0);
        // A group is named after a temple you can explore, when it has one.
        const first = k.members.find((m) => "load" in m) ?? k.members[0];
        if (k.members.length > 1) {
          el.innerHTML = `<span class="atlas-dot" aria-hidden="true">${k.members.length}</span><span class="atlas-label"></span>`;
          el.querySelector(".atlas-label")!.textContent = `${first.name} +${k.members.length - 1}`;
          el.setAttribute("aria-label", groupLabel(k.members));
          el.addEventListener("click", () => fitTo(k.members.map(point)));
        } else {
          el.innerHTML = `<span class="atlas-dot" aria-hidden="true"></span><span class="atlas-label"></span>`;
          el.querySelector(".atlas-label")!.textContent = first.name;
          el.setAttribute("aria-label", `${first.name}, ${first.location}${built === 0 ? ", coming soon" : ""}`);
          el.addEventListener("click", () => {
            select(first.id);
            options.onSelect(first.id);
          });
        }
        markerPool.set(key, el);
        markers.append(el);
      }
      el.style.transform = `translate(${k.x}px, ${k.y}px)`;
      const ids = k.members.map((m) => m.id);
      const isSelected = selected !== null && ids.includes(selected);
      const isHovered = hovered !== null && ids.includes(hovered);
      el.classList.toggle("selected", isSelected);
      el.classList.toggle("hover", isHovered);
      // Labels go to the selection first, then to groups with temples to explore, then to size.
      placed.push({ k, el, priority: (isSelected || isHovered ? 1e6 : 0) + built * 1000 + k.members.length });
    }
    for (const [key, el] of markerPool) {
      if (seen.has(key)) continue;
      el.remove();
      markerPool.delete(key);
    }
    // Labels never cover another marker or label: the busiest clusters and the selection keep
    // theirs, the rest show on hover and focus.
    const boxes = placed.map(({ k }) => {
      const r = k.members.length > 1 ? 13 : 7;
      return { x: k.x - r, y: k.y - r, w: 2 * r, h: 2 * r };
    });
    const overlaps = (a: { x: number; y: number; w: number; h: number }) =>
      boxes.some((b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h);
    for (const { k, el } of [...placed].sort((a, b) => b.priority - a.priority)) {
      const label = el.querySelector<HTMLElement>(".atlas-label")!;
      const r = k.members.length > 1 ? 13 : 7;
      const box = { x: k.x + r + 2, y: k.y - 10, w: label.offsetWidth, h: 20 };
      const fits = !overlaps(box) && box.x + box.w < size.w;
      el.classList.toggle("label-hidden", !fits);
      if (fits) boxes.push(box);
    }
  };

  // Animated moves between views; a new move or a drag interrupts the running one.
  let animation = 0;
  const go = (target: View, animate = true) => {
    cancelAnimationFrame(animation);
    const to = clamp(target);
    if (!animate || reducedMotion) {
      view = to;
      render();
      return;
    }
    const from = view;
    const start = performance.now();
    const duration = 650;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const k = 1 - Math.pow(1 - t, 3);
      // Interpolate zoom in log space so wide zooms feel even.
      const scale = Math.exp(Math.log(from.scale) + (Math.log(to.scale) - Math.log(from.scale)) * k);
      view = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, scale };
      render();
      if (t < 1) animation = requestAnimationFrame(step);
    };
    animation = requestAnimationFrame(step);
  };
  const fitTo = (points: { x: number; y: number }[], minScale = 0) => {
    if (points.length === 0) return;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const dx = Math.max(...xs) - Math.min(...xs);
    const dy = Math.max(...ys) - Math.min(...ys);
    const scale = Math.max(
      minScale,
      Math.min((size.w * 0.55) / Math.max(dx, 1e-4), (size.h * 0.55) / Math.max(dy, 1e-4), MAX_SCALE),
    );
    go({ x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2, scale });
  };
  const showAll = () => go({ x: FRAME.x + FRAME.width / 2, y: FRAME.y + FRAME.height / 2, scale: fitScale() });
  const zoomAt = (factor: number, sx = size.w / 2, sy = size.h / 2, animate = false) => {
    // Keep the map point under (sx, sy) fixed while zooming.
    const scale = Math.min(MAX_SCALE, Math.max(fitScale(), view.scale * factor));
    const mx = view.x + (sx - size.w / 2) / view.scale;
    const my = view.y + (sy - size.h / 2) / view.scale;
    go({ x: mx - (sx - size.w / 2) / scale, y: my - (sy - size.h / 2) / scale, scale }, animate);
  };

  // Selecting a temple: zoom until it has its own marker. The card is the React page's.
  const select = (id: string) => {
    const c = shown().find((t) => t.id === id);
    if (!c) return;
    selected = id;
    const p = point(c);
    const others = shown().filter((o) => o.id !== id);
    const nearest = Math.min(...others.map((o) => Math.hypot(point(o).x - p.x, point(o).y - p.y)));
    const needed = Math.min(MAX_SCALE, SPLIT_PX / nearest);
    go({ x: p.x, y: p.y, scale: Math.max(view.scale, needed) });
    render();
  };

  // Pointer pan and pinch, wheel and keyboard zoom.
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = 0;
  const onPointerDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("button, a")) return;
    cancelAnimationFrame(animation);
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onPointerMove = (e: PointerEvent) => {
    const last = pointers.get(e.pointerId);
    if (!last) return;
    const now = { x: e.clientX, y: e.clientY };
    if (pointers.size === 1) {
      view = clamp({ ...view, x: view.x - (now.x - last.x) / view.scale, y: view.y - (now.y - last.y) / view.scale });
      pointers.set(e.pointerId, now);
      render();
      return;
    }
    pointers.set(e.pointerId, now);
    const [a, b] = [...pointers.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    const rect = stage.getBoundingClientRect();
    if (pinch > 0) zoomAt(distance / pinch, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top);
    pinch = distance;
  };
  const release = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const rect = stage.getBoundingClientRect();
    zoomAt(Math.exp(-e.deltaY * 0.0018), e.clientX - rect.left, e.clientY - rect.top);
  };
  const onDoubleClick = (e: MouseEvent) => {
    if ((e.target as Element).closest("button, a")) return;
    const rect = stage.getBoundingClientRect();
    zoomAt(2.5, e.clientX - rect.left, e.clientY - rect.top, true);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== stage) return;
    const pan = 80 / view.scale;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => go({ ...view, x: view.x - pan }, false),
      ArrowRight: () => go({ ...view, x: view.x + pan }, false),
      ArrowUp: () => go({ ...view, y: view.y - pan }, false),
      ArrowDown: () => go({ ...view, y: view.y + pan }, false),
      "+": () => zoomAt(1.6, undefined, undefined, true),
      "=": () => zoomAt(1.6, undefined, undefined, true),
      "-": () => zoomAt(1 / 1.6, undefined, undefined, true),
      "0": showAll,
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    move();
  };
  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("wheel", onWheel, { passive: false });
  stage.addEventListener("dblclick", onDoubleClick);
  stage.addEventListener("keydown", onKeyDown);

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const first = size.w === 1;
    size.w = Math.max(1, rect.width);
    size.h = Math.max(1, rect.height);
    if (first) view = { ...view, scale: fitScale() };
    view = clamp(view);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  resize();

  return {
    setBuiltOnly(next: boolean) {
      builtOnly = next;
      render();
    },
    setSelected(id: string | null) {
      if (id === null) {
        selected = null;
        render();
        return;
      }
      select(id);
    },
    setHovered(id: string | null) {
      hovered = id;
      render();
    },
    fitToTempleIds(ids: readonly string[], minScale = 0) {
      fitTo(
        shown()
          .filter((c) => ids.includes(c.id))
          .map(point),
        minScale,
      );
    },
    fitScale,
    showAll,
    zoomBy(factor: number) {
      zoomAt(factor, undefined, undefined, true);
    },
    destroy() {
      observer.disconnect();
      cancelAnimationFrame(animation);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", release);
      stage.removeEventListener("pointercancel", release);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("dblclick", onDoubleClick);
      stage.removeEventListener("keydown", onKeyDown);
    },
  };
}
