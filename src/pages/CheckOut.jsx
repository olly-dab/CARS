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
} from "lucide-react";


export default function CheckOut() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
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

    // ONLY assets with status = Available
    const availableAssets = all.filter(
      (asset) => asset.status === "Available"
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
  // SEARCH ONLY AVAILABLE ASSETS
  // ======================================================

  const suggestions = assets
    .filter(
      (asset) =>
        asset.assetId
          ?.toLowerCase()
          .includes(
            assetSearch.toLowerCase()
          ) ||

        asset.brand
          ?.toLowerCase()
          .includes(
            assetSearch.toLowerCase()
          ) ||

        asset.assetType
          ?.toLowerCase()
          .includes(
            assetSearch.toLowerCase()
          )
    )
    .slice(0, 6);


  // ======================================================
  // SELECT ASSET
  // ======================================================

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setAssetSearch(asset.assetId);
    setShowDropdown(false);

    if (errors.assetId) {
      setErrors((prev) => ({
        ...prev,
        assetId: "",
      }));
    }
  };


  // ======================================================
  // CLEAR SELECTED ASSET
  // ======================================================

  const handleClearAsset = () => {
    setSelectedAsset(null);
    setAssetSearch("");
    setShowDropdown(false);
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

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }


    // --------------------------------------------
    // GET LATEST ASSET DATA
    // --------------------------------------------

    const allAssets =
      JSON.parse(
        localStorage.getItem("cars_assets")
      ) || [];


    // --------------------------------------------
    // FIND SELECTED ASSET
    // --------------------------------------------

    const currentAsset =
      allAssets.find(
        (asset) =>
          asset.id === selectedAsset.id
      );


    // --------------------------------------------
    // SAFETY CHECK
    // --------------------------------------------

    if (!currentAsset) {
      toast.error(
        "Asset could not be found."
      );

      loadAvailableAssets();
      handleClearAsset();

      return;
    }


    // --------------------------------------------
    // MAKE SURE IT IS STILL AVAILABLE
    // --------------------------------------------

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
    // UPDATE ASSET STATUS
    // ==================================================

    const updatedAssets = allAssets.map(
      (asset) =>
        asset.id === selectedAsset.id
          ? {
              ...asset,
              status: "Checked Out",
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

      // Current status
      status: "Checked Out",

      date:
        new Date().toISOString(),
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


    navigate("/asset-history");
  };


  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}

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


        {/* FORM */}

        <form onSubmit={handleSubmit}>

          <Card>

            <CardHeader>

              <CardTitle className="text-base">
                Select Asset
              </CardTitle>

              

            </CardHeader>


            <CardContent>

              {/* ASSET SEARCH */}

              <div
                className="space-y-2"
                ref={dropdownRef}
              >

                <Label htmlFor="assetSearch">
                  Asset ID *
                </Label>


                <div className="relative">

                  <Search
                    className="
                      absolute left-3
                      top-2.5
                      h-4 w-4
                      text-muted-foreground
                    "
                  />


                  <Input
                    id="assetSearch"
                    placeholder="Type to search available assets..."
                    value={assetSearch}
                    readOnly={
                      !!selectedAsset
                    }
                    onChange={(e) => {

                      setAssetSearch(
                        e.target.value
                      );

                      setShowDropdown(true);

                      setSelectedAsset(null);
                    }}
                    onFocus={() => {

                      if (!selectedAsset) {
                        setShowDropdown(true);
                      }

                    }}
                    className={`
                      pl-9 pr-8
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
                        absolute right-2.5
                        top-2.5
                        text-muted-foreground
                        hover:text-foreground
                      "
                    >

                      <X className="h-4 w-4" />

                    </button>

                  )}


                  {/* DROPDOWN */}

                  {showDropdown &&
                    !selectedAsset && (

                    <div
                      className="
                        absolute
                        left-0 right-0
                        top-full
                        mt-1
                        z-50
                        rounded-lg
                        border
                        bg-card
                        shadow-lg
                        overflow-hidden
                      "
                    >

                      {/* DROPDOWN HEADER */}

                      <div
                        className="
                          p-1.5
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-muted-foreground
                          bg-muted/30
                          border-b
                        "
                      >
                        Available Assets
                      </div>


                      {/* AVAILABLE ASSETS */}

                      {suggestions.length > 0 ? (

                        <div
                          className="
                            divide-y
                            divide-border/40
                            max-h-56
                            overflow-y-auto
                          "
                        >

                          {suggestions.map(
                            (asset) => (

                            <button
                              key={asset.id}
                              type="button"
                              onClick={() =>
                                handleSelectAsset(
                                  asset
                                )
                              }
                              className="
                                w-full
                                flex
                                items-center
                                justify-between
                                px-3 py-2.5
                                text-left
                                text-xs
                                hover:bg-muted/60
                                transition-colors
                              "
                            >

                              <div className="flex items-center gap-2">

                                <Laptop
                                  className="
                                    h-3.5 w-3.5
                                    text-primary
                                    shrink-0
                                  "
                                />


                                <div>

                                  <span
                                    className="
                                      font-semibold
                                      text-foreground
                                    "
                                  >
                                    {asset.brand}
                                  </span>

                                  <span
                                    className="
                                      text-muted-foreground
                                      ml-1.5
                                    "
                                  >
                                    ({asset.assetType})
                                  </span>

                                </div>

                              </div>


                              <div className="flex items-center gap-2">

                                <Badge
                                  variant="success"
                                  className="text-[10px]"
                                >
                                  Available
                                </Badge>

                                <span
                                  className="
                                    font-mono
                                    text-[11px]
                                    font-bold
                                    text-primary
                                  "
                                >
                                  {asset.assetId}
                                </span>

                              </div>

                            </button>

                          ))}

                        </div>

                      ) : (

                        <div
                          className="
                            p-3
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


                {/* SELECTED ASSET */}

                {selectedAsset && (

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-md
                      border
                      bg-muted/20
                      px-3 py-2
                      mt-1
                    "
                  >

                    <Laptop
                      className="
                        h-4 w-4
                        text-primary
                        shrink-0
                      "
                    />


                    <div className="flex-1 text-xs">

                      <span
                        className="
                          font-semibold
                          text-foreground
                        "
                      >
                        {selectedAsset.brand}
                      </span>

                      <span
                        className="
                          text-muted-foreground
                          ml-1
                        "
                      >
                        — {selectedAsset.assetType}
                      </span>

                      <span
                        className="
                          font-mono
                          text-primary
                          ml-2
                        "
                      >
                        ({selectedAsset.assetId})
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


                {/* ERROR */}

                {errors.assetId && (

                  <p
                    className="
                      text-xs
                      text-destructive
                      mt-1
                    "
                  >
                    {errors.assetId}
                  </p>

                )}

              </div>

            </CardContent>


            {/* FOOTER */}

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

                Confirm Check-Out

              </Button>

            </CardFooter>

          </Card>

        </form>

      </div>

    </DashboardLayout>
  );
}