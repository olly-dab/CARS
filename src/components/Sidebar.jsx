// src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  ArrowUpRight,
  FileBarChart,
  ShieldCheck,
  LogOut,
  Layers,
} from "lucide-react";

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    logout();

    toast.info("You have been signed out.");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // Navigation Link Style
  // ==========================================

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-100 shadow-sm">

      {/* ==========================================
          BRAND HEADER
      =========================================== */}

      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
          <Layers className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-bold tracking-tight text-white">
            CARS
          </h2>

          
        </div>

      </div>


      {/* ==========================================
          CURRENT USER
      =========================================== */}

      <div className="mx-4 mt-4 rounded-lg border border-slate-700/60 bg-slate-800/80 p-3">

        <div className="text-sm font-semibold text-white">
          {currentUser?.name || "System User"}
        </div>

        <div className="text-xs font-medium text-blue-400">
          {currentUser?.role || "Reception"}
        </div>

      </div>


      {/* ==========================================
          NAVIGATION
      =========================================== */}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">

        {/* ========================================
            DASHBOARD
        ========================================= */}

        <NavLink
          to="/dashboard"
          className={navLinkClass}
        >
          <LayoutDashboard className="h-4 w-4" />

          <span>
            Dashboard
          </span>
        </NavLink>


       


        {/* ========================================
            REGISTER ASSET
            RECEPTION ONLY
        ========================================= */}

        {currentUser?.role === "Reception" && (
          <NavLink
            to="/assets/register"
            className={navLinkClass}
          >
            <PlusCircle className="h-4 w-4" />

            <span>
              Register Asset
            </span>
          </NavLink>
        )}


        {/* ========================================
    CHECK-OUT
    RECEPTION ONLY
========================================= */}

{currentUser?.role === "Reception" && (
  <NavLink
    to="/checkout"
    className={navLinkClass}
  >
    <ArrowUpRight className="h-4 w-4" />

    <span>
      Check-Out
    </span>
  </NavLink>
)}
         {/* ========================================
            ASSETS
        ========================================= */}

        <NavLink
          to="/assets"
          className={navLinkClass}
        >
          <Boxes className="h-4 w-4" />

          <span>
            Assets
          </span>
        </NavLink>


        {/* ========================================
            ADMIN CONTROLS
        ========================================= */}

        {currentUser?.role === "Admin" && (
          <div className="pt-4">

            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Admin Controls
            </div>


            {/* Reports */}

            <NavLink
              to="/reports"
              className={navLinkClass}
            >
              <FileBarChart className="h-4 w-4" />

              <span>
                Reports
              </span>
            </NavLink>


            {/* Users & Roles */}

            <NavLink
              to="/users"
              className={navLinkClass}
            >
              <ShieldCheck className="h-4 w-4" />

              <span>
                Users & Roles
              </span>
            </NavLink>

          </div>
        )}

      </nav>


      {/* ==========================================
          LOGOUT
      =========================================== */}

      <div className="border-t border-slate-800 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-red-800/40 bg-red-950/40 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/50 hover:text-red-300"
        >

          <LogOut className="h-4 w-4" />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}