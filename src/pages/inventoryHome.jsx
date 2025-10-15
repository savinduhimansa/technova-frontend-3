// src/inventoryHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../api/api.js";

export default function InventoryHome() {
  return (
    <div className="min-h-screen">
      <style>{`
        body{
          background:
            radial-gradient(1000px 600px at 110% 0%, rgba(59,130,246,.10), transparent 60%),
            radial-gradient(1200px 800px at 0% 0%, rgba(30,58,138,.10), transparent 60%),
            #ffffff;
          color:#1E3A8A;
          font-family:"Poppins","Montserrat","Roboto",system-ui,-apple-system,Segoe UI,Helvetica,Arial;
        }
      `}</style>

      <main className="max-w-6xl mx-auto px-5 py-8">
        <InventoryView />
      </main>
    </div>
  );
}

/* ================== INVENTORY VIEW ================== */
function InventoryView() {
  // --- Blue Horizon palette ---
  const blue = {
    sidebarBg: "#1E3A8A",
    sidebarHover: "#1E40AF",
    accent: "#3B82F6",
    cardBg: "#DBEAFE",
    cardBorder: "#BFDBFE",
    tableHeader: "#BFDBFE",
    rowHover: "#EFF6FF",
    textPri: "#1E40AF",
    textSec: "#1E3A8A",
    green: "#22C55E",
    yellow: "#FACC15",
    red: "#EF4444",
  };

  // ------------------ state ------------------
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filters
  const [search, setSearch] = useState(getParam("search") || "");
  const [category, setCategory] = useState(getParam("category") || "");
  const [brand, setBrand] = useState(getParam("brand") || "");
  const [minPrice, setMinPrice] = useState(getParam("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(getParam("maxPrice") || "");
  const [inStock, setInStock] = useState(getParam("inStock") || ""); // "", "true", "false"
  const [lowStockOnly, setLowStockOnly] = useState(getParam("lowStockOnly") === "true");

  // auxiliary data
  const [brands, setBrands] = useState([]);

  // debounce search so we don’t spam the API
  const debouncedSearch = useDebouncedValue(search, 300);

  // ------------------ sync URL <-> filters ------------------
  useEffect(() => {
    const url = new URL(window.location.href);
    setParam(url, "page", "inventory");
    setParam(url, "search", search);
    setParam(url, "category", category);
    setParam(url, "brand", brand);
    setParam(url, "minPrice", minPrice);
    setParam(url, "maxPrice", maxPrice);
    setParam(url, "inStock", inStock);
    setParam(url, "lowStockOnly", lowStockOnly ? "true" : "");
    window.history.replaceState({}, "", url);
  }, [search, category, brand, minPrice, maxPrice, inStock, lowStockOnly]);

  // ------------------ fetch products ------------------
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const qs = buildQuery({
          search: debouncedSearch || undefined,
          category: category || undefined,
          brand: brand || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          inStock: inStock || undefined,
        });
        const res = await fetch(`/api/products${qs}`, { signal: controller.signal });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.message || "Failed to load products.");

        const list = Array.isArray(j.data) ? j.data : [];
        const filtered = lowStockOnly ? list.filter((p) => Number(p.stock) < 5) : list;
        setItems(filtered);

        const uniqueBrands = [...new Set(list.map((p) => p.brand).filter(Boolean))].sort();
        setBrands(uniqueBrands);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Network error.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [debouncedSearch, category, brand, minPrice, maxPrice, inStock, lowStockOnly]);

  // ------------------ delete action ------------------
  async function deleteProduct(prod) {
    const id = prod._id || prod.productId;
    if (!id) return alert("Unable to determine product id.");
    if (!window.confirm(`Delete “${prod.name}” permanently?`)) return;

    try {
      await PRODUCTS.delete(encodeURIComponent(id)); // uses axios helper with auth header
      // remove from list locally
      setItems((prev) => prev.filter((p) => (p._id || p.productId) !== id));
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed.";
      alert(msg);
    }
  }

  // ------------------ helpers ------------------
  function resetFilters() {
    setSearch("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setInStock("");
    setLowStockOnly(false);
  }

  const categories = [
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
    "Fans"
  ];

  // Local table cells so we don't depend on external Th/Td
  const ThCell = ({ children, align = "left" }) => (
    <th className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>
  );
  const TdCell = ({ children, align = "left" }) => (
    <td className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"}`}>{children}</td>
  );

  return (
    <section className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: blue.textPri }}>
          <i className="fa-solid fa-boxes-stacked mr-2" style={{ color: blue.accent }} />
          Inventory
        </h2>

        {/* ✅ go to sibling route under /inv */}
        <Link
          className="px-3 py-2 rounded-lg text-sm text-white"
          style={{ backgroundColor: blue.accent }}
          to="/inv/products/new"
        >
          <i className="fa-solid fa-plus mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters bar */}
      <div
        className="rounded-xl p-4 border flex flex-col gap-3 md:flex-row md:items-end md:flex-wrap"
        style={{ backgroundColor: blue.cardBg, borderColor: blue.cardBorder }}
      >
        <div className="flex-1 min-w-[220px]">
          <BHLabel>Search</BHLabel>
          <input
            className="w-full rounded-md px-3 py-2 border"
            placeholder="Name or alt name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: blue.cardBorder, color: blue.textSec }}
          />
        </div>

        <div className="min-w-[180px]">
          <BHLabel>Category</BHLabel>
          <select
            className="w-full rounded-md px-3 py-2 border"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ borderColor: blue.cardBorder, color: blue.textSec }}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[180px]">
          <BHLabel>Brand</BHLabel>
          <select
            className="w-full rounded-md px-3 py-2 border"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{ borderColor: blue.cardBorder, color: blue.textSec }}
          >
            <option value="">All</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[160px]">
          <BHLabel>Min Price</BHLabel>
          <input
            type="number"
            className="w-full rounded-md px-3 py-2 border"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            style={{ borderColor: blue.cardBorder, color: blue.textSec }}
          />
        </div>

        <div className="min-w-[160px]">
          <BHLabel>Max Price</BHLabel>
          <input
            type="number"
            className="w-full rounded-md px-3 py-2 border"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="2000"
            style={{ borderColor: blue.cardBorder, color: blue.textSec }}
          />
        </div>

        <div className="min-w-[180px]">
          <BHLabel>Stock</BHLabel>
          <select
            className="w-full rounded-md px-3 py-2 border"
            value={inStock}
            onChange={(e) => setInStock(e.target.value)}
            style={{ borderColor: blue.cardBorder, color: blue.textSec }}
          >
            <option value="">All</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
        </div>

        <div className="flex items-center gap-2 min-w-[160px]">
          <input
            id="lowStock"
            type="checkbox"
            className="w-4 h-4"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          <label htmlFor="lowStock" className="text-sm" style={{ color: blue.textSec }}>
            Only low stock (&lt; 5)
          </label>
        </div>

        <div className="ml-auto">
          <button
            onClick={resetFilters}
            className="px-3 py-2 rounded-md text-white text-sm"
            style={{ backgroundColor: blue.sidebarHover }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Status / Errors */}
      {err ? (
        <div className="rounded-md px-3 py-2 text-sm" style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}>
          {err}
        </div>
      ) : null}

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: blue.cardBorder, backgroundColor: "white" }}
      >
        <div
          className="px-5 py-3 text-sm"
          style={{
            color: blue.textSec,
            backgroundColor: blue.cardBg,
            borderBottom: `1px solid ${blue.cardBorder}`,
          }}
        >
          Products {loading ? "• Loading…" : `• ${items.length} result${items.length === 1 ? "" : "s"}`}
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: blue.tableHeader }}>
              <tr style={{ color: blue.textPri }}>
                <ThCell align="left">Product ID</ThCell>
                <ThCell align="left">Name</ThCell>
                <ThCell align="left">Brand</ThCell>
                <ThCell align="left">Category</ThCell>
                <ThCell align="right">Price</ThCell>
                <ThCell align="right">Cost</ThCell>
                <ThCell align="right">Stock</ThCell>
                <ThCell align="right">Status</ThCell>
                <ThCell align="right">Actions</ThCell>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                    No items match your filters.
                  </td>
                </tr>
              ) : null}
              {items.map((p) => {
                const low = Number(p.stock) < 5;
                return (
                  <tr
                    key={p._id || p.productId}
                    className="border-t"
                    style={{ borderColor: blue.cardBorder }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = blue.rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <TdCell>{p.productId}</TdCell>
                    <TdCell>{p.name}</TdCell>
                    <TdCell>{p.brand}</TdCell>
                    <TdCell>{p.category}</TdCell>
                    <TdCell align="right">${Number(p.price).toLocaleString()}</TdCell>
                    <TdCell align="right">${Number(p.labeledPrice).toLocaleString()}</TdCell>
                    <TdCell align="right">{p.stock}</TdCell>
                    <TdCell align="right">
                      {Number(p.stock) <= 0 ? (
                        <StockBadge color={blue.red} text="Out" />
                      ) : low ? (
                        <StockBadge color={blue.yellow} text="Low" />
                      ) : (
                        <StockBadge color={blue.green} text="OK" />
                      )}
                    </TdCell>
                    <TdCell align="right">
                      {/* ✅ link to sibling route under /inv (reads ?id=) */}
                      <Link
                        className="inline-block px-3 py-1 rounded-md text-white text-xs mr-2"
                        style={{ backgroundColor: blue.accent }}
                        to={`/inv/products/edit?id=${encodeURIComponent(p._id || p.productId)}`}
                      >
                        <i className="fa-regular fa-pen-to-square mr-1" />
                        Edit
                      </Link>

                      <button
                        className="inline-block px-3 py-1 rounded-md text-white text-xs"
                        style={{ backgroundColor: blue.red }}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProduct(p);
                        }}
                      >
                        <i className="fa-regular fa-trash-can mr-1" />
                        Delete
                      </button>
                    </TdCell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------- local UI helpers used by InventoryView ---------- */
function BHLabel({ children }) {
  return (
    <div className="text-xs font-semibold mb-1" style={{ color: "#1E3A8A" }}>
      {children}
    </div>
  );
}

function StockBadge({ color, text }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2 py-[2px] rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      {text}
    </span>
  );
}

function getParam(key) {
  const p = new URLSearchParams(window.location.search);
  return p.get(key) ?? "";
}

function setParam(url, key, val) {
  if (val === undefined || val === null || val === "") url.searchParams.delete(key);
  else url.searchParams.set(key, val);
}

function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, v);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// simple debounce hook
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
