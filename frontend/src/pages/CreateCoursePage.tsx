import { useState } from "react";
import { useNavigate } from "react-router";
import { createCourse } from "../lib/api";

type HoleDraft = {
  holeNumber: number;
  par: number;
  handicap: number;
  yardage: number;
};

type TeeDraft = {
  name: string;
  holes: HoleDraft[];
};

const buildHoleDrafts = (
  count: 9 | 18,
  existing: HoleDraft[] = [],
): HoleDraft[] =>
  Array.from({ length: count }, (_, index) => ({
    holeNumber: index + 1,
    par: existing[index]?.par ?? 4,
    handicap: existing[index]?.handicap ?? index + 1,
    yardage: existing[index]?.yardage ?? 350,
  }));

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [holeCount, setHoleCount] = useState<9 | 18>(18);
  const [tees, setTees] = useState<TeeDraft[]>([
    { name: "Blue", holes: buildHoleDrafts(18) },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateHoleCount = (count: 9 | 18) => {
    setHoleCount(count);
    setTees((prevTees) =>
      prevTees.map((tee) => ({
        ...tee,
        holes: buildHoleDrafts(count, tee.holes),
      })),
    );
  };

  const updateTeeName = (index: number, value: string) => {
    setTees((prevTees) =>
      prevTees.map((tee, teeIndex) =>
        teeIndex === index ? { ...tee, name: value } : tee,
      ),
    );
  };

  const updateHoleField = (
    teeIndex: number,
    holeIndex: number,
    field: keyof HoleDraft,
    value: string,
  ) => {
    setTees((prevTees) =>
      prevTees.map((tee, currentTeeIndex) => {
        if (currentTeeIndex !== teeIndex) return tee;

        return {
          ...tee,
          holes: tee.holes.map((hole, currentHoleIndex) =>
            currentHoleIndex === holeIndex
              ? { ...hole, [field]: Number(value) }
              : hole,
          ),
        };
      }),
    );
  };

  const addTee = () => {
    setTees((prevTees) => [
      ...prevTees,
      { name: `Tee ${prevTees.length + 1}`, holes: buildHoleDrafts(holeCount) },
    ]);
  };

  const removeTee = (index: number) => {
    setTees((prevTees) => prevTees.filter((_, teeIndex) => teeIndex !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a course name.");
      return;
    }

    const trimmedTees = tees
      .map((tee) => ({ ...tee, name: tee.name.trim() }))
      .filter((tee) => tee.name.length > 0);

    if (trimmedTees.length === 0) {
      setError("Please add at least one tee color.");
      return;
    }

    try {
      setIsSubmitting(true);
      const holesPayload = trimmedTees.reduce<Record<string, HoleDraft[]>>(
        (acc, tee) => {
          acc[tee.name] = tee.holes.map((hole) => ({
            holeNumber: hole.holeNumber,
            par: hole.par,
            handicap: hole.handicap,
            yardage: hole.yardage,
          }));
          return acc;
        },
        {},
      );

      const createdCourse = await createCourse({
        name: name.trim(),
        city: city.trim(),
        province: province.trim(),
        country: country.trim(),
        holes: holesPayload,
      });

      navigate(`/rounds/new?courseId=${createdCourse.id}`);
    } catch (err) {
      console.error("Error creating course:", err);
      setError("We could not create the course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-lg shadow-slate-950/20">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          ← Back to overview
        </button>
        <h1 className="text-3xl font-bold text-white">Add a Course</h1>
        <p className="mt-2 text-slate-400">
          Build the course profile with tee options and hole details.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Course name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                placeholder="Pebble Beach"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                placeholder="Monterey"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Province / State
              </label>
              <input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                placeholder="CA"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Country
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                placeholder="USA"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Hole layout
                </h2>
                <p className="text-sm text-slate-400">
                  Choose whether this course is 9 or 18 holes.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateHoleCount(9)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    holeCount === 9
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  9 holes
                </button>
                <button
                  type="button"
                  onClick={() => updateHoleCount(18)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    holeCount === 18
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  18 holes
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                Add one or more tee colors and fill in each hole's details.
              </p>
              <button
                type="button"
                onClick={addTee}
                className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600/10"
              >
                + Add tee
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {tees.map((tee, teeIndex) => (
                <div
                  key={`${tee.name}-${teeIndex}`}
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Tee color
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                        onChange={(e) =>
                          updateTeeName(teeIndex, e.target.value)
                        }
                        value={tee.name}
                      >
                        <option value="Blue">Blue</option>
                        <option value="White">White</option>
                        <option value="Red">Red</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Gold">Gold</option>
                        <option value="Black">Black</option>
                      </select>
                      {/* <<input
                        value={tee.name}
                        type=""
                        onChange={(e) =>
                          updateTeeName(teeIndex, e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                        placeholder="Blue"
                      />> */}
                    </div>

                    {tees.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeTee(teeIndex)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-rose-500 hover:text-rose-400"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {tee.holes.map((hole, holeIndex) => (
                      <div
                        key={`${tee.name}-hole-${hole.holeNumber}`}
                        className="rounded-xl border border-slate-700 bg-slate-950/80 p-3"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="font-semibold text-slate-100">
                            Hole {hole.holeNumber}
                          </p>
                          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            #{hole.holeNumber}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Par
                            <input
                              type="number"
                              min="3"
                              max="8"
                              value={hole.par}
                              onChange={(e) =>
                                updateHoleField(
                                  teeIndex,
                                  holeIndex,
                                  "par",
                                  e.target.value,
                                )
                              }
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                            />
                          </label>

                          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Yardage
                            <input
                              type="number"
                              min="0"
                              value={hole.yardage}
                              onChange={(e) =>
                                updateHoleField(
                                  teeIndex,
                                  holeIndex,
                                  "yardage",
                                  e.target.value,
                                )
                              }
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                            />
                          </label>

                          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Handicap
                            <input
                              type="number"
                              min="1"
                              max={holeCount}
                              value={hole.handicap}
                              onChange={(e) =>
                                updateHoleField(
                                  teeIndex,
                                  holeIndex,
                                  "handicap",
                                  e.target.value,
                                )
                              }
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
