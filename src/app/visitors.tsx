import { type JSX, useEffect, useState } from "react";

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

/** "● N online · M visitors"; stays hidden until the first successful fetch. */
export function Visitors({ className }: { className?: string }): JSX.Element | null {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(FEED);
        if (!res.ok) return;
        const stats = parseStats(await res.json());
        if (!stats) return;
        const noun = stats.total_visitors === 1 ? "visitor" : "visitors";
        setText(`${format.format(stats.online_now)} online · ${format.format(stats.total_visitors)} ${noun}`);
      } catch {
        // Analytics outage or blocker: keep the last numbers, or stay hidden.
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  if (text === null) return null;
  return (
    <p className={className ?? "flex items-center gap-1.5 text-xs text-muted-foreground"}>
      <span aria-hidden="true" className="size-[7px] rounded-full bg-primary" />
      {text}
    </p>
  );
}
