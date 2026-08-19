// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  AtSign,
  KeyRound,
} from "lucide-react";

export default function Profile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  // =====================================================
  // PERMISSIONS
  // =====================================================

  const isAdmin = currentUser?.role === "Admin";

  const isEditingOtherUser =
    Boolean(userId) &&
    String(userId) !== String(currentUser?.id);

  // =====================================================
  // USER BEING EDITED
  // =====================================================

  const [profileUser, setProfileUser] = useState(null);

  // =====================================================
  // PROFILE FORM
  // =====================================================

  const [form, setForm] = useState({
    name: "",
    username: "",
  });

  // =====================================================
  // PASSWORD FORM
  // =====================================================

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =====================================================
  // ROLE
  // =====================================================

  const [selectedRole, setSelectedRole] =
    useState("Reception");

  // =====================================================
  // ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] =
    useState({});

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const users =
      JSON.parse(
        localStorage.getItem("cars_users")
      ) || [];

    // =================================================
    // OWN PROFILE
    // =================================================

    if (!userId) {
      setProfileUser(currentUser);

      setForm({
        name: currentUser.name || "",
        username: currentUser.username || "",
      });

      setSelectedRole(
        currentUser.role || "Reception"
      );

      return;
    }

    // =================================================
    // OTHER USER
    // =================================================

    const foundUser = users.find(
      (user) =>
        String(user.id) === String(userId)
    );

    if (!foundUser) {
      toast.error("User profile not found.");
      navigate("/users");
      return;
    }

    // =================================================
    // ONLY ADMIN CAN EDIT OTHER USERS
    // =================================================

    if (
      String(foundUser.id) !==
        String(currentUser.id) &&
      currentUser.role !== "Admin"
    ) {
      toast.error(
        "You are not authorized to edit this profile."
      );

      navigate("/profile");
      return;
    }

    setProfileUser(foundUser);

    setForm({
      name: foundUser.name || "",
      username: foundUser.username || "",
    });

    setSelectedRole(
      foundUser.role || "Reception"
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setErrors({});
    setPasswordErrors({});
  }, [currentUser, userId, navigate]);

  // =====================================================
  // HANDLE PROFILE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =====================================================
  // HANDLE PASSWORD CHANGE
  // =====================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =====================================================
  // VALIDATE PROFILE
  // =====================================================

  const validateProfile = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Full name is required.";
    }

    if (!form.username.trim()) {
      newErrors.username =
        "Username is required.";
    }

    return newErrors;
  };

  // =====================================================
  // VALIDATE PASSWORD
  // =====================================================

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordForm.newPassword) {
      newErrors.newPassword =
        "New password is required.";
    } else if (
      passwordForm.newPassword.length < 4
    ) {
      newErrors.newPassword =
        "Password must be at least 4 characters.";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    return newErrors;
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!currentUser || !profileUser) {
      return;
    }

    const validationErrors =
      validateProfile();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      const users =
        JSON.parse(
          localStorage.getItem("cars_users")
        ) || [];

      // =================================================
      // CHECK USERNAME
      // =================================================

      const usernameExists = users.some(
        (user) =>
          user.username
            ?.trim()
            .toLowerCase() ===
            form.username
              .trim()
              .toLowerCase() &&
          String(user.id) !==
            String(profileUser.id)
      );

      if (usernameExists) {
        setErrors({
          username:
            "This username is already in use.",
        });

        return;
      }

      // =================================================
      // ROLE
      // =================================================

      let finalRole = profileUser.role;

      // Admin can change another user's role
      if (
        isAdmin &&
        isEditingOtherUser
      ) {
        finalRole = selectedRole;
      }

      // User cannot change their own role
      if (!isEditingOtherUser) {
        finalRole = currentUser.role;
      }

      // =================================================
      // UPDATED USER
      // =================================================

      const updatedUser = {
        ...profileUser,

        name: form.name.trim(),

        username: form.username.trim(),

        role: finalRole,

        // Keep password unchanged
        password: profileUser.password,
      };

      // =================================================
      // UPDATE USERS
      // =================================================

      const updatedUsers = users.map(
        (user) =>
          String(user.id) ===
          String(profileUser.id)
            ? updatedUser
            : user
      );

      localStorage.setItem(
        "cars_users",
        JSON.stringify(updatedUsers)
      );

      // =================================================
      // UPDATE CURRENT USER
      // =================================================

      if (
        String(profileUser.id) ===
        String(currentUser.id)
      ) {
        updateCurrentUser(updatedUser);
      }

      setProfileUser(updatedUser);

      window.dispatchEvent(
        new Event("storage")
      );

      setErrors({});

      toast.success(
        isEditingOtherUser
          ? "User profile updated successfully."
          : "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        "Unable to update profile."
      );
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!currentUser || !profileUser) {
      return;
    }

    const validationErrors =
      validatePassword();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setPasswordErrors(validationErrors);
      return;
    }

    // =================================================
    // OWN PASSWORD
    // =================================================

    if (!isEditingOtherUser) {
      if (
        !passwordForm.currentPassword
      ) {
        setPasswordErrors({
          currentPassword:
            "Current password is required.",
        });

        return;
      }

      if (
        passwordForm.currentPassword !==
        currentUser.password
      ) {
        setPasswordErrors({
          currentPassword:
            "Current password is incorrect.",
        });

        return;
      }

      if (
        passwordForm.newPassword ===
        currentUser.password
      ) {
        setPasswordErrors({
          newPassword:
            "New password must be different from your current password.",
        });

        return;
      }
    }

    // =================================================
    // SAVE PASSWORD
    // =================================================

    try {
      const users =
        JSON.parse(
          localStorage.getItem("cars_users")
        ) || [];

      const updatedUser = {
        ...profileUser,

        password:
          passwordForm.newPassword,

        role: profileUser.role,
      };

      const updatedUsers = users.map(
        (user) =>
          String(user.id) ===
          String(profileUser.id)
            ? updatedUser
            : user
      );

      localStorage.setItem(
        "cars_users",
        JSON.stringify(updatedUsers)
      );

      // =================================================
      // UPDATE CURRENT USER
      // =================================================

      if (
        String(profileUser.id) ===
        String(currentUser.id)
      ) {
        updateCurrentUser(updatedUser);
      }

      setProfileUser(updatedUser);

      // =================================================
      // CLEAR PASSWORD FORM
      // =================================================

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});

      window.dispatchEvent(
        new Event("storage")
      );

      toast.success(
        isEditingOtherUser
          ? "User password changed successfully."
          : "Your password has been changed successfully."
      );
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      toast.error(
        "Unable to change password."
      );
    }
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const initials = form.name
    ? form.name
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // =====================================================
  // NO USER
  // =====================================================

  if (!currentUser || !profileUser) {
    return null;
  }

  // =====================================================
  // TITLE
  // =====================================================

  const pageTitle = isEditingOtherUser
    ? "Edit User Profile"
    : "My Profile";

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-2xl space-y-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              {pageTitle}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {isEditingOtherUser
                ? "Manage this user's account information."
                : "Manage your account information and password."}
            </p>

          </div>

          <Button
            variant="ghost"
            onClick={() =>
              navigate(
                isEditingOtherUser
                  ? "/users"
                  : "/dashboard"
              )
            }
            className="gap-2"
          >

            <ArrowLeft className="h-4 w-4" />

            Back

          </Button>

        </div>

        {/* =================================================
            SINGLE PROFILE CARD
        ================================================= */}

        <Card>

          {/* =================================================
              CARD HEADER
          ================================================= */}

          <CardHeader className="border-b">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-sm">
                {initials}
              </div>

              {/* USER INFO */}

              <div>

                <CardTitle>
                  {profileUser.name || "User"}
                </CardTitle>

                <CardDescription>
                  @{profileUser.username}
                </CardDescription>

              </div>

              {/* ROLE */}

              <Badge
                className="ml-auto"
                variant={
                  profileUser.role ===
                  "Admin"
                    ? "default"
                    : "secondary"
                }
              >
                {profileUser.role}
              </Badge>

            </div>

          </CardHeader>

          {/* =================================================
              EVERYTHING INSIDE ONE FORM
          ================================================= */}

          <form
            onSubmit={handleProfileSubmit}
          >

            <CardContent className="space-y-8 pt-6">

              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}

              <div>

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">

                    <User className="h-4 w-4 text-primary" />

                  </div>

                  <div>

                    <h2 className="text-base font-semibold">
                      Profile Information
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Update the user's basic account information.
                    </p>

                  </div>

                </div>

                <div className="space-y-5">

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
                        placeholder="Enter full name"
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

                    <div className="relative">

                      <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                      <Input
                        id="username"
                        name="username"
                        value={
                          form.username
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter username"
                        className="pl-9"
                      />

                    </div>

                    {errors.username && (
                      <p className="text-xs text-destructive">
                        {
                          errors.username
                        }
                      </p>
                    )}

                  </div>

                  {/* ROLE */}

                  {isAdmin &&
                  isEditingOtherUser ? (

                    <div className="space-y-2">

                      <Label htmlFor="role">
                        Account Role
                      </Label>

                      <select
                        id="role"
                        value={
                          selectedRole
                        }
                        onChange={(e) =>
                          setSelectedRole(
                            e.target.value
                          )
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >

                        <option value="Admin">
                          Admin
                        </option>

                        <option value="Reception">
                          Reception
                        </option>

                      </select>

                      <p className="text-xs text-muted-foreground">
                        Only an Admin can change a user's role.
                      </p>

                    </div>

                  ) : (

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
                          {
                            profileUser.role
                          }
                        </Badge>

                      </div>

                    </div>

                  )}

                </div>

              </div>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="border-t" />

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">

                    <KeyRound className="h-4 w-4 text-primary" />

                  </div>

                  <div>

                    <h2 className="text-base font-semibold">
                      Password
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      {isEditingOtherUser
                        ? "Set a new password for this user."
                        : "Change your account password."}
                    </p>

                  </div>

                </div>

                <div className="space-y-5">

                  {/* CURRENT PASSWORD */}

                  {!isEditingOtherUser && (

                    <div className="space-y-2">

                      <Label htmlFor="currentPassword">
                        Current Password
                      </Label>

                      <div className="relative">

                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Enter current password"
                          className="pl-9"
                        />

                      </div>

                      {passwordErrors.currentPassword && (
                        <p className="text-xs text-destructive">
                          {
                            passwordErrors.currentPassword
                          }
                        </p>
                      )}

                    </div>

                  )}

                  {/* NEW PASSWORD */}

                  <div className="space-y-2">

                    <Label htmlFor="newPassword">
                      New Password
                    </Label>

                    <div className="relative">

                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={
                          passwordForm.newPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Enter new password"
                        className="pl-9"
                      />

                    </div>

                    {passwordErrors.newPassword && (
                      <p className="text-xs text-destructive">
                        {
                          passwordErrors.newPassword
                        }
                      </p>
                    )}

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div className="space-y-2">

                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>

                    <div className="relative">

                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={
                          passwordForm.confirmPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Confirm new password"
                        className="pl-9"
                      />

                    </div>

                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-destructive">
                        {
                          passwordErrors.confirmPassword
                        }
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </CardContent>

            {/* =================================================
                FOOTER
            ================================================= */}

            <CardFooter className="flex justify-end gap-3 border-t p-4">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    isEditingOtherUser
                      ? "/users"
                      : "/dashboard"
                  )
                }
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