/**
 * shadcn-style Select built over a native <select>: a combobox trigger and a listbox popover
 * (WAI-ARIA "select-only combobox" pattern). The native element stays in the DOM, hidden, as the
 * source of truth: picking an option sets its value and dispatches "change", so existing
 * listeners keep working.
 */

const CHEVRON =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let instances = 0;

export function enhanceSelect(native: HTMLSelectElement): void {
  const listId = `${native.id || `select-${++instances}`}-listbox`;

  const root = document.createElement("span");
  root.className = "select";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "select-trigger";
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", listId);
  const valueText = document.createElement("span");
  trigger.append(valueText);
  trigger.insertAdjacentHTML("beforeend", CHEVRON);

  const list = document.createElement("div");
  list.className = "select-content";
  list.id = listId;
  list.setAttribute("role", "listbox");
  list.hidden = true;

  const items = [...native.options].map((option, i) => {
    const item = document.createElement("div");
    item.className = "select-item";
    item.id = `${listId}-${i}`;
    item.setAttribute("role", "option");
    const label = document.createElement("span");
    label.textContent = option.textContent;
    item.append(label);
    item.insertAdjacentHTML("beforeend", CHECK);
    list.append(item);
    return item;
  });

  // The native select keeps its place, hidden. The trigger goes before it so that a wrapping
  // <label> (which labels its first labelable descendant) names the trigger and forwards clicks.
  native.hidden = true;
  native.tabIndex = -1;
  native.before(root);
  root.append(trigger, list);

  let active = native.selectedIndex;

  const sync = () => {
    valueText.textContent = native.options[native.selectedIndex]?.textContent ?? "";
    items.forEach((item, i) => item.setAttribute("aria-selected", String(i === native.selectedIndex)));
  };
  const setActive = (i: number) => {
    active = Math.max(0, Math.min(items.length - 1, i));
    items.forEach((item, j) => item.toggleAttribute("data-active", j === active));
    trigger.setAttribute("aria-activedescendant", items[active].id);
    items[active].scrollIntoView({ block: "nearest" });
  };
  const isOpen = () => !list.hidden;
  const open = () => {
    if (isOpen()) return;
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    // Flip above the trigger when the viewport has no room below (the tour bar sits low).
    const below = window.innerHeight - trigger.getBoundingClientRect().bottom;
    list.classList.toggle("above", below < list.offsetHeight + 8);
    setActive(native.selectedIndex);
  };
  const close = () => {
    if (!isOpen()) return;
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("aria-activedescendant");
  };
  const choose = (i: number) => {
    if (i !== native.selectedIndex) {
      native.selectedIndex = i;
      native.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    }
    close();
  };

  trigger.addEventListener("click", () => (isOpen() ? close() : open()));
  trigger.addEventListener("blur", close);
  // Keep focus on the trigger while clicking an option, so blur doesn't close the list first.
  list.addEventListener("pointerdown", (e) => e.preventDefault());
  // A wrapping <label> would forward option clicks to the trigger and reopen the list.
  list.addEventListener("click", (e) => e.preventDefault());
  items.forEach((item, i) => {
    item.addEventListener("pointermove", () => setActive(i));
    item.addEventListener("click", () => choose(i));
  });

  trigger.addEventListener("keydown", (e) => {
    if (!isOpen()) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        open();
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        open();
        setActive(e.key === "Home" ? 0 : items.length - 1);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        setActive(active + 1);
        break;
      case "ArrowUp":
        setActive(active - 1);
        break;
      case "Home":
        setActive(0);
        break;
      case "End":
        setActive(items.length - 1);
        break;
      case "Enter":
      case " ":
        choose(active);
        break;
      case "Escape":
        close();
        break;
      case "Tab":
        choose(active); // Tab commits and moves on, like a native select.
        return;
      default: {
        // Type-ahead: jump to the first option starting with the typed character.
        const match = items.findIndex((item) => item.textContent?.toLowerCase().startsWith(e.key.toLowerCase()));
        if (e.key.length === 1 && match >= 0) setActive(match);
        return;
      }
    }
    e.preventDefault();
    e.stopPropagation();
  });

  sync();
}
