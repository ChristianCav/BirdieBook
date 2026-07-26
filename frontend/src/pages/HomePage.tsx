import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getUserRounds } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { data: rounds = [], isLoading } = useQuery({
    queryKey: ["userRounds", userId],
    queryFn: () => getUserRounds(userId!),
    enabled: !!userId,
  });

  const recentRounds = useMemo(() => {
    return [...rounds]
      .sort((a: any, b: any) => {
        const aDate = new Date(a.playedAt || 0).getTime();
        const bDate = new Date(b.playedAt || 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [rounds]);

  const stats = useMemo(() => {
    if (!rounds.length) {
      return {
        roundsPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        handicap: 0,
      };
    }

    const scores = rounds
      .map((round: any) => Number(round.totalScore))
      .filter((score: number) => Number.isFinite(score));

    const averageScore = scores.length
      ? Math.round(
          scores.reduce((sum: number, score: number) => sum + score, 0) /
            scores.length,
        )
      : 0;

    const bestScore = scores.length ? Math.min(...scores) : 0;
    const handicap = Math.max(0, Math.round((averageScore - 72) / 2));

    return {
      roundsPlayed: rounds.length,
      averageScore,
      bestScore,
      handicap,
    };
  }, [rounds]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-lg shadow-slate-950/20">
          <h1 className="text-4xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-slate-400">
            Here are your latest rounds and a quick snapshot of your progress.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Rounds</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.roundsPlayed}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Avg Score</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.averageScore}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Best</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.bestScore}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Handicap</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.handicap}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Recent rounds</h2>
            <span className="text-sm text-slate-400">Latest 5</span>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-400">
              Loading rounds...
            </div>
          ) : recentRounds.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-400">
              No rounds yet. Use the new round button in the navbar to get
              started.
            </div>
          ) : (
            <div className="space-y-3">
              {recentRounds.map((round: any) => (
                <button
                  key={round.id}
                  type="button"
                  onClick={() => navigate(`/rounds/${round.id}`)}
                  className="flex w-full flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-emerald-500/60 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-100">
                      {round.courseName || "Untitled course"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(round.playedAt).toLocaleDateString()} •{" "}
                      {round.teeColor || "Tee"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span>Score: {round.totalScore ?? "—"}</span>
                    <span>Holes: {round.holes?.length ?? 0}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
