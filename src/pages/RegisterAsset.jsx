// src/pages/RegisterAsset.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle, RefreshCw, Sparkles } from "lucide-react";

// Helper to generate unique Asset IDs
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
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return `CARS-${prefix}-${randomCode}`;
};

export default function RegisterAsset() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assetType: "",
    assetId: generateAssetId(),
    brand: "",
    serialNumber: "",
    status: "Available",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Automatically update ID prefix when asset type changes
    if (name === "assetType") {
      setFormData((prev) => ({
        ...prev,
        assetType: value,
        assetId: generateAssetId(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegenerateId = () => {
    const newId = generateAssetId(formData.assetType);
    setFormData((prev) => ({ ...prev, assetId: newId }));
    toast.info(`Generated new ID: ${newId}`);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.assetType) newErrors.assetType = "Asset type is required.";
    if (!formData.assetId.trim()) newErrors.assetId = "Asset ID is required.";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required.";
    if (!formData.serialNumber.trim()) newErrors.serialNumber = "Serial number is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const existingAssets = JSON.parse(localStorage.getItem("cars_assets")) || [];
    if (existingAssets.some((a) => a.assetId.toLowerCase() === formData.assetId.toLowerCase())) {
      formData.assetId = generateAssetId(formData.assetType);
    }

    const newAsset = {
      id: Date.now(),
      ...formData,
      registeredDate: new Date().toISOString(),
    };

    localStorage.setItem("cars_assets", JSON.stringify([...existingAssets, newAsset]));
    toast.success(`Asset "${formData.brand}" (${formData.assetId}) registered successfully!`);
    navigate("/assets");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Register Asset</h1>
            <p className="text-sm text-muted-foreground">Add new equipment to the CARS inventory.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/assets")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assets</span>
          </Button>
        </div>

        {/* Simplified Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Asset Information</CardTitle>
              <CardDescription>Primary hardware identification</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Asset Type */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="assetType">Asset Type *</Label>
                <select
                  id="assetType"
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select type...</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop Computer</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Printer">Printer</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Phone">Phone</option>
                  <option value="Other">Other</option>
                </select>
                {errors.assetType && <p className="text-xs text-destructive">{errors.assetType}</p>}
              </div>

              {/* Auto-Generated Asset ID */}
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="assetId">Asset ID (Auto-Generated)</Label>
                  <Badge variant="secondary" className="gap-1 text-[10px] py-0">
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    <span>Auto</span>
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="assetId"
                    name="assetId"
                    value={formData.assetId}
                    readOnly
                    className="font-mono font-bold text-primary bg-muted/30 cursor-not-allowed"
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
                {errors.assetId && <p className="text-xs text-destructive">{errors.assetId}</p>}
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="e.g. Dell / Lenovo / HP"
                  value={formData.brand}
                  onChange={handleChange}
                />
                {errors.brand && <p className="text-xs text-destructive">{errors.brand}</p>}
              </div>

              {/* Serial Number */}
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="e.g. SN-984210"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
                {errors.serialNumber && <p className="text-xs text-destructive">{errors.serialNumber}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-t p-4">
              <Button type="button" variant="outline" onClick={() => navigate("/assets")}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Register Asset</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}