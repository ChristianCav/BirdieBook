import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";
import ProfilePage from "./pages/ProfilePage";
import CreateRoundPage from "./pages/CreateRoundPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import RoundInfoPage from "./pages/RoundInfoPage";
import AllCoursesPage from "./pages/AllCoursesPage";
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
          <Route path="/rounds/new" element={<CreateRoundPage />} />
          <Route path="/courses/new" element={<CreateCoursePage />} />
          <Route path="/rounds/:roundId" element={<RoundInfoPage />} />
          <Route path="/courses/all" element={<AllCoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseInfoPage />} />
          <Route path="/courses/me" element={<MyCoursesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
