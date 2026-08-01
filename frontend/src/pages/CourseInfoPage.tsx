import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getCourseById, getUserRoundsByCourse } from "../lib/api";
import type { Course, Round } from "../lib/types";

const CourseInfoPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { userId } = useAuth();

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  });

  const {
    data: userRounds,
    isLoading: isRoundsLoading,
    isError: isRoundsError,
  } = useQuery<Round[]>({
    queryKey: ["userRounds", userId, courseId],
    queryFn: () => getUserRoundsByCourse(userId!, courseId!),
    enabled: !!userId && !!courseId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p>Loading course...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-20">
        <p>Failed to load course.</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center py-20">
        <p>Course not found.</p>
      </div>
    );
  }

  const teeSets = Object.entries(course.holes ?? {});
  const holeNumbers =
    teeSets.length > 0
      ? [
          ...new Set(
            teeSets.flatMap(([, holes]) =>
              holes.map((hole) => hole.holeNumber),
            ),
          ),
        ].sort((a, b) => a - b)
      : [];

  const frontNine = holeNumbers.filter((holeNumber) => holeNumber <= 9);
  const backNine = holeNumbers.filter((holeNumber) => holeNumber > 9);

  const buildTotals = (segment: number[]) => {
    return teeSets.map(([teeColour, holes]) => {
      const totalYardage = segment.reduce((sum, holeNumber) => {
        const hole = holes.find((item) => item.holeNumber === holeNumber);
        return sum + (hole?.yardage ?? 0);
      }, 0);

      const totalPar = segment.reduce((sum, holeNumber) => {
        const hole = holes.find((item) => item.holeNumber === holeNumber);
        return sum + (hole?.par ?? 0);
      }, 0);

      return { teeColour, totalYardage, totalPar };
    });
  };

  const overallTotals = buildTotals(holeNumbers);

  const formatPlayedAt = (value: string | Date | null | undefined) => {
    if (!value) return "—";

    const parsedDate = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString();
  };

  const renderSection = (
    title: string,
    segment: number[],
    totalsLabel: string,
    includeOverallTotals = false,
  ) => {
    const sectionTotals = buildTotals(segment);
    const columnTemplate = `140px repeat(${segment.length}, minmax(72px, 1fr)) 88px${includeOverallTotals ? " 88px" : ""}`;

    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
          {title}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div
              className="grid border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className="px-3 py-3">Hole</div>
              {segment.map((holeNumber) => (
                <div
                  key={holeNumber}
                  className="border-l border-slate-200 px-3 py-3 text-center"
                >
                  {holeNumber}
                </div>
              ))}
              <div className="border-l border-slate-200 px-3 py-3 text-center">
                {totalsLabel}
              </div>
              {includeOverallTotals ? (
                <div className="border-l border-slate-200 px-3 py-3 text-center">
                  Total
                </div>
              ) : null}
            </div>

            {teeSets.map(([teeColour, holes]) => (
              <div
                key={`${title}-${teeColour}`}
                className="grid border-b border-slate-200 bg-white text-sm"
                style={{ gridTemplateColumns: columnTemplate }}
              >
                <div className="px-3 py-3 font-semibold text-slate-700">
                  {teeColour}
                </div>
                {segment.map((holeNumber) => {
                  const hole = holes.find(
                    (item) => item.holeNumber === holeNumber,
                  );

                  return (
                    <div
                      key={`${title}-${teeColour}-${holeNumber}`}
                      className="border-l border-slate-100 px-3 py-3 text-center text-slate-700"
                    >
                      {hole?.yardage ?? "-"}
                    </div>
                  );
                })}
                <div className="border-l border-slate-100 px-3 py-3 text-center text-slate-700">
                  {sectionTotals.find((item) => item.teeColour === teeColour)
                    ?.totalYardage ?? "-"}
                </div>
                {includeOverallTotals ? (
                  <div className="border-l border-slate-100 px-3 py-3 text-center text-slate-700">
                    {overallTotals.find((item) => item.teeColour === teeColour)
                      ?.totalYardage ?? "-"}
                  </div>
                ) : null}
              </div>
            ))}

            <div
              className="grid border-b border-slate-200 bg-white text-sm"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className="px-3 py-3 font-semibold text-slate-700">HCP</div>
              {segment.map((holeNumber) => {
                const hole = teeSets[0]?.[1].find(
                  (item) => item.holeNumber === holeNumber,
                );

                return (
                  <div
                    key={`${title}-hcp-${holeNumber}`}
                    className="border-l border-slate-100 px-3 py-3 text-center text-slate-700"
                  >
                    {hole?.handicap ?? "-"}
                  </div>
                );
              })}
              <div className="border-l border-slate-100 px-3 py-3 text-center text-slate-700">
                -
              </div>
              {includeOverallTotals ? (
                <div className="border-l border-slate-100 px-3 py-3 text-center text-slate-700">
                  -
                </div>
              ) : null}
            </div>

            <div
              className="grid border-b border-slate-200 bg-white text-sm"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className="px-3 py-3 font-semibold text-slate-700">Par</div>
              {segment.map((holeNumber) => {
                const hole = teeSets[0]?.[1].find(
                  (item) => item.holeNumber === holeNumber,
                );

                return (
                  <div
                    key={`${title}-par-${holeNumber}`}
                    className="border-l border-slate-100 px-3 py-3 text-center text-slate-700"
                  >
                    {hole?.par ?? "-"}
                  </div>
                );
              })}
              <div className="border-l border-slate-100 px-3 py-3 text-center text-slate-700">
                {sectionTotals.find(
                  (item) => item.teeColour === teeSets[0]?.[0],
                )?.totalPar ?? "-"}
              </div>
              {includeOverallTotals ? (
                <div className="border-l border-slate-100 px-3 py-3 text-center text-slate-700">
                  {overallTotals.find(
                    (item) => item.teeColour === teeSets[0]?.[0],
                  )?.totalPar ?? "-"}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{course.name}</h1>
        <p className="mt-2 text-lg text-slate-600">
          {course.city}, {course.province}, {course.country}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-800">Scorecard</h2>
        </div>

        <div className="space-y-4 p-4">
          {frontNine.length > 0
            ? renderSection("Front 9", frontNine, "Out")
            : null}
          {backNine.length > 0
            ? renderSection("Back 9", backNine, "In", true)
            : null}

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Your rounds at this course
            </div>

            {isRoundsLoading ? (
              <div className="px-4 py-4 text-sm text-slate-600">
                Loading your rounds...
              </div>
            ) : isRoundsError ? (
              <div className="px-4 py-4 text-sm text-rose-600">
                We couldn’t load your rounds for this course.
              </div>
            ) : !userRounds?.length ? (
              <div className="px-4 py-4 text-sm text-slate-600">
                You haven’t played this course yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {userRounds.map((round) => (
                  <Link
                    to={`/rounds/${round.id}`}
                    key={round.id}
                    className="block"
                  >
                    <div
                      key={round.id}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-100"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {formatPlayedAt(round.playedAt)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {round.teeColor || "Tee"}
                        </p>
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {round.totalScore ?? "—"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoPage;
