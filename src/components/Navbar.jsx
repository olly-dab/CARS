// src/components/Navbar.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Bell,
  ChevronDown,
  User,
} from "lucide-react";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 shadow-sm backdrop-blur">

      {/* LEFT */}

      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">

        <span>
          Customer Asset Tracking
        </span>

        <span>/</span>

        <span className="font-semibold capitalize text-foreground">
          Workspace
        </span>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* NOTIFICATION */}

        <button
          type="button"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </button>


        {/* PROFILE */}

        <button
          type="button"
          onClick={handleProfileClick}
          className="flex items-center gap-3 border-l pl-3 transition-opacity hover:opacity-80"
          title="Edit Profile"
        >

          {/* AVATAR */}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
            {initials}
          </div>


          {/* NAME + ROLE */}

          <div className="hidden text-left text-xs sm:block">

            <p className="leading-none font-semibold text-foreground">
              {currentUser?.name || "User"}
            </p>

            <p className="mt-0.5 text-muted-foreground">
              {currentUser?.role || "Reception"}
            </p>

          </div>


          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />

        </button>

      </div>

    </header>
  );
}