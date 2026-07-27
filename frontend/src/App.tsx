import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import AddCoursePage from "./pages/AddCoursePage";
import RoundPage from "./pages/RoundPage";
import CoursesPage from "./pages/AllCoursesPage";
import CourseInfoPage from "./pages/CourseInfoPage";
import MyCoursesPage from "./pages/MyCoursesPage";

function App() {
  const { isClerkLoaded } = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/courses/new" element={<AddCoursePage />} />
          <Route path="/rounds/:roundId" element={<RoundPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseInfoPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
