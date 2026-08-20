import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  ArrowLeft,
  PlusCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

// ======================================================
// GENERATE ASSET ID
// ======================================================

const generateAssetId = (type = "") => {
  const typePrefixes = {
    Laptop: "LAP",
    Desktop: "DSK",
    Monitor: "MON",
    Printer: "PRN",
    Tablet: "TAB",
    Phone: "PHN",
    Other: "AST",
  };

  const prefix = typePrefixes[type] || "AST";

  const randomCode = Math.floor(
    1000 + Math.random() * 9000
  );

  return `CARS-${prefix}-${randomCode}`;
};

// ======================================================
// REGISTER ASSET
// ======================================================

export default function RegisterAsset() {
  const navigate = useNavigate();

  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] = useState({
    assetType: "",
    assetId: generateAssetId(),
    brand: "",
    customerName: "",
    phoneNumber: "",
    serialNumber: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Generate a new asset ID when asset type changes
    if (name === "assetType") {
      setFormData((prev) => ({
        ...prev,
        assetType: value,
        assetId: generateAssetId(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // REGENERATE ASSET ID
  // ======================================================

  const handleRegenerateId = () => {
    const newId = generateAssetId(
      formData.assetType
    );

    setFormData((prev) => ({
      ...prev,
      assetId: newId,
    }));

    toast.info(`Generated new ID: ${newId}`);
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validate = () => {
    const newErrors = {};

    if (!formData.assetType) {
      newErrors.assetType =
        "Asset type is required.";
    }

    if (!formData.assetId.trim()) {
      newErrors.assetId =
        "Asset ID is required.";
    }

    if (!formData.brand.trim()) {
      newErrors.brand =
        "Brand is required.";
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName =
        "Customer name is required.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber =
        "Phone number is required.";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber =
        "Serial number is required.";
    }

    return newErrors;
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // --------------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------------

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // --------------------------------------------------
    // GET EXISTING ASSETS
    // --------------------------------------------------

    const existingAssets =
      JSON.parse(
        localStorage.getItem("cars_assets")
      ) || [];

    // --------------------------------------------------
    // CHECK ASSET ID
    // --------------------------------------------------

    let assetId = formData.assetId.trim();

    const assetIdExists = existingAssets.some(
      (asset) =>
        asset.assetId?.toLowerCase() ===
        assetId.toLowerCase()
    );

    if (assetIdExists) {
      assetId = generateAssetId(
        formData.assetType
      );

      // Make absolutely sure regenerated ID is unique
      while (
        existingAssets.some(
          (asset) =>
            asset.assetId?.toLowerCase() ===
            assetId.toLowerCase()
        )
      ) {
        assetId = generateAssetId(
          formData.assetType
        );
      }
    }

    // --------------------------------------------------
    // CHECK SERIAL NUMBER
    // --------------------------------------------------

    const serialExists = existingAssets.some(
      (asset) =>
        asset.serialNumber
          ?.trim()
          .toLowerCase() ===
        formData.serialNumber
          .trim()
          .toLowerCase()
    );

    if (serialExists) {
      setErrors({
        serialNumber:
          "This serial number is already registered.",
      });

      return;
    }

    // ==================================================
    // REGISTRATION DATE & TIME
    // ==================================================

    const registrationDate =
      new Date().toISOString();

    // ==================================================
    // CREATE NEW ASSET
    // ==================================================

    const newAsset = {
      id: Date.now(),

      assetType:
        formData.assetType,

      assetId:
        assetId,

      brand:
        formData.brand.trim(),

      customerName:
        formData.customerName.trim(),

      phoneNumber:
        formData.phoneNumber.trim(),

      serialNumber:
        formData.serialNumber.trim(),

      // New assets always start as Available
      status: "Available",

      // Save exact registration date and time
      registeredDate:
        registrationDate,
    };

    // ==================================================
    // SAVE ASSET
    // ==================================================

    const updatedAssets = [
      ...existingAssets,
      newAsset,
    ];

    localStorage.setItem(
      "cars_assets",
      JSON.stringify(updatedAssets)
    );

    // ==================================================
    // GET EXISTING HISTORY
    // ==================================================

    const existingHistory =
      JSON.parse(
        localStorage.getItem(
          "cars_asset_history"
        )
      ) || [];

    // ==================================================
    // CREATE REGISTRATION HISTORY
    // ==================================================

    const registrationHistory = {
      id: Date.now() + 1,

      assetId:
        newAsset.assetId,

      assetName:
        `${newAsset.brand} (${newAsset.assetType})`,

      action: "Registered",

      status: "Available",

      date:
        registrationDate,

      // Keep customer information in history too
      customerName:
        newAsset.customerName,

      phoneNumber:
        newAsset.phoneNumber,
    };

    // ==================================================
    // SAVE HISTORY
    // ==================================================

    const updatedHistory = [
      ...existingHistory,
      registrationHistory,
    ];

    localStorage.setItem(
      "cars_asset_history",
      JSON.stringify(updatedHistory)
    );

    // ==================================================
    // SUCCESS MESSAGE
    // ==================================================

    toast.success(
      `Asset "${newAsset.assetId}" registered successfully!`
    );

    // ==================================================
    // RETURN TO ASSETS
    // ==================================================

    navigate("/assets");
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Register Asset
            </h1>

           

          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/assets")}
            className="gap-1.5"
          >

            <ArrowLeft className="h-4 w-4" />

            <span>
              Back to Assets
            </span>

          </Button>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          <Card>

            <CardHeader>

              <CardTitle className="text-base">
                Asset Information
              </CardTitle>

              

            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* =================================================
                  ASSET TYPE
              ================================================= */}

              <div className="space-y-2 sm:col-span-2">

                <Label htmlFor="assetType">
                  Asset Type *
                </Label>

                <select
                  id="assetType"
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleChange}
                  className="
                    flex h-9 w-full rounded-md
                    border border-input
                    bg-transparent px-3 py-1
                    text-sm shadow-sm
                    focus-visible:outline-none
                    focus-visible:ring-1
                    focus-visible:ring-ring
                  "
                >

                  <option value="">
                    Select type...
                  </option>

                  <option value="Laptop">
                    Laptop
                  </option>

                  <option value="Tablet">
                    Tablet
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                {errors.assetType && (
                  <p className="text-xs text-destructive">
                    {errors.assetType}
                  </p>
                )}

              </div>

              {/* =================================================
                  ASSET ID
              ================================================= */}

              <div className="space-y-2 sm:col-span-2">

                <div className="flex items-center justify-between">

                  <Label htmlFor="assetId">
                    Asset ID (Auto-Generated)
                  </Label>

                  <Badge
                    variant="secondary"
                    className="gap-1 text-[10px] py-0"
                  >

                    <Sparkles className="h-2.5 w-2.5 text-primary" />

                    <span>
                      Auto
                    </span>

                  </Badge>

                </div>

                <div className="flex gap-2">

                  <Input
                    id="assetId"
                    name="assetId"
                    value={formData.assetId}
                    readOnly
                    className="
                      font-mono font-bold
                      text-primary
                      bg-muted/30
                      cursor-not-allowed
                    "
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRegenerateId}
                    title="Generate new ID"
                    className="shrink-0"
                  >

                    <RefreshCw className="h-4 w-4" />

                  </Button>

                </div>

                {errors.assetId && (
                  <p className="text-xs text-destructive">
                    {errors.assetId}
                  </p>
                )}

              </div>

              {/* =================================================
                  BRAND
              ================================================= */}

              <div className="space-y-2">

                <Label htmlFor="brand">
                  Brand *
                </Label>

                <Input
                  id="brand"
                  name="brand"
                  placeholder="Enter asset brand"
                  value={formData.brand}
                  onChange={handleChange}
                />

                {errors.brand && (
                  <p className="text-xs text-destructive">
                    {errors.brand}
                  </p>
                )}

              </div>

              {/* =================================================
                  SERIAL NUMBER
              ================================================= */}

              <div className="space-y-2">

                <Label htmlFor="serialNumber">
                  Serial Number *
                </Label>

                <Input
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="Enter asset serial number"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />

                {errors.serialNumber && (
                  <p className="text-xs text-destructive">
                    {errors.serialNumber}
                  </p>
                )}

              </div>

              {/* =================================================
                  CUSTOMER NAME
              ================================================= */}

              <div className="space-y-2">

                <Label htmlFor="customerName">
                  Customer Name *
                </Label>

                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={handleChange}
                />

                {errors.customerName && (
                  <p className="text-xs text-destructive">
                    {errors.customerName}
                  </p>
                )}

              </div>

              {/* =================================================
                  PHONE NUMBER
              ================================================= */}

              {/* =================================================
    PHONE NUMBER
================================================= */}

<div className="space-y-2">

  <Label htmlFor="phoneNumber">
    Phone Number *
  </Label>

  <Input
    id="phoneNumber"
    name="phoneNumber"
    type="tel"
    placeholder="Enter customer phone number"
    value={formData.phoneNumber}
    onChange={(e) => {
      let value = e.target.value;

      // Always keep +251 at the beginning
      if (!value.startsWith("+251")) {
        value = "+251 ";
      }

      // Only allow numbers after +251
      const numberPart = value
        .replace("+251", "")
        .replace(/\D/g, "");

      // Maximum 9 digits after +251
      const limitedNumber = numberPart.slice(0, 9);

      setFormData((prev) => ({
        ...prev,
        phoneNumber: `+251 ${limitedNumber}`,
      }));

      if (errors.phoneNumber) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "",
        }));
      }
    }}
    className="font-mono"
  />

  {errors.phoneNumber && (
    <p className="text-xs text-destructive">
      {errors.phoneNumber}
    </p>
  )}

</div>

              {/* =================================================
                  INITIAL STATUS
              ================================================= */}

              
            </CardContent>

            {/* =================================================
                FOOTER
            ================================================= */}

            <CardFooter
              className="
                flex justify-end gap-3
                border-t p-4
              "
            >

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/assets")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="gap-2"
              >

                <PlusCircle className="h-4 w-4" />

                <span>
                  Register 
                </span>

              </Button>

            </CardFooter>

          </Card>

        </form>

      </div>

    </DashboardLayout>
  );
}