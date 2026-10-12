import { buildBrahu } from "./model";
import type { CandiDefinition, Topic } from "../types";

/**
 * Sources: Indonesian Wikipedia "Candi Brahu"; Buddhazine "Situs Trowulan Majapahit (1): Candi
 * Brahu" (Jo Priastana, 2012 — restoration survey: azimuth 227°, body 10 × 10.5 × 9.6 m, roof
 * about 6 m with a circular stupa remnant at its south-east corner, chamber 4 × 4 m, charcoal
 * radiocarbon-dated at BATAN to 1410–1646, west stair of unknown form, Dutch-colonial brick and
 * the 1990/91–1994/95 reconstruction); the Mojokerto regency tourism office (location, Bejijong,
 * about 2 km north of the Mojokerto–Jombang road). The name is traced to warahu/wanaru in the
 * Alasantan inscription of Mpu Sindok, 939 CE (861 Saka).
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Trowulan, Mojokerto · 14th–15th century?",
    title: "Candi Brahu",
    paragraphs: [
      "The one sanctuary still standing nearly whole among the shrines that once crowded this corner of Trowulan, the brick capital of Majapahit, in a quiet garden at Bejijong about 2 km north of the Mojokerto–Jombang road. Like every major building of the capital it is of red brick, the blocks bonded without mortar in the gosok manner, each joint ground smooth against the next.",
      "Its name is traced to warahu or wanaru, a sacred building named in the Alasantan copper-plate inscription issued by King Mpu Sindok in 939 CE and found not far away. Whether that building is this one is unresolved: the temple is usually dated to the 14th or 15th century, yet many judge it older than any other structure at Trowulan.",
      "It faces west — the restoration survey gives an azimuth of 227°, just south of due west — rising about 20 m from a base of 22.5 × 18 m.",
    ],
    facts: [
      ["Faces", "West (azimuth 227°)"],
      ["Base", "22.5 × 18 m"],
      ["Height", "≈ 20 m"],
      ["Material", "Red brick, gosok bond"],
    ],
  },
  chamber: {
    kicker: "The chamber",
    title: "A room without a door",
    paragraphs: [
      "Inside the body hides a bare chamber about 4 × 4 m; its floor is broken. There is no surviving way in — the west stair is recorded but its original form is unknown, and archaeologists reached the room by taking the brickwork apart. Charcoal found during that dismantling was radiocarbon-dated at BATAN to 1410–1646, anchoring the temple in the late Majapahit period.",
      "Village tradition makes Brahu the crematorium of Majapahit kings. Yet no researcher has found ash or remains in the chamber; the containers, if any ever lay there, were looted long before the restoration of the 1990s.",
    ],
    facts: [
      ["Chamber", "≈ 4 × 4 m, floor damaged"],
      ["Charcoal dated", "1410–1646 CE (BATAN)"],
      ["Tradition", "Royal crematorium, no ash found"],
    ],
  },
  bricks: {
    kicker: "Brick and restoration",
    title: "Old foot, new brick",
    paragraphs: [
      "Much of the body is new brick, rebuilt while Java was under Dutch administration after the ruin collapsed; the whole was consolidated again between 1990/91 and 1994/95. Beneath the present foot the excavators found the separate, earlier foot of a square building 17 × 17 m — the temple grew over an older sanctuary.",
      "The base reads as two moulded steps with the flat fillets, bell-shaped faces and half-round rolls of East Javanese brickwork, and its double frame once carried a stair on the west side.",
    ],
    facts: [
      ["Earlier foot", "17 × 17 m, below the present base"],
      ["Restored", "Dutch period; 1990/91–1994/95"],
    ],
  },
  crown: {
    kicker: "Roof",
    title: "Rounded tiers and a broken stupa",
    paragraphs: [
      "Above the body — a square of 10 × 10.5 m, 9.6 m tall, with boldly rounded corners — the roof rises about 6 m in rounded, cushion-like tiers and ends flat, unlike the tiered pyramids of Central Java.",
      "At the south-east corner of the roof survives a circular ornament, read as the base of a stupa: the sign that Brahu was Buddhist. The exact original shape of the roof is unknown, and this model rounds it off with a profiled drum.",
    ],
    facts: [
      ["Body", "10 × 10.5 m, 9.6 m tall"],
      ["Roof", "≈ 6 m, flat top"],
      ["South-east corner", "Circular stupa base, Buddhist marker"],
    ],
  },
};

export const brahu: CandiDefinition = {
  id: "brahu",
  name: "Brahu",
  location: "Mojokerto, Jawa Timur",
  site: { lat: -7.543, lon: 112.3722 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "chamber", label: "Sealed doorway", anchor: [-5.3, 11.5, 0], view: { position: [-27, 12.5, 7], target: [-5, 11, 0] } },
    { topic: "crown", label: "Rounded crown", anchor: [0, 18.4, 0], view: { position: [26, 21, 20], target: [0, 15.5, 0] } },
    { topic: "bricks", label: "Moulded foot", anchor: [-11.3, 2.3, 1.5], view: { position: [-23, 4.5, 10], target: [-11, 2.4, 0] } },
    { topic: "overview", label: "Whole temple", anchor: [0, 10, 0], view: { position: [-44, 19, 27], target: [0, 9, 0] } },
  ],
  horizon: [
    { name: "Penanggungan", lat: -7.6156, lon: 112.62, relativeHeight: 1623, kind: "volcano" },
    { name: "Anjasmoro", lat: -7.621, lon: 112.281, relativeHeight: 2247, kind: "volcano" },
    { name: "Welirang", lat: -7.691, lon: 112.477, relativeHeight: 3126, kind: "volcano" },
    { name: "Arjuno", lat: -7.725, lon: 112.576, relativeHeight: 3309, kind: "volcano" },
  ],
  orbit: { position: [-26, 18, 17], target: [0, 9, 0] },
  realms: {
    lower: "Kamadhatu · foot",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · roof",
  },
  setting: { plazaRadius: 65, shadowExtent: 32, approach: { x: -1, z: 0, start: 26 } },
  build: buildBrahu,
};
