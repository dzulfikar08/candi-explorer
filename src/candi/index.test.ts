import { describe, expect, it } from "vitest";
import { CANDI } from "./index";

describe("candi registry", () => {
  it("has unique ids", () => {
    expect(new Set(CANDI.map((c) => c.id)).size).toBe(CANDI.length);
  });

  it.each(CANDI.map((c) => [c.id, c] as const))("%s loads a definition with the same id and name", async (_, entry) => {
    const candi = await entry.load();
    expect(candi.id).toBe(entry.id);
    expect(candi.name).toBe(entry.name);
    expect(candi.name.startsWith("Candi ")).toBe(false);
    expect(candi.topics[candi.overviewTopic]).toBeDefined();
    for (const h of candi.hotspots) expect(candi.topics[h.topic], `${entry.id} hotspot ${h.label}`).toBeDefined();
  });
});
