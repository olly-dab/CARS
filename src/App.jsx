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
import EditAsset from "./pages/EditAsset";
import CheckOut from "./pages/CheckOut";
import Assets from "./pages/Assets";

import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

// ======================================================
// ROUTE GUARDS
// ======================================================

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* ==================================================
            TOASTER
        ================================================== */}

        <Toaster
          position="top-right"
          richColors
          closeButton
        />

        <Routes>

          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}

          {/* LOGIN */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* DEFAULT */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
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
              PROFILE
              CURRENT USER
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
              EDIT USER PROFILE
              ADMIN CAN EDIT ADMIN + RECEPTION
              
              Example:
              /profile/1
              /profile/2
          ================================================== */}

          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              USERS & ROLES
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
              ASSETS
              ADMIN + RECEPTION
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
              EDIT ASSET
              ADMIN + RECEPTION
          ================================================== */}

          <Route
            path="/assets/:id/edit"
            element={
              <ProtectedRoute>
                <EditAsset />
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


          {/* ==================================================
              OLD REGISTER ASSET URL
              REDIRECT
          ================================================== */}

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
              ADMIN + RECEPTION
          ================================================== */}

          <Route
            path="/checkout"
            element={
              <RoleProtectedRoute
                allowedRoles={[
                  "Admin",
                  "Reception",
                ]}
              >
                <CheckOut />
              </RoleProtectedRoute>
            }
          />


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