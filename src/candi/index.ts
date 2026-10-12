import type { CandiDefinition } from "./types";

export interface CandiEntry {
  id: string;
  name: string;
  /** Loaded on demand so each temple's code only ships when it is opened. */
  load(): Promise<CandiDefinition>;
}

/**
 * Every temple, in the order the picker lists them: by region (Central Java, East Java, West Java,
 * Sumatra, Bali), neighbours together. The first is the default at `/`.
 */
export const CANDI: readonly CandiEntry[] = [
  // Central Java: Kedu Plain.
  { id: "borobudur", name: "Borobudur", load: () => import("./borobudur").then((m) => m.borobudur) },
  { id: "pawon", name: "Pawon", load: () => import("./pawon").then((m) => m.pawon) },
  { id: "mendut", name: "Mendut", load: () => import("./mendut").then((m) => m.mendut) },
  // Central Java: Prambanan Plain.
  { id: "prambanan", name: "Prambanan", load: () => import("./prambanan").then((m) => m.prambanan) },
  { id: "lumbung", name: "Lumbung", load: () => import("./lumbung").then((m) => m.lumbung) },
  { id: "sewu", name: "Sewu", load: () => import("./sewu").then((m) => m.sewu) },
  { id: "plaosan", name: "Plaosan", load: () => import("./plaosan").then((m) => m.plaosan) },
  { id: "kalasan", name: "Kalasan", load: () => import("./kalasan").then((m) => m.kalasan) },
  { id: "sari", name: "Sari", load: () => import("./sari").then((m) => m.sari) },
  { id: "sambisari", name: "Sambisari", load: () => import("./sambisari").then((m) => m.sambisari) },
  { id: "ratu-boko", name: "Ratu Boko", load: () => import("./ratu-boko").then((m) => m.ratuBoko) },
  { id: "ijo", name: "Ijo", load: () => import("./ijo").then((m) => m.ijo) },
  // Central Java: highlands.
  { id: "dieng", name: "Dieng", load: () => import("./dieng").then((m) => m.dieng) },
  { id: "gedong-songo", name: "Gedong Songo", load: () => import("./gedong-songo").then((m) => m.gedongSongo) },
  { id: "sukuh", name: "Sukuh", load: () => import("./sukuh").then((m) => m.sukuh) },
  { id: "cetho", name: "Cetho", load: () => import("./cetho").then((m) => m.cetho) },
  // East Java: Malang and Blitar.
  { id: "badut", name: "Badut", load: () => import("./badut").then((m) => m.badut) },
  { id: "kidal", name: "Kidal", load: () => import("./kidal").then((m) => m.kidal) },
  { id: "jago", name: "Jago", load: () => import("./jago").then((m) => m.jago) },
  { id: "singosari", name: "Singosari", load: () => import("./singosari").then((m) => m.singosari) },
  { id: "jawi", name: "Jawi", load: () => import("./jawi").then((m) => m.jawi) },
  { id: "penataran", name: "Penataran", load: () => import("./penataran").then((m) => m.penataran) },
  // East Java: Trowulan, the Majapahit capital.
  { id: "bajang-ratu", name: "Bajang Ratu", load: () => import("./bajang-ratu").then((m) => m.bajangRatu) },
  { id: "wringin-lawang", name: "Wringin Lawang", load: () => import("./wringin-lawang").then((m) => m.wringinLawang) },
  { id: "tikus", name: "Tikus", load: () => import("./tikus").then((m) => m.tikus) },
  { id: "brahu", name: "Brahu", load: () => import("./brahu").then((m) => m.brahu) },
  // West Java.
  { id: "cangkuang", name: "Cangkuang", load: () => import("./cangkuang").then((m) => m.cangkuang) },
  { id: "batujaya", name: "Batujaya", load: () => import("./batujaya").then((m) => m.batujaya) },
  // Sumatra.
  { id: "muara-takus", name: "Muara Takus", load: () => import("./muara-takus").then((m) => m.muaraTakus) },
  { id: "muaro-jambi", name: "Muaro Jambi", load: () => import("./muaro-jambi").then((m) => m.muaroJambi) },
  { id: "bahal", name: "Bahal I", load: () => import("./bahal").then((m) => m.bahal) },
  // Bali.
  { id: "gunung-kawi", name: "Gunung Kawi", load: () => import("./gunung-kawi").then((m) => m.gunungKawi) },
];
