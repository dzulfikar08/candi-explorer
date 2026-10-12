import type { CandiDefinition } from "./types";

export interface CandiEntry {
  id: string;
  name: string;
  /** Loaded on demand so each temple's code only ships when it is opened. */
  load(): Promise<CandiDefinition>;
}

/** Every temple, in the order the picker lists them. The first is the default at `/`. */
export const CANDI: readonly CandiEntry[] = [
  { id: "borobudur", name: "Borobudur", load: () => import("./borobudur").then((m) => m.borobudur) },
  { id: "prambanan", name: "Prambanan", load: () => import("./prambanan").then((m) => m.prambanan) },
  { id: "mendut", name: "Mendut", load: () => import("./mendut").then((m) => m.mendut) },
  { id: "sewu", name: "Sewu", load: () => import("./sewu").then((m) => m.sewu) },
  { id: "sambisari", name: "Sambisari", load: () => import("./sambisari").then((m) => m.sambisari) },
  { id: "kalasan", name: "Kalasan", load: () => import("./kalasan").then((m) => m.kalasan) },
  { id: "sari", name: "Sari", load: () => import("./sari").then((m) => m.sari) },
];
