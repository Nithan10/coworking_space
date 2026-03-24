import "./components/Layout.css";
import Sidebar from "./components/sidebar";
import AdminNavbar from "./components/navbar";

export const metadata = {
  title: "Admin Dashboard | SpaceHub",
  description: "Manage bookings, users, and locations for SpaceHub.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // We prevent scrolling on the body so the sidebar and main content scroll independently
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden selection:bg-indigo-500/30">
      
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navbar - Fixed at top of content area */}
        <AdminNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto admin-scroll p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}