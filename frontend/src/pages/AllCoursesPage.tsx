import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../lib/api";

const CoursesPage = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getAllCourses(),
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading courses...</p>
      ) : isError ? (
        <p>Error loading courses.</p>
      ) : (
        <ul>
          {courses?.map((course) => (
            <div>
              <a href={`/courses/${course.id}`}>{course.name}</a>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoursesPage;
