import type { JSX, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * The pradaksina tour controls, floating above the dock while the tour runs. Progress is written
 * straight to the fill/track elements (a frame-rate callback, so no React state per frame).
 */
export function TourBar({
  playing,
  ended,
  onPlayToggle,
  onNext,
  speed,
  onSpeed,
  onExit,
  fillRef,
  barRef,
  sectionLabel,
}: {
  playing: boolean;
  ended: boolean;
  onPlayToggle(): void;
  onNext(): void;
  speed: number;
  onSpeed(speed: number): void;
  onExit(): void;
  fillRef: RefObject<HTMLDivElement | null>;
  barRef: RefObject<HTMLDivElement | null>;
  sectionLabel: string;
}): JSX.Element {
  return (
    <div className="fixed bottom-19 left-1/2 z-[1] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-border bg-background p-3.5 max-[760px]:bottom-[140px]">
      <div className="flex items-center gap-2 flex-wrap max-[760px]:flex-wrap">
        <Button variant="outline" onClick={onPlayToggle}>
          {ended ? "Replay" : playing ? "Pause" : "Resume"}
        </Button>
        <Button variant="outline" onClick={onNext}>
          Next section
        </Button>
        <label className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          Speed
          <Select value={String(speed)} onValueChange={(value) => onSpeed(Number(value))}>
            <SelectTrigger className="bg-card" aria-label="Tour speed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="1">1×</SelectItem>
              <SelectItem value="2">2×</SelectItem>
              <SelectItem value="4">4×</SelectItem>
              <SelectItem value="8">8×</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <Button variant="outline" className="ml-auto" onClick={onExit}>
          End tour
        </Button>
      </div>
      <div
        ref={barRef}
        role="progressbar"
        aria-label="Pradaksina progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="mt-2.5 h-1 overflow-hidden rounded-sm bg-[#e0d5c2]"
      >
        <div ref={fillRef} className="h-full w-0 bg-primary" />
      </div>
      <p className="mt-1.5 mb-0 text-[13px] text-muted-foreground">{sectionLabel}</p>
    </div>
  );
}
