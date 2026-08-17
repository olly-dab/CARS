// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Laptop, CheckCircle2, ArrowUpRight, Activity } from "lucide-react";

export default function Reports() {
  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setAssets(JSON.parse(localStorage.getItem("cars_assets")) || []);
    setHistory(JSON.parse(localStorage.getItem("cars_asset_history")) || []);
  }, []);

  const availableAssets = assets.filter((a) => a.status !== "Checked Out");
  const checkedOutAssets = assets.filter((a) => a.status === "Checked Out");
  const totalCheckouts = history.filter((i) => i.action === "Check-Out").length;
  const totalCheckins = history.filter((i) => i.action === "Check-In").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive system audit breakdown.</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Assets</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{availableAssets.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Checked Out</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{checkedOutAssets.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Movement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Asset Movement Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4 bg-muted/20">
              <span className="text-3xl font-bold text-amber-600">{totalCheckouts}</span>
              <p className="text-sm font-semibold text-foreground mt-1">Total Check-Outs</p>
              <p className="text-xs text-muted-foreground">Hardware released</p>
            </div>
            <div className="rounded-lg border p-4 bg-muted/20">
              <span className="text-3xl font-bold text-emerald-600">{totalCheckins}</span>
              <p className="text-sm font-semibold text-foreground mt-1">Total Check-Ins</p>
              <p className="text-xs text-muted-foreground">Hardware returned</p>
            </div>
            <div className="rounded-lg border p-4 bg-muted/20">
              <span className="text-3xl font-bold text-primary">{history.length}</span>
              <p className="text-sm font-semibold text-foreground mt-1">Total Transactions</p>
              <p className="text-xs text-muted-foreground">Full activity count</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Status Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Asset Registry Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id || asset.assetId}>
                    <TableCell className="font-bold text-primary font-mono">{asset.assetId}</TableCell>
                    <TableCell className="text-muted-foreground">{asset.assetType || "Equipment"}</TableCell>
                    <TableCell className="font-medium text-foreground">{asset.brand}</TableCell>
                    <TableCell>
                      <Badge variant={asset.status === "Checked Out" ? "warning" : "success"}>
                        {asset.status || "Available"}
                      </Badge>
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