// src/pages/CheckOut.jsx

import { useState, useRef, useEffect } from "react";
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
  ArrowUpRight,
  Search,
  X,
  Laptop,
  Eye,
} from "lucide-react";

export default function CheckOut() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAsset, setSelectedAsset] =
    useState(null);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [errors, setErrors] = useState({});

  const dropdownRef = useRef(null);

  // ======================================================
  // LOAD ONLY AVAILABLE ASSETS
  // ======================================================

  const loadAvailableAssets = () => {
    const all =
      JSON.parse(
        localStorage.getItem("cars_assets")
      ) || [];

    // ONLY AVAILABLE ASSETS
    const availableAssets = all.filter(
      (asset) =>
        asset.status === "Available"
    );

    setAssets(availableAssets);
  };

  // ======================================================
  // LOAD ASSETS WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    loadAvailableAssets();
  }, []);

  // ======================================================
  // REFRESH AVAILABLE ASSETS WHEN WINDOW GETS FOCUS
  // ======================================================

  useEffect(() => {
    const handleFocus = () => {
      loadAvailableAssets();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  // ======================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ======================================================

  useEffect(() => {
    function handleOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  // ======================================================
  // SEARCH AVAILABLE ASSETS
  //
  // Search by:
  // - Username
  // - Model
  // - Asset ID
  // - Asset Type
  // ======================================================

  const searchValue =
    assetSearch.trim().toLowerCase();

  const suggestions = assets
    .filter((asset) => {
      // USERNAME
      const username = String(
        asset.username ||
          asset.customerUsername ||
          asset.customerName ||
          ""
      ).toLowerCase();

      // MODEL
      const model = String(
        asset.model || ""
      ).toLowerCase();

      // ASSET ID
      const assetId = String(
        asset.assetId || ""
      ).toLowerCase();

      // ASSET TYPE
      const assetType = String(
        asset.assetType || ""
      ).toLowerCase();

      // BRAND IS ALSO INCLUDED FOR CONVENIENCE
      const brand = String(
        asset.brand || ""
      ).toLowerCase();

      // Empty search = show all available assets
      if (!searchValue) {
        return true;
      }

      return (
        username.includes(searchValue) ||
        model.includes(searchValue) ||
        assetId.includes(searchValue) ||
        assetType.includes(searchValue) ||
        brand.includes(searchValue)
      );
    })
    .slice(0, 10);

  // ======================================================
  // SELECT ASSET
  // ======================================================

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);

    setAssetSearch(
      asset.assetId || ""
    );

    setShowDropdown(false);

    if (errors.assetId) {
      setErrors((prev) => ({
        ...prev,
        assetId: "",
      }));
    }
  };

  // ======================================================
  // VIEW ASSET
  //
  // IMPORTANT:
  // fromCheckout = true
  //
  // This tells AssetDetails that it was opened
  // from the Checkout page.
  // ======================================================

  const handleViewAsset = (asset) => {
    navigate(`/assets/${asset.id}`, {
      state: {
        fromCheckout: true,
      },
    });
  };

  // ======================================================
  // CLEAR SELECTED ASSET
  // ======================================================

  const handleClearAsset = () => {
    setSelectedAsset(null);
    setAssetSearch("");
    setShowDropdown(false);
    setErrors({});
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validate = () => {
    const errs = {};

    if (!selectedAsset) {
      errs.assetId =
        "Please select an available asset.";
    }

    return errs;
  };

  // ======================================================
  // CHECK OUT ASSET
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    // ==================================================
    // GET LATEST ASSET DATA
    // ==================================================

    const allAssets =
      JSON.parse(
        localStorage.getItem("cars_assets")
      ) || [];

    // ==================================================
    // FIND SELECTED ASSET
    // ==================================================

    const currentAsset =
      allAssets.find(
        (asset) =>
          asset.id === selectedAsset.id
      );

    // ==================================================
    // SAFETY CHECK
    // ==================================================

    if (!currentAsset) {
      toast.error(
        "Asset could not be found."
      );

      loadAvailableAssets();
      handleClearAsset();

      return;
    }

    // ==================================================
    // MAKE SURE IT IS STILL AVAILABLE
    // ==================================================

    if (
      currentAsset.status !== "Available"
    ) {
      toast.error(
        "This asset is no longer available."
      );

      loadAvailableAssets();
      handleClearAsset();

      return;
    }

    // ==================================================
    // CHECKOUT DATE & TIME
    // ==================================================

    const checkoutDate =
      new Date().toISOString();

    // ==================================================
    // UPDATE ASSET STATUS
    // ==================================================

    const updatedAssets =
      allAssets.map((asset) =>
        asset.id === selectedAsset.id
          ? {
              ...asset,

              status: "Checked Out",

              checkoutDate:
                checkoutDate,
            }
          : asset
      );

    localStorage.setItem(
      "cars_assets",
      JSON.stringify(updatedAssets)
    );

    // ==================================================
    // ADD CHECK-OUT HISTORY
    // ==================================================

    const history =
      JSON.parse(
        localStorage.getItem(
          "cars_asset_history"
        )
      ) || [];

    const entry = {
      id: Date.now(),

      assetId:
        selectedAsset.assetId,

      assetName:
        `${selectedAsset.brand} (${selectedAsset.assetType})`,

      action: "Check-Out",

      status: "Checked Out",

      date: checkoutDate,
    };

    localStorage.setItem(
      "cars_asset_history",
      JSON.stringify([
        ...history,
        entry,
      ])
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    toast.success(
      `${selectedAsset.assetId} checked out successfully!`
    );

    navigate("/assets");
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-2xl space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Check-Out Asset
            </h1>

          </div>

          <Button
            variant="ghost"
            onClick={() =>
              navigate("/assets")
            }
            className="gap-1.5"
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Assets

          </Button>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          <Card>

            

            <CardContent>

              {/* =================================================
                  ASSET SEARCH
              ================================================= */}

              <div
                className="space-y-2"
                ref={dropdownRef}
              >

                <Label htmlFor="assetSearch">
                  Search Asset *
                </Label>

                <div className="relative">

                  {/* SEARCH ICON */}

                  <Search
                    className="
                      absolute
                      left-3
                      top-2.5
                      h-4
                      w-4
                      text-muted-foreground
                    "
                  />

                  {/* SEARCH INPUT */}

                  <Input
                    id="assetSearch"
                    placeholder="Search username, model, asset ID or type..."
                    value={assetSearch}
                    readOnly={
                      !!selectedAsset
                    }
                    onChange={(e) => {

                      setAssetSearch(
                        e.target.value
                      );

                      setShowDropdown(
                        true
                      );

                      setSelectedAsset(
                        null
                      );

                    }}
                    onFocus={() => {

                      if (
                        !selectedAsset
                      ) {
                        setShowDropdown(
                          true
                        );
                      }

                    }}
                    className={`
                      pl-9
                      pr-8
                      ${
                        selectedAsset
                          ? "font-mono font-bold text-primary bg-muted/30"
                          : ""
                      }
                    `}
                  />

                  {/* CLEAR BUTTON */}

                  {(selectedAsset ||
                    assetSearch) && (

                    <button
                      type="button"
                      onClick={
                        handleClearAsset
                      }
                      className="
                        absolute
                        right-2.5
                        top-2.5
                        text-muted-foreground
                        hover:text-foreground
                      "
                    >

                      <X className="h-4 w-4" />

                    </button>

                  )}

                  {/* =================================================
                      DROPDOWN
                  ================================================= */}

                  {showDropdown &&
                    !selectedAsset && (

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-50
                        mt-1
                        overflow-hidden
                        rounded-lg
                        border
                        bg-card
                        shadow-lg
                      "
                    >

                      {/* DROPDOWN HEADER */}

                      <div
                        className="
                          border-b
                          bg-muted/30
                          p-2
                        "
                      >

                        <div
                          className="
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-muted-foreground
                          "
                        >
                          Available Assets
                        </div>

                        <div
                          className="
                            mt-1
                            text-[10px]
                            text-muted-foreground
                          "
                        >
                          Search by username,
                          model, asset ID
                          or asset type
                        </div>

                      </div>

                      {/* =================================================
                          AVAILABLE ASSETS
                      ================================================= */}

                      {suggestions.length >
                      0 ? (

                        <div
                          className="
                            max-h-72
                            divide-y
                            divide-border/40
                            overflow-y-auto
                          "
                        >

                          {suggestions.map(
                            (asset) => {

                              const username =
                                asset.username ||
                                asset.customerUsername ||
                                asset.customerName ||
                                "-";

                              return (

                                <div
                                  key={
                                    asset.id
                                  }
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    px-3
                                    py-3
                                    text-left
                                    hover:bg-muted/40
                                  "
                                >

                                  {/* ASSET INFORMATION */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSelectAsset(
                                        asset
                                      )
                                    }
                                    className="
                                      min-w-0
                                      flex-1
                                      text-left
                                    "
                                  >

                                    <div className="flex items-center gap-2">

                                      <Laptop
                                        className="
                                          h-4
                                          w-4
                                          shrink-0
                                          text-primary
                                        "
                                      />

                                      <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-x-2">

                                          <span
                                            className="
                                              font-semibold
                                              text-foreground
                                            "
                                          >
                                            {asset.brand ||
                                              "-"}
                                          </span>

                                          {asset.model && (

                                            <span
                                              className="
                                                text-xs
                                                text-muted-foreground
                                              "
                                            >
                                              {asset.model}
                                            </span>

                                          )}

                                        </div>

                                        <div
                                          className="
                                            mt-1
                                            flex
                                            flex-wrap
                                            gap-x-3
                                            gap-y-1
                                            text-[11px]
                                            text-muted-foreground
                                          "
                                        >

                                          <span>
                                            Username:{" "}
                                            <span className="font-medium text-foreground">
                                              {
                                                username
                                              }
                                            </span>
                                          </span>

                                          <span>
                                            Type:{" "}
                                            <span className="font-medium text-foreground">
                                              {asset.assetType ||
                                                "-"}
                                            </span>
                                          </span>

                                        </div>

                                        <div className="mt-1">

                                          <span
                                            className="
                                              font-mono
                                              text-[11px]
                                              font-bold
                                              text-primary
                                            "
                                          >
                                            {
                                              asset.assetId
                                            }
                                          </span>

                                        </div>

                                      </div>

                                    </div>

                                  </button>

                                  {/* =================================================
                                      VIEW BUTTON
                                  ================================================= */}

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewAsset(
                                        asset
                                      )
                                    }
                                    className="
                                      shrink-0
                                      gap-1.5
                                    "
                                  >

                                    <Eye className="h-3.5 w-3.5" />

                                    View

                                  </Button>

                                </div>

                              );

                            }
                          )}

                        </div>

                      ) : (

                        <div
                          className="
                            p-4
                            text-center
                            text-xs
                            text-muted-foreground
                          "
                        >

                          {assets.length === 0
                            ? "No available assets to check out."
                            : "No matching available assets found."}

                        </div>

                      )}

                    </div>

                  )}

                </div>

                {/* =================================================
                    SELECTED ASSET
                ================================================= */}

                {selectedAsset && (

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                      rounded-md
                      border
                      bg-muted/20
                      px-3
                      py-2
                    "
                  >

                    <Laptop
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-primary
                      "
                    />

                    <div className="flex-1 text-xs">

                      <span
                        className="
                          font-semibold
                          text-foreground
                        "
                      >
                        {selectedAsset.brand ||
                          "-"}
                      </span>

                      {selectedAsset.model && (

                        <span
                          className="
                            ml-1
                            text-muted-foreground
                          "
                        >
                          — {selectedAsset.model}
                        </span>

                      )}

                      <span
                        className="
                          ml-2
                          font-mono
                          text-primary
                        "
                      >
                        (
                        {
                          selectedAsset.assetId
                        }
                        )
                      </span>

                    </div>

                    <Badge
                      variant="success"
                      className="text-[10px]"
                    >
                      Available
                    </Badge>

                  </div>

                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {errors.assetId && (

                  <p
                    className="
                      mt-1
                      text-xs
                      text-destructive
                    "
                  >
                    {errors.assetId}
                  </p>

                )}

              </div>

            </CardContent>

            {/* =================================================
                FOOTER
            ================================================= */}

            <CardFooter
              className="
                flex
                justify-end
                gap-3
                border-t
                p-4
              "
            >

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate("/assets")
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="gap-2"
              >

                <ArrowUpRight className="h-4 w-4" />

                Check-Out

              </Button>

            </CardFooter>

          </Card>

        </form>

      </div>

    </DashboardLayout>
  );
}