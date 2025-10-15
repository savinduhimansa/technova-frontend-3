// src/pages/inventoryAdd.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCubes, FaGaugeHigh, FaBoxesStacked, FaTruck, FaPlus,
  FaCircleCheck, FaCircleXmark, FaFloppyDisk,
} from "react-icons/fa6";
import { PRODUCTS } from "../api/api.js";

export default function InventoryAdd() {
  const [form, setForm] = useState({
    productId: "", name: "", brand: "", altNames: "",
    category: "", price: "", labeledPrice: "", stock: "",
    images: "", description: "",
  });
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { margin, markup } = useMemo(() => {
    const price = parseFloat(form.price);
    const cost = parseFloat(form.labeledPrice);
    if (!Number.isFinite(price) || !Number.isFinite(cost)) return { margin: "—", markup: "—" };
    const m = price - cost;
    const k = cost > 0 ? (m / cost) * 100 : 0;
    return { margin: `$${m.toFixed(2)}`, markup: `${k.toFixed(1)}%` };
  }, [form.price, form.labeledPrice]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const reset = () => setForm({
    productId: "", name: "", brand: "", altNames: "",
    category: "", price: "", labeledPrice: "", stock: "",
    images: "", description: "",
  });

  const parseCSV = (v = "") => v.split(",").map((s) => s.trim()).filter(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      productId: form.productId.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      altNames: form.altNames ? parseCSV(form.altNames) : [],
      category: form.category,
      price: Number(form.price),
      labeledPrice: Number(form.labeledPrice),
      description: form.description.trim(),
      images: form.images ? parseCSV(form.images) : [],
      stock: Number(form.stock),
    };

    if (!payload.images.length) {
      payload.images = ["https://d2ati23fc66y9j.cloudfront.net/category-pages/sub_category-174021874143.jpg"];
    }

    if (!payload.productId || !payload.name || !payload.brand || !payload.category ||
        !Number.isFinite(payload.price) || !Number.isFinite(payload.labeledPrice) || !Number.isFinite(payload.stock)) {
      return setError("Please fill all required fields with valid values.");
    }
    if (payload.price < 0 || payload.labeledPrice < 0 || payload.stock < 0) {
      return setError("Price, Labeled Price, and Stock cannot be negative.");
    }

    try {
      // use the axios helper so auth header is included
      await PRODUCTS.create(payload);
      setShowToast(true);
      reset();
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to save product.";
      if (err?.response?.status === 409) return setError(msg || "Duplicate value for name or productId.");
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen">
      <style>{`
        /* =============== Blue Horizon Theme =============== */
        :root{
          --bh-sidebar:#1E3A8A;
          --bh-sidebar-hover:#1E40AF;
          --bh-accent:#3B82F6;
          --bh-card-bg:#DBEAFE;
          --bh-card-border:#BFDBFE;
          --bh-row-hover:#EFF6FF;
          --bh-text-pri:#1E40AF;
          --bh-text-sec:#1E3A8A;
          --bh-green:#22C55E;
          --bh-yellow:#FACC15;
          --bh-red:#EF4444;
        }
        body{
          background:#ffffff;
          color:var(--bh-text-sec);
          font-family:"Poppins","Montserrat","Roboto",system-ui,-apple-system,Segoe UI,Helvetica,Arial;
        }
        header.sticky{
          background:var(--bh-sidebar) !important;
          color:#fff !important;
          border-color:rgba(255,255,255,.15) !important;
        }
        header.sticky a{ color:#fff; }
        header.sticky .text-slate-500{ color:#e5ecff !important; opacity:.9; }

        .neon-card{
          background:var(--bh-card-bg);
          border:1px solid var(--bh-card-border);
        }
        .btn-neon{
          background:var(--bh-accent);
          border:1px solid var(--bh-accent);
          color:#fff;
          transition:transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
          box-shadow: 0 6px 12px rgba(59,130,246,.15);
        }
        .btn-neon:hover{
          transform: translateY(-1px);
          background:#2563EB;
          border-color:#2563EB;
          box-shadow: 0 10px 18px rgba(37,99,235,.22);
        }
        .field{
          background:#fff;
          border:1px solid var(--bh-card-border);
          color:var(--bh-text-sec);
        }
        .field::placeholder{ color:#9aa7c7; }
        .field:focus{
          outline:none;
          border-color:var(--bh-accent);
          box-shadow:0 0 0 3px rgba(59,130,246,.25);
        }
        label{ color:var(--bh-text-sec) !important; }
        .text-slate-400{ color:var(--bh-text-pri) !important; opacity:.9; }
        .text-slate-500{ color:var(--bh-text-pri) !important; opacity:.8; }
        .badge{
          border:1px solid var(--bh-card-border);
          background:#EEF2FF;
          color:var(--bh-text-sec);
        }
        .toast{
          animation: rise .25s ease-out;
          background:var(--bh-card-bg);
          border:1px solid var(--bh-card-border);
          color:var(--bh-text-sec);
        }
        @keyframes rise{ from{opacity:0; transform: translateY(8px)} to{opacity:1; transform:none} }
        .brand-chip{ background:linear-gradient(135deg,#3B82F6 0%,#1E40AF 100%); }
      `}</style>

      {/* Top bar */}
      <header className="sticky top-0 z-10 px-5 py-3 border-b bg-[#1E3A8A]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg brand-chip flex items-center justify-center shadow">
              <FaCubes className="text-white" />
            </div>
            <h1 className="text-lg font-extrabold text-white">TechNova Inventory</h1>
            <span className="text-slate-500 text-sm">/ Add Product</span>
          </div>
          <nav className="flex items-center gap-2">
            {/* ✅ keep navigation inside /inv/* */}
            <Link className="btn-neon px-3 py-2 rounded-lg text-sm" to="../dashboard">
              <FaGaugeHigh className="mr-2 inline-block" /> Dashboard
            </Link>
            <Link className="btn-neon px-3 py-2 rounded-lg text-sm" to="../inventory">
              <FaBoxesStacked className="mr-2 inline-block" /> Inventory
            </Link>
            <Link className="btn-neon px-3 py-2 rounded-lg text-sm" to="../suppliers">
              <FaTruck className="mr-2 inline-block" /> Suppliers
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-5 py-8">
        <section className="neon-card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold" style={{color:"var(--bh-text-pri)"}}>
                <FaPlus className="mr-2 inline-block" style={{color:"var(--bh-accent)"}} />
                Add Product
              </h2>
              <p className="text-slate-400 text-sm mt-1">Fill details and save to MongoDB.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="badge rounded-lg px-3 py-2 text-sm">
                <span className="text-slate-400">Margin</span> <span className="font-bold ml-2">{margin}</span>
              </div>
              <div className="badge rounded-lg px-3 py-2 text-sm">
                <span className="text-slate-400">Markup%</span> <span className="font-bold ml-2">{markup}</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
            {/* left column */}
            <div className="space-y-4">
              <Field label="Product ID *">
                <input className="field w-full rounded-lg px-3 py-2" name="productId" value={form.productId} onChange={onChange} required placeholder="e.g., LAP-001" />
              </Field>
              <Field label="Name *">
                <input className="field w-full rounded-lg px-3 py-2" name="name" value={form.name} onChange={onChange} required placeholder="e.g., ThinkPad X1 Carbon" />
              </Field>
              <Field label="Brand *">
                <input className="field w-full rounded-lg px-3 py-2" name="brand" value={form.brand} onChange={onChange} required placeholder="e.g., Lenovo" />
              </Field>
              <Field label="Alt Names (comma separated)">
                <input className="field w-full rounded-lg px-3 py-2" name="altNames" value={form.altNames} onChange={onChange} placeholder="X1C, X1 Carbon Gen 11" />
              </Field>
              <Field label="Category *">
                <select className="field w-full rounded-lg px-3 py-2" name="category" value={form.category} onChange={onChange} required>
                  <option value="" disabled>Select category</option>
                  <option>Laptops</option><option>Desktops</option><option>Monitors</option>
                  <option>Keyboards</option><option>Mice</option><option>Headsets</option>
                  <option>Graphics Cards</option><option>CPUs</option><option>Storage</option>
                </select>
              </Field>
            </div>

            {/* right column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (sell) *">
                  <input className="field w-full rounded-lg px-3 py-2" name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required placeholder="1599" />
                </Field>
                <Field label="Labeled Price (cost) *">
                  <input className="field w-full rounded-lg px-3 py-2" name="labeledPrice" type="number" min="0" step="0.01" value={form.labeledPrice} onChange={onChange} required placeholder="1200" />
                </Field>
              </div>

              <Field label="Stock *">
                <input className="field w-full rounded-lg px-3 py-2" name="stock" type="number" min="0" value={form.stock} onChange={onChange} required placeholder="15" />
              </Field>

              <Field label="Images (comma separated URLs)" hint="Leave blank for default image.">
                <input className="field w-full rounded-lg px-3 py-2" name="images" value={form.images} onChange={onChange} placeholder="https://..., https://..." />
              </Field>

              <Field label="Description *">
                <textarea className="field w-full rounded-lg px-3 py-2" rows={4} name="description" value={form.description} onChange={onChange} required placeholder="14-inch ultrabook i7/16/512..." />
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-between pt-2">
              <div className={`text-sm ${error ? "text-red-600" : "invisible"}`}>{error || "-"}</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={reset} className="btn-neon px-4 py-2 rounded-lg"><FaCircleXmark className="mr-2 inline-block" />Clear</button>
                <button type="submit" className="btn-neon px-5 py-2 rounded-lg font-semibold"><FaFloppyDisk className="mr-2 inline-block" />Save Product</button>
              </div>
            </div>
          </form>
        </section>

        {showToast && (
          <div className="fixed bottom-6 right-6 neon-card rounded-xl px-4 py-3 toast">
            <div className="flex items-center gap-3">
              <FaCircleCheck style={{color:"var(--bh-green)"}} />
              <div>
                <div className="font-semibold" style={{color:"var(--bh-text-pri)"}}>Saved!</div>
                <div className="text-sm" style={{color:"var(--bh-text-sec)"}}>Product created successfully.</div>
              </div>
            </div>
            <div className="mt-2 text-right">
              {/* ✅ stay inside /inv/* */}
              <Link to="../inventory" style={{color:"var(--bh-accent)"}} className="text-sm underline">
                Go to Inventory
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
      {hint ? <p className="text-[12px] text-slate-500 mt-1">{hint}</p> : null}
    </div>
  );
}
