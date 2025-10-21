import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTruckField,
  FaList,
  FaCircleXmark,
  FaFloppyDisk,
  FaCircleCheck,
  FaPlus,
} from "react-icons/fa6";
import { SUPPLIERS } from "../api/api.js";

export default function AddSupplier() {
  const [form, setForm] = useState({
    supplierId: "",
    supplierName: "",
    contactNo: "",
    email: "",
    address: "",
    description: "",
    status: "Active",
    paymentTerms: "NET 30",
    notes: "",
  });

  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const reset = () =>
    setForm({
      supplierId: "",
      supplierName: "",
      contactNo: "",
      email: "",
      address: "",
      description: "",
      status: "Active",
      paymentTerms: "NET 30",
      notes: "",
    });

  const showError = (msg) => {
    setError(msg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");

    // payload that matches the updated backend model
    const payload = {
      supplierId: form.supplierId.trim(),
      supplierName: form.supplierName.trim(),
      contactNo: form.contactNo.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
    };

    if (!payload.supplierId || !payload.supplierName)
      return showError("Supplier ID and Supplier Name are required.");

    if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email))
      return showError("Please enter a valid email address.");

    try {
      await SUPPLIERS.create(payload);
      showToast();
      reset();
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to create supplier.";
      if (err?.response?.status === 409)
        return showError(msg || "Duplicate supplierId or supplierName.");
      showError(msg);
    }
  };

  // Blue Horizon palette (keep theme consistent)
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
      <header
        className="sticky top-0 z-10 px-5 py-3 shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${blue.cardBorder}`,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: blue.sidebarBg }}
            >
              <FaTruckField className="text-white" />
            </div>
            <h1
              className="text-lg font-extrabold"
              style={{ color: blue.textPri }}
            >
              TechNova • Suppliers
            </h1>
            <span className="text-sm" style={{ color: blue.textSec }}>
              / Add Supplier
            </span>
          </div>
          <nav>
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

      <main className="max-w-6xl mx-auto px-5 py-8">
        <section
          className="rounded-2xl p-6"
          style={{
            backgroundColor: blue.cardBg,
            border: `1px solid ${blue.cardBorder}`,
          }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: blue.textPri }}>
            <FaPlus
              className="mr-2 inline-block"
              style={{ color: blue.accent }}
            />
            New Supplier
          </h2>
          <p className="text-sm mb-6" style={{ color: blue.textSec }}>
            Fill supplier details and save to the database.
          </p>

          {/* error */}
          <div
            className={`mb-4 text-sm px-3 py-2 rounded ${
              error ? "" : "hidden"
            }`}
            style={{
              backgroundColor: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
            }}
          >
            {error || "-"}
          </div>

          <form onSubmit={save} className="grid md:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="space-y-4">
              <Field label="Supplier ID *" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="supplierId"
                  value={form.supplierId}
                  onChange={onChange}
                  required
                  placeholder="SUP-001"
                  style={{ borderColor: blue.cardBorder }}
                />
              </Field>

              <Field label="Supplier Name *" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="supplierName"
                  value={form.supplierName}
                  onChange={onChange}
                  required
                  placeholder="Acme Components Pvt Ltd"
                  style={{ borderColor: blue.cardBorder }}
                />
              </Field>

              <Field label="Phone" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="contactNo"
                  value={form.contactNo}
                  onChange={onChange}
                  placeholder="+94 71 638 9276"
                  style={{ borderColor: blue.cardBorder }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" blue={blue}>
                  <input
                    className="w-full rounded-md px-3 py-2 border"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="sales@supplier.com"
                    style={{ borderColor: blue.cardBorder }}
                  />
                </Field>
                <Field label="Status" blue={blue}>
                  <select
                    className="w-full rounded-md px-3 py-2 border"
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    style={{ borderColor: blue.cardBorder }}
                  >
                    <option>Active</option>
                    <option>On Hold</option>
                    <option>Inactive</option>
                  </select>
                </Field>
              </div>

              <Field label="Description (What they supply)" blue={blue}>
                <textarea
                  className="w-full rounded-md px-3 py-2 border"
                  rows="3"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="e.g., Computer peripherals, printers, or laptop spare parts"
                  style={{ borderColor: blue.cardBorder }}
                />
              </Field>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <Field label="Address" blue={blue}>
                <input
                  className="w-full rounded-md px-3 py-2 border"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="No. 123, Main Street, Colombo"
                  style={{ borderColor: blue.cardBorder }}
                />
              </Field>

              <Field label="Payment Terms" blue={blue}>
                <select
                  className="w-full rounded-md px-3 py-2 border"
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={onChange}
                  style={{ borderColor: blue.cardBorder }}
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
                  rows="4"
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                  placeholder="Preferred partner, discounts, VAT, etc."
                  style={{ borderColor: blue.cardBorder }}
                />
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-end pt-2 gap-3">
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: blue.sidebarHover }}
              >
                <FaCircleXmark className="mr-2 inline-block" />
                Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md font-semibold text-white"
                style={{ backgroundColor: blue.accent }}
              >
                <FaFloppyDisk className="mr-2 inline-block" />
                Save Supplier
              </button>
            </div>
          </form>
        </section>

        {toast && (
          <div
            className="fixed bottom-6 right-6 rounded-lg px-4 py-3 shadow"
            style={{
              backgroundColor: blue.cardBg,
              border: `1px solid ${blue.cardBorder}`,
            }}
          >
            <div className="flex items-center gap-3">
              <FaCircleCheck style={{ color: "#22C55E" }} />
              <div>
                <div className="font-semibold" style={{ color: blue.textPri }}>
                  Saved!
                </div>
                <div className="text-sm" style={{ color: blue.textSec }}>
                  Supplier created successfully.
                </div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <Link
                to="../suppliers"
                className="text-sm underline"
                style={{ color: blue.accent }}
              >
                Go to Suppliers
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
