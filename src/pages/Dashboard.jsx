// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Laptop, ArrowUpRight, CheckCircle2, PlusCircle, ArrowRight, FileBarChart, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const assets = JSON.parse(localStorage.getItem("cars_assets")) || [];
  const history = JSON.parse(localStorage.getItem("cars_asset_history")) || [];

  const checkedOutCount = assets.filter((a) => a.status === "Checked Out").length;
  const availableCount = assets.filter((a) => a.status !== "Checked Out").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto">
            {currentUser?.role || "Reception"} Access
          </Badge>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
              <Laptop className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total registered hardware</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Checked Out</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{checkedOutCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Assets</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{availableCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready for checkout</p>
            </CardContent>
          </Card>
        </div>

       
      </div>
    </DashboardLayout>
  );
}