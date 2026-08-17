// src/pages/AssetDetails.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  Laptop,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Hash,
  Barcode,
  Tag,
} from "lucide-react";

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);

  useEffect(() => {
    const savedAssets =
      JSON.parse(localStorage.getItem("cars_assets")) || [];

    const found = savedAssets.find(
      (item) =>
        String(item.id) === String(id) ||
        item.assetId === id
    );

    setAsset(found);
  }, [id]);

  // ======================================================
  // ASSET NOT FOUND
  // ======================================================

  if (!asset) {
    return (
      <DashboardLayout>
        <Card className="max-w-md mx-auto text-center p-8">

          <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />

          <h2 className="text-lg font-bold text-foreground">
            Asset Not Found
          </h2>

          <p className="text-sm text-muted-foreground mt-1 mb-4">
            The requested asset record does not exist.
          </p>

          <Button
            onClick={() => navigate("/assets")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Assets
          </Button>

        </Card>
      </DashboardLayout>
    );
  }

  // ======================================================
  // STATUS
  // ======================================================

  const status =
    asset.status || "Available";

  const statusVariant =
    status === "Checked Out"
      ? "warning"
      : status === "Maintenance"
      ? "secondary"
      : "success";

  // ======================================================
  // REGISTRATION DATE & TIME
  // ======================================================

  const registrationDate = asset.registeredDate
    ? new Date(asset.registeredDate).toLocaleString()
    : "-";

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold tracking-tight">
                {asset.brand || "Asset"}
              </h1>

              <Badge variant={statusVariant}>
                {status}
              </Badge>

            </div>

            <p className="text-sm font-mono text-primary font-semibold mt-1">
              Asset ID: {asset.assetId}
            </p>

          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/assets")}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assets
          </Button>

        </div>


        {/* =================================================
            CUSTOMER INFORMATION
        ================================================= */}

        <Card>

          <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b">

            <User className="h-4 w-4 text-primary" />

            <div>

              <CardTitle className="text-base">
                Customer Information
              </CardTitle>

              <CardDescription>
                Customer associated with this asset
              </CardDescription>

            </div>

          </CardHeader>

          <CardContent className="pt-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* CUSTOMER NAME */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Customer Name
                </span>

                <div className="flex items-center gap-2 mt-1">

                  <User className="h-4 w-4 text-muted-foreground" />

                  <p className="font-semibold text-foreground">
                    {asset.customerName || "-"}
                  </p>

                </div>

              </div>


              {/* PHONE NUMBER */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Phone Number
                </span>

                <div className="flex items-center gap-2 mt-1">

                  <Phone className="h-4 w-4 text-muted-foreground" />

                  <p className="font-semibold text-foreground">
                    {asset.phoneNumber || "-"}
                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>


        {/* =================================================
            HARDWARE DETAILS
        ================================================= */}

        <Card>

          <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b">

            <Laptop className="h-4 w-4 text-primary" />

            <div>

              <CardTitle className="text-base">
                Hardware Details
              </CardTitle>

              <CardDescription>
                Registered asset information
              </CardDescription>

            </div>

          </CardHeader>


          <CardContent className="pt-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* ASSET ID */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Asset ID
                </span>

                <div className="flex items-center gap-2 mt-1">

                  <Hash className="h-4 w-4 text-muted-foreground" />

                  <p className="font-bold text-primary font-mono">
                    {asset.assetId}
                  </p>

                </div>

              </div>


              {/* ASSET MODEL */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Asset Model
                </span>

                <div className="flex items-center gap-2 mt-1">

                  <Tag className="h-4 w-4 text-muted-foreground" />

                  <p className="font-semibold text-foreground">
                    {asset.model || asset.assetModel || "-"}
                  </p>

                </div>

              </div>


              {/* ASSET TYPE */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Asset Type
                </span>

                <p className="font-semibold text-foreground mt-1">
                  {asset.assetType || "Equipment"}
                </p>

              </div>


              {/* BRAND */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Brand
                </span>

                <p className="font-semibold text-foreground mt-1">
                  {asset.brand || "-"}
                </p>

              </div>


              {/* SERIAL NUMBER */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Serial Number
                </span>

                <div className="flex items-center gap-2 mt-1">

                  <Barcode className="h-4 w-4 text-muted-foreground" />

                  <p className="font-semibold text-foreground font-mono text-xs">
                    {asset.serialNumber || "-"}
                  </p>

                </div>

              </div>


              {/* STATUS */}

              <div>

                <span className="text-xs text-muted-foreground block font-medium">
                  Current Status
                </span>

                <div className="mt-1">
                  <Badge variant={statusVariant}>
                    {status}
                  </Badge>
                </div>

              </div>


              {/* REGISTRATION DATE & TIME */}

              <div className="sm:col-span-2">

                <span className="text-xs text-muted-foreground block font-medium">
                  Registration Date & Time
                </span>

                <div className="flex items-center gap-2 mt-1">

                  <Calendar className="h-4 w-4 text-muted-foreground" />

                  <p className="font-semibold text-foreground">
                    {registrationDate}
                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <div className="flex justify-end">

          <Button
            variant="outline"
            onClick={() => navigate("/assets")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assets
          </Button>

        </div>

      </div>

    </DashboardLayout>
  );
}