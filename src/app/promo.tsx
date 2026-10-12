import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Megaphone } from "lucide-react";
import { PROMOS, utmUrl } from "@/data/sponsor";

import "./promo.css";

const ROTATE_MS = 5000;

/**
 * Rotating cross-promo card, ported from promo.ts. Rotation pauses on hover/focus and
 * hidden tabs, and is off under reduced motion. Used in the map sidebar footer and
 * under the temple brand card.
 */
export function Promo(): JSX.Element {
  // Random start so each visit features a different product first.
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PROMOS.length));
  const rootRef = useRef<HTMLDivElement>(null);
  const heldRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = rootRef.current;
    if (!card) return;
    const timer = window.setInterval(() => {
      if (heldRef.current || document.hidden || card.offsetParent === null) return;
      setIndex((i) => (i + 1) % PROMOS.length);
      card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
    }, ROTATE_MS);
    const onEnter = () => (heldRef.current = true);
    const onLeave = () => (heldRef.current = false);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("focusin", onEnter);
    card.addEventListener("focusout", onLeave);
    return () => {
      window.clearInterval(timer);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("focusin", onEnter);
      card.removeEventListener("focusout", onLeave);
    };
  }, []);

  const promo = PROMOS[index];
  return (
    // Fixed width: long taglines wrap (two lines reserved below) instead of widening the card.
    <div ref={rootRef} data-slot="promo" className="w-[260px] max-w-full rounded-lg border border-border bg-card p-3 shadow-xs" aria-label="More from the makers">
      {/* min-h on the tagline reserves two lines so the card doesn't jump as taglines rotate */}
      <a
        href={utmUrl(promo.href, "corner-card")}
        target="_blank"
        rel="noopener"
        className="group/card grid grid-cols-[32px_1fr] gap-x-2.5 gap-y-px rounded-md text-[13px] leading-[1.35] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <img src={promo.icon} alt="" width={32} height={32} className="col-start-1 row-span-2 size-8 rounded-md" />
        <span className="font-semibold group-hover/card:underline">{promo.name}</span>
        <span className="promo-tagline line-clamp-3 min-h-[2.7em] text-muted-foreground">{promo.tagline}</span>
      </a>
      <div className="promo-meta mt-2.5 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
        More from us
        <a
          href="/advertise"
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-0.5 font-medium transition-colors hover:border-primary/60 hover:text-foreground"
        >
          <Megaphone className="size-3" aria-hidden="true" />
          Your product here
        </a>
      </div>
    </div>
  );
}
