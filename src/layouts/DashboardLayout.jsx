// src/layouts/DashboardLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ml-[250px] min-h-screen flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-background px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">

            <p>
              © {new Date().getFullYear()} CARS. All rights reserved.
            </p>

            <p>
              Customer Asset Registration System
            </p>

          </div>
        </footer>

      </div>

    </div>
  );
}