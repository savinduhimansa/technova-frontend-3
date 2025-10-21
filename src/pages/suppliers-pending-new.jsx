// src/pages/suppliers-pending-new.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SUPPLIERS } from "../api/api.js";

export default function SupplierAddPendingOrder() {
  const [params] = useSearchParams();
  const supplierId = params.get("id");
  const nav = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [ref, setRef] = useState("");       // required
  const [title, setTitle] = useState("");   // optional
  const [amount, setAmount] = useState(""); // optional
  const [eta, setEta] = useState("");       // optional YYYY-MM-DD
  const [note, setNote] = useState("");     // optional
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setErr("");
      try {
        if (!supplierId) return setErr("Missing supplier id.");
        const res = await SUPPLIERS.getById(supplierId);
        const one = res?.data?.data || res?.data || null;
        if (!ignore) setSupplier(one);
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.message || e.message || "Failed to load supplier.");
      }
    })();
    return () => (ignore = true);
  }, [supplierId]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!ref.trim()) return setErr("Order reference is required.");
    setErr("");
    setSaving(true);
    try {
      await SUPPLIERS.pending.add(supplierId, {
        ref: ref.trim(),
        title: title.trim() || undefined,
        amount: amount !== "" ? Number(amount) : undefined,
        eta: eta ? new Date(eta).toISOString() : undefined,
        note: note.trim() || undefined,
      });
      nav("/inv/suppliers");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to add pending order.");
    } finally {
      setSaving(false);
    }
  }

  const theme = { primary: "#1E40AF", brand: "#3B82F6", border: "#BFDBFE" };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: theme.primary }}>
          Add Pending Order
        </h2>
        <Link
          to="/inv/suppliers"
          className="px-3 py-2 rounded-md text-white"
          style={{ backgroundColor: theme.brand }}
        >
          ← Back
        </Link>
      </div>

      {supplier ? (
        <div
          className="rounded-lg p-3 text-sm"
          style={{ border: `1px solid ${theme.border}` }}
        >
          <div><span className="font-semibold">Supplier ID:</span> {supplier.supplierId}</div>
          <div><span className="font-semibold">Name:</span> {supplier.supplierName}</div>
        </div>
      ) : null}

      {err ? (
        <div className="rounded-md px-3 py-2 text-sm bg-red-50 text-red-700">{err}</div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: theme.primary }}>
            Order Reference <span className="text-red-500">*</span>
          </label>
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="e.g., HP-1556"
            style={{ borderColor: theme.border }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: theme.primary }}>
              Title (optional)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="HP toner batch"
              style={{ borderColor: theme.border }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: theme.primary }}>
              Amount (optional)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="125000"
              style={{ borderColor: theme.border }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: theme.primary }}>
            ETA (optional)
          </label>
          <input
            type="date"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ borderColor: theme.border }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: theme.primary }}>
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Awaiting invoice; ETA 24 Oct"
            style={{ borderColor: theme.border }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-2 rounded-md text-white"
            style={{ backgroundColor: theme.brand, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving…" : "Add Pending Order"}
          </button>
          <Link
            to="/inv/suppliers"
            className="px-3 py-2 rounded-md text-sm"
            style={{ border: `1px solid ${theme.border}` }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
