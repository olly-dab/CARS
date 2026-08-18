// src/pages/Reports.jsx

import { useEffect, useState } from "react";
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
  Activity,
  Download,
} from "lucide-react";

import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    setAssets(
      JSON.parse(localStorage.getItem("cars_assets")) || []
    );

    setHistory(
      JSON.parse(localStorage.getItem("cars_asset_history")) || []
    );
  }, []);

  // ==========================================
  // ASSET COUNTS
  // ==========================================

  const availableAssets = assets.filter(
    (a) => a.status === "Available"
  );

  const checkedOutAssets = assets.filter(
    (a) => a.status === "Checked Out"
  );

  const maintenanceAssets = assets.filter(
    (a) => a.status === "Maintenance"
  );

  const totalCheckouts = history.filter(
    (i) => i.action === "Check-Out"
  ).length;

  const totalCheckins = history.filter(
    (i) => i.action === "Check-In"
  ).length;

  // ==========================================
  // DOWNLOAD PDF REPORT
  // ==========================================

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

    // ========================================
    // HEADER
    // ========================================

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
      "CUSTOMER ASSET REGISTRATION SYSTEM",
      pageWidth / 2,
      20,
      {
        align: "center",
      }
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

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

    // ========================================
    // SUMMARY
    // ========================================

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");

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
        ["Total Assets", assets.length],
        ["Available Assets", availableAssets.length],
        ["Checked Out Assets", checkedOutAssets.length],
        ["Maintenance Assets", maintenanceAssets.length],
        ["Total Check-Outs", totalCheckouts],
        ["Total Check-Ins", totalCheckins],
        ["Total Transactions", history.length],
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

    // ========================================
    // ASSET REGISTRY
    // ========================================

    let currentY =
      doc.lastAutoTable.finalY + 15;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");

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
          "Serial Number",
          "Customer",
          "Status",
        ],
      ],

      body: assets.map((asset) => [
        asset.assetId || "-",

        asset.assetType ||
          "Equipment",

        asset.brand ||
          "-",

        asset.serialNumber ||
          "-",

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

    // ========================================
    // MOVEMENT HISTORY
    // ========================================

    currentY =
      doc.lastAutoTable.finalY + 15;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");

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
      doc.setFont("helvetica", "normal");

      doc.text(
        "No asset movement history recorded.",
        14,
        currentY + 8
      );
    }

    // ========================================
    // FOOTER
    // ========================================

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

    // ========================================
    // SAVE PDF
    // ========================================

    const fileName =
      `CARS-Asset-Report-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

    doc.save(fileName);

    toast.success(
      "PDF report downloaded successfully!"
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* ====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Reports & Analytics
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


        {/* ====================================
            TOP METRIC CARDS
        ===================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

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


        {/* ====================================
            MOVEMENT METRICS
        ===================================== */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2 text-base">

              <Activity className="h-4 w-4 text-primary" />

              <span>
                Asset Movement Metrics
              </span>

            </CardTitle>

          </CardHeader>


          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-lg border bg-muted/20 p-4">

              <span className="text-3xl font-bold text-amber-600">
                {totalCheckouts}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Total Check-Outs
              </p>

              

            </div>


            <div className="rounded-lg border bg-muted/20 p-4">

              <span className="text-3xl font-bold text-emerald-600">
                {totalCheckins}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Total Check-Ins
              </p>

              

            </div>


            <div className="rounded-lg border bg-muted/20 p-4">

              <span className="text-3xl font-bold text-primary">
                {history.length}
              </span>

              <p className="mt-1 text-sm font-semibold">
                Total Transactions
              </p>

              

            </div>

          </CardContent>

        </Card>


        {/* ====================================
            CURRENT ASSET REGISTRY
        ===================================== */}

        <Card>

          <CardHeader>

            <CardTitle className="text-base">
              Current Asset Registry Status
            </CardTitle>

          </CardHeader>


          <CardContent className="p-0">

            <div className="w-full overflow-x-auto">

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
                      Customer
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {assets.length > 0 ? (

                    assets.map((asset) => (

                      <TableRow
                        key={
                          asset.id ||
                          asset.assetId
                        }
                      >

                        {/* ASSET ID */}

                        <TableCell className="font-bold font-mono text-primary">
                          {asset.assetId || "-"}
                        </TableCell>


                        {/* TYPE */}

                        <TableCell>
                          {asset.assetType ||
                            "Equipment"}
                        </TableCell>


                        {/* BRAND */}

                        <TableCell className="font-medium">
                          {asset.brand || "-"}
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
                              Not Assigned
                            </span>
                          )}

                        </TableCell>


                        {/* STATUS */}

                        <TableCell>

                          <Badge
                            variant={
                              asset.status ===
                              "Checked Out"
                                ? "warning"
                                : asset.status ===
                                  "Maintenance"
                                ? "secondary"
                                : "success"
                            }
                          >
                            {asset.status ||
                              "Available"}
                          </Badge>

                        </TableCell>

                      </TableRow>

                    ))

                  ) : (

                    <TableRow>

                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No assets registered.
                      </TableCell>

                    </TableRow>

                  )}

                </TableBody>

              </Table>

            </div>

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
}