import { useQuery } from "@tanstack/react-query";
import { getMyCourses } from "../lib/api";
import type { Course } from "../lib/types";

const MyCoursesPage = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getMyCourses(),
  });
  return (
    <div>
      {isLoading ? (
        <p>Loading courses...</p>
      ) : isError ? (
        <p>Error loading courses.</p>
      ) : (
        <div>
          <h1>My Courses</h1>
          <ul>
            {courses?.map((course: Course) => (
              <div>
                <a href={`/courses/${course.id}`}>{course.name}</a>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
