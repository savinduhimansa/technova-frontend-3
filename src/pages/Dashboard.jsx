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

// --- Theme colors (consistent with Blue Horizon palette)
const blue = {
  bgCard: "#DBEAFE",
  border: "#BFDBFE",
  primary: "#1E40AF",
  accent: "#3B82F6",
  yellow: "#FACC15",
  green: "#22C55E",
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    inStock: "all",
    category: "",
  });

  // detect role
  const [role, setRole] = useState("guest");
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      setRole(payload.role?.toLowerCase?.() || "guest");
    } catch {
      setRole("guest");
    }
  }, []);

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

  const priceTrend = products.map((p) => ({
    name: p.name,
    labeledPrice: p.labeledPrice,
    price: p.price,
  }));

  const COLORS = [
    "#3B82F6",
    "#1E40AF",
    "#22C55E",
    "#FACC15",
    "#EF4444",
    "#8B5CF6",
  ];

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  // --- Handle Report Download
  const handleDownloadClick = () => {
    setShowFilterModal(true);
  };

  const downloadReport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.inStock !== "all") params.append("inStock", filters.inStock);
      if (filters.category) params.append("category", filters.category);

      const token = localStorage.getItem("token") || "";
      const res = await fetch(`/api/products/report/pdf?${params.toString()}`, {
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
      setShowFilterModal(false);
    } catch (err) {
      alert("Failed to download report: " + (err?.message || "Unknown error"));
    }
  };

  // --- Dynamic back button
  const isAdmin = role === "admin";
  const backLink = isAdmin ? "/admindashboard" : "/";
  const backLabel = isAdmin ? "← Back to Admin" : "← Back to Homepage";

  return (
    <section className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: blue.primary }}>
          📊 Inventory Dashboard
        </h1>
        <a
          href={backLink}
          className="px-3 py-2 rounded-md text-white text-sm"
          style={{ backgroundColor: blue.accent }}
        >
          {backLabel}
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Stock" value={totalStock} accent={blue.accent} />
        <Card title="Low Stock Items" value={lowStockCount} accent={blue.yellow} />
        <Card title="Categories" value={categoriesCount} accent={blue.green} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill={blue.accent} />
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

      {/* NEW: Labeled Price vs Selling Price */}
      <ChartCard title="Cost vs. Selling Price">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="labeledPrice" stroke={blue.accent} name="Cost" />
            <Line type="monotone" dataKey="price" stroke={blue.green} name="Selling Price" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Report button */}
      <div className="text-right">
        <button
          onClick={handleDownloadClick}
          className="px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: blue.accent }}
        >
          ⬇️ Download Inventory Report
        </button>
      </div>

      {/* --- Floating Filter Modal --- */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 w-full max-w-md shadow-lg"
            style={{ backgroundColor: "#ffffff", border: `1px solid ${blue.border}` }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: blue.primary }}>
              Filter Inventory Report
            </h2>

            {/* In-stock filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: blue.primary }}>
                Stock Status
              </label>
              <select
                value={filters.inStock}
                onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.value }))}
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: blue.border }}
              >
                <option value="all">All Items</option>
                <option value="true">In Stock Only</option>
                <option value="false">Out of Stock Only</option>
              </select>
            </div>

            {/* Category filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: blue.primary }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: blue.border }}
              >
                <option value="">All Categories</option>
                {[
                  "Laptops",
                  "Desktops",
                  "Monitors",
                  "Keyboards",
                  "Mice",
                  "Headsets",
                  "Graphics Cards",
                  "CPUs",
                  "Storage",
                  "Motherboards",
                  "RAM",
                  "GPUs",
                  "Cases",
                  "SSDs",
                  "HDDs",
                  "PSUs",
                  "Fans",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 rounded-md text-sm"
                style={{ border: `1px solid ${blue.border}`, color: blue.primary }}
              >
                Cancel
              </button>
              <button
                onClick={downloadReport}
                className="px-4 py-2 rounded-md text-white text-sm"
                style={{ backgroundColor: blue.accent }}
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* --- Reusable Components --- */
function Card({ title, value, accent }) {
  return (
    <div
      className="rounded-lg p-6 border shadow text-center"
      style={{ backgroundColor: blue.bgCard, borderColor: blue.border }}
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
      style={{ backgroundColor: blue.bgCard, borderColor: blue.border }}
    >
      <h3 className="font-semibold mb-4" style={{ color: blue.primary }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
