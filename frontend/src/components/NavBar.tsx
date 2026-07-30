import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { Link } from "react-router";
import { PlusIcon, PlusCircleIcon, UserIcon, EarthIcon } from "lucide-react";

const NavBar = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 py-4 text-slate-100 shadow-sm shadow-slate-950/20">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-lg font-semibold text-white">
          BirdieBook
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isSignedIn ? (
          <>
            <Link to="/courses/all" className="btn btn-ghost btn-sm gap-1">
              <EarthIcon className="size-4" />
              <span className="hidden sm:inline">Browse Courses</span>
            </Link>
            <Link to="/courses/me" className="btn btn-ghost btn-sm gap-1">
              <EarthIcon className="size-4" />
              <span className="hidden sm:inline">My Courses</span>
            </Link>
            <Link to="/rounds/new" className="btn btn-primary btn-sm gap-1">
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">New Round</span>
            </Link>
            <Link to="/courses/new" className="btn btn-ghost btn-sm gap-1">
              <PlusCircleIcon className="size-4" />
              <span className="hidden sm:inline">New Course</span>
            </Link>
            <Link to="/profile" className="btn btn-ghost btn-sm gap-1">
              <UserIcon className="size-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="btn btn-ghost btn-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-sm">Get Started</button>
            </SignUpButton>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
