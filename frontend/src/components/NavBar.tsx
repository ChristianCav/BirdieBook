import React from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { Link } from "react-router";
import { PlusIcon, UserIcon } from "lucide-react";

const NavBar = () => {
  const { isSignedIn } = useAuth();

  return (
    <div>
      {isSignedIn ? (
        <>
          <Link to="/create" className="btn btn-primary btn-sm gap-1">
            <PlusIcon className="size-4" />
            <span className="hidden sm:inline">New Round</span>
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
  );
};

export default NavBar;
