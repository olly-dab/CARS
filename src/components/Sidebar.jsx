// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  ArrowUpRight,
  History,
  FileBarChart,
  ShieldCheck,
  LogOut,
  Layers,
} from "lucide-react";

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-slate-900 text-slate-100 shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">CARS</h2>
          <p className="text-xs text-slate-400">Asset Management</p>
        </div>
      </div>

      {/* User Info */}
      <div className="mx-4 mt-4 rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
        <div className="text-sm font-semibold text-white">
          {currentUser?.name || "System User"}
        </div>
        <div className="text-xs font-medium text-blue-400">
          {currentUser?.role || "Reception"}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {/* Available to Both */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
      to="/assets/register"
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <PlusCircle className="h-4 w-4" />
      <span>Register Asset</span>
    </NavLink>

        
  <>
    

    <NavLink
      to="/checkout"
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <ArrowUpRight className="h-4 w-4" />
      <span>Check-Out</span>
    </NavLink>
  </>


<NavLink
  to="/assets"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`
  }
>
  <History className="h-4 w-4" />
  <span>Assets</span>
</NavLink>

        {/* ADMIN ONLY: Reports & Users */}
        {currentUser?.role === "Admin" && (
          <div className="pt-2">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Admin Controls
            </div>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <FileBarChart className="h-4 w-4" />
              <span>Reports</span>
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Users & Roles</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-red-950/40 border border-red-800/40 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>LogOut</span>
        </button>
      </div>
    </aside>
  );
}