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

  useEffect(() => {
    setAssets(
      JSON.parse(localStorage.getItem("cars_assets")) || []
    );

    setHistory(
      JSON.parse(localStorage.getItem("cars_asset_history")) || []
    );
  }, []);

  const availableAssets = assets.filter(
    (a) => a.status !== "Checked Out"
  );

  const checkedOutAssets = assets.filter(
    (a) => a.status === "Checked Out"
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
      toast.error("There are no assets to include in the report.");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // ------------------------------------------
    // HEADER
    // ------------------------------------------

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
      "CUSTOMER ASSET REGISTRATION SYSTEM",
      pageWidth / 2,
      20,
      { align: "center" }
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Asset Management Report",
      pageWidth / 2,
      29,
      { align: "center" }
    );

    doc.setFontSize(9);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      37,
      { align: "center" }
    );

    // ------------------------------------------
    // SUMMARY
    // ------------------------------------------

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");

    doc.text("Report Summary", 14, 50);

    autoTable(doc, {
      startY: 55,

      head: [
        ["Metric", "Value"],
      ],

      body: [
        ["Total Assets", assets.length],
        ["Available Assets", availableAssets.length],
        ["Checked Out Assets", checkedOutAssets.length],
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

    // ------------------------------------------
    // ASSET REGISTRY
    // ------------------------------------------

    let currentY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");

    doc.text("Asset Registry", 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,

      head: [
        [
          "Asset ID",
          "Type",
          "Brand",
          "Serial Number",
          "Status",
        ],
      ],

      body: assets.map((asset) => [
        asset.assetId || "-",
        asset.assetType || "Equipment",
        asset.brand || "-",
        asset.serialNumber || "-",
        asset.status || "Available",
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

    // ------------------------------------------
    // MOVEMENT HISTORY
    // ------------------------------------------

    currentY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");

    doc.text("Asset Movement History", 14, currentY);

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
              ? new Date(item.date).toLocaleString()
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

    // ------------------------------------------
    // FOOTER ON EVERY PAGE
    // ------------------------------------------

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      const pageHeight =
        doc.internal.pageSize.getHeight();

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

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

    // ------------------------------------------
    // SAVE PDF
    // ------------------------------------------

    const fileName = `CARS-Asset-Report-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    doc.save(fileName);

    toast.success("PDF report downloaded successfully!");
  };

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Reports & Analytics
            </h1>

            <p className="text-sm text-muted-foreground">
              Comprehensive system audit breakdown.
            </p>
          </div>

          {/* Download PDF */}
          <Button
            onClick={downloadPDF}
            className="gap-2 self-start"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>

        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Assets
              </CardTitle>

              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {availableAssets.length}
              </div>
            </CardContent>
          </Card>

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

        {/* Movement Metrics */}
        <Card>

          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Asset Movement Metrics</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-lg border p-4 bg-muted/20">
              <span className="text-3xl font-bold text-amber-600">
                {totalCheckouts}
              </span>

              <p className="text-sm font-semibold text-foreground mt-1">
                Total Check-Outs
              </p>

              <p className="text-xs text-muted-foreground">
                Hardware released
              </p>
            </div>

            <div className="rounded-lg border p-4 bg-muted/20">
              <span className="text-3xl font-bold text-emerald-600">
                {totalCheckins}
              </span>

              <p className="text-sm font-semibold text-foreground mt-1">
                Total Check-Ins
              </p>

              <p className="text-xs text-muted-foreground">
                Hardware returned
              </p>
            </div>

            <div className="rounded-lg border p-4 bg-muted/20">
              <span className="text-3xl font-bold text-primary">
                {history.length}
              </span>

              <p className="text-sm font-semibold text-foreground mt-1">
                Total Transactions
              </p>

              <p className="text-xs text-muted-foreground">
                Full activity count
              </p>
            </div>

          </CardContent>

        </Card>

        {/* Asset Registry */}
        <Card>

          <CardHeader>
            <CardTitle className="text-base">
              Current Asset Registry Status
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">

            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {assets.map((asset) => (
                  <TableRow
                    key={asset.id || asset.assetId}
                  >

                    <TableCell className="font-bold text-primary font-mono">
                      {asset.assetId}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {asset.assetType || "Equipment"}
                    </TableCell>

                    <TableCell className="font-medium text-foreground">
                      {asset.brand}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          asset.status === "Checked Out"
                            ? "warning"
                            : "success"
                        }
                      >
                        {asset.status || "Available"}
                      </Badge>
                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
}