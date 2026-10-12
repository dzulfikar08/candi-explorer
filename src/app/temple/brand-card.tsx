import type { JSX } from "react";
import { CANDI } from "@/candi";
import type { Temple } from "@/candi";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TemplePicker } from "./temple-picker";

/** Brand card, top left: back to the map, the temple's name, and prev / picker / next. */
export function BrandCard({
  index,
  onPick,
}: {
  index: number;
  onPick: (t: Temple) => void;
}): JSX.Element {
  const entry = CANDI[index];
  // Previous / next walk the built temples in list order and wrap around.
  const prev = CANDI[(index - 1 + CANDI.length) % CANDI.length];
  const next = CANDI[(index + 1) % CANDI.length];

  return (
    <header className="w-62.5 rounded-lg border border-border bg-background/96 px-3.5 pb-3.5 pl-4 pt-3 max-[760px]:w-auto max-[760px]:px-3 max-[760px]:pb-3 max-[760px]:pt-2.5">
      <a
        href={`/?from=${entry.id}`}
        className="mb-1.5 -ml-0.5 inline-flex items-center gap-1 rounded-sm px-0.5 py-0.5 text-[13px] font-medium text-primary-ink no-underline hover:bg-muted"
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        All temples
      </a>
      <h1 className="m-0 font-heading text-[30px] leading-[1.1] font-semibold max-[760px]:text-[22px]">
        {entry.name}
      </h1>
      <p className="mt-0.5 mb-0 text-[13px] text-muted-foreground max-[760px]:hidden">{entry.location}</p>
      <div className="mt-3 flex gap-1.5 max-[760px]:mt-2">
        <Button
          variant="outline"
          size="icon"
          render={<a href={`/${prev.id}`} aria-label={`Previous temple: ${prev.name}`} title={`Previous: ${prev.name}`} />}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <div className="min-w-0 flex-1">
          <TemplePicker current={entry} onPick={onPick} />
        </div>
        <Button
          variant="outline"
          size="icon"
          render={<a href={`/${next.id}`} aria-label={`Next temple: ${next.name}`} title={`Next: ${next.name}`} />}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
