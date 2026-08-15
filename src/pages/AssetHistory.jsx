import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ArrowLeft, History, Search } from "lucide-react";

export default function AssetHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("cars_asset_history")) || []);
  }, []);

  const filtered = history.filter(
    (item) =>
      item.assetId?.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.action?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset History</h1>
            <p className="text-sm text-muted-foreground">Audit log of all check-in and check-out events.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/assets")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assets</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Movement Logs ({filtered.length})</CardTitle>
              <CardDescription>Full transaction registry</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Purpose / Notes</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-bold text-primary font-mono">{record.assetId}</TableCell>
                      <TableCell className="font-medium text-foreground">{record.customerName || "Unassigned"}</TableCell>
                      <TableCell>
                        <Badge variant={record.action === "Check-Out" ? "warning" : "success"}>
                          {record.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{record.notes || record.purpose || "-"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {record.date ? new Date(record.date).toLocaleString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <History className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-semibold text-foreground">No records found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}