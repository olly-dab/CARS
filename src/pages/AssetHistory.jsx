// src/pages/AssetHistory.jsx

import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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

import { Search, History } from "lucide-react";


// ======================================================
// GET STATUS FROM ACTION
// ======================================================

const getStatusFromAction = (action) => {
  switch (action) {
    case "Registered":
      return "Available";

    case "Check-Out":
      return "Checked Out";

    case "Check-In":
      return "Available";

    case "Returned":
      return "Available";

    case "Maintenance":
      return "Maintenance";

    default:
      return "Unknown";
  }
};


// ======================================================
// GET BADGE VARIANT
// ======================================================

const getBadgeVariant = (status) => {
  switch (status) {
    case "Available":
      return "success";

    case "Checked Out":
      return "warning";

    case "Maintenance":
      return "secondary";

    default:
      return "outline";
  }
};


// ======================================================
// ASSET HISTORY
// ======================================================

export default function AssetHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");


  // ======================================================
  // LOAD HISTORY
  // ======================================================

  const loadHistory = () => {
    const savedHistory =
      JSON.parse(
        localStorage.getItem("cars_asset_history")
      ) || [];

    setHistory(savedHistory);
  };


  // ======================================================
  // LOAD WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    loadHistory();
  }, []);


  // ======================================================
  // REFRESH WHEN STORAGE CHANGES
  // ======================================================

  useEffect(() => {
    const handleStorageChange = () => {
      loadHistory();
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


  // ======================================================
  // SHOW ONLY LATEST ACTION FOR EACH ASSET
  // ======================================================

  const latestHistory = Object.values(
    history.reduce((acc, item) => {

      const existing = acc[item.assetId];

      // Keep the newest record
      if (
        !existing ||
        new Date(item.date) >
          new Date(existing.date)
      ) {
        acc[item.assetId] = item;
      }

      return acc;

    }, {})
  );


  // ======================================================
  // SEARCH
  // ======================================================

  const filtered = latestHistory.filter(
    (item) => {

      const assetId =
        item.assetId?.toLowerCase() || "";

      const assetName =
        item.assetName?.toLowerCase() || "";

      const action =
        item.action?.toLowerCase() || "";

      const status =
        getStatusFromAction(item.action)
          .toLowerCase();

      const searchText =
        search.toLowerCase();

      return (
        assetId.includes(searchText) ||
        assetName.includes(searchText) ||
        action.includes(searchText) ||
        status.includes(searchText)
      );
    }
  );


  // ======================================================
  // SORT NEWEST FIRST
  // ======================================================

  const sortedHistory = filtered
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );


  // ======================================================
  // UI
  // ======================================================

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Asset History
          </h1>

          <p className="text-sm text-muted-foreground">
            Current movement status of registered assets.
          </p>

        </div>


        {/* CARD */}

        <Card>

          <CardHeader
            className="
              flex flex-row
              items-center
              justify-between
            "
          >

            <div>

              <CardTitle className="text-base">
                Asset Movement
              </CardTitle>

              <CardDescription>
                {latestHistory.length} assets
                currently displayed
              </CardDescription>

            </div>


            {/* SEARCH */}

            <div className="relative w-72">

              <Search
                className="
                  absolute left-3
                  top-2.5
                  h-4 w-4
                  text-muted-foreground
                "
              />

              <Input
                placeholder="Search asset ID, name, action..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="pl-9"
              />

            </div>

          </CardHeader>


          {/* TABLE */}

          <CardContent className="p-0">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Asset ID
                  </TableHead>

                  <TableHead>
                    Asset Name
                  </TableHead>

                  <TableHead>
                    Action
                  </TableHead>

                  <TableHead>
                    Date & Time
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>

                {sortedHistory.length > 0 ? (

                  sortedHistory.map((item) => {

                    // ----------------------------------
                    // STATUS IS BASED ON LATEST ACTION
                    // ----------------------------------

                    const status =
                      getStatusFromAction(
                        item.action
                      );


                    return (

                      <TableRow
                        key={item.id}
                      >

                        {/* ASSET ID */}

                        <TableCell
                          className="
                            font-bold
                            text-primary
                            font-mono
                          "
                        >
                          {item.assetId}
                        </TableCell>


                        {/* ASSET NAME */}

                        <TableCell
                          className="
                            font-medium
                            text-foreground
                          "
                        >
                          {item.assetName || "-"}
                        </TableCell>


                        {/* ACTION */}

                        <TableCell
                          className="
                            font-semibold
                            text-foreground
                          "
                        >
                          {item.action}
                        </TableCell>


                        {/* DATE */}

                        <TableCell
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >

                          {item.date
                            ? new Date(
                                item.date
                              ).toLocaleString()
                            : "—"}

                        </TableCell>


                        {/* STATUS */}

                        <TableCell>

                          <Badge
                            variant={getBadgeVariant(
                              status
                            )}
                          >
                            {status}
                          </Badge>

                        </TableCell>

                      </TableRow>

                    );
                  })

                ) : (

                  <TableRow>

                    <TableCell
                      colSpan={5}
                      className="text-center py-12"
                    >

                      <History
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
                        No history found
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                          mt-1
                        "
                      >

                        {search
                          ? "Try a different search term."
                          : "Asset movements will appear here."}

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