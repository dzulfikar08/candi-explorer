import { type JSX, useState } from "react";
import { REGION_NAMES, REGIONS, TEMPLES } from "@/candi";
import { matchesQuery } from "@/candi/search";
import type { Temple } from "@/candi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search } from "lucide-react";

/**
 * Searchable temple picker: a combobox over every known temple, grouped by region and filtered with
 * the same accent-insensitive `matchesQuery` as the old picker. Built temples open their page,
 * coming-soon ones the map with `?from=`; navigation stays a full page load for a clean scene.
 */
export function TemplePicker({ current, onPick }: { current: Temple; onPick: (t: Temple) => void }): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const pick = (t: Temple) => {
    setOpen(false);
    onPick(t);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-9 w-full min-w-0 justify-between gap-1.5 px-2.5 font-normal max-[760px]:h-10"
            title="Switch temple"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <Search className="size-3.5 shrink-0 opacity-50" aria-hidden="true" />
          <span className="truncate">{current.name}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--anchor-width) min-w-60 p-1">
        <Command shouldFilter={false}>
          <CommandInput value={query} onValueChange={setQuery} placeholder="Search temples" className="max-[760px]:text-base" />
          <CommandList>
            <CommandEmpty>No temples match</CommandEmpty>
            {REGIONS.map((region) => {
              const temples = TEMPLES.filter((t) => t.region === region && matchesQuery(t, query));
              if (temples.length === 0) return null;
              return (
                <CommandGroup key={region} heading={REGION_NAMES[region]}>
                  {temples.map((t) => {
                    const built = "load" in t;
                    const isCurrent = t.id === current.id;
                    return (
                      <CommandItem key={t.id} value={t.id} onSelect={() => pick(t)} aria-current={isCurrent || undefined}>
                        <span className="flex min-w-0 flex-1 items-center gap-2">
                          <span className={built ? "truncate" : "truncate font-normal text-muted-foreground"}>
                            {t.name}
                          </span>
                          {!built && <Badge variant="secondary">Coming soon</Badge>}
                        </span>
                        {isCurrent && <Check className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
