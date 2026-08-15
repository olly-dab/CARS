// src/pages/AssetDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Laptop, Calendar, AlertCircle } from "lucide-react";

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    const savedAssets = JSON.parse(localStorage.getItem("cars_assets")) || [];
    const found = savedAssets.find(
      (item) => String(item.id) === String(id) || item.assetId === id
    );
    setAsset(found);
  }, [id]);

  if (!asset) {
    return (
      <DashboardLayout>
        <Card className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h2 className="text-lg font-bold text-foreground">Asset Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">The requested asset record does not exist.</p>
          <Button onClick={() => navigate("/assets")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Assets</span>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{asset.brand}</h1>
              <Badge variant={asset.status === "Checked Out" ? "warning" : "success"}>
                {asset.status || "Available"}
              </Badge>
            </div>
            <p className="text-sm font-mono text-primary font-semibold mt-0.5">Asset ID: {asset.assetId}</p>
          </div>

          <Button variant="ghost" onClick={() => navigate("/assets")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assets</span>
          </Button>
        </div>

        {/* Hardware Specs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b">
            <Laptop className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-base">Hardware Details</CardTitle>
              <CardDescription>Verified inventory item</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Asset ID</span>
                <p className="font-bold text-foreground font-mono">{asset.assetId}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Asset Type</span>
                <p className="font-semibold text-foreground">{asset.assetType || "Equipment"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Brand</span>
                <p className="font-semibold text-foreground">{asset.brand || "-"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Serial Number</span>
                <p className="font-semibold text-foreground font-mono text-xs">{asset.serialNumber || "-"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Status</span>
                <p className="font-semibold text-foreground">{asset.status || "Available"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Registration Date</span>
                <p className="font-semibold text-foreground">
                  {asset.registeredDate ? new Date(asset.registeredDate).toLocaleDateString() : "Recent"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}