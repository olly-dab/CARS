// src/pages/Users.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { UserPlus, X, ShieldAlert } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "Reception",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("cars_users")) || [];
    setUsers(savedUsers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (users.some((u) => u.username.toLowerCase() === formData.username.toLowerCase())) {
      setError("Username already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      status: "Active",
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("cars_users", JSON.stringify(updated));

    toast.success(`User account "${formData.username}" created successfully!`);
    setFormData({ name: "", username: "", password: "", confirmPassword: "", role: "Reception" });
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
            <p className="text-sm text-muted-foreground">Manage administrative and reception access.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            {showForm ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            <span>{showForm ? "Cancel" : "Add User"}</span>
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Operator Account</CardTitle>
              <CardDescription>Set credentials and permission level</CardDescription>
            </CardHeader>
            {error && (
              <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Assigned Role</Label>
                  <div className="flex gap-6 pt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="Reception"
                        checked={formData.role === "Reception"}
                        onChange={handleChange}
                      />
                      <span>Reception (Staff)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="Admin"
                        checked={formData.role === "Admin"}
                        onChange={handleChange}
                      />
                      <span>Admin (Full Control)</span>
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t p-4">
                <Button type="submit">Create Account</Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Operators</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/20">
                  <TableCell className="font-bold text-foreground">CARS Administrator</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">admin</TableCell>
                  <TableCell>
                    <Badge variant="default">Admin</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium text-foreground">{u.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.username}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "Admin" ? "default" : "secondary"}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{u.status || "Active"}</Badge>
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