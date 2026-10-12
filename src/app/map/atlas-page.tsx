import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { CANDI, REGIONS, REGION_NAMES, TEMPLES, type Temple } from "@/candi";
import { matchesQuery } from "@/candi/search";
import { TEMPLE_PHOTOS } from "@/candi/photos";
import { CommonsPhoto } from "@/components/commons-photo";
import { SourceList } from "@/components/source-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Promo } from "@/app/promo";
import { Visitors } from "@/app/visitors";
import { mountMap, type MapApi } from "@/map/view";
import "@/map/map.css";

/** Region headings zoom the map to the region; the count follows the search and the filter. */
function RegionSection({
  region,
  members,
  selectedId,
  shownIds,
  onHead,
  onSelect,
  onHover,
}: {
  region: Temple["region"];
  members: readonly Temple[];
  selectedId: string | null;
  shownIds: ReadonlySet<string>;
  onHead(ids: readonly string[]): void;
  onSelect(id: string): void;
  onHover(id: string | null): void;
}) {
  const visible = members.filter((c) => shownIds.has(c.id));
  if (visible.length === 0) return null;
  return (
    <section>
      <button
        type="button"
        className="atlas-region-head flex w-full items-baseline justify-between border-b border-border px-2.5 pt-3 pb-1.5 text-left font-heading text-[15px] leading-snug font-semibold hover:text-primary-ink"
        aria-label={`${REGION_NAMES[region]}, ${visible.length} temples. Show on map`}
        onClick={() => onHead(visible.map((c) => c.id))}
      >
        <span>{REGION_NAMES[region]}</span>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">{visible.length}</span>
      </button>
      <ul className="mb-2 list-none p-0">
        {members.map((c) => {
          const built = "load" in c;
          if (!shownIds.has(c.id)) return null;
          return (
            <li key={c.id}>
              <button
                type="button"
                data-id={c.id}
                aria-current={selectedId === c.id ? "true" : undefined}
                className={`mt-0.5 grid w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left transition-colors duration-150 hover:bg-muted aria-current:bg-primary/12 ${
                  built ? "grid-cols-[1fr]" : "grid-cols-[1fr_auto] gap-x-2"
                }`}
                onClick={() => onSelect(c.id)}
                onPointerEnter={() => onHover(c.id)}
                onPointerLeave={() => onHover(null)}
              >
                <span
                  className={`col-start-1 text-[15px] leading-tight ${selectedId === c.id ? "text-primary-ink" : ""} ${
                    built ? "font-medium" : "font-normal"
                  }`}
                >
                  {c.name}
                </span>
                <span className="col-start-1 text-xs text-muted-foreground">{c.location}</span>
                {!built && (
                  <Badge variant="outline" className="col-start-2 row-span-2 self-center">
                    Coming soon
                  </Badge>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The home page: every known temple on a map of Indonesia, panel and overlays in React. */
export function AtlasPage({ focusId }: { focusId: string | null }) {
  const [query, setQuery] = useState("");
  const [builtOnly, setBuiltOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const mapRef = useRef<MapApi>(null);
  /** A marker (not a list item) picked the temple: its row scrolls into view. */
  const pickedOnMapRef = useRef(false);
  const appliedSelectionRef = useRef<string | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const map = mountMap(stage, {
      onSelect: (id) => {
        pickedOnMapRef.current = true;
        setSelectedId(id);
      },
    });
    mapRef.current = map;
    return () => {
      map.destroy();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setBuiltOnly(builtOnly);
    // Switching to "In 3D" while a planned temple is selected closes the card.
    const selected = TEMPLES.find((c) => c.id === selectedId);
    if (builtOnly && selected && !("load" in selected)) setSelectedId(null);
  }, [builtOnly, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (selectedId !== appliedSelectionRef.current) {
      appliedSelectionRef.current = selectedId;
      map.setSelected(selectedId);
    }
    if (selectedId !== null && pickedOnMapRef.current) {
      pickedOnMapRef.current = false;
      listRef.current?.querySelector<HTMLElement>(`[data-id="${selectedId}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedId]);

  useEffect(() => {
    mapRef.current?.setHovered(hoveredId);
  }, [hoveredId]);

  // Sent from a temple page or the picker: start on that temple, selected.
  useEffect(() => {
    if (focusId !== null && TEMPLES.some((c) => c.id === focusId)) {
      appliedSelectionRef.current = focusId;
      mapRef.current?.setSelected(focusId);
      setSelectedId(focusId);
    }
    // Runs once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pool = builtOnly ? CANDI : TEMPLES;
  const matches = useMemo(() => pool.filter((c) => matchesQuery(c, query)), [pool, query]);
  const shownIds = useMemo(() => new Set(matches.map((c) => c.id)), [matches]);
  const selected = selectedId === null ? null : (TEMPLES.find((c) => c.id === selectedId) ?? null);
  const selectedIsBuilt = selected !== null && "load" in selected;

  const onSearchInput = (value: string) => {
    setQuery(value);
    const map = mapRef.current;
    if (!map) return;
    if (value.trim() === "") {
      map.showAll();
      return;
    }
    const found = pool.filter((c) => matchesQuery(c, value));
    if (found.length > 0) map.fitToTempleIds(found.map((c) => c.id), map.fitScale());
  };

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const [first] = pool.filter((c) => matchesQuery(c, query));
    if (first) setSelectedId(first.id);
  };

  const select = (id: string) => {
    pickedOnMapRef.current = false;
    setSelectedId(id);
  };

  return (
    <div className="atlas-page">
      <aside className="atlas-panel">
        <header className="atlas-head p-[22px] pt-[22px] pb-3.5 max-[760px]:p-4 max-[760px]:pb-3">
          <p className="m-0 text-[13px] text-primary-ink max-[760px]:hidden">Candi Explorer</p>
          <h1 className="mt-0.5 mb-2 font-heading text-[30px] leading-[1.1] font-semibold max-[760px]:m-0 max-[760px]:text-[22px]">
            Temples of Indonesia
          </h1>
          <p className="m-0 text-sm text-muted-foreground max-[760px]:hidden">
            {CANDI.length} temples to explore in 3D, from Batujaya's early brick platforms to the gates of Majapahit, and{" "}
            {TEMPLES.length - CANDI.length} more known temples coming soon. Pick one on the map or from the list.
          </p>
          <InputGroup className="mt-3.5 max-[760px]:mt-2">
            <InputGroupAddon>
              <InputGroupText>
                <Search aria-hidden="true" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Search temples, regencies, islands"
              aria-label="Search temples"
              aria-controls="atlas-list"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => onSearchInput(e.currentTarget.value)}
              onKeyDown={onSearchKeyDown}
            />
          </InputGroup>
          <ToggleGroup
            variant="outline"
            aria-label="Which temples"
            className="mt-2.5"
            value={[builtOnly ? "built" : "all"]}
            onValueChange={(values: string[]) => {
              if (values.length === 0) return;
              setBuiltOnly(values[0] === "built");
            }}
          >
            <ToggleGroupItem value="all">
              All <span className="ml-1 text-xs font-medium text-muted-foreground tabular-nums">{TEMPLES.length}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="built">
              In 3D{" "}
              <span className="ml-1 text-xs font-medium text-muted-foreground tabular-nums">{CANDI.length}</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </header>
        <nav id="atlas-list" aria-label="Temples by region" ref={listRef} className="atlas-list px-3 pb-3">
          {REGIONS.map((region) => (
            <RegionSection
              key={region}
              region={region}
              members={TEMPLES.filter((c) => c.region === region)}
              selectedId={selectedId}
              shownIds={shownIds}
              onHead={(ids) => mapRef.current?.fitToTempleIds(ids)}
              onSelect={select}
              onHover={setHoveredId}
            />
          ))}
        </nav>
        {matches.length === 0 && (
          <p className="m-0 px-[22px] pb-4 text-sm text-muted-foreground">
            No temple matches “{query}”. Try a regency or island, like Malang or Sumatra.
          </p>
        )}
        <footer className="grid gap-2 px-4 pt-3 pb-4">
          <Visitors className="m-0" />
          <p className="m-0 text-xs text-muted-foreground">
            Made by{" "}
            <a href="https://joyodigitama.com" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-foreground">
              JoyoDigitama
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/dzulfikar08/candi-explorer"
              target="_blank"
              rel="noopener"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Source
            </a>{" "}
            · Map: Natural Earth
          </p>
          <Promo />
        </footer>
      </aside>

      <div
        ref={stageRef}
        className="atlas-map"
        tabIndex={0}
        role="region"
        aria-label="Map of temples. Drag to pan, scroll or use plus and minus to zoom."
      >
        <div className="atlas-zoom">
          <Button variant="outline" size="sm" aria-label="Zoom in" onClick={() => mapRef.current?.zoomBy(1.8)}>
            +
          </Button>
          <Button variant="outline" size="sm" aria-label="Zoom out" onClick={() => mapRef.current?.zoomBy(1 / 1.8)}>
            −
          </Button>
          <Button variant="outline" size="sm" onClick={() => mapRef.current?.showAll()}>
            All Indonesia
          </Button>
        </div>
        {selected !== null && (
          <Card
            className="atlas-card gap-0 py-3.5 shadow-[0_8px_24px_rgb(42_37_32/0.18)]"
            aria-live="polite"
          >
            {TEMPLE_PHOTOS[selected.id] && (
              <CommonsPhoto photo={TEMPLE_PHOTOS[selected.id]} alt={`Candi ${selected.name}`} className="mb-3 px-4 [&_img]:aspect-[16/9]" />
            )}
            <p className="m-0 px-4 text-[13px] text-primary-ink">{REGION_NAMES[selected.region]}</p>
            <h2 className="mt-0.5 mb-0.5 px-4 font-heading text-2xl leading-tight font-semibold">{selected.name}</h2>
            <p className="m-0 px-4 text-sm text-muted-foreground">{selected.location}</p>
            {!selectedIsBuilt && (
              <div className="mt-3 px-4">
                <p className="m-0 mb-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-1">
                    Coming soon
                  </Badge>
                  Not built in 3D yet. Read about it:
                </p>
                <SourceList sources={selected.sources} />
              </div>
            )}
            <div className="mt-3.5 flex gap-2 px-4">
              {selectedIsBuilt && (
                <Button render={<a href={`/${selected.id}`}>Explore in 3D</a>} />
              )}
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                Close
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
