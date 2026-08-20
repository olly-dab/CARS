// src/pages/Reports.jsx

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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

import {
  Laptop,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  // =====================================================
  // STATE
  // =====================================================

  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
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
          "Unable to load report data:",
          error
        );

        setAssets([]);
        setHistory([]);
      }
    };

    loadData();

    // Refresh when localStorage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =====================================================
  // ASSET COUNTS
  // =====================================================

  const availableAssets = assets.filter(
    (asset) =>
      asset.status === "Available"
  );

  const checkedOutAssets = assets.filter(
    (asset) =>
      asset.status === "Checked Out"
  );

  const totalCheckouts = history.filter(
    (item) =>
      item.action === "Check-Out"
  ).length;

  const totalCheckins = history.filter(
    (item) =>
      item.action === "Check-In"
  ).length;

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAssets = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return assets;
    }

    return assets.filter((asset) => {
      const assetId =
        String(asset.assetId || "")
          .toLowerCase();

      const assetType =
        String(asset.assetType || "")
          .toLowerCase();

      const brand =
        String(asset.brand || "")
          .toLowerCase();

      const serialNumber =
        String(asset.serialNumber || "")
          .toLowerCase();

      const customerName =
        String(asset.customerName || "")
          .toLowerCase();

      const status =
        String(
          asset.status || "Available"
        ).toLowerCase();

      return (
        assetId.includes(search) ||
        assetType.includes(search) ||
        brand.includes(search) ||
        serialNumber.includes(search) ||
        customerName.includes(search) ||
        status.includes(search)
      );
    });
  }, [assets, searchTerm]);

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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Make sure page stays valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredAssets.length
  );

  const paginatedAssets =
    filteredAssets.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusVariant = (status) => {
    if (status === "Checked Out") {
      return "warning";
    }

    if (status === "Maintenance") {
      return "secondary";
    }

    return "success";
  };

  // =====================================================
  // DOWNLOAD PDF
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
    // CURRENT ASSET REGISTRY
    // =================================================

    let currentY =
      doc.lastAutoTable.finalY + 15;

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
          "Status",
        ],
      ],

      body: assets.map((asset) => [
        asset.assetId || "-",

        asset.assetType ||
          "Equipment",

        asset.brand || "-",

        asset.serialNumber || "-",

        asset.customerName ||
          "Not Assigned",

        asset.status ||
          "Available",
      ]),

      theme: "grid",

      headStyles: {
        fillColor: [18, 60, 105],
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 7,
        cellPadding: 3,
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // =================================================
    // MOVEMENT HISTORY
    // =================================================

    currentY =
      doc.lastAutoTable.finalY + 15;

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
    // SAVE PDF
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
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Reports
            </h1>

            
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
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* TOTAL ASSETS */}

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

            </CardContent>

          </Card>

        </div>


        {/* =================================================
            CURRENT ASSET REGISTRY
        ================================================= */}

        <Card>

          <CardHeader>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <CardTitle className="text-base">
                Current Asset Registry Status
              </CardTitle>

              {/* SEARCH */}

              <div className="relative w-full sm:w-80">

                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  placeholder="Search assets..."
                  className="pl-9"
                />

              </div>

            </div>

          </CardHeader>


          <CardContent className="p-0">

            {/* TABLE */}

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

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {paginatedAssets.length > 0 ? (

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

                          <TableCell>
                            {asset.assetType ||
                              "Equipment"}
                          </TableCell>


                          {/* BRAND */}

                          <TableCell className="font-medium">
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

                            {asset.customerName ||
                              "Not Assigned"}

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

                        </TableRow>

                      )
                    )

                  ) : (

                    <TableRow>

                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground"
                      >

                        {searchTerm
                          ? "No assets match your search."
                          : "No assets registered."}

                      </TableCell>

                    </TableRow>

                  )}

                </TableBody>

              </Table>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

              {/* SHOWING */}

              <p className="text-sm text-muted-foreground">

                {" "}

                {filteredAssets.length === 0
                  ? 0
                  : startIndex + 1}

                {" - "}

                {endIndex}

                {" of "}

                {filteredAssets.length}

                {" assets"}

              </p>


              {/* PAGINATION CONTROLS */}

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

                {getPageNumbers().map(
                  (page) => (

                    <Button
                      key={page}
                      size="sm"
                      variant={
                        currentPage === page
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>

                  )
                )}


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

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
}