import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Navbar />
        <main className="p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}