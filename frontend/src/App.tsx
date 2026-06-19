import {
  SignedOut,
  SignInButton,
  SignOutButton,
  SignedIn,
} from "@clerk/clerk-react";
import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
