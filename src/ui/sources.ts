import type { Source } from "../candi/types";

const EXTERNAL =
  '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3.5h6.5V10M12.5 3.5L4 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden"> (opens in a new tab)</span>';

/** One list item per source, each link opening in a new tab; goes in a `.info-sources` list. */
export function sourceItems(sources: readonly Source[]): HTMLLIElement[] {
  return sources.map((s) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = s.title;
    a.insertAdjacentHTML("beforeend", EXTERNAL);
    li.append(a);
    return li;
  });
}
