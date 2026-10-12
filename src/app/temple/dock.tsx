import type { JSX } from "react";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Mode } from "@/scene/engine";

const MODES: readonly Mode[] = ["orbit", "walk", "tour"];

const clock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Bottom dock: camera mode (Orbit / Walk / Pradaksina tour), the realms overlay, and time of day. */
export function Dock({
  mode,
  canWalk,
  onMode,
  realms,
  onRealms,
  minutes,
  onMinutes,
}: {
  mode: Mode;
  canWalk: boolean;
  onMode(mode: Mode): void;
  realms: boolean;
  onRealms(on: boolean): void;
  minutes: number;
  onMinutes(minutes: number): void;
}): JSX.Element {
  return (
    <nav
      aria-label="View controls"
      className="fixed bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-3.5 rounded-lg border border-border bg-background px-2.5 py-2 whitespace-nowrap shadow-[0_4px_18px_rgb(0_0_0/0.25)] max-[760px]:inset-x-3 max-[760px]:left-auto max-[760px]:translate-x-0 max-[760px]:flex-wrap max-[760px]:justify-center max-[760px]:whitespace-normal"
    >
      <ToggleGroup
        variant="outline"
        spacing={2}
        className="gap-0.5 rounded-lg bg-muted p-[3px]"
        value={[mode]}
        onValueChange={(values) => {
          const value = String(values[0] ?? "");
          onMode(MODES.find((m) => m === value) ?? "orbit");
        }}
      >
        <ToggleGroupItem
          value="orbit"
          className="border-0 text-muted-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-xs"
        >
          Orbit
        </ToggleGroupItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value="walk"
                  disabled={!canWalk}
                  className="border-0 text-muted-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-xs"
                />
              }
            >
              Walk
            </TooltipTrigger>
            {!canWalk && <TooltipContent>Walking needs a keyboard and mouse</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        <ToggleGroupItem
          value="tour"
          className="border-0 text-muted-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-xs"
        >
          Pradaksina tour
        </ToggleGroupItem>
      </ToggleGroup>
      <Toggle
        variant="outline"
        className="border-border bg-card shadow-xs data-[state=on]:border-primary data-[state=on]:bg-primary/12 data-[state=on]:text-primary-ink"
        pressed={realms}
        onPressedChange={onRealms}
      >
        Show three realms
      </Toggle>
      <label className="grid gap-1 text-[13px] text-muted-foreground">
        <span>
          Time <output className="text-foreground tabular-nums">{clock(minutes)}</output> WIB
        </span>
        <Slider
          className="w-45 max-[760px]:w-35"
          min={300}
          max={1140}
          step={5}
          value={minutes}
          onValueChange={(value) => onMinutes(Array.isArray(value) ? value[0] : value)}
          aria-label="Time of day"
        />
      </label>
    </nav>
  );
}
