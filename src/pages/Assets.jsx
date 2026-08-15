// src/pages/Assets.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, Search, Boxes } from "lucide-react";

export default function Assets() {
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAssets(JSON.parse(localStorage.getItem("cars_assets")) || []);
  }, []);

  const filtered = assets.filter(
    (item) =>
      item.assetId?.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.toLowerCase().includes(search.toLowerCase()) ||
      item.assetType?.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-sm text-muted-foreground">Monitor and manage registered hardware equipment.</p>
          </div>

          {/* Reception Only: Register Asset */}
          {currentUser?.role === "Reception" && (
            <Button onClick={() => navigate("/assets/register")} className="gap-2 self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              <span>Register Asset</span>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Inventory Registry</CardTitle>
              <CardDescription>Total of {assets.length} items logged</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ID, brand, type..."
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
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <TableRow key={item.id || item.assetId}>
                      <TableCell className="font-bold text-primary font-mono">{item.assetId}</TableCell>
                      <TableCell className="font-medium text-foreground">{item.assetType || "Equipment"}</TableCell>
                      <TableCell className="text-foreground">{item.brand}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {item.serialNumber || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Checked Out" ? "warning" : "success"}>
                          {item.status || "Available"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Boxes className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-semibold text-foreground">No assets found</p>
                      <p className="text-xs text-muted-foreground mt-1">Register an asset to see it listed here.</p>
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