import { Outlet } from "react-router-dom";
import SalesSidebar from "../components/SalesSidebar";

export default function SalesDashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <SalesSidebar />
      <main className="ml-64 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
