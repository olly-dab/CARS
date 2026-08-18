// src/pages/Dashboard.jsx

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  Laptop,
  ArrowUpRight,
  CheckCircle2,
  PieChart as PieChartIcon,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // LOAD ASSETS
  // =====================================================

  const assets =
    JSON.parse(localStorage.getItem("cars_assets")) || [];

  // =====================================================
  // ASSET COUNTS
  // =====================================================

  const checkedOutCount = assets.filter(
    (asset) => asset.status === "Checked Out"
  ).length;

  const availableCount = assets.filter(
    (asset) => asset.status === "Available"
  ).length;

  // =====================================================
  // STATUS CHART DATA
  // =====================================================

  const statusData = [
    {
      name: "Available",
      value: availableCount,
      color: "#10b981",
    },
    {
      name: "Checked Out",
      value: checkedOutCount,
      color: "#f59e0b",
    },
  ];

  // =====================================================
  // ASSET TYPE BREAKDOWN
  // =====================================================

  const TYPE_COLORS = [
    "#2563eb",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#f97316",
    "#64748b",
  ];

  const typeMap = assets.reduce((acc, asset) => {
    const type = asset.assetType || "Other";

    acc[type] = (acc[type] || 0) + 1;

    return acc;
  }, {});

  const typeData = Object.keys(typeMap).map(
    (key, index) => ({
      name: key,
      value: typeMap[key],
      color:
        TYPE_COLORS[index % TYPE_COLORS.length],
    })
  );

  // =====================================================
  // CUSTOM TOOLTIP
  // =====================================================

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];

      return (
        <div className="rounded-lg border bg-background px-3 py-1.5 shadow-md text-xs font-medium">
          <span
            style={{
              color: data.payload.color,
            }}
            className="font-bold"
          >
            {data.name}
          </span>

          {" : "}
          {data.value}{" "}
          {data.value === 1 ? "unit" : "units"}
        </div>
      );
    }

    return null;
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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Overview of customer assets and their current status.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="self-start sm:self-auto"
          >
            {currentUser?.role || "Reception"} Access
          </Badge>

        </div>

        {/* =================================================
            TOP METRIC CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* =================================================
              TOTAL ASSETS
          ================================================= */}

          <Card
            onClick={() => navigate("/assets")}
            className="
              cursor-pointer
              transition-all
              duration-200
              hover:shadow-md
              hover:-translate-y-0.5
              hover:border-primary/40
            "
          >

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assets
              </CardTitle>

              <Laptop className="h-4 w-4 text-primary" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold">
                {assets.length}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                View all registered assets
              </p>

            </CardContent>

          </Card>


          {/* =================================================
              CHECKED OUT
          ================================================= */}

          <Card
            onClick={() =>
              navigate("/assets?status=Checked%20Out")
            }
            className="
              cursor-pointer
              transition-all
              duration-200
              hover:shadow-md
              hover:-translate-y-0.5
              hover:border-amber-500/40
            "
          >

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Checked Out
              </CardTitle>

              <ArrowUpRight className="h-4 w-4 text-amber-600" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold text-amber-600">
                {checkedOutCount}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                View checked-out assets
              </p>

            </CardContent>

          </Card>


          {/* =================================================
              AVAILABLE ASSETS
          ================================================= */}

          <Card
            onClick={() =>
              navigate("/assets?status=Available")
            }
            className="
              cursor-pointer
              transition-all
              duration-200
              hover:shadow-md
              hover:-translate-y-0.5
              hover:border-emerald-500/40
            "
          >

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Assets
              </CardTitle>

              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold text-emerald-600">
                {availableCount}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                View available assets
              </p>

            </CardContent>

          </Card>

        </div>


        {/* =================================================
            PIE CHARTS
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* =================================================
              STATUS CHART
          ================================================= */}

          <Card>

            <CardHeader>

              <CardTitle className="text-base flex items-center gap-2">

                <PieChartIcon className="h-4 w-4 text-primary" />

                <span>
                  Asset Availability Status
                </span>

              </CardTitle>

              <CardDescription>
                Ratio of available vs. checked out items
              </CardDescription>

            </CardHeader>

            <CardContent>

              {assets.length > 0 ? (

                <div className="h-[280px] w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

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

                        {statusData.map(
                          (entry, index) => (
                            <Cell
                              key={`status-cell-${index}`}
                              fill={entry.color}
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        content={
                          <CustomTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />

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


          {/* =================================================
              TYPE BREAKDOWN
          ================================================= */}

          <Card>

            <CardHeader>

              <CardTitle className="text-base flex items-center gap-2">

                <PieChartIcon className="h-4 w-4 text-primary" />

                <span>
                  Category Breakdown
                </span>

              </CardTitle>

              <CardDescription>
                Inventory distribution across hardware types
              </CardDescription>

            </CardHeader>

            <CardContent>

              {typeData.length > 0 ? (

                <div className="h-[280px] w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        labelLine={false}
                      >

                        {typeData.map(
                          (entry, index) => (
                            <Cell
                              key={`type-cell-${index}`}
                              fill={entry.color}
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        content={
                          <CustomTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />

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