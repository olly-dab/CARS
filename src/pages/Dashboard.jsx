// src/pages/Dashboard.jsx
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Laptop,
  ArrowUpRight,
  CheckCircle2,
  PieChart as PieChartIcon,
} from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();

  const assets = JSON.parse(localStorage.getItem("cars_assets")) || [];

  const checkedOutCount = assets.filter((a) => a.status === "Checked Out").length;
  const availableCount = assets.filter((a) => a.status !== "Checked Out").length;

  // 1. Status Chart Data
  const statusData = [
    { name: "Available", value: availableCount || 0, color: "#10b981" }, // Emerald
    { name: "Checked Out", value: checkedOutCount || 0, color: "#f59e0b" }, // Amber
  ];

  // 2. Asset Type Breakdown Data
  const TYPE_COLORS = ["#2563eb", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316", "#64748b"];

  const typeMap = assets.reduce((acc, curr) => {
    const type = curr.assetType || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(typeMap).map((key, index) => ({
    name: key,
    value: typeMap[key],
    color: TYPE_COLORS[index % TYPE_COLORS.length],
  }));

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-lg border bg-background px-3 py-1.5 shadow-md text-xs font-medium">
          <span style={{ color: data.payload.color }} className="font-bold">
            {data.name}
          </span>
          : {data.value} {data.value === 1 ? "unit" : "units"}
        </div>
      );
    }
    return null;
  };

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

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
              <Laptop className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assets.length}</div>
              
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Checked Out</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{checkedOutCount}</div>
              
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Assets</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{availableCount}</div>
        
            </CardContent>
          </Card>
        </div>

        {/* --- PIE CHARTS SECTION --- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 1. Status Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-primary" />
                <span>Asset Availability Status</span>
              </CardTitle>
              <CardDescription>Ratio of available vs. checked out items</CardDescription>
            </CardHeader>
            <CardContent>
              {assets.length > 0 ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">
                  No assets registered to display chart.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Type Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-primary" />
                <span>Category Breakdown</span>
              </CardTitle>
              <CardDescription>Inventory distribution across hardware types</CardDescription>
            </CardHeader>
            <CardContent>
              {typeData.length > 0 ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        labelLine={false}
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">
                  No hardware categories registered yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}