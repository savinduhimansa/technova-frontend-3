import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/salesdashboard";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { FiBarChart2 } from "react-icons/fi";

export default function SalesDashboardPage() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try { const res = await getDashboardStats(); setStats(res.data); }
    catch (err) { console.error("Failed to fetch dashboard stats", err); }
  };

  useEffect(() => { fetchStats(); }, []);

  if (!stats) return <p className="text-[#1E3A8A]">Loading...</p>;

  const COLORS = ["#3B82F6", "#1E40AF", "#93C5FD", "#60A5FA"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1E40AF] flex items-center gap-2">
        <FiBarChart2 /> Dashboard
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Orders this Month", value: stats.totalOrdersMonth },
          { label: "Processing Orders", value: stats.processingOrders },
          { label: "Completed Orders", value: stats.completedOrders },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[#BFDBFE] bg-white p-4 shadow-sm">
            <div className="text-[#1E3A8A]">{label}</div>
            <div className="text-3xl font-bold text-[#1E40AF]">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="rounded-xl border border-[#BFDBFE] bg-white p-4 flex-1 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1E40AF] mb-3">Courier Performance</h3>
          <div className="overflow-auto">
            <PieChart width={520} height={380}>
              <Pie data={stats.courierStats} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={140} label>
                {stats.courierStats.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="rounded-xl border border-[#BFDBFE] bg-white p-4 flex-1 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1E40AF] mb-3">Sales by Product</h3>
          <div className="overflow-auto">
            <BarChart width={560} height={380} data={stats.productStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}
