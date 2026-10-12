import { type JSX, useEffect, useRef, useState } from "react";
import { CANDI } from "@/candi";
import type { CandiDefinition } from "@/candi/types";
import type { Temple } from "@/candi";
import { LoadingScreen } from "@/app/loading-screen";
import { Promo } from "@/app/promo";
import { createEngine, type Engine, type Mode } from "@/scene/engine";
import { BrandCard } from "./brand-card";
import { Dock } from "./dock";
import { NotesPanel } from "./notes-panel";
import { TourBar } from "./tour-bar";

const WALK_HINT = "Click the view to look around. W A S D to walk, Shift to hurry, Esc to release the mouse.";
const REALM_KEYS = ["lower", "middle", "upper"] as const;

const failMessage = (err: unknown) =>
  err instanceof Error && /WebGL/i.test(err.message)
    ? "This browser could not start WebGL, which the 3D view needs. Try a current Chrome, Firefox or Safari."
    : "The temple failed to load. Reload the page to try again.";

/** One temple in 3D: canvas, brand card, hotspots, notes, tour and dock. */
export function TemplePage({ index }: { index: number }): JSX.Element {
  const entry = CANDI[index];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const [candi, setCandi] = useState<CandiDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("orbit");
  const [topicKey, setTopicKey] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [realms, setRealms] = useState(false);
  const [walkLocked, setWalkLocked] = useState(false);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [tourEnded, setTourEnded] = useState(false);
  const [tourSection, setTourSection] = useState("");
  const [minutes, setMinutes] = useState(420);
  const [speed, setSpeed] = useState(2);

  useEffect(() => {
    document.title = `Candi Explorer · ${entry.name}`;
  }, [entry]);

  // Load the temple's definition (each temple's code ships only when opened).
  useEffect(() => {
    let cancelled = false;
    setCandi(null);
    setError(null);
    setReady(false);
    setTopicKey(null);
    setTourSection("");
    entry.load().then(
      (definition) => {
        if (!cancelled) setCandi(definition);
      },
      (err: unknown) => {
        if (!cancelled) setError(failMessage(err));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [entry]);

  // Build the scene once the canvas exists. createEngine yields between its heavy stages, so the
  // loading screen paints first and keeps moving; if the page goes away mid-build, the finished
  // engine is disposed on arrival.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!candi || !canvas) return;
    let cancelled = false;
    let engine: Engine | null = null;
    createEngine(canvas, candi, {
      onTopic: setTopicKey,
      onMode: setMode,
      onWalkLock: setWalkLocked,
      onTourSection: (i) => setTourSection(`${i + 1} / ${engine?.tourSections ?? 0} · ${engine?.tourSectionLabels[i] ?? ""}`),
      onTourProgress: (fraction) => {
        const pct = Math.round(fraction * 1000) / 10;
        if (fillRef.current) fillRef.current.style.width = `${pct}%`;
        if (barRef.current) barRef.current.setAttribute("aria-valuenow", String(Math.round(pct)));
      },
      onTourEnd: () => {
        setTourPlaying(false);
        setTourEnded(true);
      },
    }).then(
      (built) => {
        engine = built;
        if (cancelled) {
          built.dispose();
          return;
        }
        engineRef.current = built;
        built.setHotspotElements(hotspotRefs.current.filter((el): el is HTMLButtonElement => el !== null));
        built.setTime(minutes);
        built.setTourSpeed(speed);
        setReady(true);
      },
      (err: unknown) => {
        if (!cancelled) setError(failMessage(err));
      },
    );
    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
    // Minutes and speed only seed the engine; later changes go through their own effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candi]);

  // On phones the notes sheet would cover the monument; start it folded.
  useEffect(() => {
    if (ready && window.matchMedia("(max-width: 760px)").matches) setCollapsed(true);
  }, [ready]);

  useEffect(() => {
    engineRef.current?.setTime(minutes);
  }, [minutes]);
  useEffect(() => {
    engineRef.current?.setTourSpeed(speed);
  }, [speed]);
  useEffect(() => {
    engineRef.current?.setRealms(realms);
  }, [realms]);

  const pickTemple = (t: Temple) => {
    // Full page loads, as before, for a clean scene. Temples not built yet open on the map.
    location.assign("load" in t ? `/${t.id}` : `/?from=${t.id}`);
  };
  const goToHotspot = (i: number) => {
    engineRef.current?.goToHotspot(i);
  };
  const playToggle = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (tourEnded) {
      engine.restartTour();
      setTourEnded(false);
      setTourPlaying(true);
      return;
    }
    engine.setTourPlaying(!tourPlaying);
    setTourPlaying(!tourPlaying);
  };
  const enterTour = () => {
    setTourEnded(false);
    setTourPlaying(true);
    engineRef.current?.setMode("tour");
  };

  const topic = candi && topicKey !== null ? candi.topics[topicKey] : null;

  return (
    <div data-mode={mode} className="fixed inset-0">
      <canvas ref={canvasRef} role="img" aria-label={`3D view of ${entry.name}`} className="fixed inset-0 block h-full w-full touch-none" />

      {/* Hotspot markers; the engine positions, hides and dims these each frame. */}
      <div role="group" aria-label="Points of interest" className="pointer-events-none fixed inset-0 z-[1]" hidden={!ready || mode !== "orbit"}>
        {candi?.hotspots.map((h, i) => (
          <button
            key={h.topic}
            ref={(el) => {
              hotspotRefs.current[i] = el;
            }}
            type="button"
            aria-label={h.label}
            hidden
            onClick={() => goToHotspot(i)}
            className="absolute top-0 left-0 flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 transition-opacity duration-150 pointer-events-auto [.occluded_&]:opacity-40"
          >
            <span className="grid size-6.5 place-items-center rounded-full border-2 border-white bg-primary text-[13px] font-semibold text-white">
              {i + 1}
            </span>
            <span className="rounded bg-background px-2 py-0.5 text-[13px] text-foreground opacity-0 -translate-x-1 transition-[opacity,translate] duration-150 [.active_&]:translate-x-0 [.active_&]:opacity-100 hover:translate-x-0 hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100">
              {h.label}
            </span>
          </button>
        ))}
      </div>

      <div className="fixed top-4 left-4 z-[2] flex flex-col gap-2 max-[760px]:items-start">
        <BrandCard index={index} onPick={pickTemple} />
        {mode !== "walk" && <Promo />}
      </div>

      {candi && topic && (
        <NotesPanel
          candi={candi}
          topicKey={topicKey ?? candi.overviewTopic}
          topic={topic}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          onOverview={() => {
            setTopicKey(candi.overviewTopic);
            engineRef.current?.setTopic(candi.overviewTopic);
          }}
          onPlace={goToHotspot}
          className={mode === "tour" ? "max-[760px]:bottom-72 max-[760px]:max-h-[28vh]" : ""}
        />
      )}

      {ready && mode === "tour" && (
        <TourBar
          playing={tourPlaying}
          ended={tourEnded}
          onPlayToggle={playToggle}
          onNext={() => engineRef.current?.nextTourSection()}
          speed={speed}
          onSpeed={setSpeed}
          onExit={() => engineRef.current?.setMode("orbit")}
          fillRef={fillRef}
          barRef={barRef}
          sectionLabel={tourSection}
        />
      )}

      <Dock
        mode={mode}
        canWalk={ready && (engineRef.current?.canWalk ?? false)}
        onMode={(next) => {
          if (next === "tour") enterTour();
          else engineRef.current?.setMode(next);
        }}
        realms={realms}
        onRealms={setRealms}
        minutes={minutes}
        onMinutes={setMinutes}
      />

      {/* Realm legend */}
      {ready && realms && (
        <div className="fixed bottom-21 left-5 z-[2] rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm max-[760px]:hidden">
          {REALM_KEYS.map((realm) => (
            <p key={realm} className="my-0.5 flex items-center gap-2">
              <span aria-hidden="true" className="size-3.5 rounded-sm border border-black/20" style={{ background: `var(--realm-${realm})` }} />
              {candi?.realms[realm]}
            </p>
          ))}
        </div>
      )}

      {ready && mode === "walk" && !walkLocked && (
        <div className="pointer-events-none fixed top-1/2 left-1/2 z-[2] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background/94 p-4 text-center">
          <p className="m-0">{WALK_HINT}</p>
        </div>
      )}

      {(!ready || error) && <LoadingScreen message={error ?? "Laying the stones…"} />}
    </div>
  );
}
