// src/pages/Reports.jsx

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Laptop,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Download,
  Wrench,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  // =====================================================
  // STATE
  // =====================================================

  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Exactly 10 assets per page
  const ITEMS_PER_PAGE = 10;

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = () => {
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

      setAssets(savedAssets);
      setHistory(savedHistory);
    } catch (error) {
      console.error(
        "Error loading report data:",
        error
      );

      setAssets([]);
      setHistory([]);
    }
  };

  useEffect(() => {
    loadData();

    // Reload when the page gets focus
    const handleFocus = () => {
      loadData();
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

  // =====================================================
  // ASSET COUNTS
  // =====================================================

  const availableAssets = assets.filter(
    (asset) =>
      (asset.status || "Available") ===
      "Available"
  );

  const checkedOutAssets = assets.filter(
    (asset) =>
      asset.status === "Checked Out"
  );

  const maintenanceAssets = assets.filter(
    (asset) =>
      asset.status === "Maintenance"
  );

  // =====================================================
  // MOVEMENT COUNTS
  // =====================================================

  const totalCheckouts = history.filter(
    (item) =>
      item.action === "Check-Out"
  ).length;

  const totalCheckins = history.filter(
    (item) =>
      item.action === "Check-In"
  ).length;

  // =====================================================
  // SEARCH ASSET REGISTRY
  // =====================================================

  const filteredAssets = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return assets;
    }

    return assets.filter((asset) => {
      const searchableValues = [
        asset.assetId,
        asset.assetType,
        asset.brand,
        asset.serialNumber,
        asset.customerId,
        asset.customerName,
        asset.location,
        asset.condition,
        asset.status,
      ];

      return searchableValues.some(
        (value) =>
          value &&
          String(value)
            .toLowerCase()
            .includes(searchValue)
      );
    });
  }, [assets, search]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAssets.length /
        ITEMS_PER_PAGE
    )
  );

  // Make sure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const currentAssets =
    filteredAssets.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const pageNumbers = [];

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pageNumbers.push(page);
  }

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Checked Out":
        return "bg-amber-100 text-amber-700 border-amber-200";

      case "Maintenance":
        return "bg-red-100 text-red-700 border-red-200";

      case "Available":
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // =====================================================
  // DOWNLOAD PDF REPORT
  // =====================================================

  const downloadPDF = () => {
    if (assets.length === 0) {
      toast.error(
        "There are no assets to include in the report."
      );
      return;
    }

    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    // =================================================
    // HEADER
    // =================================================

    doc.setFontSize(18);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "CUSTOMER ASSET REGISTRATION SYSTEM",
      pageWidth / 2,
      20,
      {
        align: "center",
      }
    );

    doc.setFontSize(14);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Asset Management Report",
      pageWidth / 2,
      29,
      {
        align: "center",
      }
    );

    doc.setFontSize(9);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      37,
      {
        align: "center",
      }
    );

    // =================================================
    // SUMMARY
    // =================================================

    doc.setFontSize(13);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Report Summary",
      14,
      50
    );

    autoTable(doc, {
      startY: 55,

      head: [
        ["Metric", "Value"],
      ],

      body: [
        [
          "Total Assets",
          assets.length,
        ],
        [
          "Available Assets",
          availableAssets.length,
        ],
        [
          "Checked Out Assets",
          checkedOutAssets.length,
        ],
        [
          "Maintenance Assets",
          maintenanceAssets.length,
        ],
        [
          "Total Check-Outs",
          totalCheckouts,
        ],
        [
          "Total Check-Ins",
          totalCheckins,
        ],
        [
          "Total Transactions",
          history.length,
        ],
      ],

      theme: "grid",

      headStyles: {
        fillColor: [18, 60, 105],
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      columnStyles: {
        0: {
          cellWidth: 100,
        },

        1: {
          cellWidth: 50,
          halign: "center",
        },
      },
    });

    // =================================================
    // ASSET REGISTRY
    // =================================================

    let currentY =
      doc.lastAutoTable.finalY +
      15;

    doc.setFontSize(13);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Current Asset Registry Status",
      14,
      currentY
    );

    autoTable(doc, {
      startY: currentY + 5,

      head: [
        [
          "Asset ID",
          "Type",
          "Brand",
          "Serial",
          "Customer",
          "Location",
          "Condition",
          "Status",
        ],
      ],

      body: assets.map(
        (asset) => [
          asset.assetId || "-",
          asset.assetType ||
            "Equipment",
          asset.brand || "-",
          asset.serialNumber || "-",
          asset.customerName ||
            "-",
          asset.location || "-",
          asset.condition || "-",
          asset.status ||
            "Available",
        ]
      ),

      theme: "grid",

      headStyles: {
        fillColor: [18, 60, 105],
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 7,
        cellPadding: 2.5,
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // =================================================
    // MOVEMENT HISTORY
    // =================================================

    currentY =
      doc.lastAutoTable.finalY +
      15;

    doc.setFontSize(13);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Asset Movement History",
      14,
      currentY
    );

    if (history.length > 0) {
      autoTable(doc, {
        startY: currentY + 5,

        head: [
          [
            "Asset ID",
            "Asset Name",
            "Action",
            "Date & Time",
          ],
        ],

        body: history
          .slice()
          .reverse()
          .map((item) => [
            item.assetId || "-",
            item.assetName || "-",
            item.action || "-",
            item.date
              ? new Date(
                  item.date
                ).toLocaleString()
              : "-",
          ]),

        theme: "grid",

        headStyles: {
          fillColor: [18, 60, 105],
          textColor: 255,
          fontStyle: "bold",
        },

        styles: {
          fontSize: 8,
          cellPadding: 3,
        },

        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });
    } else {
      doc.setFontSize(9);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "No asset movement history recorded.",
        14,
        currentY + 8
      );
    }

    // =================================================
    // FOOTER
    // =================================================

    const pageCount =
      doc.internal.getNumberOfPages();

    for (
      let i = 1;
      i <= pageCount;
      i++
    ) {
      doc.setPage(i);

      const pageHeight =
        doc.internal.pageSize.getHeight();

      doc.setFontSize(8);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "© 2026 Customer Asset Registration System (CARS). All rights reserved.",
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );

      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 14,
        pageHeight - 10,
        {
          align: "right",
        }
      );
    }

    // =================================================
    // SAVE
    // =================================================

    const fileName =
      `CARS-Asset-Report-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

    doc.save(fileName);

    toast.success(
      "PDF report downloaded successfully!"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Reports & Analytics
            </h1>

            <p className="text-sm text-muted-foreground">
              Comprehensive system audit breakdown.
            </p>
          </div>

          <Button
            onClick={downloadPDF}
            className="gap-2 self-start"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>

        </div>


        {/* =================================================
            CURRENT ASSET STATUS SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

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
                {assets.length}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Registered assets
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
                {availableAssets.length}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Ready for checkout
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
                {checkedOutAssets.length}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Currently in use
              </p>

            </CardContent>
          </Card>


          {/* MAINTENANCE */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maintenance
              </CardTitle>

              <Wrench className="h-4 w-4 text-red-600" />

            </CardHeader>

            <CardContent>

              <div className="text-2xl font-bold text-red-600">
                {maintenanceAssets.length}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Currently under maintenance
              </p>

            </CardContent>
          </Card>

        </div>


        {/* =================================================
            MOVEMENT METRICS
        ================================================= */}

        <Card>

          <CardHeader>

            <CardTitle className="text-base flex items-center gap-2">

              <Activity className="h-4 w-4 text-primary" />

              <span>
                Asset Movement Metrics
              </span>

            </CardTitle>

          </CardHeader>


          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* CHECK OUTS */}

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


            {/* CHECK INS */}

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
                {history.length}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Total Transactions
              </p>

              <p className="text-xs text-muted-foreground">
                Full activity count
              </p>

            </div>

          </CardContent>

        </Card>


        {/* =================================================
            CURRENT ASSET REGISTRY STATUS
        ================================================= */}

        <Card>

          <CardHeader>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <CardTitle className="text-base">
                  Current Asset Registry Status
                </CardTitle>

                <CardDescription>
                  View the current status and details of all registered assets.
                </CardDescription>

              </div>


              {/* SEARCH */}

              <div className="relative w-full lg:w-80">

                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search assets..."
                  className="pl-9 pr-9"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              </div>

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
                      Location
                    </TableHead>

                    <TableHead>
                      Condition
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {currentAssets.length > 0 ? (

                    currentAssets.map(
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

                          <TableCell className="font-medium whitespace-nowrap">
                            {asset.assetType ||
                              "Equipment"}
                          </TableCell>


                          {/* BRAND */}

                          <TableCell>
                            {asset.brand ||
                              "-"}
                          </TableCell>


                          {/* SERIAL */}

                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {asset.serialNumber ||
                              "-"}
                          </TableCell>


                          {/* CUSTOMER */}

                          <TableCell className="whitespace-nowrap">

                            {asset.customerName ? (
                              <div>

                                <div className="font-medium">
                                  {asset.customerName}
                                </div>

                                {asset.customerId && (
                                  <div className="text-xs text-muted-foreground">
                                    {asset.customerId}
                                  </div>
                                )}

                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                -
                              </span>
                            )}

                          </TableCell>


                          {/* LOCATION */}

                          <TableCell className="whitespace-nowrap">
                            {asset.location ||
                              "-"}
                          </TableCell>


                          {/* CONDITION */}

                          <TableCell>
                            {asset.condition ||
                              "-"}
                          </TableCell>


                          {/* STATUS */}

                          <TableCell>

                            <Badge
                              variant="outline"
                              className={
                                getStatusClass(
                                  asset.status ||
                                    "Available"
                                )
                              }
                            >
                              {asset.status ||
                                "Available"}
                            </Badge>

                          </TableCell>

                        </TableRow>

                      )
                    )

                  ) : (

                    <TableRow>

                      <TableCell
                        colSpan={8}
                        className="py-12 text-center"
                      >

                        <Laptop className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />

                        <p className="font-semibold">
                          No assets found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">

                          {search
                            ? "No assets match your search."
                            : "No assets have been registered yet."}

                        </p>

                      </TableCell>

                    </TableRow>

                  )}

                </TableBody>

              </Table>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {filteredAssets.length > 0 && (

              <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                {/* SHOWING */}

                <p className="text-sm text-muted-foreground">

                  Showing{" "}

                  <span className="font-medium text-foreground">
                    {startIndex + 1}
                  </span>

                  {" - "}

                  <span className="font-medium text-foreground">
                    {Math.min(
                      endIndex,
                      filteredAssets.length
                    )}
                  </span>

                  {" of "}

                  <span className="font-medium text-foreground">
                    {filteredAssets.length}
                  </span>

                  {" assets"}

                </p>


                {/* PAGINATION BUTTONS */}

                <div className="flex items-center gap-1">

                  {/* PREVIOUS */}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage === 1
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

                    {pageNumbers.map(
                      (page) => (

                        <Button
                          key={page}
                          variant={
                            currentPage ===
                            page
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }
                          className="h-9 w-9 p-0"
                        >
                          {page}
                        </Button>

                      )
                    )}

                  </div>


                  {/* NEXT */}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage ===
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

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
}