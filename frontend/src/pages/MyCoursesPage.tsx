import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { removeCourseFromUser, getMyCourses } from "../lib/api";
import type { Course } from "../lib/types";

const MyCoursesPage = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    data: myCourses = [],
    isLoading,
    isError,
  } = useQuery<Course[]>({
    queryKey: ["myCourses"],
    queryFn: getMyCourses,
  });

  const removeCourseMutation = useMutation({
    mutationFn: removeCourseFromUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCourses"] });
    },
  });

  const filteredCourses = myCourses.filter((course: Course) =>
    course.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p>Loading courses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-20">
        <p>Failed to load courses.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Courses</h1>

      <input
        className="input-primary mb-6 w-full"
        placeholder="Search by course name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search !== "" && (
        <p className="mb-4 text-sm text-gray-500">
          {filteredCourses.length} course
          {filteredCourses.length !== 1 && "s"} found
        </p>
      )}

      {search === "" ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
          Start typing to search for a course.
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
          No matching courses found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course: Course) => {
            return (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-lg border p-4 transition hover:shadow-sm"
              >
                <Link to={`/courses/${course.id}`} className="hover:underline">
                  <span className="font-bold text-lg">{course.name}</span>
                  <span className="text-sm">
                    {"  "}({course.city}, {course.province}, {course.country})
                  </span>
                </Link>

                <button
                  className="btn btn-ghost"
                  onClick={() => removeCourseMutation.mutate(course.id)}
                >
                  Remove Course
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
