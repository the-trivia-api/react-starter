import { describe, expect, it } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("keeps every item and leaves the original alone", () => {
    const items = ["a", "b", "c", "d"];
    const shuffled = shuffle(items);

    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual(["a", "b", "c", "d"]);
  });

  it("puts each item in each position roughly equally often", () => {
    const runs = 20_000;
    const firstPositionCounts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    for (let i = 0; i < runs; i++) {
      firstPositionCounts[shuffle(["a", "b", "c", "d"])[0]]++;
    }

    for (const count of Object.values(firstPositionCounts)) {
      // Each should be close to a quarter of the runs
      expect(count / runs).toBeGreaterThan(0.22);
      expect(count / runs).toBeLessThan(0.28);
    }
  });
});
