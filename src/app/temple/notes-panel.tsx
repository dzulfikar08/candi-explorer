import { Fragment, type JSX } from "react";
import type { CandiDefinition, Topic } from "@/candi/types";
import { Button } from "@/components/ui/button";
import { TEMPLE_PHOTOS, TOPIC_PHOTOS } from "@/candi/photos";
import { CommonsPhoto } from "@/components/commons-photo";
import { SourceList } from "@/components/source-list";
import { Visitors } from "@/app/visitors";

/**
 * The notes panel, top right (bottom sheet on phones): the active topic's text and facts, the
 * "Places to look at" list mirroring the scene markers (the keyboard and screen-reader path to the
 * same views), sources, and the visitors + credit footer.
 */
export function NotesPanel({
  candi,
  topicKey,
  topic,
  collapsed,
  onToggleCollapsed,
  onOverview,
  onPlace,
  className,
}: {
  candi: CandiDefinition;
  topicKey: string;
  topic: Topic;
  collapsed: boolean;
  onToggleCollapsed(): void;
  onOverview(): void;
  onPlace(index: number): void;
  className?: string;
}): JSX.Element {
  // The topic's own photo, or the temple's lead photo on the overview.
  const photo = TOPIC_PHOTOS[candi.id]?.[topicKey] ?? (topicKey === candi.overviewTopic ? TEMPLE_PHOTOS[candi.id] : undefined);
  return (
    <aside
      aria-label="Notes"
      className={`fixed top-4 right-4 z-[2] flex max-h-[calc(100vh-140px)] w-[min(380px,calc(100vw-2rem))] flex-col rounded-lg border border-border bg-background/95 max-[760px]:top-auto max-[760px]:right-3 max-[760px]:bottom-33 max-[760px]:left-3 max-[760px]:w-auto max-[760px]:max-h-[38vh] ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3 pt-2.5 pr-2.5 pb-1 pl-5">
        <p className={`m-0 text-[13px] text-primary-ink max-[760px]:min-w-0 ${collapsed ? "max-[760px]:truncate max-[760px]:whitespace-nowrap max-[760px]:overflow-hidden" : ""}`}>
          {topic.kicker}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-[13px] text-muted-foreground"
          aria-expanded={!collapsed}
          onClick={onToggleCollapsed}
        >
          {collapsed ? "Show notes" : "Hide notes"}
        </Button>
      </div>
      {!collapsed && (
        // A plain overflow box: it shrinks inside the panel's max-height, which ScrollArea's
        // percentage-height viewport cannot do.
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="pr-5 pb-4 pl-5">
            <div aria-live="polite">
              <h2 className="mt-0.5 mb-2.5 font-heading text-2xl leading-tight font-semibold">{topic.title}</h2>
              {photo && <CommonsPhoto key={photo.src} photo={photo} alt={photo.caption ?? `Candi ${candi.name}`} className="mb-3" />}
              <div>
                {topic.paragraphs.map((text, i) => (
                  <p key={i} className="mb-2.5 mt-0">
                    {text}
                  </p>
                ))}
              </div>
              {topic.facts && topic.facts.length > 0 && (
                <dl className="mt-3.5 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1 border-t border-border pt-3 text-sm">
                  {topic.facts.map(([label, value]) => (
                    <Fragment key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="m-0 tabular-nums">{value}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
              {topicKey !== candi.overviewTopic && (
                <Button variant="link" className="mt-3.5 h-auto p-0 text-primary-ink underline underline-offset-[3px]" onClick={onOverview}>
                  Back to overview
                </Button>
              )}
            </div>
            <section className="mt-4.5 border-t border-border pt-3">
              <h3 className="mb-1.5 font-heading text-[15px] leading-snug font-semibold">Places to look at</h3>
              <ol className="m-0 list-none p-0">
                {candi.hotspots.map((h, i) => (
                  <li key={h.topic}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-md border-0 bg-transparent px-2 py-[5px] pl-1 text-left text-sm transition-colors hover:bg-muted aria-[current]:bg-primary/12 aria-[current]:text-primary-ink"
                      aria-current={topicKey === h.topic || undefined}
                      onClick={() => onPlace(i)}
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-5.5 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white tabular-nums"
                      >
                        {i + 1}
                      </span>
                      {h.label}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
            <section className="mt-4.5 border-t border-border pt-3">
              <h3 className="mb-1.5 font-heading text-[15px] leading-snug font-semibold">Sources</h3>
              <SourceList sources={candi.sources} />
            </section>
            <footer className="mt-4.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border pt-2.5 pb-0 text-[13px] text-muted-foreground">
              <Visitors />
              <p className="m-0">
                Made by{" "}
                <a href="https://joyodigitama.com" target="_blank" rel="noopener" className="text-foreground underline underline-offset-2 hover:text-primary-ink">
                  JoyoDigitama
                </a>{" "}
                ·{" "}
                <a href="https://github.com/dzulfikar08/candi-explorer" target="_blank" rel="noopener" className="text-foreground underline underline-offset-2 hover:text-primary-ink">
                  Source code
                </a>
              </p>
            </footer>
          </div>
        </div>
      )}
    </aside>
  );
}
