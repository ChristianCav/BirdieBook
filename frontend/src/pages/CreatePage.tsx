import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { getCourses, createRound } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";

interface HoleData {
  holeNumber: number;
  par: number;
  handicap?: number;
  yardage: number;
  score?: number;
  putts?: number;
  fairwayHit?: boolean;
  gir?: boolean;
  penaltyStrokes?: number;
}

const CreatePage = () => {
  const { userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTeeColor, setSelectedTeeColor] = useState<string>("");
  const [playedDate, setPlayedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [holes, setHoles] = useState<HoleData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSelectionKeyRef = useRef<string>("");

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const selectedCourse = courses.find((c: any) => c.id === selectedCourseId);

  const getTeeColorOptions = (course: any) => {
    if (!course?.holes || typeof course.holes !== "object") {
      return ["Red", "Blue", "Gold", "White", "Black"];
    }

    if (Array.isArray(course.holes)) {
      return (
        course.holes
          .filter(Array.isArray)
          .map((group: any[]) => (typeof group[0] === "string" ? group[0] : ""))
          .filter(Boolean) || ["Red", "Blue", "Gold", "White", "Black"]
      );
    }

    return Object.keys(course.holes);
  };

  const teeColorOptions = getTeeColorOptions(selectedCourse);

  const getHolesForTeeColor = (course: any, teeColor: string): HoleData[] => {
    if (!course?.holes) return [];

    if (Array.isArray(course.holes)) {
      const matchingTeeGroup = course.holes.find(
        (group: any) =>
          Array.isArray(group) &&
          typeof group[0] === "string" &&
          group[0].toLowerCase() === teeColor.toLowerCase(),
      );

      if (!matchingTeeGroup || !Array.isArray(matchingTeeGroup)) return [];

      return matchingTeeGroup
        .slice(1)
        .map((hole: any, index: number) => ({
          holeNumber: hole?.holeNumber ?? index + 1,
          par: hole?.par ?? 4,
          handicap: hole?.handicap,
          yardage: hole?.yardage ?? 0,
          score: undefined,
          putts: undefined,
          fairwayHit: undefined,
          gir: undefined,
          penaltyStrokes: undefined,
        }))
        .sort((a, b) => a.holeNumber - b.holeNumber);
    }

    if (typeof course.holes === "object") {
      const matchingTeeKey = Object.keys(course.holes).find(
        (key) => key.toLowerCase() === teeColor.toLowerCase(),
      );

      const teeHoles = matchingTeeKey ? course.holes[matchingTeeKey] : [];

      if (!Array.isArray(teeHoles)) return [];

      return teeHoles
        .map((hole: any, index: number) => ({
          holeNumber: hole?.holeNumber ?? index + 1,
          par: hole?.par ?? 4,
          handicap: hole?.handicap,
          yardage: hole?.yardage ?? 0,
          score: undefined,
          putts: undefined,
          fairwayHit: undefined,
          gir: undefined,
          penaltyStrokes: undefined,
        }))
        .sort((a, b) => a.holeNumber - b.holeNumber);
    }

    return [];
  };

  useEffect(() => {
    if (!selectedCourseId || !selectedTeeColor) {
      setHoles([]);
      lastSelectionKeyRef.current = "";
      return;
    }

    const selectionKey = `${selectedCourseId}:${selectedTeeColor}`;
    if (lastSelectionKeyRef.current === selectionKey) return;

    const course = courses.find((c: any) => c.id === selectedCourseId);
    setHoles(getHolesForTeeColor(course, selectedTeeColor));
    lastSelectionKeyRef.current = selectionKey;
  }, [courses, selectedCourseId, selectedTeeColor]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialCourseId = params.get("courseId") || "";

    if (initialCourseId && initialCourseId !== selectedCourseId) {
      setSelectedCourseId(initialCourseId);
      setSelectedTeeColor("");
      setHoles([]);
      lastSelectionKeyRef.current = "";
    }
  }, [location.search]);

  const totalScore = holes.reduce((sum, h) => sum + (h.score || 0), 0);
  const totalPar = holes.reduce((sum, h) => sum + h.par, 0);

  const handleScoreChange = (holeNumber: number, field: string, value: any) => {
    setHoles((prevHoles) =>
      prevHoles.map((h) =>
        h.holeNumber === holeNumber ? { ...h, [field]: value } : h,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!userId || !selectedCourseId || !selectedTeeColor) {
      alert("Please select course, tee color, and date");
      return;
    }

    if (holes.filter((h) => typeof h.score === "number").length === 0) {
      alert("Please enter at least one score");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRound({
        userId,
        courseId: selectedCourseId,
        courseName: selectedCourse?.name ?? "",
        teeColor: selectedTeeColor,
        playedAt: new Date(`${playedDate}T12:00:00`),
        totalScore: totalScore || null,
        notes: "",
        holes: holes
          .filter((h) => typeof h.score === "number")
          .map((h) => ({
            holeNumber: h.holeNumber,
            score: h.score as number,
            putts: h.putts ?? null,
            fairwayHit: h.fairwayHit ?? null,
            greenInRegulation: h.gir ?? null,
            penaltyStrokes: h.penaltyStrokes ?? null,
          })),
      });

      alert("Round created successfully!");
      // Reset form
      setSelectedCourseId("");
      setSelectedTeeColor("");
      setHoles([]);
      setPlayedDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error creating round:", error);
      alert("Error creating round. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Log a Round</h1>

        {/* Selection Section */}
        <div className="bg-slate-900 rounded-3xl shadow-2xl shadow-slate-950/30 p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedTeeColor("");
                  setHoles([]);
                  navigate("/create", { replace: true });
                }}
                className="w-full bg-slate-950 text-slate-100 px-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Choose a course...</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.name} {course.city && `(${course.city})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Tee Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Select Tees
              </label>
              <select
                value={selectedTeeColor}
                onChange={(e) => setSelectedTeeColor(e.target.value)}
                disabled={!selectedCourseId}
                className="w-full bg-slate-950 text-slate-100 px-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-800 disabled:cursor-not-allowed"
              >
                <option value="">Choose tees...</option>
                {teeColorOptions.map((teeColor: string) => (
                  <option key={teeColor} value={teeColor}>
                    {teeColor}
                  </option>
                ))}
              </select>
              {selectedTeeColor && holes.length === 0 && (
                <p className="mt-2 text-sm text-rose-300">
                  No {selectedTeeColor.toLowerCase()} tee data is available for
                  this course.
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Date Played
              </label>
              <input
                type="date"
                value={playedDate}
                onChange={(e) => setPlayedDate(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Scorecard Section */}
        {holes.length > 0 && (
          <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="bg-emerald-600 text-slate-100 p-6 mb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCourse?.name}</h2>
                  <p className="text-slate-200">{selectedTeeColor} tees</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-200">Total Score</p>
                  <p className="text-4xl font-bold">
                    {totalScore}
                    <span className="text-2xl ml-2">
                      ({totalScore - totalPar > 0 ? "+" : ""}
                      {totalScore - totalPar})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Front 9 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-100 mb-4 pb-2 border-b border-slate-700">
                  Front 9
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-slate-800">
                        <th className="px-4 py-2 text-left font-semibold text-slate-300">
                          Hole
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-slate-300">
                          Par
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-slate-300">
                          HCP
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-slate-300">
                          Yardage
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-slate-300">
                          Score
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-slate-300">
                          Putts
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {holes.slice(0, 9).map((hole) => (
                        <tr
                          key={hole.holeNumber}
                          className="border-b border-slate-700 hover:bg-slate-800"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-100">
                            {hole.holeNumber}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-300">
                            {hole.par}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-300">
                            {hole.handicap || "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-300">
                            {hole.yardage}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="1"
                              max="15"
                              value={hole.score || ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  hole.holeNumber,
                                  "score",
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                                )
                              }
                              className="w-16 px-2 py-1 bg-slate-950 text-slate-100 border border-slate-700 rounded text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              placeholder="—"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={hole.putts || ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  hole.holeNumber,
                                  "putts",
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                                )
                              }
                              className="w-16 px-2 py-1 bg-slate-950 text-slate-100 border border-slate-700 rounded text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              placeholder="—"
                            />
                          </td>
                        </tr>
                      ))}
                      {holes.slice(0, 9).length > 0 && (
                        <tr className="bg-slate-800 font-bold border-t border-slate-700">
                          <td colSpan={3} className="px-4 py-3 text-slate-100">
                            Front 9 Total
                          </td>
                          <td />
                          <td className="px-4 py-3 text-center text-emerald-300">
                            {holes
                              .slice(0, 9)
                              .reduce((sum, h) => sum + (h.score || 0), 0)}
                          </td>
                          <td className="px-4 py-3 text-center text-emerald-300">
                            {holes
                              .slice(0, 9)
                              .reduce((sum, h) => sum + (h.putts || 0), 0)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Back 9 */}
              {holes.length > 9 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-4 pb-2 border-b border-slate-700">
                    Back 9
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-slate-800">
                          <th className="px-4 py-2 text-left font-semibold text-slate-300">
                            Hole
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-slate-300">
                            Par
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-slate-300">
                            HCP
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-slate-300">
                            Yardage
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-slate-300">
                            Score
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-slate-300">
                            Putts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {holes.slice(9).map((hole) => (
                          <tr
                            key={hole.holeNumber}
                            className="border-b border-slate-700 hover:bg-slate-800"
                          >
                            <td className="px-4 py-3 font-semibold text-slate-100">
                              {hole.holeNumber}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">
                              {hole.par}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">
                              {hole.handicap || "—"}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">
                              {hole.yardage}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                min="1"
                                max="15"
                                value={hole.score || ""}
                                onChange={(e) =>
                                  handleScoreChange(
                                    hole.holeNumber,
                                    "score",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  )
                                }
                                className="w-16 px-2 py-1 bg-slate-950 text-slate-100 border border-slate-700 rounded text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="—"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={hole.putts || ""}
                                onChange={(e) =>
                                  handleScoreChange(
                                    hole.holeNumber,
                                    "putts",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  )
                                }
                                className="w-16 px-2 py-1 bg-slate-950 text-slate-100 border border-slate-700 rounded text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="—"
                              />
                            </td>
                          </tr>
                        ))}
                        {holes.slice(9).length > 0 && (
                          <tr className="bg-slate-800 font-bold border-t border-slate-700">
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-slate-100"
                            >
                              Back 9 Total
                            </td>
                            <td />
                            <td className="px-4 py-3 text-center text-emerald-300">
                              {holes
                                .slice(9)
                                .reduce((sum, h) => sum + (h.score || 0), 0)}
                            </td>
                            <td className="px-4 py-3 text-center text-emerald-300">
                              {holes
                                .slice(9)
                                .reduce((sum, h) => sum + (h.putts || 0), 0)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || totalScore === 0}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition duration-200"
                >
                  {isSubmitting ? "Saving..." : "Save Round"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedCourseId && (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-700">
            <p className="text-slate-300 text-lg">
              Select a course to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
