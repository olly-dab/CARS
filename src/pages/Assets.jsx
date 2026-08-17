// src/pages/Assets.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
} from "lucide-react";

export default function Assets() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef(null);

  // --------------------------------------------------
  // LOAD ALL REGISTERED ASSETS
  // --------------------------------------------------
  const loadAssets = useCallback(() => {
    const savedAssets =
      JSON.parse(localStorage.getItem("cars_assets")) || [];

    setAssets(savedAssets);
  }, []);

  useEffect(() => {
    loadAssets();

    // Refresh when returning to this page
    const handleFocus = () => {
      loadAssets();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadAssets]);

  // --------------------------------------------------
  // CLOSE SEARCH SUGGESTIONS
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------------------------
  // SEARCH ALL ASSETS
  // --------------------------------------------------
  const searchValue = search.toLowerCase().trim();

  const filteredAssets = assets.filter((asset) => {
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

  // --------------------------------------------------
  // SEARCH SUGGESTIONS
  // --------------------------------------------------
  const suggestions = assets
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

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------
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

  // --------------------------------------------------
  // SELECT SEARCH SUGGESTION
  // --------------------------------------------------
  const handleSelectSuggestion = (asset) => {
    setSearch(asset.assetId || "");
    setShowSuggestions(false);
  };

  // --------------------------------------------------
  // CLEAR SEARCH
  // --------------------------------------------------
  const handleClearSearch = () => {
    setSearch("");
    setShowSuggestions(false);
  };

  // --------------------------------------------------
  // VIEW ASSET DETAILS
  // --------------------------------------------------
  const handleViewAsset = (asset) => {
    navigate(`/assets/${asset.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Assets
            </h1>

            <p className="text-sm text-muted-foreground">
              View and manage all assets registered in the organisation.
            </p>
          </div>

          {/* Reception can register assets */}
          {currentUser?.role === "Reception" && (
            <Button
              onClick={() => navigate("/assets/register")}
              className="gap-2 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Register Asset
            </Button>
          )}
        </div>

        {/* =================================================
            INVENTORY CARD
        ================================================= */}
        <Card>

          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Card title */}
            <div>
              <CardTitle className="text-base">
                Organisation Asset Registry
              </CardTitle>

              <CardDescription>
                {assets.length}{" "}
                {assets.length === 1 ? "asset" : "assets"} registered
                in the organisation.
              </CardDescription>
            </div>

            {/* =================================================
                SEARCH
            ================================================= */}
            <div
              ref={searchContainerRef}
              className="relative w-full sm:w-80"
            >

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search ID, brand, type, serial..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                className="pl-9 pr-9"
              />

              {/* Clear button */}
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* =================================================
                  SEARCH SUGGESTIONS
              ================================================= */}
              {showSuggestions &&
                search.trim() &&
                suggestions.length > 0 && (

                  <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-card shadow-lg overflow-hidden">

                    <div className="p-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b">
                      Matching Assets
                    </div>

                    <div className="divide-y divide-border/40 max-h-64 overflow-y-auto">

                      {suggestions.map((asset) => (

                        <button
                          key={asset.id || asset.assetId}
                          type="button"
                          onClick={() =>
                            handleSelectSuggestion(asset)
                          }
                          className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs hover:bg-muted/60 transition-colors"
                        >

                          <div className="flex items-center gap-2">

                            <Laptop className="h-4 w-4 text-primary shrink-0" />

                            <div>
                              <div className="font-semibold text-foreground">
                                {asset.brand || "Unknown Brand"}
                              </div>

                              <div className="text-muted-foreground">
                                {asset.assetType || "Equipment"}
                              </div>
                            </div>

                          </div>

                          <span className="font-mono text-[11px] font-bold text-primary">
                            {asset.assetId}
                          </span>

                        </button>

                      ))}

                    </div>
                  </div>
                )}
            </div>
          </CardHeader>

          {/* =================================================
              ASSET TABLE
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
                    Status
                  </TableHead>

                  <TableHead>
                    Registered
                  </TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {filteredAssets.length > 0 ? (

                  filteredAssets.map((asset) => (

                    <TableRow
                      key={asset.id || asset.assetId}
                    >

                      {/* Asset ID */}
                      <TableCell className="font-bold text-primary font-mono">
                        {asset.assetId}
                      </TableCell>

                      {/* Asset Type */}
                      <TableCell className="font-medium">
                        {asset.assetType || "Equipment"}
                      </TableCell>

                      {/* Brand */}
                      <TableCell>
                        {asset.brand || "-"}
                      </TableCell>

                      {/* Serial Number */}
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {asset.serialNumber || "-"}
                      </TableCell>

                      {/* Current Status */}
                       <TableCell>
                          <Badge variant="success">
                                Registered
                          </Badge>
                        </TableCell>

                      {/* Registration Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {asset.registeredDate
                          ? new Date(
                              asset.registeredDate
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      {/* View */}
                      <TableCell className="text-right">

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleViewAsset(asset)
                          }
                          className="gap-1.5"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>

                      </TableCell>

                    </TableRow>

                  ))

                ) : (

                  <TableRow>

                    <TableCell
                      colSpan={7}
                      className="text-center py-12"
                    >

                      <Boxes className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />

                      <p className="text-sm font-semibold text-foreground">
                        No assets found
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {search
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