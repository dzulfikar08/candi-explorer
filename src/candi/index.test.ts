import { describe, expect, it } from "vitest";
import { CANDI, TEMPLES } from "./index";
import { PLANNED } from "./planned";

/** Rough ground distance in metres; plenty for "is this the same place". */
const metres = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) =>
  Math.hypot((a.lat - b.lat) * 111_320, (a.lon - b.lon) * 111_320 * Math.cos((a.lat * Math.PI) / 180));

describe("candi registry", () => {
  it("has unique ids across built and coming-soon temples", () => {
    expect(new Set(TEMPLES.map((c) => c.id)).size).toBe(CANDI.length + PLANNED.length);
  });

  it.each(PLANNED.map((t) => [t.id, t] as const))("coming-soon %s is sourced and not a built temple again", (_, t) => {
    expect(t.name.startsWith("Candi ")).toBe(false);
    expect(t.sources.length).toBeGreaterThan(0);
    for (const s of t.sources) expect(s.url, `${t.id} ${s.title}`).toMatch(/^https:\/\//);
    // Inside Indonesia's extent.
    expect(t.site.lat).toBeGreaterThan(-11.5);
    expect(t.site.lat).toBeLessThan(6.5);
    expect(t.site.lon).toBeGreaterThan(94.5);
    expect(t.site.lon).toBeLessThan(141.5);
    for (const c of CANDI) expect(metres(t.site, c.site), `${t.id} sits on ${c.id}`).toBeGreaterThan(60);
  });

  it.each(CANDI.map((c) => [c.id, c] as const))("%s matches its definition and cites sources", async (_, entry) => {
    const candi = await entry.load();
    expect(candi.id).toBe(entry.id);
    expect(candi.name).toBe(entry.name);
    expect(candi.location).toBe(entry.location);
    expect(candi.site).toEqual(entry.site);
    expect(candi.name.startsWith("Candi ")).toBe(false);
    expect(candi.topics[candi.overviewTopic]).toBeDefined();
    for (const h of candi.hotspots) expect(candi.topics[h.topic], `${entry.id} hotspot ${h.label}`).toBeDefined();
    expect(candi.sources.length).toBeGreaterThan(0);
    for (const s of candi.sources) expect(s.url, `${entry.id} ${s.title}`).toMatch(/^https:\/\//);
  });
});
