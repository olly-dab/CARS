// src/pages/Assets.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Laptop,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Search,
  X,
  Boxes,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Assets() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // =====================================================
  // URL STATUS FILTER
  // =====================================================

  const statusFilter = searchParams.get("status");

  // =====================================================
  // STATE
  // =====================================================

  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const searchContainerRef = useRef(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = useCallback(() => {
    try {
      const savedAssets =
        JSON.parse(
          localStorage.getItem("cars_assets")
        ) || [];

      const savedHistory =
        JSON.parse(
          localStorage.getItem(
            "cars_asset_history"
          )
        ) || [];

      setAssets(
        Array.isArray(savedAssets)
          ? savedAssets
          : []
      );

      setHistory(
        Array.isArray(savedHistory)
          ? savedHistory
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load asset data:",
        error
      );

      setAssets([]);
      setHistory([]);
    }
  }, []);

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadData();

    const handleFocus = () => {
      loadData();
    };

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [loadData]);

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
  // RESET PAGE WHEN SEARCH CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =====================================================
  // ASSET COUNTS
  // =====================================================

  const totalAssets = assets.length;

  const availableAssets = assets.filter(
    (asset) =>
      (asset.status || "Available") ===
      "Available"
  ).length;

  const checkedOutAssets = assets.filter(
    (asset) =>
      asset.status === "Checked Out"
  ).length;

  // =====================================================
  // MOVEMENT METRICS
  // =====================================================

  const totalCheckouts = history.filter(
    (item) =>
      item.action === "Check-Out"
  ).length;

  const totalCheckins = history.filter(
    (item) =>
      item.action === "Check-In"
  ).length;

  const totalTransactions =
    history.length;

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredAssets = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return assets
      .filter((asset) => {
        // -----------------------------------------------
        // STATUS FILTER
        // -----------------------------------------------

        if (
          statusFilter &&
          (asset.status || "Available") !==
            statusFilter
        ) {
          return false;
        }

        return true;
      })
      .filter((asset) => {
        // -----------------------------------------------
        // SEARCH
        // -----------------------------------------------

        if (!searchValue) {
          return true;
        }

        return (
          asset.assetId
            ?.toLowerCase()
            .includes(searchValue) ||
          asset.assetName
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
          asset.customerName
            ?.toLowerCase()
            .includes(searchValue) ||
          asset.status
            ?.toLowerCase()
            .includes(searchValue)
        );
      })
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
  }, [
    assets,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SEARCH SUGGESTIONS
  // =====================================================

  const suggestions = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    if (!searchValue) {
      return [];
    }

    return assets
      .filter((asset) => {
        if (
          statusFilter &&
          (asset.status || "Available") !==
            statusFilter
        ) {
          return false;
        }

        return (
          asset.assetId
            ?.toLowerCase()
            .includes(searchValue) ||
          asset.assetName
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
          asset.customerName
            ?.toLowerCase()
            .includes(searchValue)
        );
      })
      .slice(0, 6);
  }, [
    assets,
    search,
    statusFilter,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAssets.length /
        itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedAssets =
    filteredAssets.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // PAGE DISPLAY
  // =====================================================

  const firstItem =
    filteredAssets.length === 0
      ? 0
      : startIndex + 1;

  const lastItem = Math.min(
    endIndex,
    filteredAssets.length
  );

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusVariant = (
    status
  ) => {
    switch (status) {
      case "Checked Out":
        return "warning";

      case "Available":
      default:
        return "success";
    }
  };

  // =====================================================
  // SELECT SEARCH SUGGESTION
  // =====================================================

  const handleSelectSuggestion = (
    asset
  ) => {
    setSearch(
      asset.assetId || ""
    );

    setShowSuggestions(false);

    setCurrentPage(1);
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    setSearch("");
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  // =====================================================
  // CLEAR STATUS FILTER
  // =====================================================

  const handleClearFilter = () => {
    setSearchParams({});
    setSearch("");
    setCurrentPage(1);
  };

  // =====================================================
  // VIEW ASSET
  // =====================================================

  const handleViewAsset = (
    asset
  ) => {
    navigate(
      `/assets/${
        asset.id ||
        asset.assetId
      }`
    );
  };

  // =====================================================
  // PAGE TITLE
  // =====================================================

  const getPageTitle = () => {
    if (
      statusFilter ===
      "Checked Out"
    ) {
      return "Checked Out Assets";
    }

    if (
      statusFilter ===
      "Available"
    ) {
      return "Available Assets";
    }

    return "Assets";
  };

  // =====================================================
  // PAGE DESCRIPTION
  // =====================================================

  const getPageDescription = () => {
    if (
      statusFilter ===
      "Checked Out"
    ) {
      return "View all assets that are currently checked out.";
    }

    if (
      statusFilter ===
      "Available"
    ) {
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold tracking-tight">
                {getPageTitle()}
              </h1>

              {statusFilter && (
                <Badge
                  variant={getStatusVariant(
                    statusFilter
                  )}
                >
                  {statusFilter}
                </Badge>
              )}

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {getPageDescription()}
            </p>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-2">

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

            {/* RECEPTION ONLY */}

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
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* TOTAL */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assets
              </CardTitle>

              <Laptop className="h-4 w-4 text-primary" />

            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {totalAssets}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                All registered assets
              </p>
            </CardContent>
          </Card>

          {/* AVAILABLE */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available
              </CardTitle>

              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {availableAssets}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Ready to be checked out
              </p>
            </CardContent>
          </Card>

          {/* CHECKED OUT */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Checked Out
              </CardTitle>

              <ArrowUpRight className="h-4 w-4 text-amber-600" />

            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {checkedOutAssets}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Currently with customers
              </p>
            </CardContent>
          </Card>

        </div>

        {/* =================================================
            ASSET MOVEMENT METRICS
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Asset Movement Metrics
            </CardTitle>

          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* CHECK OUT */}

            <div className="rounded-lg border bg-muted/20 p-4">

              <span className="text-3xl font-bold text-amber-600">
                {totalCheckouts}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Total Check-Outs
              </p>

              <p className="text-xs text-muted-foreground">
                Hardware released
              </p>

            </div>

            {/* CHECK IN */}

            <div className="rounded-lg border bg-muted/20 p-4">

              <span className="text-3xl font-bold text-emerald-600">
                {totalCheckins}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Total Check-Ins
              </p>

              <p className="text-xs text-muted-foreground">
                Hardware returned
              </p>

            </div>

            {/* TRANSACTIONS */}

            <div className="rounded-lg border bg-muted/20 p-4">

              <span className="text-3xl font-bold text-primary">
                {totalTransactions}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Transactions
              </p>

              <p className="text-xs text-muted-foreground">
                Full activity count
              </p>

            </div>

          </CardContent>
        </Card>

        {/* =================================================
            CURRENT ASSET REGISTRY
        ================================================= */}

        <Card>

          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* TITLE */}

            <div>

              <CardTitle className="text-base">
                Current Asset Registry Status
              </CardTitle>

              <CardDescription>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {firstItem} - {lastItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredAssets.length}
                </span>{" "}
                assets
              </CardDescription>

            </div>

            {/* SEARCH */}

            <div
              ref={searchContainerRef}
              className="relative w-full sm:w-80"
            >

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

              <Input
                placeholder="Search assets..."
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

              {search && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
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

              {/* SEARCH SUGGESTIONS */}

              {showSuggestions &&
                search.trim() &&
                suggestions.length >
                  0 && (

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

                  <div
                    className="
                      border-b
                      bg-muted/30
                      p-2
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-muted-foreground
                    "
                  >
                    Matching Assets
                  </div>

                  <div className="max-h-64 overflow-y-auto">

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
                            flex
                            w-full
                            items-center
                            justify-between
                            border-b
                            px-3
                            py-2.5
                            text-left
                            text-xs
                            transition-colors
                            hover:bg-muted/60
                          "
                        >

                          <div className="flex items-center gap-2">

                            <Laptop className="h-4 w-4 shrink-0 text-primary" />

                            <div>

                              <div className="font-semibold">
                                {asset.brand ||
                                  "Unknown Brand"}
                              </div>

                              <div className="text-muted-foreground">
                                {asset.assetType ||
                                  "Equipment"}
                              </div>

                            </div>

                          </div>

                          <span className="font-mono text-[11px] font-bold text-primary">
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

            <div className="w-full overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Asset ID
                    </TableHead>

                    <TableHead>
                      Type
                    </TableHead>

                    <TableHead>
                      Brand
                    </TableHead>

                    <TableHead>
                      Serial
                    </TableHead>

                    <TableHead>
                      Customer
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

                  {paginatedAssets.length >
                  0 ? (

                    paginatedAssets.map(
                      (asset) => (

                        <TableRow
                          key={
                            asset.id ||
                            asset.assetId
                          }
                        >

                          {/* ASSET ID */}

                          <TableCell className="font-mono font-bold text-primary">
                            {asset.assetId ||
                              "-"}
                          </TableCell>

                          {/* TYPE */}

                          <TableCell className="font-medium">
                            {asset.assetType ||
                              asset.assetName ||
                              "Equipment"}
                          </TableCell>

                          {/* BRAND */}

                          <TableCell>
                            {asset.brand ||
                              "-"}
                          </TableCell>

                          {/* SERIAL */}

                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {asset.serialNumber ||
                              "-"}
                          </TableCell>

                          {/* CUSTOMER */}

                          <TableCell>

                            {asset.customerName ? (

                              <div>

                                <div className="font-medium">
                                  {
                                    asset.customerName
                                  }
                                </div>

                                {asset.customerId && (
                                  <div className="text-xs text-muted-foreground">
                                    {
                                      asset.customerId
                                    }
                                  </div>
                                )}

                              </div>

                            ) : (

                              <span className="text-muted-foreground">
                                Not assigned
                              </span>

                            )}

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

                          {/* ACTION */}

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
                        className="py-14 text-center"
                      >

                        <Boxes className="mx-auto mb-3 h-9 w-9 text-muted-foreground/40" />

                        <p className="text-sm font-semibold">
                          No assets found
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">

                          {search
                            ? "Try searching with a different keyword."
                            : statusFilter
                            ? `There are no ${statusFilter.toLowerCase()} assets.`
                            : "Register an asset to see it listed here."}

                        </p>

                      </TableCell>

                    </TableRow>

                  )}

                </TableBody>

              </Table>

            </div>

          </CardContent>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredAssets.length >
            itemsPerPage && (

            <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              {/* SHOWING */}

              <p className="text-sm text-muted-foreground">

                Showing{" "}
                <span className="font-medium text-foreground">
                  {firstItem}
                </span>{" "}
                -{" "}
                <span className="font-medium text-foreground">
                  {lastItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredAssets.length}
                </span>{" "}
                assets

              </p>

              {/* PAGINATION */}

              <div className="flex items-center gap-1">

                {/* PREVIOUS */}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Previous
                  </span>
                </Button>

                {/* PAGE NUMBERS */}

                <div className="flex items-center gap-1">

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => {

                    /*
                     * If there are many pages,
                     * keep the pagination compact.
                     */

                    if (
                      totalPages > 7 &&
                      page !== 1 &&
                      page !== totalPages &&
                      Math.abs(
                        page -
                          safeCurrentPage
                      ) > 1
                    ) {
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={
                          page ===
                          safeCurrentPage
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className="h-9 min-w-9"
                      >
                        {page}
                      </Button>
                    );
                  })}

                </div>

                {/* NEXT */}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="gap-1"
                >
                  <span className="hidden sm:inline">
                    Next
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

              </div>

            </div>
          )}

        </Card>

      </div>
    </DashboardLayout>
  );
}