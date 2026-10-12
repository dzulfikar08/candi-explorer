import { ArrowUpRight } from "lucide-react";
import type { Source } from "@/candi/types";

/** Reference links, each opening in a new tab. */
export function SourceList({ sources }: { sources: readonly Source[] }) {
  return (
    <ul className="grid gap-1.5 text-sm">
      {sources.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener"
            className="text-foreground underline decoration-foreground/35 underline-offset-3 hover:text-primary-ink hover:decoration-current"
          >
            {s.title}
            <ArrowUpRight className="ml-0.5 inline size-3.5 align-[-2px] opacity-60" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
