/**
 * Live visitor count from Revklik's public widget feed (the same data as klikapa-live.js,
 * used on nempel.com), rendered in the brand panel instead of Revklik's floating bubble,
 * which would cover the dock and notes.
 */

// Widget token for the "Candi Explorer" Revklik site (Revklik → Settings → Live Widget).
const FEED = "https://app.revklik.com/api/widgets/live/8ecd7f67-1222-48cc-bc91-7ae9c926f67b";
// Matches klikapa-live.js; the feed is edge-cached for 15 s.
const REFRESH_MS = 30_000;

interface LiveStats {
  online_now: number;
  total_visitors: number;
}

function parseStats(body: unknown): LiveStats | null {
  if (typeof body !== "object" || body === null || !("data" in body)) return null;
  const data = body.data;
  if (typeof data !== "object" || data === null) return null;
  if (!("online_now" in data) || !("total_visitors" in data)) return null;
  const { online_now, total_visitors } = data;
  if (typeof online_now !== "number" || typeof total_visitors !== "number") return null;
  return { online_now, total_visitors };
}

/** Fills `root` with "● N online · M visitors"; stays hidden until the first successful fetch. */
export function mountVisitors(root: HTMLElement): void {
  const format = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
  const refresh = async () => {
    if (document.hidden) return;
    try {
      const res = await fetch(FEED);
      if (!res.ok) return;
      const stats = parseStats(await res.json());
      if (!stats) return;
      const noun = stats.total_visitors === 1 ? "visitor" : "visitors";
      root.textContent = `${format.format(stats.online_now)} online · ${format.format(stats.total_visitors)} ${noun}`;
      root.hidden = false;
    } catch {
      // Analytics outage or blocker: keep the last numbers, or stay hidden.
    }
  };
  void refresh();
  window.setInterval(refresh, REFRESH_MS);
  document.addEventListener("visibilitychange", refresh);
}
