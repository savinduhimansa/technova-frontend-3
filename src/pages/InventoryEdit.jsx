// src/InventoryEdit.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen, FaList, FaPenToSquare, FaArrowRotateRight, FaCheck,
  FaCircleCheck, FaCircleExclamation, FaSquarePlus, FaFloppyDisk, FaTrashCan,
} from "react-icons/fa6";
import { PRODUCTS } from "../api/api.js";

export default function InventoryEdit() {
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

  const id = useMemo(() => new URLSearchParams(window.location.search).get("id"), []);

  const [form, setForm] = useState({
    productId: "", name: "", brand: "", altNames: "",
    category: "Laptops", price: "", labeledPrice: "", stock: "",
    images: "", description: "",
  });
  const [stockInput, setStockInput] = useState("");
  const [error, setError] = useState("");
  const [toastOk, setToastOk] = useState(false);
  const [toastDanger, setToastDanger] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const parseCSV = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);
  const listToCSV = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

  const { margin, markup } = useMemo(() => {
    const price = parseFloat(form.price);
    const cost = parseFloat(form.labeledPrice);
    if (!Number.isFinite(price) || !Number.isFinite(cost)) return { margin: "—", markup: "—" };
    const m = price - cost;
    const k = cost > 0 ? (m / cost) * 100 : 0;
    return { margin: `$${m.toFixed(2)}`, markup: `${k.toFixed(1)}%` };
  }, [form.price, form.labeledPrice]);

  const showErr = (msg) => {
    setError(msg || "Something went wrong.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const hideErr = () => setError("");

  const showOkToast = () => { setToastOk(true); setTimeout(() => setToastOk(false), 3500); };
  const showDangerToast = () => { setToastDanger(true); setTimeout(() => setToastDanger(false), 1200); };

  // ---------- Load product ----------
  useEffect(() => {
    (async () => {
      if (!id) return showErr("Missing ?id= in URL (productId or Mongo _id).");
      try {
        const res = await PRODUCTS.getOne(encodeURIComponent(id));
        const j = res?.data || {};
        if (!j?.data) return showErr(j?.message || "Failed to load product.");

        const p = j.data;
        setForm({
          productId: p.productId || "",
          name: p.name || "",
          brand: p.brand || "",
          altNames: listToCSV(p.altNames || []),
          category: p.category || "Laptops",
          price: p.price ?? "",
          labeledPrice: p.labeledPrice ?? "",
          stock: p.stock ?? 0,
          images: listToCSV(p.images || []),
          description: p.description || "",
        });
        setStockInput(p.stock ?? 0);
      } catch (e) {
        showErr(e?.response?.data?.message || e.message || "Network error.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- Save (PUT) ----------
  const save = async (e) => {
    e.preventDefault();
    hideErr();
    if (!id) return showErr("Missing ?id= in URL.");

    const payload = {
      productId: form.productId.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      altNames: parseCSV(form.altNames),
      category: form.category,
      price: Number(form.price),
      labeledPrice: Number(form.labeledPrice),
      description: form.description.trim(),
      images: parseCSV(form.images),
      stock: Number(form.stock),
    };

    if (!payload.images.length) {
      payload.images = ["https://d2ati23fc66y9j.cloudfront.net/category-pages/sub_category-174021874143.jpg"];
    }

    if (
      !payload.productId || !payload.name || !payload.brand || !payload.category ||
      !Number.isFinite(payload.price) || !Number.isFinite(payload.labeledPrice) || !Number.isFinite(payload.stock)
    ) {
      return showErr("Please fill all required fields with valid values.");
    }
    if (payload.price < 0 || payload.labeledPrice < 0 || payload.stock < 0) {
      return showErr("Price, Labeled Price, and Stock cannot be negative.");
    }

    try {
      await PRODUCTS.update(encodeURIComponent(id), payload);
      showOkToast();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update product.";
      if (e?.response?.status === 409) return showErr(msg || "Duplicate productId or name.");
      showErr(msg);
    }
  };

  // ---------- Set stock (PATCH) ----------
  const setStock = async () => {
    hideErr();
    if (!id) return showErr("Missing ?id= in URL.");
    const qty = Number(stockInput);
    if (!Number.isFinite(qty) || qty < 0) return showErr("Enter a valid non-negative stock quantity.");
    try {
      await PRODUCTS.setStock(encodeURIComponent(id), qty);
      setForm((f) => ({ ...f, stock: qty }));
      showOkToast();
    } catch (e) {
      showErr(e?.response?.data?.message || "Failed to set stock.");
    }
  };

  // ---------- Delete ----------
  const del = async () => {
    hideErr();
    if (!id) return showErr("Missing ?id= in URL.");
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await PRODUCTS.delete(encodeURIComponent(id));
      showDangerToast();
      // Gentle redirect to Inventory list after toast shows
      setTimeout(() => {
        window.location.assign("/inv/inventory");
      }, 900);
    } catch (e) {
      showErr(e?.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <header
        className="px-5 py-3"
        style={{ backgroundColor: blue.sidebarBg, color: "white" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: blue.sidebarHover }}>
              <FaBoxOpen />
            </div>
            <h1 className="text-lg font-extrabold">TechNova Inventory</h1>
            <span className="text-white/80 text-sm">
              / Edit Product <span style={{ color: blue.cardBg }}>{id || ""}</span>
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              className="px-3 py-2 rounded-lg text-sm text-white"
              style={{ backgroundColor: blue.accent }}
              to="../inventory"
            >
              <FaList className="mr-2 inline-block" /> Back to Inventory
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 space-y-6">
        {/* Card */}
        <section
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: blue.cardBg, borderColor: blue.cardBorder }}
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold" style={{ color: blue.textPri }}>
                <FaPenToSquare className="mr-2 inline-block" style={{ color: blue.accent }} />
                Edit Product
              </h2>
              <p className="text-sm" style={{ color: blue.textSec }}>
                Update details and save to MongoDB.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Badge label="Margin" value={margin} color={blue.accent} />
              <Badge label="Markup%" value={markup} color={blue.accent} />
            </div>
          </div>

          <form onSubmit={save} className="grid md:grid-cols-2 gap-5">
            {/* left */}
            <div className="space-y-4">
              <Field label="Product ID *" border={blue.cardBorder} text={blue.textSec}>
                <input className="w-full rounded-lg px-3 py-2 border" name="productId" value={form.productId} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
              </Field>
              <Field label="Name *" border={blue.cardBorder} text={blue.textSec}>
                <input className="w-full rounded-lg px-3 py-2 border" name="name" value={form.name} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
              </Field>
              <Field label="Brand *" border={blue.cardBorder} text={blue.textSec}>
                <input className="w-full rounded-lg px-3 py-2 border" name="brand" value={form.brand} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
              </Field>
              <Field label="Alt Names (comma separated)" border={blue.cardBorder} text={blue.textSec}>
                <input className="w-full rounded-lg px-3 py-2 border" name="altNames" value={form.altNames} onChange={onChange} style={{ borderColor: blue.cardBorder }} />
              </Field>
              <Field label="Category *" border={blue.cardBorder} text={blue.textSec}>
                <select className="w-full rounded-lg px-3 py-2 border" name="category" value={form.category} onChange={onChange} required style={{ borderColor: blue.cardBorder }}>
                  <option>Laptops</option><option>Desktops</option><option>Monitors</option>
                  <option>Keyboards</option><option>Mice</option><option>Headsets</option>
                  <option>Graphics Cards</option><option>CPUs</option><option>Storage</option>
                </select>
              </Field>
            </div>

            {/* right */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (sell) *" border={blue.cardBorder} text={blue.textSec}>
                  <input className="w-full rounded-lg px-3 py-2 border" name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
                </Field>
                <Field label="Labeled Price (cost) *" border={blue.cardBorder} text={blue.textSec}>
                  <input className="w-full rounded-lg px-3 py-2 border" name="labeledPrice" type="number" min="0" step="0.01" value={form.labeledPrice} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
                </Field>
              </div>
              <Field label="Stock *" border={blue.cardBorder} text={blue.textSec}>
                <input className="w-full rounded-lg px-3 py-2 border" name="stock" type="number" min="0" value={form.stock} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
              </Field>
              <Field label="Images (comma separated URLs)" border={blue.cardBorder} text={blue.textSec}>
                <input className="w-full rounded-lg px-3 py-2 border" name="images" value={form.images} onChange={onChange} style={{ borderColor: blue.cardBorder }} />
              </Field>
              <Field label="Description *" border={blue.cardBorder} text={blue.textSec}>
                <textarea className="w-full rounded-lg px-3 py-2 border" rows={4} name="description" value={form.description} onChange={onChange} required style={{ borderColor: blue.cardBorder }} />
              </Field>
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between pt-2 gap-3">
              <div className={`text-sm ${error ? "block" : "invisible"}`} style={{ color: "#991B1B" }}>
                {error || "-"}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: blue.sidebarHover }}
                  to="../products/new"
                >
                  <FaSquarePlus className="mr-2 inline-block" />
                  New Product
                </Link>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: blue.accent }}
                >
                  <FaFloppyDisk className="mr-2 inline-block" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={del}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: blue.red }}
                >
                  <FaTrashCan className="mr-2 inline-block" />
                  Delete
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Quick Stock Update */}
        <section
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: blue.cardBg, borderColor: blue.cardBorder }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: blue.textPri }}>
            <FaArrowRotateRight className="mr-2 inline-block" style={{ color: blue.accent }} />
            Quick Stock Set
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              className="rounded-lg px-3 py-2 border w-40"
              type="number"
              min="0"
              placeholder="Quantity"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              style={{ borderColor: blue.cardBorder, color: blue.textSec }}
            />
            <button
              onClick={setStock}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: blue.accent }}
            >
              <FaCheck className="mr-2 inline-block" />
              Set Stock
            </button>
            <p className="text-sm" style={{ color: blue.textSec }}>
              Uses <code>PATCH /api/products/:id/stock</code>
            </p>
          </div>
        </section>

        {/* Toasts */}
        {toastOk && (
          <div
            className="fixed bottom-6 right-6 rounded-xl px-4 py-3 border"
            style={{ backgroundColor: blue.cardBg, borderColor: blue.cardBorder }}
          >
            <div className="flex items-center gap-3">
              <FaCircleCheck style={{ color: blue.green }} />
              <div>
                <div className="font-semibold" style={{ color: blue.textPri }}>Updated!</div>
                <div className="text-sm" style={{ color: blue.textSec }}>Product saved successfully.</div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <Link to="../inventory" className="text-sm" style={{ color: blue.accent }}>
                Back to Inventory
              </Link>
            </div>
          </div>
        )}

        {toastDanger && (
          <div
            className="fixed bottom-6 right-6 rounded-xl px-4 py-3 border"
            style={{ backgroundColor: blue.cardBg, borderColor: blue.cardBorder }}
          >
            <div className="flex items-center gap-3">
              <FaCircleExclamation style={{ color: blue.red }} />
              <div>
                <div className="font-semibold" style={{ color: blue.textPri }}>Deleted</div>
                <div className="text-sm" style={{ color: blue.textSec }}>Product removed.</div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <Link to="../inventory" className="text-sm" style={{ color: blue.accent }}>
                Back to Inventory
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children, border, text }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1" style={{ color: text || "#1E3A8A" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Badge({ label, value, color }) {
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border"
      style={{ backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#111827" }}
    >
      <span className="opacity-70">{label}</span>
      <span className="font-bold ml-2" style={{ color }}>{value}</span>
    </div>
  );
}
