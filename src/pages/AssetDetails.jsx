// src/pages/AssetDetails.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  ArrowLeft,
  Laptop,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Hash,
  Barcode,
  Pencil,
  Save,
  X,
} from "lucide-react";

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [asset, setAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    assetType: "",
    brand: "",
    serialNumber: "",
    customerName: "",
    customerId: "",
    phoneNumber: "",
  });

  // =====================================================
  // LOAD ASSET
  // =====================================================

  useEffect(() => {
    try {
      const savedAssets =
        JSON.parse(localStorage.getItem("cars_assets")) || [];

      const foundAsset = savedAssets.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.assetId) === String(id)
      );

      if (!foundAsset) {
        setAsset(null);
        return;
      }

      setAsset(foundAsset);

      setFormData({
        assetType: foundAsset.assetType || "",
        brand: foundAsset.brand || "",
        serialNumber: foundAsset.serialNumber || "",
        customerName: foundAsset.customerName || "",
        customerId: foundAsset.customerId || "",
        phoneNumber: foundAsset.phoneNumber || "",
      });
    } catch (error) {
      console.error("Unable to load asset:", error);
      setAsset(null);
    }
  }, [id]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // START EDITING
  // =====================================================

  const handleEdit = () => {
    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancel = () => {
    if (!asset) return;

    setFormData({
      assetType: asset.assetType || "",
      brand: asset.brand || "",
      serialNumber: asset.serialNumber || "",
      customerName: asset.customerName || "",
      customerId: asset.customerId || "",
      phoneNumber: asset.phoneNumber || "",
    });

    setIsEditing(false);
  };

  // =====================================================
  // SAVE ASSET
  // =====================================================

  const handleSave = () => {
    try {
      const savedAssets =
        JSON.parse(localStorage.getItem("cars_assets")) || [];

      const updatedAssets = savedAssets.map((item) => {
        const isSameAsset = asset?.id
          ? String(item.id) === String(asset.id)
          : String(item.assetId) === String(id);

        if (!isSameAsset) {
          return item;
        }

        return {
          ...item,

          // Keep original unique identifiers
          id: item.id,
          assetId: item.assetId,

          // Update editable information
          assetType: formData.assetType.trim(),
          brand: formData.brand.trim(),
          serialNumber: formData.serialNumber.trim(),
          customerName: formData.customerName.trim(),
          customerId: formData.customerId.trim(),
          phoneNumber: formData.phoneNumber.trim(),

          // Keep existing status
          status: item.status || "Available",

          // Keep original registration date
          registeredDate: item.registeredDate,
        };
      });

      localStorage.setItem(
        "cars_assets",
        JSON.stringify(updatedAssets)
      );

      // Find the updated asset using the original ID
      const updatedAsset = updatedAssets.find((item) =>
        asset?.id
          ? String(item.id) === String(asset.id)
          : String(item.assetId) === String(id)
      );

      if (!updatedAsset) {
        alert("Unable to find the updated asset.");
        return;
      }

      setAsset(updatedAsset);

      setFormData({
        assetType: updatedAsset.assetType || "",
        brand: updatedAsset.brand || "",
        serialNumber: updatedAsset.serialNumber || "",
        customerName: updatedAsset.customerName || "",
        customerId: updatedAsset.customerId || "",
        phoneNumber: updatedAsset.phoneNumber || "",
      });

      setIsEditing(false);

      // Notify other components/pages
      window.dispatchEvent(new Event("storage"));

      alert("Asset updated successfully.");
    } catch (error) {
      console.error("Unable to save asset:", error);
      alert("Unable to save asset changes.");
    }
  };

  // =====================================================
  // ASSET NOT FOUND
  // =====================================================

  if (!asset) {
    return (
      <DashboardLayout>
        <Card className="mx-auto max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h2 className="text-lg font-bold">
            Asset Not Found
          </h2>

          <p className="mt-1 mb-4 text-sm text-muted-foreground">
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

  // =====================================================
  // STATUS
  // =====================================================

  const status = asset.status || "Available";

  const statusVariant =
    status === "Checked Out"
      ? "warning"
      : "success";

  // =====================================================
  // REGISTRATION DATE
  // =====================================================

  const registrationDate = asset.registeredDate
    ? new Date(asset.registeredDate).toLocaleString()
    : "-";

  // =====================================================
  // PERMISSION
  // Reception and Admin can edit
  // =====================================================

  const canEdit =
    currentUser?.role === "Reception" ||
    currentUser?.role === "Admin";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold tracking-tight">
                {asset.brand || "Asset"}
              </h1>

              <Badge variant={statusVariant}>
                {status}
              </Badge>

            </div>

            <p className="mt-1 font-mono text-sm font-semibold text-primary">
              Asset ID: {asset.assetId}
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* EDIT BUTTON */}

            {!isEditing && canEdit && (
              <Button
                onClick={handleEdit}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Asset
              </Button>
            )}

            {/* BACK BUTTON */}

            <Button
              variant="ghost"
              onClick={() => navigate("/assets")}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

          </div>
        </div>

        {/* =================================================
            EDIT MODE
        ================================================= */}

        {isEditing ? (
          <Card>

            <CardHeader className="border-b">
              <CardTitle className="text-base">
                Edit Asset
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5">

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* ASSET ID - READ ONLY */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Asset ID
                  </label>

                  <Input
                    value={asset.assetId || ""}
                    disabled
                    className="bg-muted"
                  />

                  <p className="mt-1 text-xs text-muted-foreground">
                    Asset ID cannot be changed.
                  </p>
                </div>

                {/* ASSET TYPE */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Asset Type
                  </label>

                  <Input
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                  />
                </div>

                {/* BRAND */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Brand
                  </label>

                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>

                {/* SERIAL NUMBER */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Serial Number
                  </label>

                  <Input
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* CUSTOMER NAME */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Customer Name
                  </label>

                  <Input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                  />
                </div>

                {/* CUSTOMER ID */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Customer ID
                  </label>

                  <Input
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                  />
                </div>

                {/* PHONE NUMBER */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Phone Number
                  </label>

                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* STATUS - READ ONLY */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Current Status
                  </label>

                  <div className="flex h-10 items-center">
                    <Badge variant={statusVariant}>
                      {status}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Status is managed by Check-Out and Check-In.
                  </p>
                </div>

              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-6 flex justify-end gap-2 border-t pt-5">

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>

              </div>

            </CardContent>
          </Card>

        ) : (
          <>
            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <Card>

              <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">

                <User className="h-4 w-4 text-primary" />

                <CardTitle className="text-base">
                  Customer Information
                </CardTitle>

              </CardHeader>

              <CardContent className="pt-5">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* CUSTOMER NAME */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Customer Name
                    </span>

                    <div className="mt-1 flex items-center gap-2">

                      <User className="h-4 w-4 text-muted-foreground" />

                      <p className="font-semibold">
                        {asset.customerName || "-"}
                      </p>

                    </div>
                  </div>

                  {/* PHONE NUMBER */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Phone Number
                    </span>

                    <div className="mt-1 flex items-center gap-2">

                      <Phone className="h-4 w-4 text-muted-foreground" />

                      <p className="font-semibold">
                        {asset.phoneNumber || "-"}
                      </p>

                    </div>
                  </div>

                  {/* CUSTOMER ID */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Customer ID
                    </span>

                    <div className="mt-1 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />

                      <p className="font-semibold">
                        {asset.customerId || "-"}
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

              <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">

                <Laptop className="h-4 w-4 text-primary" />

                <CardTitle className="text-base">
                  Hardware Details
                </CardTitle>

              </CardHeader>

              <CardContent className="pt-5">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* ASSET ID */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Asset ID
                    </span>

                    <div className="mt-1 flex items-center gap-2">

                      <Hash className="h-4 w-4 text-muted-foreground" />

                      <p className="font-mono font-bold text-primary">
                        {asset.assetId || "-"}
                      </p>

                    </div>
                  </div>

                  {/* ASSET TYPE */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Asset Type
                    </span>

                    <p className="mt-1 font-semibold">
                      {asset.assetType || "Equipment"}
                    </p>
                  </div>

                  {/* BRAND */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Brand
                    </span>

                    <p className="mt-1 font-semibold">
                      {asset.brand || "-"}
                    </p>
                  </div>

                  {/* SERIAL NUMBER */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Serial Number
                    </span>

                    <div className="mt-1 flex items-center gap-2">

                      <Barcode className="h-4 w-4 text-muted-foreground" />

                      <p className="font-mono text-xs font-semibold">
                        {asset.serialNumber || "-"}
                      </p>

                    </div>
                  </div>

                  {/* STATUS */}

                  <div>
                    <span className="block text-xs font-medium text-muted-foreground">
                      Current Status
                    </span>

                    <div className="mt-1">
                      <Badge variant={statusVariant}>
                        {status}
                      </Badge>
                    </div>
                  </div>

                  {/* REGISTRATION DATE */}

                  <div className="sm:col-span-2">

                    <span className="block text-xs font-medium text-muted-foreground">
                      Registration Date & Time
                    </span>

                    <div className="mt-1 flex items-center gap-2">

                      <Calendar className="h-4 w-4 text-muted-foreground" />

                      <p className="font-semibold">
                        {registrationDate}
                      </p>

                    </div>

                  </div>

                </div>

              </CardContent>
            </Card>

            {/* =================================================
                BOTTOM ACTION
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
          </>
        )}

      </div>
    </DashboardLayout>
  );
}