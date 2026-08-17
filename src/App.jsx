// src/App.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import RegisterAsset from "./pages/RegisterAsset";
import AssetDetails from "./pages/AssetDetails";
import CheckOut from "./pages/CheckOut";
import AssetHistory from "./pages/AssetHistory";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Toaster
          position="top-right"
          richColors
          closeButton
        />

        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          {/* Login page */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Start application at Login */}
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />


          {/* =========================
              SHARED PROTECTED ROUTES
              ADMIN + RECEPTION
          ========================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets/:id"
            element={
              <ProtectedRoute>
                <AssetDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/asset-history"
            element={
              <ProtectedRoute>
                <AssetHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assetshistory/:id"
            element={
              <ProtectedRoute>
                <AssetHistory />
              </ProtectedRoute>
            }
          />


          {/* =========================
              RECEPTION ONLY
          ========================= */}

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

          <Route
            path="/register-asset"
            element={
              <Navigate
                to="/assets/register"
                replace
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <RoleProtectedRoute
                allowedRoles={["Reception"]}
              >
                <CheckOut />
              </RoleProtectedRoute>
            }
          />


          {/* =========================
              ADMIN ONLY
          ========================= */}

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


          {/* =========================
              UNKNOWN URL
          ========================= */}

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