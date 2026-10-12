import { CANDI, REGION_NAMES, REGIONS, TEMPLES, type Temple } from "../candi";
import { sourceItems } from "../ui/sources";
import { matchesQuery } from "../ui/temple-search";
import { FRAME, INDONESIA, NEIGHBOURS } from "./land";

/**
 * The home page: every known temple on a map of Indonesia, the ones built in 3D in full colour and
 * the rest marked "coming soon". Land is SVG in degrees (x = longitude, y = −latitude); markers are
 * HTML buttons laid over it so they keep their size at any zoom. Temples closer than CLUSTER_PX on
 * screen merge into one marker that zooms in when clicked.
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

export function mountAtlas(root: HTMLElement, focusId: string | null): void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Panel: title, regions with their temples.
  const panel = document.createElement("aside");
  panel.className = "atlas-panel";
  panel.innerHTML = `
    <header class="atlas-head">
      <p class="brand-app">Candi Explorer</p>
      <h1>Temples of Indonesia</h1>
      <p class="atlas-intro">${CANDI.length} temples to explore in 3D, from Batujaya's early brick platforms to the gates of Majapahit, and ${TEMPLES.length - CANDI.length} more known temples coming soon. Pick one on the map or from the list.</p>
      <div class="temple-search atlas-search">
        <span class="temple-search-icon"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.25 10.25L13.5 13.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        <input type="search" class="search-field" placeholder="Search temples, regencies, islands" aria-label="Search temples" aria-controls="atlas-list" autocomplete="off" spellcheck="false" />
      </div>
      <div class="mode-group atlas-filter" role="group" aria-label="Which temples">
        <button type="button" class="tool" data-filter="all" aria-pressed="true">All <span class="atlas-count">${TEMPLES.length}</span></button>
        <button type="button" class="tool" data-filter="built" aria-pressed="false">In 3D <span class="atlas-count">${CANDI.length}</span></button>
      </div>
    </header>
    <nav class="atlas-list" id="atlas-list" aria-label="Temples by region"></nav>
    <p class="atlas-empty" hidden></p>
    <footer class="atlas-foot">
      <p class="brand-visitors" hidden></p>
      <p class="brand-credit">Made by <a href="https://joyodigitama.com" target="_blank" rel="noopener">JoyoDigitama</a> · <a href="https://github.com/dzulfikar08/candi-explorer" target="_blank" rel="noopener">Source</a> · Map: Natural Earth</p>
      <aside class="promo" aria-label="More from the makers"></aside>
    </footer>`;
  const list = panel.querySelector<HTMLElement>(".atlas-list")!;
  const search = panel.querySelector<HTMLInputElement>(".atlas-search input")!;
  const empty = panel.querySelector<HTMLElement>(".atlas-empty")!;
  const filter = panel.querySelector<HTMLElement>(".atlas-filter")!;

  // Map: land, marker layer, zoom controls, selected-temple card.
  const stage = document.createElement("div");
  stage.className = "atlas-map";
  stage.tabIndex = 0;
  stage.setAttribute("role", "region");
  stage.setAttribute("aria-label", "Map of temples. Drag to pan, scroll or use plus and minus to zoom.");
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
  const zoom = document.createElement("div");
  zoom.className = "atlas-zoom";
  zoom.innerHTML = `
    <button type="button" class="tool" data-zoom="in" aria-label="Zoom in">+</button>
    <button type="button" class="tool" data-zoom="out" aria-label="Zoom out">−</button>
    <button type="button" class="tool" data-zoom="all">All Indonesia</button>`;
  const card = document.createElement("section");
  card.className = "atlas-card";
  card.hidden = true;
  card.setAttribute("aria-live", "polite");
  stage.append(svg, markers, zoom, card);
  root.append(panel, stage);

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
  const toScreen = (p: { x: number; y: number }) => ({ x: (p.x - view.x) * view.scale + size.w / 2, y: (p.y - view.y) * view.scale + size.h / 2 });

  let selected: Temple | null = null;
  let hovered: string | null = null;
  /** "In 3D" filter: hide the temples that are not built yet, on the map and in the list. */
  let builtOnly = false;
  const markerPool = new Map<string, HTMLButtonElement>();

  const clusters = (): Cluster[] => {
    const out: Cluster[] = [];
    for (const c of builtOnly ? CANDI : TEMPLES) {
      const s = toScreen(point(c));
      const near = out.find((k) => Math.hypot(k.x - s.x, k.y - s.y) < CLUSTER_PX);
      if (near) near.members.push(c);
      else out.push({ members: [c], x: s.x, y: s.y });
    }
    return out;
  };

  const render = () => {
    svg.setAttribute("viewBox", `${view.x - size.w / 2 / view.scale} ${view.y - size.h / 2 / view.scale} ${size.w / view.scale} ${size.h / view.scale}`);
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
          el.addEventListener("click", () => select(first, false));
        }
        markerPool.set(key, el);
        markers.append(el);
      }
      el.style.transform = `translate(${k.x}px, ${k.y}px)`;
      const ids = k.members.map((m) => m.id);
      const isSelected = selected !== null && ids.includes(selected.id);
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
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const dx = Math.max(...xs) - Math.min(...xs);
    const dy = Math.max(...ys) - Math.min(...ys);
    const scale = Math.max(minScale, Math.min(size.w * 0.55 / Math.max(dx, 1e-4), size.h * 0.55 / Math.max(dy, 1e-4), MAX_SCALE));
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

  const deselect = () => {
    selected = null;
    card.hidden = true;
    for (const b of list.querySelectorAll("[aria-current]")) b.removeAttribute("aria-current");
    render();
  };

  // Selecting a temple: zoom until it has its own marker, open its card.
  const select = (c: Temple, fromList: boolean) => {
    selected = c;
    const p = point(c);
    const others = (builtOnly ? CANDI : TEMPLES).filter((o) => o !== c);
    const nearest = Math.min(...others.map((o) => Math.hypot(point(o).x - p.x, point(o).y - p.y)));
    const needed = Math.min(MAX_SCALE, SPLIT_PX / nearest);
    go({ x: p.x, y: p.y, scale: Math.max(view.scale, needed) });
    card.innerHTML = `
      <p class="atlas-card-region"></p>
      <h2></h2>
      <p class="atlas-card-location"></p>
      ${"load" in c ? "" : '<p class="atlas-card-soon"><span class="soon-badge">Coming soon</span> Not built in 3D yet. Read about it:</p><ul class="info-sources atlas-card-sources"></ul>'}
      <div class="atlas-card-actions">
        ${"load" in c ? `<a class="button-primary" href="/${c.id}">Explore in 3D</a>` : ""}
        <button type="button" class="tool atlas-card-close">Close</button>
      </div>`;
    card.querySelector(".atlas-card-region")!.textContent = REGION_NAMES[c.region];
    card.querySelector("h2")!.textContent = c.name;
    card.querySelector(".atlas-card-location")!.textContent = c.location;
    if (!("load" in c)) card.querySelector(".atlas-card-sources")!.append(...sourceItems(c.sources));
    card.querySelector(".atlas-card-close")!.addEventListener("click", deselect);
    card.hidden = false;
    for (const b of list.querySelectorAll<HTMLElement>("[data-id]")) {
      if (b.dataset.id === c.id) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    }
    if (!fromList) list.querySelector<HTMLElement>(`[data-id="${c.id}"]`)?.scrollIntoView({ block: "nearest" });
    render();
  };

  // Region list: the temples to explore first, then the ones coming soon.
  for (const region of REGIONS) {
    const members = TEMPLES.filter((c) => c.region === region);
    const group = document.createElement("section");
    group.className = "atlas-region";
    const head = document.createElement("button");
    head.type = "button";
    head.className = "atlas-region-head";
    head.innerHTML = `<span></span><span class="atlas-count"></span>`;
    head.firstElementChild!.textContent = REGION_NAMES[region];
    head.addEventListener("click", () => {
      const shown = members.filter((c) => !builtOnly || "load" in c);
      if (shown.length > 0) fitTo(shown.map(point));
    });
    const items = document.createElement("ul");
    for (const c of members) {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "load" in c ? "atlas-item" : "atlas-item planned";
      b.dataset.id = c.id;
      b.innerHTML = `<span class="atlas-item-name"></span><span class="atlas-item-location"></span>${"load" in c ? "" : '<span class="soon-badge">Coming soon</span>'}`;
      b.firstElementChild!.textContent = c.name;
      b.children[1].textContent = c.location;
      b.addEventListener("click", () => select(c, true));
      b.addEventListener("pointerenter", () => {
        hovered = c.id;
        render();
      });
      b.addEventListener("pointerleave", () => {
        hovered = null;
        render();
      });
      li.append(b);
      items.append(li);
    }
    group.append(head, items);
    list.append(group);
  }

  // The search and the "In 3D" filter decide which list items show; region counts follow.
  const matches = () => (builtOnly ? CANDI : TEMPLES).filter((c) => matchesQuery(c, search.value));
  const filterList = () => {
    const shown = new Set(matches().map((c) => c.id));
    for (const b of list.querySelectorAll<HTMLElement>("[data-id]")) b.closest("li")!.hidden = !shown.has(b.dataset.id!);
    for (const group of list.querySelectorAll<HTMLElement>(".atlas-region")) {
      const count = group.querySelectorAll("li:not([hidden])").length;
      const head = group.querySelector<HTMLElement>(".atlas-region-head")!;
      group.hidden = count === 0;
      head.lastElementChild!.textContent = String(count);
      head.setAttribute("aria-label", `${head.firstElementChild!.textContent}, ${count} temples. Show on map`);
    }
    empty.hidden = shown.size > 0;
    empty.textContent = `No temple matches “${search.value}”. Try a regency or island, like Malang or Sumatra.`;
  };
  filterList();

  // Typing fits the map to what's left; Enter opens the first match's card.
  search.addEventListener("input", () => {
    filterList();
    const found = matches();
    if (search.value.trim() === "") showAll();
    else if (found.length > 0) fitTo(found.map(point), fitScale());
  });
  search.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const [first] = matches();
    if (first) select(first, false);
  });
  filter.addEventListener("click", (e) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>("[data-filter]");
    if (!button) return;
    builtOnly = button.dataset.filter === "built";
    for (const b of filter.querySelectorAll("[data-filter]")) b.setAttribute("aria-pressed", String(b === button));
    filterList();
    if (builtOnly && selected && !("load" in selected)) deselect();
    else render();
  });

  // Pointer pan and pinch, wheel and keyboard zoom.
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = 0;
  stage.addEventListener("pointerdown", (e) => {
    if ((e.target as Element).closest("button, a, .atlas-card")) return;
    cancelAnimationFrame(animation);
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  stage.addEventListener("pointermove", (e) => {
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
  });
  const release = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0018), e.clientX - rect.left, e.clientY - rect.top);
    },
    { passive: false },
  );
  stage.addEventListener("dblclick", (e) => {
    if ((e.target as Element).closest("button, a, .atlas-card")) return;
    const rect = stage.getBoundingClientRect();
    zoomAt(2.5, e.clientX - rect.left, e.clientY - rect.top, true);
  });
  stage.addEventListener("keydown", (e) => {
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
  });
  zoom.addEventListener("click", (e) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>("[data-zoom]")?.dataset.zoom;
    if (action === "in") zoomAt(1.8, undefined, undefined, true);
    else if (action === "out") zoomAt(1 / 1.8, undefined, undefined, true);
    else if (action === "all") showAll();
  });

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const first = size.w === 1;
    size.w = Math.max(1, rect.width);
    size.h = Math.max(1, rect.height);
    if (first) view = { ...view, scale: fitScale() };
    view = clamp(view);
    render();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  // Coming back from a temple, or sent from the picker to one coming soon: start on it, selected.
  const from = TEMPLES.find((c) => c.id === focusId);
  if (from) select(from, false);
}
