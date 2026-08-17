import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers,  Lock, User, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both your username and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("cars_users")) || [];
    const defaultAdmin = {
      id: "admin-default",
      name: "CARS Administrator",
      username: "admin",
      password: "admin123",
      role: "Admin",
      status: "Active",
    };

    const allUsers = [defaultAdmin, ...users];

    const foundUser = allUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password &&
        u.status === "Active"
    );

    if (!foundUser) {
      setError("Invalid username or password.");
      return;
    }

    login(foundUser);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 rounded-2xl bg-card shadow-2xl border overflow-hidden">
        {/* Left Branding */}
        <div className="flex flex-col justify-between bg-primary p-10 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CARS</h1>
              <p className="text-xs opacity-80">Asset Management</p>
            </div>
          </div>

          <div className="my-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
               Customer Asset Registration.
            </h2>
            <p className="text-sm opacity-90 leading-relaxed">
          Movement logs, and customer management in one system.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs opacity-75">
           
            <span>A-mesob | Lafto Center</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">Sign In</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your operator credentials</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

         
        </div>
      </div>
    </div>
  );
}