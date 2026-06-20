import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";

function App() {
  const { isClerkLoaded } = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
