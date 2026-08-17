import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Layers,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // --------------------------------------------
    // VALIDATION
    // --------------------------------------------

    if (!username || !password) {
      setError(
        "Please enter both your username and your password."
      );
      return;
    }

    // --------------------------------------------
    // GET REGISTERED USERS
    // --------------------------------------------

    const users =
      JSON.parse(
        localStorage.getItem("cars_users")
      ) || [];

    // --------------------------------------------
    // DEFAULT ADMIN
    // --------------------------------------------

    const defaultAdmin = {
      id: "admin-default",
      name: "CARS Administrator",
      username: "admin",
      password: "admin123",
      role: "Admin",
      status: "Active",
    };

    // --------------------------------------------
    // COMBINE USERS
    // --------------------------------------------

    const allUsers = [
      defaultAdmin,
      ...users,
    ];

    // --------------------------------------------
    // FIND USER
    // --------------------------------------------

    const foundUser = allUsers.find(
      (u) =>
        u.username?.toLowerCase() ===
          username.toLowerCase() &&
        u.password === password &&
        u.status === "Active"
    );

    // --------------------------------------------
    // INVALID LOGIN
    // --------------------------------------------

    if (!foundUser) {
      setError(
        "Invalid username or password."
      );
      return;
    }

    // --------------------------------------------
    // LOGIN SUCCESS
    // --------------------------------------------

    login(foundUser);

    navigate("/dashboard");
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

              <p className="text-xs opacity-80">
                Asset Management
              </p>

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="my-8">

            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Customer Asset Registration.
            </h2>

            <p className="text-sm opacity-90 leading-relaxed">
              Movement logs, and customer management
              in one system.
            </p>

          </div>


          {/* LOCATION */}

          <div className="flex items-center gap-2 text-xs opacity-75">

            <span>
              A-mesob | Lafto Center
            </span>

          </div>

        </div>


        {/* ==================================================
            RIGHT LOGIN FORM
        ================================================== */}

        <div className="p-8 md:p-10 flex flex-col justify-center">

          {/* HEADER */}

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-card-foreground">
              Sign In
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              Enter your operator credentials
            </p>

          </div>


          {/* ERROR MESSAGE */}

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

              {/* PASSWORD LABEL + FORGOT PASSWORD */}

              <div className="flex items-center justify-between">

                <Label htmlFor="password">
                  Password
                </Label>

                

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

        </div>

      </div>

    </div>
  );
}