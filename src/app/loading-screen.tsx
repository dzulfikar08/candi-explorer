import { Megaphone } from "lucide-react";
import { PROMOS, utmUrl } from "@/data/sponsor";

/** Must match the `loading-marquee` duration in globals.css. */
const MARQUEE_SECONDS = 45;

/**
 * Full-screen cover while a temple's code downloads and its scene is built. Below the message, the
 * makers' products roll past. The strip is a CSS transform animation, which the browser runs on the
 * compositor, so it keeps moving while the 3D build holds the main thread; a JavaScript timer
 * would freeze. The list is rendered twice so a −50% translate loops without a seam.
 */
export function LoadingScreen({ message }: { message: string }) {
  const cells = (copy: "a" | "b") =>
    PROMOS.map((p) => (
      <a
        key={`${copy}-${p.name}`}
        href={utmUrl(p.href, "loading-marquee")}
        target="_blank"
        rel="noopener"
        tabIndex={copy === "b" ? -1 : undefined}
        className="mr-3 grid w-64 shrink-0 grid-cols-[32px_1fr] gap-x-2.5 rounded-lg border border-white/12 bg-white/6 p-3 text-left text-[13px] leading-snug transition-colors hover:border-primary/70"
      >
        <img src={p.icon} alt="" width={32} height={32} loading="lazy" className="row-span-2 size-8 rounded-md bg-white/90 object-contain p-0.5" />
        <span className="font-semibold text-[#f3ede1]">{p.name}</span>
        <span className="line-clamp-3 text-[#b9ae9c]">{p.tagline}</span>
      </a>
    ));
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-[#1b1916] text-[#e9e1d2]">
      <p className="m-0 px-6 text-center font-heading text-xl" role="status">
        {message}
      </p>
      <section aria-label="More from the makers" className="loading-marquee w-full overflow-hidden">
        {/* Phase from page time, so the strip doesn't jump back when the cover is remounted
            (download fallback → build cover). */}
        <div className="loading-marquee-track flex w-max" style={{ animationDelay: `-${(performance.now() / 1000) % MARQUEE_SECONDS}s` }}>
          {cells("a")}
          <div aria-hidden="true" className="flex">
            {cells("b")}
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-3 text-xs text-[#b9ae9c]">
          More from us
          <a
            href="/advertise"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-white/25 px-2.5 py-0.5 font-medium hover:border-primary/70 hover:text-[#f3ede1]"
          >
            <Megaphone className="size-3" aria-hidden="true" />
            Your product here
          </a>
        </p>
      </section>
    </div>
  );
}
