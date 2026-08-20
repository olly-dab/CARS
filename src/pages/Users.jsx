// src/pages/Users.jsx

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
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { toast } from "sonner";

import {
  Users as UsersIcon,
  PlusCircle,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
// =====================================================
// DEFAULT USERS
// =====================================================

const defaultUsers = [
  {
    id: 1,
    name: "System Admin",
    username: "admin",
    password: "admin123",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Front Desk",
    username: "reception",
    password: "rec123",
    role: "Reception",
    status: "Active",
  },
];

// =====================================================
// USERS PAGE
// =====================================================

export default function Users() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [users, setUsers] = useState([]);

  const [confirmDeleteId, setConfirmDeleteId] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "Reception",
  });

  const [errors, setErrors] = useState({});

  const [showForm, setShowForm] =
    useState(false);

  // =====================================================
  // CHECK ADMIN
  // =====================================================

  const isAdmin =
    currentUser?.role === "Admin";

  // =====================================================
  // CHECK IF AN ADMIN ALREADY EXISTS
  // =====================================================

  const adminExists = users.some(
    (user) => user.role === "Admin"
  );

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cars_users")
      );

      if (saved?.length) {
        setUsers(saved);
      } else {
        localStorage.setItem(
          "cars_users",
          JSON.stringify(defaultUsers)
        );

        setUsers(defaultUsers);
      }
    } catch (error) {
      console.error(
        "Unable to load users:",
        error
      );

      setUsers(defaultUsers);
    }
  }, []);

  // =====================================================
  // SAVE USERS
  // =====================================================

  const persist = (updatedUsers) => {
    setUsers(updatedUsers);

    localStorage.setItem(
      "cars_users",
      JSON.stringify(updatedUsers)
    );

    // Notify other components
    window.dispatchEvent(
      new Event("storage")
    );
  };

  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEditUser = (userId) => {
    if (!isAdmin) {
      toast.error(
        "Only Admin can edit user profiles."
      );

      return;
    }

    navigate(`/profile/${userId}`);
  };

  // =====================================================
  // DELETE USER - CLICK
  // =====================================================

  const handleDeleteClick = (id) => {
    // ---------------------------------------------
    // ADMIN ONLY
    // ---------------------------------------------

    if (!isAdmin) {
      toast.error(
        "Only Admin can delete users."
      );

      return;
    }

    // ---------------------------------------------
    // FIND USER
    // ---------------------------------------------

    const selectedUser = users.find(
      (user) => user.id === id
    );

    if (!selectedUser) {
      return;
    }

    // ---------------------------------------------
    // PREVENT DELETING YOURSELF
    // ---------------------------------------------

    if (
      String(selectedUser.id) ===
      String(currentUser?.id)
    ) {
      toast.error(
        "You cannot delete your own account."
      );

      return;
    }

    setConfirmDeleteId(id);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const handleConfirmDelete = () => {
    if (!isAdmin) {
      setConfirmDeleteId(null);

      toast.error(
        "Only Admin can delete users."
      );

      return;
    }

    if (confirmDeleteId === null) {
      return;
    }

    const updatedUsers = users.filter(
      (user) =>
        String(user.id) !==
        String(confirmDeleteId)
    );

    persist(updatedUsers);

    setConfirmDeleteId(null);

    toast.success(
      "User deleted successfully."
    );
  };

  // =====================================================
  // VALIDATE NEW USER
  // =====================================================

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Name is required.";
    }

    if (!form.username.trim()) {
      errs.username =
        "Username is required.";
    }

    if (!form.password.trim()) {
      errs.password =
        "Password is required.";
    } else if (
      form.password.trim().length < 4
    ) {
      errs.password =
        "Password must be at least 4 characters.";
    }

    const usernameExists = users.some(
      (user) =>
        user.username
          ?.trim()
          .toLowerCase() ===
        form.username
          .trim()
          .toLowerCase()
    );

    if (usernameExists) {
      errs.username =
        "Username already exists.";
    }

    // =================================================
    // ONLY ONE ADMIN
    // =================================================

    if (
      form.role === "Admin" &&
      adminExists
    ) {
      errs.role =
        "Only one Admin account is allowed.";
    }

    return errs;
  };

  // =====================================================
  // ADD USER
  // =====================================================

  const handleAddUser = (e) => {
    e.preventDefault();

    // ---------------------------------------------
    // ADMIN ONLY
    // ---------------------------------------------

    if (!isAdmin) {
      toast.error(
        "Only Admin can add users."
      );

      return;
    }

    // ---------------------------------------------
    // EXTRA ADMIN SAFETY CHECK
    // ---------------------------------------------

    if (
      form.role === "Admin" &&
      adminExists
    ) {
      setErrors({
        role:
          "Only one Admin account is allowed.",
      });

      toast.error(
        "Only one Admin account is allowed."
      );

      return;
    }

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    // ---------------------------------------------
    // CREATE USER
    // ---------------------------------------------

    const newUser = {
      id: Date.now(),

      name: form.name.trim(),

      username: form.username.trim(),

      password: form.password,

      role: form.role,

      status: "Active",
    };

    // ---------------------------------------------
    // SAVE USER
    // ---------------------------------------------

    persist([
      ...users,
      newUser,
    ]);

    // ---------------------------------------------
    // RESET FORM
    // ---------------------------------------------

    const createdName = form.name;

    setForm({
      name: "",
      username: "",
      password: "",
      role: "Reception",
    });

    setShowForm(false);

    setErrors({});

    toast.success(
      `User "${createdName}" added successfully!`
    );
  };

  // =====================================================
  // CANCEL ADD FORM
  // =====================================================

  const handleCancelForm = () => {
    setShowForm(false);

    setForm({
      name: "",
      username: "",
      password: "",
      role: "Reception",
    });

    setErrors({});
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          {/* ADD USER - ADMIN ONLY */}

          <div className="flex items-center justify-end w-full">
  {isAdmin && (
    <Button
      onClick={() =>
        setShowForm((previous) => !previous)
      }
      className="gap-2"
    >
      <PlusCircle className="h-4 w-4" />

      {showForm ? "Cancel" : "Add User"}
    </Button>
  )}
</div>
        </div>

        {/* =================================================
            ADD USER FORM
        ================================================= */}

        {showForm && isAdmin && (

          <Card>

            <CardHeader>

              <CardTitle className="text-base">
                New User
              </CardTitle>

              <CardDescription>
                Fill in the details to create a new account.
              </CardDescription>

            </CardHeader>

            <CardContent>

              <form
                onSubmit={handleAddUser}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >

                {/* FULL NAME */}

                <div className="space-y-2">

                  <Label htmlFor="name">
                    Full Name *
                  </Label>

                  <Input
                    id="name"
                    placeholder="e.g. Abebe Kebede"
                    value={form.name}
                    onChange={(e) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          name:
                            e.target.value,
                        })
                      )
                    }
                  />

                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* USERNAME */}

                <div className="space-y-2">

                  <Label htmlFor="username">
                    Username *
                  </Label>

                  <Input
                    id="username"
                    placeholder="e.g. abebe.k"
                    value={form.username}
                    onChange={(e) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          username:
                            e.target.value,
                        })
                      )
                    }
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
    Password *
  </Label>

  <div className="relative">

    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Set a password"
      value={form.password}
      onChange={(e) =>
        setForm(
          (previous) => ({
            ...previous,
            password:
              e.target.value,
          })
        )
      }
      className="pr-10"
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          (previous) => !previous
        )
      }
      className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-muted-foreground
        hover:text-foreground
      "
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

  {errors.password && (
    <p className="text-xs text-destructive">
      {errors.password}
    </p>
  )}

