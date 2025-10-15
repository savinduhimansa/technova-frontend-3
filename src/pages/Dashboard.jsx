// src/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const j = await res.json();
        if (res.ok && j?.data) setProducts(j.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    })();
  }, []);

  // Prepare chart data
  const stockByCategory = Object.entries(
    products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.stock;
      return acc;
    }, {})
  ).map(([cat, stock]) => ({ category: cat, stock }));

  const stockTrend = products.map((p, i) => ({
    name: p.name,
    stock: p.stock,
    price: p.price,
  }));

  const COLORS = ["#3B82F6", "#1E40AF", "#22C55E", "#FACC15", "#EF4444", "#8B5CF6"];

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  const downloadReport = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/products/report/pdf", {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/pdf")) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `HTTP ${res.status} while generating report`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory-report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold text-[#1E40AF]">📊 Inventory Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Stock" value={totalStock} accent="#3B82F6" />
        <Card title="Low Stock Items" value={lowStockCount} accent="#FACC15" />
        <Card title="Categories" value={categoriesCount} accent="#22C55E" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Stock Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockByCategory}
                dataKey="stock"
                nameKey="category"
                outerRadius={120}
                label
              >
                {stockByCategory.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Stock & Price Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="stock" stroke="#3B82F6" />
            <Line type="monotone" dataKey="price" stroke="#22C55E" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Report button */}
      <div className="text-right">
        <button
          onClick={downloadReport}
          className="px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: "#3B82F6" }}
        >
          ⬇️ Download Inventory Report
        </button>
      </div>
    </section>
  );
}

/* --- Reusable Components --- */
function Card({ title, value, accent }) {
  return (
    <div
      className="rounded-lg p-6 border shadow text-center"
      style={{ backgroundColor: "#DBEAFE", borderColor: "#BFDBFE" }}
    >
      <p className="text-sm" style={{ color: "#1E3A8A" }}>
        {title}
      </p>
      <h3 className="text-2xl font-bold" style={{ color: accent }}>
        {value}
      </h3>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div
      className="rounded-lg p-6 border shadow"
      style={{ backgroundColor: "#DBEAFE", borderColor: "#BFDBFE" }}
    >
      <h3 className="font-semibold mb-4" style={{ color: "#1E40AF" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
