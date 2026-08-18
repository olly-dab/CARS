// src/pages/Assets.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  Plus,
  Search,
  Boxes,
  X,
  Laptop,
  Eye,
  Filter,
} from "lucide-react";

export default function Assets() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // URL STATUS FILTER
  // =====================================================
const [searchParams] = useSearchParams();

const statusFilter = searchParams.get("status");

  // =====================================================
  // STATE
  // =====================================================

  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const searchContainerRef = useRef(null);

  // =====================================================
  // LOAD ASSETS
  // =====================================================

  const loadAssets = useCallback(() => {
    const savedAssets =
      JSON.parse(
        localStorage.getItem("cars_assets")
      ) || [];

    setAssets(savedAssets);
  }, []);

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadAssets();

    const handleFocus = () => {
      loadAssets();
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
  }, [loadAssets]);

  // =====================================================
  // CLOSE SEARCH SUGGESTIONS
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target
        )
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // FILTER BY STATUS
  // =====================================================

  const statusFilteredAssets = assets.filter(
    (asset) => {
      if (!statusFilter) {
        return true;
      }

      return asset.status === statusFilter;
    }
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const searchValue =
    search.toLowerCase().trim();

 const filteredAssets = assets
  .filter((asset) => {
    // -----------------------------------------
    // STATUS FILTER FROM DASHBOARD
    // -----------------------------------------
    if (statusFilter && asset.status !== statusFilter) {
      return false;
    }

    return true;
  })
  .filter((asset) => {
    // -----------------------------------------
    // SEARCH FILTER
    // -----------------------------------------
    return (
      asset.assetId
        ?.toLowerCase()
        .includes(searchValue) ||
      asset.assetType
        ?.toLowerCase()
        .includes(searchValue) ||
      asset.brand
        ?.toLowerCase()
        .includes(searchValue) ||
      asset.serialNumber
        ?.toLowerCase()
        .includes(searchValue) ||
      asset.status
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  // =====================================================
  // SORT LATEST ASSET FIRST
  // =====================================================

  const sortedAssets =
    filteredAssets
      .slice()
      .sort(
        (a, b) =>
          new Date(
            b.registeredDate || 0
          ) -
          new Date(
            a.registeredDate || 0
          )
      );

  // =====================================================
  // SEARCH SUGGESTIONS
  // =====================================================

  const suggestions =
    statusFilteredAssets
      .filter((asset) => {
        return (
          asset.assetId
            ?.toLowerCase()
            .includes(searchValue) ||
          asset.brand
            ?.toLowerCase()
            .includes(searchValue) ||
          asset.assetType
            ?.toLowerCase()
            .includes(searchValue) ||
          asset.serialNumber
            ?.toLowerCase()
            .includes(searchValue)
        );
      })
      .slice(0, 6);

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusVariant = (status) => {
    switch (status) {
      case "Checked Out":
        return "warning";

      case "Maintenance":
        return "secondary";

      case "Available":
      default:
        return "success";
    }
  };

  // =====================================================
  // SELECT SUGGESTION
  // =====================================================

  const handleSelectSuggestion = (asset) => {
    setSearch(asset.assetId || "");
    setShowSuggestions(false);
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    setSearch("");
    setShowSuggestions(false);
  };

  // =====================================================
  // CLEAR STATUS FILTER
  // =====================================================

  const handleClearFilter = () => {
    setSearchParams({});
    setSearch("");
  };

  // =====================================================
  // VIEW ASSET
  // =====================================================

  const handleViewAsset = (asset) => {
    navigate(
      `/assets/${asset.id}`
    );
  };

  // =====================================================
  // PAGE TITLE
  // =====================================================

  const getPageTitle = () => {
    if (statusFilter === "Checked Out") {
      return "Checked Out Assets";
    }

    if (statusFilter === "Available") {
      return "Available Assets";
    }

    return "Assets";
  };

  // =====================================================
  // PAGE DESCRIPTION
  // =====================================================

  const getPageDescription = () => {
    if (statusFilter === "Checked Out") {
      return "View all assets that are currently checked out.";
    }

    if (statusFilter === "Available") {
      return "View all assets that are currently available.";
    }

    return "View and manage all assets registered in the organisation.";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold tracking-tight">
  {statusFilter === "Available"
    ? "Available Assets"
    : statusFilter === "Checked Out"
    ? "Checked Out Assets"
    : "Assets"}
</h1>

              {statusFilter && (
                <Badge
                  variant={
                    getStatusVariant(
                      statusFilter
                    )
                  }
                >
                  {statusFilter}
                </Badge>
              )}

            </div>

           <p className="text-sm text-muted-foreground">
  {statusFilter === "Available"
    ? "View all currently available assets."
    : statusFilter === "Checked Out"
    ? "View all currently checked out assets."
    : "View and manage all assets registered in the organisation."}
</p>

          </div>

          {/* RIGHT SIDE BUTTONS */}

          <div className="flex items-center gap-2">

            {/* CLEAR FILTER */}

            {statusFilter && (
              <Button
                variant="outline"
                onClick={
                  handleClearFilter
                }
                className="gap-2"
              >
                <X className="h-4 w-4" />
                All Assets
              </Button>
            )}

            {/* REGISTER */}

            {currentUser?.role ===
              "Reception" && (
              <Button
                onClick={() =>
                  navigate(
                    "/assets/register"
                  )
                }
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Register Asset
              </Button>
            )}

          </div>

        </div>


        {/* =================================================
            REGISTRY CARD
        ================================================= */}

        <Card>

          <CardHeader
            className="
              flex flex-col gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* CARD TITLE */}

            <div>

              <div className="flex items-center gap-2">

                <CardTitle className="text-base">
                  Organisation Asset Registry
                </CardTitle>

                {statusFilter && (
                  <Filter className="h-4 w-4 text-primary" />
                )}

              </div>

              <CardDescription>

                {sortedAssets.length}{" "}
                {sortedAssets.length === 1
                  ? "asset"
                  : "assets"}{" "}

                {statusFilter
                  ? `with status "${statusFilter}"`
                  : "registered in the organisation."}

              </CardDescription>

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div
              ref={
                searchContainerRef
              }
              className="relative w-full sm:w-80"
            >

              <Search
                className="
                  absolute left-3
                  top-2.5
                  h-4 w-4
                  text-muted-foreground
                "
              />

              <Input
                placeholder="Search ID, brand, type, serial..."
                value={search}
                onChange={(e) => {
                  setSearch(
                    e.target.value
                  );
                  setShowSuggestions(
                    true
                  );
                }}
                onFocus={() => {
                  if (
                    search.trim()
                  ) {
                    setShowSuggestions(
                      true
                    );
                  }
                }}
                className="pl-9 pr-9"
              />

              {/* CLEAR SEARCH */}

              {search && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
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


              {/* =================================================
                  SEARCH SUGGESTIONS
              ================================================= */}

              {showSuggestions &&
                search.trim() &&
                suggestions.length >
                  0 && (

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

                    <div
                      className="
                        p-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-muted-foreground
                        bg-muted/30
                        border-b
                      "
                    >
                      Matching Assets
                    </div>

                    <div
                      className="
                        divide-y
                        divide-border/40
                        max-h-64
                        overflow-y-auto
                      "
                    >

                      {suggestions.map(
                        (asset) => (

                          <button
                            key={
                              asset.id ||
                              asset.assetId
                            }
                            type="button"
                            onClick={() =>
                              handleSelectSuggestion(
                                asset
                              )
                            }
                            className="
                              w-full
                              flex
                              items-center
                              justify-between
                              px-3
                              py-2.5
                              text-left
                              text-xs
                              hover:bg-muted/60
                              transition-colors
                            "
                          >

                            <div className="flex items-center gap-2">

                              <Laptop
                                className="
                                  h-4 w-4
                                  text-primary
                                  shrink-0
                                "
                              />

                              <div>

                                <div className="font-semibold text-foreground">
                                  {asset.brand ||
                                    "Unknown Brand"}
                                </div>

                                <div className="text-muted-foreground">
                                  {asset.assetType ||
                                    "Equipment"}
                                </div>

                              </div>

                            </div>

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

                          </button>

                        )
                      )}

                    </div>

                  </div>

                )}

            </div>

          </CardHeader>


          {/* =================================================
              TABLE
          ================================================= */}

          <CardContent className="p-0">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Asset ID
                  </TableHead>

                  <TableHead>
                    Asset Type
                  </TableHead>

                  <TableHead>
                    Brand
                  </TableHead>

                  <TableHead>
                    Serial Number
                  </TableHead>

                  <TableHead>
                    Registered
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>

                {sortedAssets.length >
                0 ? (

                  sortedAssets.map(
                    (asset) => (

                      <TableRow
                        key={
                          asset.id ||
                          asset.assetId
                        }
                      >

                        {/* ASSET ID */}

                        <TableCell
                          className="
                            font-bold
                            text-primary
                            font-mono
                          "
                        >
                          {asset.assetId}
                        </TableCell>


                        {/* ASSET TYPE */}

                        <TableCell className="font-medium">
                          {asset.assetType ||
                            "Equipment"}
                        </TableCell>


                        {/* BRAND */}

                        <TableCell>
                          {asset.brand ||
                            "-"}
                        </TableCell>


                        {/* SERIAL NUMBER */}

                        <TableCell
                          className="
                            font-mono
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {asset.serialNumber ||
                            "-"}
                        </TableCell>


                        {/* REGISTERED DATE + TIME */}

                        <TableCell
                          className="
                            text-xs
                            text-muted-foreground
                            whitespace-nowrap
                          "
                        >
                          {asset.registeredDate
                            ? new Date(
                                asset.registeredDate
                              ).toLocaleString()
                            : "-"}
                        </TableCell>


                        {/* STATUS */}

                        <TableCell>

                          <Badge
                            variant={getStatusVariant(
                              asset.status
                            )}
                          >
                            {asset.status ||
                              "Available"}
                          </Badge>

                        </TableCell>


                        {/* VIEW */}

                        <TableCell className="text-right">

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleViewAsset(
                                asset
                              )
                            }
                            className="gap-1.5"
                          >

                            <Eye className="h-4 w-4" />

                            View

                          </Button>

                        </TableCell>

                      </TableRow>

                    )
                  )

                ) : (

                  <TableRow>

                    <TableCell
                      colSpan={7}
                      className="
                        text-center
                        py-12
                      "
                    >

                      <Boxes
                        className="
                          mx-auto
                          h-8 w-8
                          text-muted-foreground/40
                          mb-2
                        "
                      />

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >
                        No assets found
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                          mt-1
                        "
                      >

                        {statusFilter
                          ? `There are no ${statusFilter.toLowerCase()} assets.`
                          : search
                          ? "Try searching with a different keyword."
                          : "Register an asset to see it listed here."}

                      </p>

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