</div>

                {/* ROLE */}

                <div className="space-y-2">

                  <Label htmlFor="role">
                    Role *
                  </Label>

                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          role:
                            e.target.value,
                        })
                      )
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >

                    <option value="Reception">
                      Reception
                    </option>

                    {/* =================================================
                        ONLY SHOW ADMIN OPTION IF NO ADMIN EXISTS
                    ================================================= */}

                    {!adminExists && (
                      <option value="Admin">
                        Admin
                      </option>
                    )}

                  </select>

                  {/* ADMIN WARNING */}

                  {adminExists && (
                    <p className="text-xs text-muted-foreground">
                      An Admin account already exists.
                      New users can only be Reception.
                    </p>
                  )}

                  {errors.role && (
                    <p className="text-xs text-destructive">
                      {errors.role}
                    </p>
                  )}

                </div>

                {/* CREATE */}

                <div className="flex justify-end gap-2 sm:col-span-2">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      handleCancelForm
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="gap-2"
                  >

                    <PlusCircle className="h-4 w-4" />

                    Create User

                  </Button>

                </div>

              </form>

            </CardContent>

          </Card>
        )}

        {/* =================================================
            USERS TABLE
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2 text-base">

              <UsersIcon className="h-4 w-4 text-primary" />

              <span>
                Operator Accounts
              </span>

            </CardTitle>

          </CardHeader>

          <CardContent className="p-0">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Name
                  </TableHead>

                  <TableHead>
                    Username
                  </TableHead>

                  <TableHead>
                    Role
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {users.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>

                  </TableRow>

                ) : (

                  users.map((user) => (

                    <TableRow
                      key={user.id}
                    >

                      {/* NAME */}

                      <TableCell className="font-medium text-foreground">

                        {user.name}

                      </TableCell>

                      {/* USERNAME */}

                      <TableCell className="font-mono text-sm text-muted-foreground">

                        {user.username}

                      </TableCell>

                      {/* ROLE */}

                      <TableCell>

                        <Badge
                          variant={
                            user.role ===
                            "Admin"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>

                      </TableCell>

                      {/* STATUS */}

                      <TableCell>

                        <Badge variant="success">
                          {user.status ||
                            "Active"}
                        </Badge>

                      </TableCell>

                      {/* ACTIONS */}

                      <TableCell className="text-right">

                        {confirmDeleteId ===
                        user.id ? (

                          /* =================================
                             DELETE CONFIRMATION
                          ================================= */

                          <div className="flex items-center justify-end gap-2">

                            <span className="text-xs text-muted-foreground">
                              Are you sure?
                            </span>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 px-2 text-xs"
                              onClick={
                                handleConfirmDelete
                              }
                            >
                              Yes, Delete
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs"
                              onClick={() =>
                                setConfirmDeleteId(
                                  null
                                )
                              }
                            >
                              Cancel
                            </Button>

                          </div>

                        ) : (

                          /* =================================
                             NORMAL ACTIONS
                          ================================= */

                          <div className="flex items-center justify-end gap-2">

                            {/* EDIT */}

                            {isAdmin && (

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5"
                                onClick={() =>
                                  handleEditUser(
                                    user.id
                                  )
                                }
                              >

                                <Pencil className="h-3.5 w-3.5" />

                                Edit

                              </Button>

                            )}

                            {/* DELETE */}

                            {isAdmin && (

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                  handleDeleteClick(
                                    user.id
                                  )
                                }
                                disabled={
                                  String(
                                    user.id
                                  ) ===
                                  String(
                                    currentUser?.id
                                  )
                                }
                                title={
                                  String(
                                    user.id
                                  ) ===
                                  String(
                                    currentUser?.id
                                  )
                                    ? "Cannot delete your own account"
                                    : "Delete user"
                                }
                              >

                                <Trash2 className="h-3.5 w-3.5" />

                                Delete

                              </Button>

                            )}

                            {/* RECEPTION VIEW */}

                            {!isAdmin && (
                              <span className="text-xs text-muted-foreground">
                                View only
                              </span>
                            )}

                          </div>

                        )}

                      </TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
}