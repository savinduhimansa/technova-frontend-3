// src/SupplierEdit.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTruckField,
  FaList,
  FaPenToSquare,
  FaSquarePlus,
  FaFloppyDisk,
  FaCircleCheck,
} from "react-icons/fa6";
import { SUPPLIERS } from "../api/api.js";

export default function SupplierEdit() {
  const id = useMemo(() => new URLSearchParams(window.location.search).get("id"), []);

  const [form, setForm] = useState({
    supplierId: "",
    supplierName: "",
    contactName: "",
    contactNo: "",
    email: "",
    address: "",
    city: "",
    country: "",
    status: "Active",
    paymentTerms: "NET 30",
    notes: "",
  });

  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const showErr = (msg) => {
    setError(msg || "Something went wrong.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const hideErr = () => setError("");
  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  useEffect(() => {
    (async () => {
      if (!id) return showErr("Missing ?id= in URL (supplierId or Mongo _id).");
      try {
        const res = await SUPPLIERS.getOne(id);
        const j = res.data;

        setForm({
          supplierId: j.supplierId || "",
          supplierName: j.supplierName || j.name || "",
          contactName: j.contactName || "",
          contactNo: j.contactNo || j.phone || "",
          email: j.email || "",
          address: j.address || "",
          city: j.city || "",
          country: j.country || "",
          status: j.status || "Active",
          paymentTerms: j.paymentTerms || "NET 30",
          notes: j.notes || "",
        });
      } catch (e) {
        showErr(e.response?.data?.message || e.message || "Failed to load supplier.");
      }
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    hideErr();
    if (!id) return showErr("Missing ?id= in URL.");

    const payload = {
      supplierId: form.supplierId.trim(),
      supplierName: form.supplierName.trim(),
      contactNo: form.contactNo.trim(),
      email: form.email.trim(),
      address: [form.address, form.city, form.country].filter(Boolean).join(", "),
      // status, paymentTerms, notes are still available but optional
    };

    if (!payload.supplierId || !payload.supplierName) {
      return showErr("Supplier ID and Supplier Name are required.");
    }
    if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
      return showErr("Please enter a valid email.");
    }

    try {
      await SUPPLIERS.update(id, payload);
      showToast();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update supplier.";
      if (err?.response?.status === 409) return showErr(msg || "Duplicate supplierId or supplierName.");
      showErr(msg);
    }
  };

  // Blue Horizon palette
  const blue = {
    sidebarBg: "#1E3A8A",
    sidebarHover: "#1E40AF",
    accent: "#3B82F6",
    cardBg: "#DBEAFE",
    cardBorder: "#BFDBFE",
    textPri: "#1E40AF",
    textSec: "#1E3A8A",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFF" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 px-5 py-3 shadow-sm"
        style={{ backgroundColor: "#ffffff", borderBottom: `1px solid ${blue.cardBorder}` }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: blue.sidebarBg }}
            >
              <FaTruckField className="text-white" />
            </div>
            <h1 className="text-lg font-extrabold" style={{ color: blue.textPri }}>
              TechNova • Suppliers
            </h1>
            <span className="text-sm" style={{ color: blue.textSec }}>
              / Edit Supplier <span style={{ color: blue.accent }}>{id || "—"}</span>
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              className="px-3 py-2 rounded-lg text-sm text-white"
              style={{ backgroundColor: blue.accent }}
              to="../suppliers"
            >
              <FaList className="mr-2 inline-block" />
              Back to Suppliers
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 py-8">
        <section
          className="rounded-2xl p-6"
          style={{ backgroundColor: blue.cardBg, border: `1px solid ${blue.cardBorder}` }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: blue.textPri }}>
            <FaPenToSquare className="mr-2 inline-block" style={{ color: blue.accent }} />
            Edit Supplier
          </h2>
          <p className="text-sm mb-6" style={{ color: blue.textSec }}>
            Update details and save to MongoDB.
          </p>

          {/* error */}
          <div
            className={`mb-4 text-sm px-3 py-2 rounded ${error ? "" : "hidden"}`}
            style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}
          >
            {error || "-"}
          </div>

          <form onSubmit={save} className="grid md:grid-cols-2 gap-5">
            {/* left column */}
            <div className="space-y-4">
              <Field label="Supplier ID *" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="supplierId"
                  value={form.supplierId}
                  onChange={onChange}
                />
              </Field>

              <Field label="Supplier Name *" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="supplierName"
                  value={form.supplierName}
                  onChange={onChange}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Contact Person" blue={blue}>
                  <input
                    className="w-full rounded-md px-3 py-2 border"
                    name="contactName"
                    value={form.contactName}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Phone" blue={blue}>
                  <input
                    className="w-full rounded-md px-3 py-2 border"
                    name="contactNo"
                    value={form.contactNo}
                    onChange={onChange}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" blue={blue}>
                  <input
                    className="w-full rounded-md px-3 py-2 border"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Status" blue={blue}>
                  <select
                    className="w-full rounded-md px-3 py-2 border"
                    name="status"
                    value={form.status}
                    onChange={onChange}
                  >
                    <option>Active</option>
                    <option>On Hold</option>
                    <option>Inactive</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* right column */}
            <div className="space-y-4">
              <Field label="Address" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="City" blue={blue}>
                  <input
                    className="w-full rounded-md px-3 py-2 border"
                    name="city"
                    value={form.city}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Country" blue={blue}>
                  <input
                    className="w-full rounded-md px-3 py-2 border"
                    name="country"
                    value={form.country}
                    onChange={onChange}
                  />
                </Field>
              </div>

              <Field label="Payment Terms" blue={blue}>
                <select
                  className="w-full rounded-md px-3 py-2 border"
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={onChange}
                >
                  <option>Prepaid</option>
                  <option>NET 15</option>
                  <option>NET 30</option>
                  <option>NET 45</option>
                  <option>NET 60</option>
                </select>
              </Field>

              <Field label="Notes" blue={blue}>
                <textarea
                  className="w-full rounded-md px-3 py-2 border"
                  rows={4}
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                />
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-between pt-2">
              <div className={`text-sm ${error ? "" : "invisible"}`} style={{ color: "#991B1B" }}>
                {error || "-"}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: blue.sidebarHover }}
                  to="../suppliers/new"
                >
                  <FaSquarePlus className="mr-2 inline-block" />
                  New Supplier
                </Link>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md font-semibold text-white"
                  style={{ backgroundColor: blue.accent }}
                >
                  <FaFloppyDisk className="mr-2 inline-block" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </section>

        {toast && (
          <div
            className="fixed bottom-6 right-6 rounded-lg px-4 py-3 shadow"
            style={{ backgroundColor: blue.cardBg, border: `1px solid ${blue.cardBorder}` }}
          >
            <div className="flex items-center gap-3">
              <FaCircleCheck style={{ color: "#22C55E" }} />
              <div>
                <div className="font-semibold" style={{ color: blue.textPri }}>
                  Updated!
                </div>
                <div className="text-sm" style={{ color: blue.textSec }}>
                  Supplier updated successfully.
                </div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <Link to="../suppliers" className="text-sm underline" style={{ color: blue.accent }}>
                Back to Suppliers
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, blue, children }) {
  return (
    <div>
      <label className="block text-sm mb-1" style={{ color: blue.textSec }}>
        {label}
      </label>
      {children}
    </div>
  );
}
