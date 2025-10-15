// src/suppliers.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SUPPLIERS } from "../api/api.js";

export default function Suppliers() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    setLoading(true);
    setErr("");
    try {
      const res = await SUPPLIERS.getAll();
      // Be tolerant of either { data: [...] } or plain [...]
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setRows(list);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Failed to load suppliers.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSupplier(id) {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await SUPPLIERS.delete(id);
      setRows((prev) => prev.filter((s) => (s._id || s.supplierId) !== id));
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed.";
      alert(msg);
    }
  }

  // Format address from parts
  const formatAddress = (s) =>
    [s.address, s.city, s.country].filter(Boolean).join(", ") || "—";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "#1E40AF" }}>
          Suppliers
        </h2>
        <Link
          to="new"
          className="px-3 py-2 rounded-md text-white"
          style={{ backgroundColor: "#3B82F6" }}
        >
          + Add Supplier
        </Link>
      </div>

      {err ? (
        <div className="rounded-md px-3 py-2 text-sm bg-red-50 text-red-700">
          {err}
        </div>
      ) : null}

      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: "#BFDBFE" }}
      >
        <table className="min-w-full text-sm">
          <thead className="bg-[#BFDBFE] text-[#1E40AF]">
            <tr>
              <th className="px-4 py-2 text-left">Supplier ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  Loading suppliers…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No suppliers yet.
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                const id = s._id || s.supplierId;
                return (
                  <tr
                    key={id}
                    className="border-t"
                    style={{ borderColor: "#BFDBFE" }}
                  >
                    <td className="px-4 py-2">{s.supplierId}</td>
                    <td className="px-4 py-2">{s.supplierName || s.name}</td>
                    <td className="px-4 py-2">{s.contactNo || "-"}</td>
                    <td className="px-4 py-2">{s.email || "-"}</td>
                    <td className="px-4 py-2">{formatAddress(s)}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Link
                        className="inline-block px-3 py-1 rounded-md text-white text-xs"
                        style={{ backgroundColor: "#3B82F6" }}
                        to={`edit?id=${encodeURIComponent(id)}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="inline-block px-3 py-1 rounded-md text-white text-xs"
                        style={{ backgroundColor: "#EF4444" }}
                        onClick={() => deleteSupplier(id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
