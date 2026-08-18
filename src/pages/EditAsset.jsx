// src/pages/EditAsset.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./RegisterAsset.css";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EditAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    serialNumber: "",
    assetTag: "",
    description: "",
    location: "",
    condition: "Good",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CHECK RECEPTION ACCESS
  // =====================================================

  useEffect(() => {
    if (
      currentUser &&
      currentUser.role !== "Reception"
    ) {
      navigate("/assets", { replace: true });
    }
  }, [currentUser, navigate]);

  // =====================================================
  // LOAD ASSET
  // =====================================================

  useEffect(() => {
    try {
      const assets =
        JSON.parse(
          localStorage.getItem("cars_assets")
        ) || [];

      const asset = assets.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.assetId) === String(id)
      );

      if (!asset) {
        alert("Asset not found.");
        navigate("/assets", { replace: true });
        return;
      }

      setFormData({
        assetName:
          asset.assetName || "",

        assetType:
          asset.assetType || "",

        serialNumber:
          asset.serialNumber || "",

        assetTag:
          asset.assetTag || "",

        description:
          asset.description || "",

        location:
          asset.location || "",

        condition:
          asset.condition || "Good",
      });

      setLoading(false);
    } catch (error) {
      console.error(
        "Unable to load asset:",
        error
      );

      alert(
        "Unable to load the asset."
      );

      navigate("/assets", {
        replace: true,
      });
    }
  }, [id, navigate]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =====================================================
  // HANDLE SELECT
  // =====================================================

  const handleSelectChange = (
    name,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.assetName.trim()) {
      newErrors.assetName =
        "Asset name is required.";
    }

    if (!formData.assetType) {
      newErrors.assetType =
        "Asset type is required.";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber =
        "Serial number is required.";
    }

    if (!formData.assetTag.trim()) {
      newErrors.assetTag =
        "Asset tag is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location =
        "Location is required.";
    }

    return newErrors;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      const assets =
        JSON.parse(
          localStorage.getItem("cars_assets")
        ) || [];

      const assetIndex = assets.findIndex(
        (item) =>
          String(item.id) === String(id) ||
          String(item.assetId) === String(id)
      );

      if (assetIndex === -1) {
        alert("Asset not found.");
        navigate("/assets");
        return;
      }

      // =================================================
      // CHECK DUPLICATE SERIAL NUMBER
      // =================================================

      const duplicateSerial =
        assets.some(
          (asset, index) =>
            index !== assetIndex &&
            asset.serialNumber
              ?.toLowerCase()
              .trim() ===
              formData.serialNumber
                .toLowerCase()
                .trim()
        );

      if (duplicateSerial) {
        setErrors({
          serialNumber:
            "Another asset already uses this serial number.",
        });

        return;
      }

      // =================================================
      // CHECK DUPLICATE ASSET TAG
      // =================================================

      const duplicateTag =
        assets.some(
          (asset, index) =>
            index !== assetIndex &&
            asset.assetTag
              ?.toLowerCase()
              .trim() ===
              formData.assetTag
                .toLowerCase()
                .trim()
        );

      if (duplicateTag) {
        setErrors({
          assetTag:
            "Another asset already uses this asset tag.",
        });

        return;
      }

      const oldAsset = assets[assetIndex];

      const now =
        new Date().toISOString();

      // =================================================
      // UPDATE ASSET
      // =================================================

      const updatedAsset = {
        ...oldAsset,

        assetName:
          formData.assetName.trim(),

        assetType:
          formData.assetType,

        serialNumber:
          formData.serialNumber.trim(),

        assetTag:
          formData.assetTag.trim(),

        description:
          formData.description.trim(),

        location:
          formData.location.trim(),

        condition:
          formData.condition,

        // IMPORTANT:
        // Keep existing status and customer.
        status:
          oldAsset.status ||
          "Available",

        customerId:
          oldAsset.customerId ??
          null,

        customerName:
          oldAsset.customerName ??
          null,

        updatedDate: now,
      };

      const updatedAssets = [
        ...assets,
      ];

      updatedAssets[
        assetIndex
      ] = updatedAsset;

      localStorage.setItem(
        "cars_assets",
        JSON.stringify(
          updatedAssets
        )
      );

      // =================================================
      // ADD HISTORY RECORD
      // =================================================

      const existingHistory =
        JSON.parse(
          localStorage.getItem(
            "cars_asset_history"
          )
        ) || [];

      const historyRecord = {
        id: `HIS-${Date.now()}`,

        assetId:
          updatedAsset.id ||
          updatedAsset.assetId,

        assetName:
          updatedAsset.assetName,

        customerId:
          updatedAsset.customerId,

        customerName:
          updatedAsset.customerName,

        action: "Asset Updated",

        status:
          updatedAsset.status,

        date: now,

        performedBy:
          currentUser?.name ||
          "Reception",
      };

      localStorage.setItem(
        "cars_asset_history",
        JSON.stringify([
          historyRecord,
          ...existingHistory,
        ])
      );

      alert(
        `Asset ${
          updatedAsset.assetId ||
          updatedAsset.id
        } updated successfully!`
      );

      navigate("/assets");
    } catch (error) {
      console.error(
        "Asset update error:",
        error
      );

      alert(
        "Unable to update the asset. Please try again."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">
            Loading asset...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>
      <div className="register-asset p-6">

        <div className="mx-auto max-w-5xl space-y-6">

          {/* HEADER */}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="text-3xl font-bold tracking-tight">
                Edit Asset
              </h1>

              <p className="mt-1 text-muted-foreground">
                Update the registered asset
                information.
              </p>

            </div>

            <Link to="/assets">

              <Button
                type="button"
                variant="outline"
              >
                ← Back to Assets
              </Button>

            </Link>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <Card>

              <CardHeader>

                <CardTitle>
                  Asset Information
                </CardTitle>

                <CardDescription>
                  Update the basic information
                  about this asset.
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* ASSET NAME */}

                  <div className="space-y-2">

                    <Label htmlFor="assetName">
                      Asset Name{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="assetName"
                      name="assetName"
                      value={
                        formData.assetName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Dell Latitude Laptop"
                    />

                    {errors.assetName && (
                      <p className="text-sm text-red-500">
                        {errors.assetName}
                      </p>
                    )}

                  </div>

                  {/* ASSET TYPE */}

                  <div className="space-y-2">

                    <Label>
                      Asset Type{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </Label>

                    <Select
                      value={
                        formData.assetType
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleSelectChange(
                          "assetType",
                          value
                        )
                      }
                    >

                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>

                      <SelectContent>

                        <SelectItem value="Laptop">
                          Laptop
                        </SelectItem>

                        <SelectItem value="Desktop">
                          Desktop
                        </SelectItem>

                        <SelectItem value="Monitor">
                          Monitor
                        </SelectItem>

                        <SelectItem value="Printer">
                          Printer
                        </SelectItem>

                        <SelectItem value="Mobile Phone">
                          Mobile Phone
                        </SelectItem>

                        <SelectItem value="Tablet">
                          Tablet
                        </SelectItem>

                        <SelectItem value="Network Device">
                          Network Device
                        </SelectItem>

                        <SelectItem value="Other">
                          Other
                        </SelectItem>

                      </SelectContent>

                    </Select>

                    {errors.assetType && (
                      <p className="text-sm text-red-500">
                        {errors.assetType}
                      </p>
                    )}

                  </div>

                  {/* SERIAL NUMBER */}

                  <div className="space-y-2">

                    <Label htmlFor="serialNumber">
                      Serial Number{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="serialNumber"
                      name="serialNumber"
                      value={
                        formData.serialNumber
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter serial number"
                    />

                    {errors.serialNumber && (
                      <p className="text-sm text-red-500">
                        {errors.serialNumber}
                      </p>
                    )}

                  </div>

                  {/* ASSET TAG */}

                  <div className="space-y-2">

                    <Label htmlFor="assetTag">
                      Asset Tag{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="assetTag"
                      name="assetTag"
                      value={
                        formData.assetTag
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. CARS-001"
                    />

                    {errors.assetTag && (
                      <p className="text-sm text-red-500">
                        {errors.assetTag}
                      </p>
                    )}

                  </div>

                  {/* LOCATION */}

                  <div className="space-y-2">

                    <Label htmlFor="location">
                      Location{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="location"
                      name="location"
                      value={
                        formData.location
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Main Office"
                    />

                    {errors.location && (
                      <p className="text-sm text-red-500">
                        {errors.location}
                      </p>
                    )}

                  </div>

                  {/* CONDITION */}

                  <div className="space-y-2">

                    <Label>
                      Condition
                    </Label>

                    <Select
                      value={
                        formData.condition
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleSelectChange(
                          "condition",
                          value
                        )
                      }
                    >

                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>

                        <SelectItem value="New">
                          New
                        </SelectItem>

                        <SelectItem value="Good">
                          Good
                        </SelectItem>

                        <SelectItem value="Fair">
                          Fair
                        </SelectItem>

                        <SelectItem value="Damaged">
                          Damaged
                        </SelectItem>

                      </SelectContent>

                    </Select>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="space-y-2 md:col-span-2">

                    <Label htmlFor="description">
                      Description
                    </Label>

                    <textarea
                      id="description"
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter additional asset information..."
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* CURRENT STATUS */}

            <Card>

              <CardHeader>

                <CardTitle>
                  Current Asset Status
                </CardTitle>

                <CardDescription>
                  Editing the asset does not
                  change its current status.
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="rounded-lg border p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      ✓
                    </div>

                    <div>

                      <p className="font-semibold">
                        {(() => {
                          const assets =
                            JSON.parse(
                              localStorage.getItem(
                                "cars_assets"
                              )
                            ) || [];

                          const asset =
                            assets.find(
                              (item) =>
                                String(
                                  item.id
                                ) ===
                                  String(id) ||
                                String(
                                  item.assetId
                                ) ===
                                  String(id)
                            );

                          return (
                            asset?.status ||
                            "Available"
                          );
                        })()}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        The current asset status
                        will remain unchanged.
                      </p>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link to="/assets">

                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>

              </Link>

              <Button
                type="submit"
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>

            </div>

          </form>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditAsset;