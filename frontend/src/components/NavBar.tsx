import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const NavBar = () => {
  return (
    <div>
      <SignInButton mode="modal">
        <button className="btn btn-ghost btn-sm">Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="btn btn-primary btn-sm">Get Started</button>
      </SignUpButton>
    </div>
  );
};

export default NavBar;
