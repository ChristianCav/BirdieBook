import { describe, expect, it } from "vitest";
import { calculateUserRoundStats } from "./roundStats.js";

describe("calculateUserRoundStats", () => {
  it("computes stats from the latest 20 rounds and the best handicap sample", () => {
    const rounds = Array.from({ length: 22 }, (_, index) => ({
      id: `${index}`,
      totalScore: 80 + index,
      relativeToPar: index % 5 === 0 ? 2 : -1,
      playedAt: new Date(2024, 0, index + 1),
    }));

    const stats = calculateUserRoundStats(rounds as any[]);

    expect(stats.roundsPlayed).toBe(22);
    expect(stats.averageScore).toBe(92);
    expect(stats.bestScore).toBe(82);
    expect(stats.handicap).toBe(-1);
  });
});
