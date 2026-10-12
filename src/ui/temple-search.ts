import { CANDI, type CandiEntry, REGION_NAMES } from "../candi";

/**
 * Searchable temple picker: an editable combobox (WAI-ARIA "combobox with listbox popup") over the
 * temple list. Typing filters by name, regency or region, ignoring case and accents.
 */

const CHECK =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SEARCH =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.25 10.25L13.5 13.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Whether every word of `query` appears in the temple's name, regency or region. */
export function matchesQuery(c: CandiEntry, query: string): boolean {
  const haystack = fold(`${c.name} ${c.location} ${REGION_NAMES[c.region]}`);
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function mountTempleSearch(root: HTMLElement, current: CandiEntry, onPick: (c: CandiEntry) => void): void {
  const listId = "temple-search-list";
  root.classList.add("temple-search");
  root.innerHTML = `
    <span class="temple-search-icon">${SEARCH}</span>
    <input type="text" role="combobox" autocomplete="off" spellcheck="false"
      aria-autocomplete="list" aria-expanded="false" aria-controls="${listId}" aria-label="Search temples" />
    <div class="select-content temple-search-list" id="${listId}" role="listbox" aria-label="Temples" hidden></div>`;
  const input = root.querySelector("input")!;
  const list = root.querySelector<HTMLElement>("[role=listbox]")!;
  input.value = current.name;
  input.placeholder = "Search temples";

  let options: { c: CandiEntry; el: HTMLElement }[] = [];
  let active = -1;

  const setActive = (i: number) => {
    if (options.length === 0) return;
    active = (i + options.length) % options.length;
    options.forEach((o, j) => o.el.toggleAttribute("data-active", j === active));
    const el = options[active].el;
    input.setAttribute("aria-activedescendant", el.id);
    el.scrollIntoView({ block: "nearest" });
  };

  const fill = (query: string) => {
    const matches = CANDI.filter((c) => matchesQuery(c, query));
    list.replaceChildren();
    options = [];
    if (matches.length === 0) {
      const empty = document.createElement("p");
      empty.className = "temple-search-empty";
      empty.textContent = `No temple matches “${query}”. Try a regency or island, like Malang or Sumatra.`;
      list.append(empty);
    }
    for (const region of new Set(matches.map((c) => c.region))) {
      const group = document.createElement("div");
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", REGION_NAMES[region]);
      const head = document.createElement("p");
      head.className = "temple-search-group";
      head.setAttribute("aria-hidden", "true");
      head.textContent = REGION_NAMES[region];
      group.append(head);
      for (const c of matches.filter((m) => m.region === region)) {
        const el = document.createElement("div");
        el.className = "select-item temple-search-item";
        el.id = `${listId}-${c.id}`;
        el.setAttribute("role", "option");
        el.setAttribute("aria-selected", String(c.id === current.id));
        el.innerHTML = `<span><span class="temple-search-name"></span><span class="temple-search-location"></span></span>${CHECK}`;
        el.querySelector(".temple-search-name")!.textContent = c.name;
        el.querySelector(".temple-search-location")!.textContent = c.location;
        // Keep focus in the input so the pick doesn't blur-close the list first.
        el.addEventListener("mousedown", (e) => e.preventDefault());
        el.addEventListener("click", () => pick(c));
        options.push({ c, el });
        group.append(el);
      }
      list.append(group);
    }
    active = -1;
    input.removeAttribute("aria-activedescendant");
  };

  const open = () => {
    if (!list.hidden) return;
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    // Flip above the input when there is no room below.
    const below = window.innerHeight - input.getBoundingClientRect().bottom;
    list.classList.toggle("above", below < Math.min(320, list.scrollHeight) + 12);
  };
  const close = (restore: boolean) => {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    if (restore) input.value = current.name;
  };
  const pick = (c: CandiEntry) => {
    close(false);
    input.value = c.name;
    if (c.id !== current.id) onPick(c);
  };

  input.addEventListener("focus", () => {
    fill("");
    open();
    input.select();
    setActive(Math.max(0, options.findIndex((o) => o.c.id === current.id)));
  });
  input.addEventListener("input", () => {
    fill(input.value);
    open();
    if (options.length > 0) setActive(0);
  });
  input.addEventListener("blur", () => close(true));
  input.addEventListener("keydown", (e) => {
    // Home/End stay with the text caret, as in any search field.
    if (e.key === "ArrowDown" && list.hidden) {
      e.preventDefault();
      fill("");
      open();
      setActive(0);
      return;
    }
    if (list.hidden) return;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive(active + 1),
      ArrowUp: () => setActive(active - 1),
      Enter: () => {
        const choice = options[active] ?? options[0];
        if (choice) pick(choice.c);
      },
      Escape: () => {
        close(true);
        input.select();
      },
    };
    const handler = keys[e.key];
    if (!handler) return;
    e.preventDefault();
    handler();
  });
}
