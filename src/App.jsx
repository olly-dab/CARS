// src/App.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

// ======================================================
// PAGES
// ======================================================

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import RegisterAsset from "./pages/RegisterAsset";
import AssetDetails from "./pages/AssetDetails";
import CheckOut from "./pages/CheckOut";

// AssetHistory.jsx was renamed to Asset.jsx
import Assets from "./pages/Assets";

import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import EditAsset from "./pages/EditAsset";

// ======================================================
// ROUTE GUARDS
// ======================================================

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* TOASTER */}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />

        <Routes>

          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* Default page */}
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
          <Route
  path="/assets/:id/edit"
  element={
    <ProtectedRoute>
      <EditAsset />
    </ProtectedRoute>
  }
/>
          {/* =========================
    CHECKOUT
    ADMIN + RECEPTION
========================= */}

<Route
  path="/checkout"
  element={
    <RoleProtectedRoute
      allowedRoles={["Admin", "Reception"]}
    >
      <CheckOut />
    </RoleProtectedRoute>
  }
/>


          {/* ==================================================
              PROFILE
              ADMIN + RECEPTION
          ================================================== */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              DASHBOARD
              ADMIN + RECEPTION
          ================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              ASSET
              ADMIN + RECEPTION

              AssetHistory.jsx was renamed to Asset.jsx
          ================================================== */}

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              ASSET DETAILS
              ADMIN + RECEPTION
          ================================================== */}

          <Route
            path="/assets/:id"
            element={
              <ProtectedRoute>
                <AssetDetails />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              REGISTER ASSET
              RECEPTION ONLY
          ================================================== */}

          <Route
            path="/assets/register"
            element={
              <RoleProtectedRoute
                allowedRoles={["Reception"]}
              >
                <RegisterAsset />
              </RoleProtectedRoute>
            }
          />

          {/* Old URL compatibility */}
          <Route
            path="/register-asset"
            element={
              <Navigate
                to="/assets/register"
                replace
              />
            }
          />


          {/* ==================================================
              CHECKOUT
              RECEPTION ONLY
          ================================================== */}

          

          {/* ==================================================
              REPORTS
              ADMIN ONLY
          ================================================== */}

          <Route
            path="/reports"
            element={
              <RoleProtectedRoute
                allowedRoles={["Admin"]}
              >
                <Reports />
              </RoleProtectedRoute>
            }
          />


          {/* ==================================================
              USERS
              ADMIN ONLY
          ================================================== */}

          <Route
            path="/users"
            element={
              <RoleProtectedRoute
                allowedRoles={["Admin"]}
              >
                <Users />
              </RoleProtectedRoute>
            }
          />


          {/* ==================================================
              UNKNOWN URL
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;