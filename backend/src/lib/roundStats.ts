export type RoundStatsSummary = {
  roundsPlayed: number;
  averageScore: number;
  bestScore: number;
  handicap: number;
};

export type RoundStatsInput = {
  totalScore?: number | null;
  relativeToPar?: number | null;
  playedAt?: Date | string | null;
};

export function calculateUserRoundStats(
  rounds: RoundStatsInput[],
): RoundStatsSummary {
  if (!rounds.length) {
    return {
      roundsPlayed: 0,
      averageScore: 0,
      bestScore: 0,
      handicap: 0,
    };
  }

  const recentRounds = [...rounds]
    .sort((a, b) => {
      const aDate = new Date(a.playedAt || 0).getTime();
      const bDate = new Date(b.playedAt || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 20);

  const scores = recentRounds
    .map((round) => Number(round.totalScore))
    .filter((score) => Number.isFinite(score));

  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const bestScore = scores.length ? Math.min(...scores) : 0;

  const countingHandicapRounds = [...recentRounds]
    .sort((a, b) => (a.relativeToPar ?? 0) - (b.relativeToPar ?? 0))
    .slice(0, 8);

  const handicap = countingHandicapRounds.length
    ? Number(
        (
          countingHandicapRounds.reduce(
            (sum, round) => sum + (round.relativeToPar ?? 0),
            0,
          ) / countingHandicapRounds.length
        ).toFixed(2),
      )
    : 0;

  return {
    roundsPlayed: rounds.length,
    averageScore,
    bestScore,
    handicap,
  };
}
