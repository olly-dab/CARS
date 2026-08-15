// src/pages/CheckOut.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, ArrowUpRight, AlertTriangle } from "lucide-react";

export default function CheckOut() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assetId: "",
    customerName: "",
    purpose: "",
    expectedReturnDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.assetId.trim()) newErrors.assetId = "Asset ID is required.";
    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required.";
    if (!formData.purpose) newErrors.purpose = "Purpose is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assets = JSON.parse(localStorage.getItem("cars_assets")) || [];
    const assetIndex = assets.findIndex(
      (a) => a.assetId.toLowerCase() === formData.assetId.toLowerCase()
    );

    if (assetIndex === -1) {
      setErrors({ assetId: "Asset not found in database." });
      return;
    }

    const asset = assets[assetIndex];
    if (asset.status === "Checked Out") {
      setErrors({ assetId: "This asset is already checked out." });
      return;
    }

    const updatedAssets = [...assets];
    updatedAssets[assetIndex] = {
      ...asset,
      status: "Checked Out",
      customerName: formData.customerName,
    };

    const history = JSON.parse(localStorage.getItem("cars_asset_history")) || [];
    const transaction = {
      id: Date.now(),
      assetId: asset.assetId,
      assetName: `${asset.brand || ""} ${asset.model || ""}`.trim() || asset.assetId,
      customerName: formData.customerName,
      action: "Check-Out",
      purpose: formData.purpose,
      expectedReturnDate: formData.expectedReturnDate,
      notes: formData.notes,
      date: new Date().toISOString(),
    };

    localStorage.setItem("cars_assets", JSON.stringify(updatedAssets));
    localStorage.setItem("cars_asset_history", JSON.stringify([transaction, ...history]));

    toast.success(`Asset ${asset.assetId} successfully checked out to ${formData.customerName}!`);
    navigate("/assets");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Check-Out Asset</h1>
            <p className="text-sm text-muted-foreground">Sign off hardware leaving the facility.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/assets")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assets</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction Details</CardTitle>
              <CardDescription>Identify asset and recipient</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset ID *</Label>
                <Input
                  id="assetId"
                  name="assetId"
                  placeholder="e.g. CARS-LAP-001"
                  value={formData.assetId}
                  onChange={handleChange}
                />
                {errors.assetId && <p className="text-xs text-destructive">{errors.assetId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer / Recipient *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Enter full name"
                  value={formData.customerName}
                  onChange={handleChange}
                />
                {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Check-Out *</Label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select purpose...</option>
                  <option value="Business">Business</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Remote Work">Remote Work</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Other">Other</option>
                </select>
                {errors.purpose && <p className="text-xs text-destructive">{errors.purpose}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
                <Input
                  id="expectedReturnDate"
                  name="expectedReturnDate"
                  type="date"
                  value={formData.expectedReturnDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any accessories included (chargers, adapters)..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </CardContent>

            <div className="mx-6 mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 text-xs">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">Check-Out Verification</p>
                <p className="mt-0.5">Ensure asset tag, accessories, and recipient ID match before handover.</p>
              </div>
            </div>

            <CardFooter className="flex justify-end gap-3 border-t p-4">
              <Button type="button" variant="outline" onClick={() => navigate("/assets")}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                <span>Confirm Check-Out</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}