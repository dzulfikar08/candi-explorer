import { PLANNED } from "./planned";
import type { CandiDefinition, Source } from "./types";

/** Regions in the order the map list and the picker show them. */
export const REGIONS = ["central-java", "east-java", "west-java", "sumatra", "bali", "kalimantan"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_NAMES: Record<Region, string> = {
  "central-java": "Central Java & Yogyakarta",
  "east-java": "East Java",
  "west-java": "West Java & Banten",
  sumatra: "Sumatra & Bangka",
  bali: "Bali",
  kalimantan: "Kalimantan",
};

/** What the map and the search know about a temple, built or not. */
interface TempleSite {
  id: string;
  name: string;
  /** "Regency, Province". */
  location: string;
  site: { lat: number; lon: number };
  region: Region;
}

export interface CandiEntry extends TempleSite {
  /** Loaded on demand so each temple's code only ships when it is opened. Location and site repeat the definition's. */
  load(): Promise<CandiDefinition>;
}

/** A known temple not built in 3D yet: on the map and in the lists as "coming soon". */
export interface PlannedTemple extends TempleSite {
  /** Where the temple and its coordinates are recorded. */
  sources: Source[];
}

export type Temple = CandiEntry | PlannedTemple;

/**
 * The temples built in 3D, in the order previous / next walk them: by region, neighbours together.
 * `src/candi/index.test.ts` checks name, location and site against each definition.
 */
export const CANDI: readonly CandiEntry[] = [
  // Kedu Plain.
  { id: "borobudur", name: "Borobudur", location: "Magelang, Jawa Tengah", site: { lat: -7.6079, lon: 110.2038 }, region: "central-java", load: () => import("./borobudur").then((m) => m.borobudur) },
  { id: "pawon", name: "Pawon", location: "Magelang, Jawa Tengah", site: { lat: -7.60616, lon: 110.219522 }, region: "central-java", load: () => import("./pawon").then((m) => m.pawon) },
  { id: "mendut", name: "Mendut", location: "Magelang, Jawa Tengah", site: { lat: -7.6046, lon: 110.2295 }, region: "central-java", load: () => import("./mendut").then((m) => m.mendut) },
  // Prambanan Plain.
  { id: "prambanan", name: "Prambanan", location: "Sleman, DI Yogyakarta", site: { lat: -7.752, lon: 110.4915 }, region: "central-java", load: () => import("./prambanan").then((m) => m.prambanan) },
  { id: "lumbung", name: "Lumbung", location: "Klaten, Jawa Tengah", site: { lat: -7.748138, lon: 110.492871 }, region: "central-java", load: () => import("./lumbung").then((m) => m.lumbung) },
  { id: "sewu", name: "Sewu", location: "Klaten, Jawa Tengah", site: { lat: -7.7437, lon: 110.492 }, region: "central-java", load: () => import("./sewu").then((m) => m.sewu) },
  { id: "plaosan", name: "Plaosan", location: "Klaten, Jawa Tengah", site: { lat: -7.7406, lon: 110.5044 }, region: "central-java", load: () => import("./plaosan").then((m) => m.plaosan) },
  { id: "kalasan", name: "Kalasan", location: "Sleman, DI Yogyakarta", site: { lat: -7.7672, lon: 110.4724 }, region: "central-java", load: () => import("./kalasan").then((m) => m.kalasan) },
  { id: "sari", name: "Sari", location: "Sleman, DI Yogyakarta", site: { lat: -7.7598, lon: 110.4727 }, region: "central-java", load: () => import("./sari").then((m) => m.sari) },
  { id: "sambisari", name: "Sambisari", location: "Sleman, DI Yogyakarta", site: { lat: -7.7623, lon: 110.4471 }, region: "central-java", load: () => import("./sambisari").then((m) => m.sambisari) },
  { id: "ratu-boko", name: "Ratu Boko", location: "Sleman, DI Yogyakarta", site: { lat: -7.77, lon: 110.4889 }, region: "central-java", load: () => import("./ratu-boko").then((m) => m.ratuBoko) },
  { id: "ijo", name: "Ijo", location: "Sleman, DI Yogyakarta", site: { lat: -7.7839, lon: 110.512 }, region: "central-java", load: () => import("./ijo").then((m) => m.ijo) },
  // Highlands.
  { id: "dieng", name: "Dieng", location: "Banjarnegara, Jawa Tengah", site: { lat: -7.2052, lon: 109.9069 }, region: "central-java", load: () => import("./dieng").then((m) => m.dieng) },
  { id: "gedong-songo", name: "Gedong Songo", location: "Semarang, Jawa Tengah", site: { lat: -7.2085, lon: 110.3418 }, region: "central-java", load: () => import("./gedong-songo").then((m) => m.gedongSongo) },
  { id: "sukuh", name: "Sukuh", location: "Karanganyar, Jawa Tengah", site: { lat: -7.62722, lon: 111.13111 }, region: "central-java", load: () => import("./sukuh").then((m) => m.sukuh) },
  { id: "cetho", name: "Cetho", location: "Karanganyar, Jawa Tengah", site: { lat: -7.5956, lon: 111.1581 }, region: "central-java", load: () => import("./cetho").then((m) => m.cetho) },
  // Malang and Blitar.
  { id: "badut", name: "Badut", location: "Malang, Jawa Timur", site: { lat: -7.9578, lon: 112.5983 }, region: "east-java", load: () => import("./badut").then((m) => m.badut) },
  { id: "kidal", name: "Kidal", location: "Malang, Jawa Timur", site: { lat: -8.0333, lon: 112.7167 }, region: "east-java", load: () => import("./kidal").then((m) => m.kidal) },
  { id: "jago", name: "Jago", location: "Malang, Jawa Timur", site: { lat: -8.0057806, lon: 112.7641167 }, region: "east-java", load: () => import("./jago").then((m) => m.jago) },
  { id: "singosari", name: "Singosari", location: "Malang, Jawa Timur", site: { lat: -7.8878, lon: 112.6639 }, region: "east-java", load: () => import("./singosari").then((m) => m.singosari) },
  { id: "jawi", name: "Jawi", location: "Pasuruan, Jawa Timur", site: { lat: -7.6625, lon: 112.6697 }, region: "east-java", load: () => import("./jawi").then((m) => m.jawi) },
  { id: "penataran", name: "Penataran", location: "Blitar, Jawa Timur", site: { lat: -8.01611, lon: 112.20917 }, region: "east-java", load: () => import("./penataran").then((m) => m.penataran) },
  // Trowulan, the Majapahit capital.
  { id: "bajang-ratu", name: "Bajang Ratu", location: "Mojokerto, Jawa Timur", site: { lat: -7.5677, lon: 112.3988 }, region: "east-java", load: () => import("./bajang-ratu").then((m) => m.bajangRatu) },
  { id: "wringin-lawang", name: "Wringin Lawang", location: "Mojokerto, Jawa Timur", site: { lat: -7.54202, lon: 112.39101 }, region: "east-java", load: () => import("./wringin-lawang").then((m) => m.wringinLawang) },
  { id: "tikus", name: "Tikus", location: "Mojokerto, Jawa Timur", site: { lat: -7.5717, lon: 112.4035 }, region: "east-java", load: () => import("./tikus").then((m) => m.tikus) },
  { id: "brahu", name: "Brahu", location: "Mojokerto, Jawa Timur", site: { lat: -7.543, lon: 112.3722 }, region: "east-java", load: () => import("./brahu").then((m) => m.brahu) },
  { id: "cangkuang", name: "Cangkuang", location: "Garut, Jawa Barat", site: { lat: -7.1029, lon: 107.9189 }, region: "west-java", load: () => import("./cangkuang").then((m) => m.cangkuang) },
  { id: "batujaya", name: "Batujaya", location: "Karawang, Jawa Barat", site: { lat: -6.056314, lon: 107.154106 }, region: "west-java", load: () => import("./batujaya").then((m) => m.batujaya) },
  { id: "muara-takus", name: "Muara Takus", location: "Kampar, Riau", site: { lat: 0.3395, lon: 100.6402 }, region: "sumatra", load: () => import("./muara-takus").then((m) => m.muaraTakus) },
  { id: "muaro-jambi", name: "Muaro Jambi", location: "Muaro Jambi, Jambi", site: { lat: -1.4779, lon: 103.6671 }, region: "sumatra", load: () => import("./muaro-jambi").then((m) => m.muaroJambi) },
  { id: "bahal", name: "Bahal I", location: "Padang Lawas Utara, Sumatera Utara", site: { lat: 1.40556, lon: 99.73056 }, region: "sumatra", load: () => import("./bahal").then((m) => m.bahal) },
  { id: "gunung-kawi", name: "Gunung Kawi", location: "Gianyar, Bali", site: { lat: -8.4234, lon: 115.3123 }, region: "bali", load: () => import("./gunung-kawi").then((m) => m.gunungKawi) },
];

/** Every known temple, built ones first within each region; the map list and the picker show this. */
export const TEMPLES: readonly Temple[] = REGIONS.flatMap((region) => [...CANDI, ...PLANNED].filter((t) => t.region === region));
