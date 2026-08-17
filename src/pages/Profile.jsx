import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import {
  User,
  Save,
  ArrowLeft,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function Profile() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ======================================================
  // LOAD CURRENT USER
  // ======================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setForm({
      name: currentUser.name || "",
      username: currentUser.username || "",
      password: currentUser.password || "",
    });
  }, [currentUser, navigate]);

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (form.password.length < 4) {
      newErrors.password =
        "Password must be at least 4 characters.";
    }

    return newErrors;
  };

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ---------------------------------------------
    // GET ALL USERS
    // ---------------------------------------------

    const users =
      JSON.parse(
        localStorage.getItem("cars_users")
      ) || [];

    // ---------------------------------------------
    // CHECK USERNAME
    // ---------------------------------------------

    const usernameExists = users.some(
      (user) =>
        user.username.toLowerCase() ===
          form.username.trim().toLowerCase() &&
        String(user.id) !== String(currentUser.id)
    );

    if (usernameExists) {
      setErrors({
        username: "This username is already in use.",
      });
      return;
    }

    // ---------------------------------------------
    // UPDATED USER
    // ---------------------------------------------

    const updatedUser = {
      ...currentUser,
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
    };

    // ---------------------------------------------
    // UPDATE USERS LIST
    // ---------------------------------------------

    const updatedUsers = users.map((user) =>
      String(user.id) === String(currentUser.id)
        ? updatedUser
        : user
    );

    localStorage.setItem(
      "cars_users",
      JSON.stringify(updatedUsers)
    );

    // ---------------------------------------------
    // UPDATE CURRENT USER
    // ---------------------------------------------

    login(updatedUser);

    // ---------------------------------------------
    // SUCCESS
    // ---------------------------------------------

    toast.success(
      "Your profile has been updated successfully."
    );

    setErrors({});
  };

  // ======================================================
  // INITIALS
  // ======================================================

  const initials = form.name
    ? form.name
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // ======================================================
  // NO USER
  // ======================================================

  if (!currentUser) {
    return null;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Profile
            </h1>

            <p className="text-sm text-muted-foreground">
              View and manage your account information.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

        </div>

        {/* PROFILE CARD */}

        <Card>

          <CardHeader className="border-b">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-sm">
                {initials}
              </div>

              <div>

                <CardTitle>
                  {currentUser.name || "User"}
                </CardTitle>

                <CardDescription>
                  @{currentUser.username}
                </CardDescription>

              </div>

              <Badge
                className="ml-auto"
                variant={
                  currentUser.role === "Admin"
                    ? "default"
                    : "secondary"
                }
              >
                {currentUser.role}
              </Badge>

            </div>

          </CardHeader>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <CardContent className="space-y-5 pt-6">

              {/* FULL NAME */}

              <div className="space-y-2">

                <Label htmlFor="name">
                  Full Name
                </Label>

                <div className="relative">

                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="pl-9"
                  />

                </div>

                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* USERNAME */}

              <div className="space-y-2">

                <Label htmlFor="username">
                  Username
                </Label>

                <Input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />

                {errors.username && (
                  <p className="text-xs text-destructive">
                    {errors.username}
                  </p>
                )}

              </div>

              {/* PASSWORD */}

              <div className="space-y-2">

                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">

                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-9"
                  />

                </div>

                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* ROLE */}

              <div className="rounded-lg border bg-muted/30 p-4">

                <div className="flex items-center gap-3">

                  <ShieldCheck className="h-5 w-5 text-primary" />

                  <div>

                    <p className="text-sm font-semibold">
                      Account Role
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Your role is managed by an administrator.
                    </p>

                  </div>

                  <Badge className="ml-auto">
                    {currentUser.role}
                  </Badge>

                </div>

              </div>

            </CardContent>

            {/* FOOTER */}

            <CardFooter className="flex justify-end gap-3 border-t p-4">

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>

            </CardFooter>

          </form>

        </Card>

      </div>
    </DashboardLayout>
  );
}