import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCourses,
  getTeeSetsByCourseId,
  getTeeSetHolesByTeeSetId,
  getCourseHolesByCourseId,
  createRoundWithHoles,
} from "../lib/api";
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTeeSetId, setSelectedTeeSetId] = useState<string>("");
  const [playedDate, setPlayedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [holes, setHoles] = useState<HoleData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  // Fetch tee sets for selected course
  const { data: teeSets = [] } = useQuery({
    queryKey: ["teeSets", selectedCourseId],
    queryFn: () => getTeeSetsByCourseId(selectedCourseId),
    enabled: !!selectedCourseId,
  });

  // Fetch tee set holes and course holes
  const { data: teeSetHoles = [] } = useQuery({
    queryKey: ["teeSetHoles", selectedTeeSetId],
    queryFn: () => getTeeSetHolesByTeeSetId(selectedTeeSetId),
    enabled: !!selectedTeeSetId,
  });

  const { data: courseHoles = [] } = useQuery({
    queryKey: ["courseHoles", selectedCourseId],
    queryFn: () => getCourseHolesByCourseId(selectedCourseId),
    enabled: !!selectedCourseId,
  });

  // Combine and sort holes data
  useMemo(() => {
    if (teeSetHoles.length > 0 && courseHoles.length > 0) {
      const combined: HoleData[] = teeSetHoles.map((tsh: any) => {
        const courseHole = courseHoles.find(
          (ch: any) => ch.holeNumber === tsh.holeNumber,
        );
        return {
          holeNumber: tsh.holeNumber,
          par: courseHole?.par || 4,
          handicap: courseHole?.handicap,
          yardage: tsh.yardage,
          score: undefined,
          putts: undefined,
          fairwayHit: undefined,
          gir: undefined,
          penaltyStrokes: undefined,
        };
      });
      setHoles(combined.sort((a, b) => a.holeNumber - b.holeNumber));
    }
  }, [teeSetHoles, courseHoles]);

  const selectedCourse = courses.find((c: any) => c.id === selectedCourseId);
  const selectedTeeSet = teeSets.find((t: any) => t.id === selectedTeeSetId);

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
    if (!userId || !selectedCourseId || !selectedTeeSetId) {
      alert("Please select course, tee set, and date");
      return;
    }

    if (holes.filter((h) => h.score).length === 0) {
      alert("Please enter at least one score");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRoundWithHoles({
        userId,
        courseId: selectedCourseId,
        teeSetId: selectedTeeSetId,
        courseName: selectedCourse?.name,
        playedAt: new Date(playedDate),
        totalScore: totalScore || null,
        notes: "",
        holes: holes
          .filter((h) => h.score)
          .map((h) => ({
            holeNumber: h.holeNumber,
            score: h.score,
            putts: h.putts || null,
            fairwayHit: h.fairwayHit || null,
            greenInRegulation: h.gir || null,
            penaltyStrokes: h.penaltyStrokes || null,
          })),
      });

      alert("Round created successfully!");
      // Reset form
      setSelectedCourseId("");
      setSelectedTeeSetId("");
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-8">Log a Round</h1>

        {/* Selection Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-green-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedTeeSetId("");
                  setHoles([]);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Tees
              </label>
              <select
                value={selectedTeeSetId}
                onChange={(e) => setSelectedTeeSetId(e.target.value)}
                disabled={!selectedCourseId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Choose tees...</option>
                {teeSets.map((teeSet: any) => (
                  <option key={teeSet.id} value={teeSet.id}>
                    {teeSet.name} ({teeSet.color}) - {teeSet.totalYardage} yds
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Played
              </label>
              <input
                type="date"
                value={playedDate}
                onChange={(e) => setPlayedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Scorecard Section */}
        {holes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-700 text-white p-6 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCourse?.name}</h2>
                  <p className="text-green-100">
                    {selectedTeeSet?.name} ({selectedTeeSet?.color})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-100">Total Score</p>
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                  Front 9
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Hole
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Par
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          HCP
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Yardage
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Score
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700">
                          Putts
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {holes.slice(0, 9).map((hole) => (
                        <tr
                          key={hole.holeNumber}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {hole.holeNumber}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">
                            {hole.par}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">
                            {hole.handicap || "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">
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
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="—"
                            />
                          </td>
                        </tr>
                      ))}
                      {holes.slice(0, 9).length > 0 && (
                        <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                          <td colSpan={3} className="px-4 py-3">
                            Front 9 Total
                          </td>
                          <td></td>
                          <td className="px-4 py-3 text-center text-green-700">
                            {holes
                              .slice(0, 9)
                              .reduce((sum, h) => sum + (h.score || 0), 0)}
                          </td>
                          <td className="px-4 py-3 text-center text-green-700">
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
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                    Back 9
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Hole
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">
                            Par
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">
                            HCP
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">
                            Yardage
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">
                            Score
                          </th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">
                            Putts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {holes.slice(9).map((hole) => (
                          <tr
                            key={hole.holeNumber}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-semibold text-gray-800">
                              {hole.holeNumber}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">
                              {hole.par}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">
                              {hole.handicap || "—"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">
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
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="—"
                              />
                            </td>
                          </tr>
                        ))}
                        {holes.slice(9).length > 0 && (
                          <tr className="bg-green-50 font-bold border-t-2 border-green-300">
                            <td colSpan={3} className="px-4 py-3">
                              Back 9 Total
                            </td>
                            <td></td>
                            <td className="px-4 py-3 text-center text-green-700">
                              {holes
                                .slice(9)
                                .reduce((sum, h) => sum + (h.score || 0), 0)}
                            </td>
                            <td className="px-4 py-3 text-center text-green-700">
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
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition duration-200"
                >
                  {isSubmitting ? "Saving..." : "Save Round"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedCourseId && (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Select a course to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
