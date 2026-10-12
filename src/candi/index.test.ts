import { describe, expect, it } from "vitest";
import { CANDI } from "./index";

describe("candi registry", () => {
  it("has unique ids", () => {
    expect(new Set(CANDI.map((c) => c.id)).size).toBe(CANDI.length);
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
