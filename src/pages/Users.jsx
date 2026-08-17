// src/pages/Users.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { Users as UsersIcon, PlusCircle, Trash2 } from "lucide-react";

const defaultUsers = [
  { id: 1, name: "System Admin", username: "admin",     password: "admin123", role: "Admin",     status: "Active" },
  { id: 2, name: "Front Desk",   username: "reception", password: "rec123",   role: "Reception", status: "Active" },
];

export default function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "Reception" });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cars_users"));
    setUsers(saved?.length ? saved : defaultUsers);
  }, []);

  const persist = (updated) => {
    setUsers(updated);
    localStorage.setItem("cars_users", JSON.stringify(updated));
  };

  /* ── Delete ── */
  const handleDeleteClick = (id) => {
    // Prevent deleting yourself
    if (users.find((u) => u.id === id)?.username === currentUser?.username) {
      toast.error("You cannot delete your own account.");
      return;
    }
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    const updated = users.filter((u) => u.id !== confirmDeleteId);
    persist(updated);
    setConfirmDeleteId(null);
    toast.success("User deleted successfully.");
  };

  /* ── Add User ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = "Name is required.";
    if (!form.username.trim()) errs.username = "Username is required.";
    if (!form.password.trim()) errs.password = "Password is required.";
    if (users.some((u) => u.username === form.username.trim()))
      errs.username = "Username already exists.";
    return errs;
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const newUser = { id: Date.now(), ...form, status: "Active" };
    persist([...users, newUser]);
    setForm({ name: "", username: "", password: "", role: "Reception" });
    setShowForm(false);
    setErrors({});
    toast.success(`User "${form.name}" added successfully!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
            <p className="text-sm text-muted-foreground">Manage operator accounts and permissions.</p>
          </div>
          <Button onClick={() => setShowForm((p) => !p)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {showForm ? "Cancel" : "Add User"}
          </Button>
        </div>

        {/* Add User Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New User</CardTitle>
              <CardDescription>Fill in the details to create a new account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Abebe Kebede"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="e.g. abebe.k"
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  />
                  {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Set a password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  />
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Reception">Reception</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-primary" />
              <span>Operator Accounts</span>
            </CardTitle>
            <CardDescription>{users.length} accounts registered</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{user.username}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {confirmDeleteId === user.id ? (
                        /* Inline confirmation */
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground">Are you sure?</span>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs px-2"
                            onClick={handleConfirmDelete}
                          >
                            Yes, Delete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-2"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(user.id)}
                          disabled={user.username === currentUser?.username}
                          title={user.username === currentUser?.username ? "Cannot delete your own account" : "Delete user"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}