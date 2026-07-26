import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getRoundById } from "../lib/api";

interface RoundHoleData {
  holeNumber: number;
  score: number;
  putts?: number | null;
  fairwayHit?: boolean | null;
  greenInRegulation?: boolean | null;
  penaltyStrokes?: number | null;
}

const RoundPage = () => {
  const navigate = useNavigate();
  const { roundId } = useParams();

  const {
    data: round,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["round", roundId],
    queryFn: () => getRoundById(roundId!),
    enabled: !!roundId,
  });

  const stats = useMemo(() => {
    const holes: RoundHoleData[] = Array.isArray(round?.holes)
      ? round.holes
      : [];

    const totalScore =
      round?.totalScore ??
      holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
    const totalPutts = holes.reduce((sum, hole) => sum + (hole.putts || 0), 0);
    const fairwaysHit = holes.filter((hole) => hole.fairwayHit === true).length;
    const greensInRegulation = holes.filter(
      (hole) => hole.greenInRegulation === true,
    ).length;
    const penalties = holes.reduce(
      (sum, hole) => sum + (hole.penaltyStrokes || 0),
      0,
    );

    return {
      totalScore,
      holesPlayed: holes.length,
      totalPutts,
      fairwaysHit,
      greensInRegulation,
      penalties,
      averageScore: holes.length ? Math.round(totalScore / holes.length) : 0,
    };
  }, [round]);

  const formatMetric = (value: boolean | null | undefined) => {
    if (value === true) return "✓";
    if (value === false) return "✕";
    return "—";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-700 bg-slate-900 p-8 text-slate-300">
          Loading round details...
        </div>
      </div>
    );
  }

  if (isError || !round) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto max-w-6xl rounded-3xl border border-rose-700/40 bg-slate-900 p-8 text-slate-300">
          <h1 className="text-2xl font-semibold text-white">Round not found</h1>
          <p className="mt-2 text-slate-400">
            We couldn’t load that round right now. Please try again in a moment.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-500"
          >
            Back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-lg shadow-slate-950/20">
          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            ← Back to overview
          </button>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Round details
              </p>
              <h1 className="mt-2 text-4xl font-bold text-white">
                {round.courseName || "Untitled course"}
              </h1>
              <p className="mt-2 text-slate-400">
                {new Date(round.playedAt).toLocaleDateString()} •{" "}
                {round.teeColor || "Tee"}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-700/40 bg-emerald-600/10 px-4 py-3 text-right">
              <p className="text-sm text-emerald-300">Total score</p>
              <p className="text-3xl font-semibold text-white text-center">
                {stats.totalScore}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Holes</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.holesPlayed}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Avg / hole</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.averageScore}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Putts</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.totalPutts}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Fairways</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.fairwaysHit}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Greens</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.greensInRegulation}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Penalties</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.penalties}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Scorecard</h2>
            <span className="text-sm text-slate-400">
              Hole-by-hole breakdown
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/70">
                <tr className="text-left text-sm text-slate-400">
                  <th className="px-4 py-3 font-medium">Hole</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Putts</th>
                  <th className="px-4 py-3 font-medium">Fairway</th>
                  <th className="px-4 py-3 font-medium">GIR</th>
                  <th className="px-4 py-3 font-medium">Penalties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                {round.holes?.length ? (
                  round.holes.map((hole: RoundHoleData) => (
                    <tr
                      key={hole.holeNumber}
                      className="text-sm text-slate-300"
                    >
                      <td className="px-4 py-3 font-semibold text-white">
                        {hole.holeNumber}
                      </td>
                      <td className="px-4 py-3">{hole.score}</td>
                      <td className="px-4 py-3">{hole.putts ?? "—"}</td>
                      <td className="px-4 py-3">
                        {formatMetric(hole.fairwayHit)}
                      </td>
                      <td className="px-4 py-3">
                        {formatMetric(hole.greenInRegulation)}
                      </td>
                      <td className="px-4 py-3">
                        {hole.penaltyStrokes ?? "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No hole-by-hole data was saved for this round.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundPage;
