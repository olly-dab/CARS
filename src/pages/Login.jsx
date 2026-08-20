import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Layers,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // =====================================================
  // LOGIN STATES
  // =====================================================

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // FORGOT PASSWORD STATES
  // =====================================================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [resetUsername, setResetUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // =====================================================
  // INITIALIZE DEFAULT ADMIN
  // =====================================================

  useEffect(() => {
    try {
      const users =
        JSON.parse(localStorage.getItem("cars_users")) || [];

      if (!Array.isArray(users) || users.length === 0) {
        const defaultAdmin = {
          id: "admin-default",
          name: "CARS Administrator",
          username: "admin",
          password: "admin123",
          role: "Admin",
          status: "Active",
        };

        localStorage.setItem(
          "cars_users",
          JSON.stringify([defaultAdmin])
        );
      }
    } catch (error) {
      const defaultAdmin = {
        id: "admin-default",
        name: "CARS Administrator",
        username: "admin",
        password: "admin123",
        role: "Admin",
        status: "Active",
      };

      localStorage.setItem(
        "cars_users",
        JSON.stringify([defaultAdmin])
      );
    }
  }, []);

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    // --------------------------------------------
    // VALIDATION
    // --------------------------------------------

    if (!username.trim() || !password) {
      setError(
        "Please enter both your username and your password."
      );
      return;
    }

    // --------------------------------------------
    // GET USERS
    // --------------------------------------------

    let users = [];

    try {
      users =
        JSON.parse(localStorage.getItem("cars_users")) || [];
    } catch (error) {
      users = [];
    }

    if (!Array.isArray(users)) {
      users = [];
    }

    // --------------------------------------------
    // FIND USER
    // --------------------------------------------

    const enteredUsername = username
      .trim()
      .toLowerCase();

    const foundUser = users.find((user) => {
      const storedUsername = String(
        user.username || ""
      )
        .trim()
        .toLowerCase();

      const storedPassword = String(
        user.password || ""
      );

      const storedStatus = String(
        user.status || "Active"
      )
        .trim()
        .toLowerCase();

      return (
        storedUsername === enteredUsername &&
        storedPassword === password &&
        storedStatus === "active"
      );
    });

    // --------------------------------------------
    // INVALID LOGIN
    // --------------------------------------------

    if (!foundUser) {
      setError("Invalid username or password.");
      return;
    }

    // --------------------------------------------
    // LOGIN SUCCESS
    // --------------------------------------------

    login(foundUser);

    navigate("/dashboard");
  };

  // =====================================================
  // OPEN FORGOT PASSWORD
  // =====================================================

  const handleOpenForgotPassword = () => {
    setShowForgotPassword(true);

    setResetUsername("");
    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess("");
    setError("");
  };

  // =====================================================
  // BACK TO LOGIN
  // =====================================================

  const handleBackToLogin = () => {
    setShowForgotPassword(false);

    setResetUsername("");
    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess("");

    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =====================================================
  // HANDLE RESET PASSWORD
  // =====================================================

  const handleResetPassword = (e) => {
    e.preventDefault();

    setResetError("");
    setResetSuccess("");

    // --------------------------------------------
    // VALIDATION
    // --------------------------------------------

    if (!resetUsername.trim()) {
      setResetError("Please enter your username.");
      return;
    }

    if (!newPassword) {
      setResetError("Please enter a new password.");
      return;
    }

    if (!confirmPassword) {
      setResetError("Please confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setResetError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    // --------------------------------------------
    // GET USERS
    // --------------------------------------------

    let users = [];

    try {
      users =
        JSON.parse(localStorage.getItem("cars_users")) || [];
    } catch (error) {
      users = [];
    }

    if (!Array.isArray(users)) {
      setResetError("Unable to access user accounts.");
      return;
    }

    // --------------------------------------------
    // FIND USER
    // --------------------------------------------

    const enteredUsername = resetUsername
      .trim()
      .toLowerCase();

    const userIndex = users.findIndex((user) => {
      const storedUsername = String(
        user.username || ""
      )
        .trim()
        .toLowerCase();

      return storedUsername === enteredUsername;
    });

    // --------------------------------------------
    // USER NOT FOUND
    // --------------------------------------------

    if (userIndex === -1) {
      setResetError(
        "Username not found. Please check your username and try again."
      );
      return;
    }

    // --------------------------------------------
    // CHECK USER STATUS
    // --------------------------------------------

    const currentUser = users[userIndex];

    const currentStatus = String(
      currentUser.status || "Active"
    )
      .trim()
      .toLowerCase();

    if (currentStatus !== "active") {
      setResetError(
        "This account is not active. Please contact an administrator."
      );
      return;
    }

    // --------------------------------------------
    // UPDATE PASSWORD
    // --------------------------------------------

    const updatedUsers = [...users];

    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
    };

    // --------------------------------------------
    // SAVE USERS
    // --------------------------------------------

    localStorage.setItem(
      "cars_users",
      JSON.stringify(updatedUsers)
    );

    // --------------------------------------------
    // SUCCESS
    // --------------------------------------------

    setResetSuccess(
      "Password reset successfully. You can now log in."
    );

    setResetUsername("");
    setNewPassword("");
    setConfirmPassword("");

    setShowNewPassword(false);
    setShowConfirmPassword(false);

    // --------------------------------------------
    // RETURN TO LOGIN
    // --------------------------------------------

    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSuccess("");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">

      <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 rounded-2xl bg-card shadow-2xl border overflow-hidden">

        {/* ==================================================
            LEFT BRANDING
        ================================================== */}

        <div className="flex flex-col justify-between bg-primary p-10 text-primary-foreground">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground text-primary">

              <Layers className="h-6 w-6" />

            </div>

            <div>

              <h1 className="text-xl font-bold">
                CARS
              </h1>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="my-8">

            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Customer Asset Registration.
            </h2>

          </div>

          {/* LOCATION */}

          <div className="flex items-center gap-2 text-xs opacity-75">

            <span>
              A-mesob | Lafto Center
            </span>

          </div>

        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="p-8 md:p-10 flex flex-col justify-center">

          {/* ==================================================
              LOGIN FORM
          ================================================== */}

          {!showForgotPassword && (
            <>

              {/* HEADER */}

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-card-foreground">
                  Sign In
                </h2>

              </div>

              {/* ERROR */}

              {error && (

                <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">

                  <AlertCircle className="h-4 w-4 shrink-0" />

                  <span>
                    {error}
                  </span>

                </div>

              )}

              {/* LOGIN FORM */}

              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >

                {/* USERNAME */}

                <div className="space-y-2">

                  <Label htmlFor="username">
                    Username
                  </Label>

                  <div className="relative">

                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="username"
                      type="text"
                      placeholder="e.g. admin"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      className="pl-9"
                      autoComplete="username"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="space-y-2">

                  {/* PASSWORD LABEL */}

                  <div className="flex items-center justify-between">

                    <Label htmlFor="password">
                      Password
                    </Label>

                    {/* FORGOT PASSWORD */}

                    <button
                      type="button"
                      onClick={
                        handleOpenForgotPassword
                      }
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>

                  </div>

                  {/* PASSWORD INPUT */}

                  <div className="relative">

                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className="pl-9 pr-10"
                      autoComplete="current-password"
                    />

                    {/* SHOW / HIDE PASSWORD */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* LOGIN BUTTON */}

                <Button
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>

              </form>

            </>
          )}

          {/* ==================================================
              FORGOT PASSWORD FORM
          ================================================== */}

          {showForgotPassword && (
            <>

              {/* HEADER */}

              <div className="mb-6">

                <div className="flex items-center gap-3 mb-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">

                    <KeyRound className="h-5 w-5" />

                  </div>

                  <h2 className="text-2xl font-bold">
                    Forgot Password?
                  </h2>

                </div>

                <p className="text-sm text-muted-foreground">
                  Enter your username and create a new
                  password.
                </p>

              </div>

              {/* RESET ERROR */}

              {resetError && (

                <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">

                  <AlertCircle className="h-4 w-4 shrink-0" />

                  <span>
                    {resetError}
                  </span>

                </div>

              )}

              {/* RESET SUCCESS */}

              {resetSuccess && (

                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-xs text-green-600">

                  <CheckCircle className="h-4 w-4 shrink-0" />

                  <span>
                    {resetSuccess}
                  </span>

                </div>

              )}

              {/* RESET FORM */}

              <form
                onSubmit={handleResetPassword}
                className="space-y-4"
              >

                {/* USERNAME */}

                <div className="space-y-2">

                  <Label htmlFor="resetUsername">
                    Username
                  </Label>

                  <div className="relative">

                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="resetUsername"
                      type="text"
                      placeholder="Enter your username"
                      value={resetUsername}
                      onChange={(e) => {
                        setResetUsername(
                          e.target.value
                        );
                        setResetError("");
                      }}
                      className="pl-9"
                      autoComplete="username"
                    />

                  </div>

                </div>

                {/* NEW PASSWORD */}

                <div className="space-y-2">

                  <Label htmlFor="newPassword">
                    New Password
                  </Label>

                  <div className="relative">

                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="newPassword"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(
                          e.target.value
                        );
                        setResetError("");
                      }}
                      className="pl-9 pr-10"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >

                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="space-y-2">

                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>

                  <div className="relative">

                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(
                          e.target.value
                        );
                        setResetError("");
                      }}
                      className="pl-9 pr-10"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >

                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* RESET BUTTON */}

                <Button
                  type="submit"
                  className="w-full gap-2"
                >

                  <KeyRound className="h-4 w-4" />

                  Reset Password

                </Button>

                {/* BACK TO LOGIN */}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="w-full gap-2"
                >

                  <ArrowLeft className="h-4 w-4" />

                  Back to Login

                </Button>

              </form>

            </>
          )}

        </div>

      </div>

    </div>
  );
}