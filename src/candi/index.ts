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
  { id: "jawi", name: "Jawi", load: () => import("./jawi").then((m) => m.jawi) },
  { id: "kidal", name: "Kidal", load: () => import("./kidal").then((m) => m.kidal) },
  { id: "tikus", name: "Candi Tikus", load: () => import("./tikus").then((m) => m.tikus) },
  { id: "cangkuang", name: "Cangkuang", load: () => import("./cangkuang").then((m) => m.cangkuang) },
  { id: "pawon", name: "Pawon", load: () => import("./pawon").then((m) => m.pawon) },
  { id: "ijo", name: "Candi Ijo", load: () => import("./ijo").then((m) => m.ijo) },
  { id: "badut", name: "Badut", load: () => import("./badut").then((m) => m.badut) },
  { id: "singosari", name: "Singosari", load: () => import("./singosari").then((m) => m.singosari) },
  { id: "dieng", name: "Dieng · Arjuna complex", load: () => import("./dieng").then((m) => m.dieng) },
  { id: "gunung-kawi", name: "Gunung Kawi", load: () => import("./gunung-kawi").then((m) => m.gunungKawi) },
  { id: "muara-takus", name: "Muara Takus", load: () => import("./muara-takus").then((m) => m.muaraTakus) },
  { id: "penataran", name: "Penataran", load: () => import("./penataran").then((m) => m.penataran) },
  { id: "sukuh", name: "Sukuh", load: () => import("./sukuh").then((m) => m.sukuh) },
  { id: "jago", name: "Jago", load: () => import("./jago").then((m) => m.jago) },
  { id: "cetho", name: "Cetho", load: () => import("./cetho").then((m) => m.cetho) },
  { id: "lumbung", name: "Lumbung", load: () => import("./lumbung").then((m) => m.lumbung) },
  { id: "batujaya", name: "Batujaya", load: () => import("./batujaya").then((m) => m.batujaya) },
  { id: "brahu", name: "Brahu", load: () => import("./brahu").then((m) => m.brahu) },
  { id: "bahal", name: "Bahal I", load: () => import("./bahal").then((m) => m.bahal) },
  { id: "plaosan", name: "Plaosan", load: () => import("./plaosan").then((m) => m.plaosan) },
  { id: "wringin-lawang", name: "Wringin Lawang", load: () => import("./wringin-lawang").then((m) => m.wringinLawang) },
  { id: "ratu-boko", name: "Ratu Boko", load: () => import("./ratu-boko").then((m) => m.ratuBoko) },
];
