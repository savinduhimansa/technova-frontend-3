// src/pages/suppliers.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SUPPLIERS } from "../api/api.js";

export default function Suppliers() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // UI state
  const [expanded, setExpanded] = useState(() => new Set());
  const [search, setSearch] = useState("");
  const [hasPending, setHasPending] = useState(""); // "", "true", "false"
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const q = params.get("search") || "";
    const p = params.get("hasPendingOrder") || "";
    if (q) setSearch(q);
    if (p === "true" || p === "false") setHasPending(p);
  }, []);

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, hasPending]);

  async function fetchSuppliers() {
    setLoading(true);
    setErr("");
    try {
      const query = {};
      if (search.trim()) query.search = search.trim();
      if (hasPending === "true" || hasPending === "false") {
        query.hasPendingOrder = hasPending;
      }

      const res = await SUPPLIERS.getAll(query);
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setRows(list);

      const next = {};
      if (search.trim()) next.search = search.trim();
      if (hasPending) next.hasPendingOrder = hasPending;
      setParams(next, { replace: true });
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
      setExpanded((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed.";
      alert(msg);
    }
  }

  async function removePendingOrder(id, idOrObj) {
    if (!window.confirm("Remove this pending item?")) return;
    try {
      await SUPPLIERS.pending.remove(id, idOrObj);
      await refreshOne(id);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Failed to remove pending item.";
      alert(msg);
    }
  }

  async function clearAllPending(id) {
    if (!window.confirm("Clear ALL pending orders for this supplier?")) return;
    try {
      await SUPPLIERS.pending.clear(id);
      await refreshOne(id);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Failed to clear pending orders.";
      alert(msg);
    }
  }

  async function syncPending(id) {
    try {
      await SUPPLIERS.pending.sync(id);
      await refreshOne(id);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Failed to sync pending metadata.";
      alert(msg);
    }
  }

  async function refreshOne(id) {
    try {
      const res = await SUPPLIERS.getById(id);
      const one = res?.data?.data && res.data.data._id ? res.data.data : res?.data || null;
      if (!one) return;
      setRows((prev) => {
        const key = id;
        return prev.map((s) => ((s._id || s.supplierId) === key ? one : s));
      });
    } catch {
      /* noop */
    }
  }

  const formatAddress = (s) =>
    [s.address, s.city, s.country].filter(Boolean).join(", ") || "—";

  function toggleExpand(rowId) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }

  const theme = {
    primary: "#1E40AF",
    brand: "#3B82F6",
    border: "#BFDBFE",
    borderHover: "#93C5FD",
    red: "#EF4444",
    bgHeader: "#BFDBFE",
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold" style={{ color: theme.primary }}>
          Suppliers
        </h2>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Search name/email/address/description…"
              style={{ borderColor: theme.border }}
            />
          </div>
          <select
            value={hasPending}
            onChange={(e) => setHasPending(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
            style={{ borderColor: theme.border }}
          >
            <option value="">All</option>
            <option value="true">With pending</option>
            <option value="false">No pending</option>
          </select>

          <Link
            to="new"
            className="px-3 py-2 rounded-md text-white text-center"
            style={{ backgroundColor: theme.brand }}
          >
            + Add Supplier
          </Link>
        </div>
      </div>

      {err ? (
        <div className="rounded-md px-3 py-2 text-sm bg-red-50 text-red-700">{err}</div>
      ) : null}

      <div
        className="rounded-xl overflow-hidden border shadow-sm"
        style={{ borderColor: theme.border }}
      >
        <table className="min-w-full text-sm">
          <thead className="text-[#1E40AF]" style={{ backgroundColor: theme.bgHeader }}>
            <tr>
              <th className="px-4 py-3 text-left">Supplier ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Pending</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                  Loading suppliers…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                  No suppliers yet.
                </td>
              </tr>
            ) : (
              rows.map((s, idx) => {
                const id = s._id || s.supplierId;
                const isOpen = expanded.has(id);
                const desc =
                  (s.description || "").length > 120
                    ? s.description.slice(0, 117) + "…"
                    : s.description || "—";
                const computedCount =
                  (s.pendingOrderIds?.length || 0) + (s.pendingOrders?.length || 0);
                const pendingCount =
                  s.pendingOrderCount != null ? Number(s.pendingOrderCount) : computedCount;
                const pendingBadge =
                  pendingCount > 0 ? `${pendingCount} order${pendingCount > 1 ? "s" : ""}` : "—";

                return (
                  <>
                    <tr
                      key={id}
                      className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFF]"}`}
                      style={{ borderColor: theme.border }}
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">{s.supplierId}</td>
                      <td className="px-4 py-3">
                        <div className="leading-tight">
                          <div className="font-semibold text-slate-800">
                            {s.supplierName || s.name}
                          </div>
                          {s.contactNo ? (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {s.contactNo}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">{s.contactNo || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="break-words">{s.email || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="line-clamp-2">{formatAddress(s)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="line-clamp-2">{desc}</span>
                      </td>
                      <td className="px-4 py-3">
                        {s.hasPendingOrder ? (
                          <span
                            className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              background: "#DBEAFE",
                              color: theme.primary,
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            {pendingBadge}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          className="inline-block px-3 py-1 rounded-md text-white text-xs"
                          style={{ backgroundColor: theme.brand }}
                          onClick={() => toggleExpand(id)}
                          title="View pending orders / actions"
                        >
                          {isOpen ? "Hide Pending" : "View Pending"}
                        </button>

                        <Link
                          className="inline-block px-3 py-1 rounded-md text-white text-xs"
                          style={{ backgroundColor: theme.brand }}
                          to={`edit?id=${encodeURIComponent(id)}`}
                          title="Edit supplier"
                        >
                          Edit
                        </Link>

                        <Link
                          className="inline-block px-3 py-1 rounded-md text-white text-xs"
                          style={{ backgroundColor: theme.brand }}
                          to={`pending/new?id=${encodeURIComponent(id)}`}
                          title="Add pending order"
                        >
                          + Pending
                        </Link>

                        <button
                          className="inline-block px-3 py-1 rounded-md text-white text-xs"
                          style={{ backgroundColor: theme.red }}
                          onClick={() => deleteSupplier(id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED ROW */}
                    {isOpen && (
                      <tr key={`${id}-panel`} className="border-t" style={{ borderColor: theme.border }}>
                        <td colSpan={8} className="px-4 py-4">
                          <div
                            className="rounded-lg p-3"
                            style={{ border: `1px solid ${theme.border}`, background: "#F8FAFF" }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div className="space-y-1">
                                <div className="text-sm">
                                  <span className="font-semibold" style={{ color: theme.primary }}>
                                    Pending Orders:
                                  </span>{" "}
                                  {pendingBadge}
                                </div>
                                {s.pendingOrderNote ? (
                                  <div className="text-xs text-slate-600">Note: {s.pendingOrderNote}</div>
                                ) : null}
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  to={`pending/new?id=${encodeURIComponent(id)}`}
                                  className="px-3 py-1 rounded-md text-white text-xs"
                                  style={{ backgroundColor: theme.brand }}
                                >
                                  + Add Pending
                                </Link>
                                <button
                                  onClick={() => syncPending(id)}
                                  className="px-3 py-1 rounded-md text-xs"
                                  style={{ backgroundColor: "#E5E7EB", color: "#111827" }}
                                >
                                  Sync
                                </button>
                                <button
                                  onClick={() => clearAllPending(id)}
                                  className="px-3 py-1 rounded-md text-white text-xs"
                                  style={{ backgroundColor: theme.red }}
                                >
                                  Clear All
                                </button>
                              </div>
                            </div>

                            {/* Embedded pending entries */}
                            <div className="mt-3">
                              {(s.pendingOrders || []).length > 0 && (
                                <>
                                  <div className="text-sm font-semibold mb-2" style={{ color: theme.primary }}>
                                    Entries
                                  </div>
                                  <ul className="space-y-2">
                                    {s.pendingOrders.map((e) => (
                                      <li
                                        key={String(e._id)}
                                        className="flex items-start justify-between rounded-md border px-3 py-2 bg-white"
                                        style={{ borderColor: theme.border }}
                                      >
                                        <div className="text-sm">
                                          <div className="font-mono">{e.ref}</div>
                                          {e.title ? (
                                            <div className="text-xs text-slate-600">{e.title}</div>
                                          ) : null}
                                          {e.amount != null ? (
                                            <div className="text-xs text-slate-600">Amount: {e.amount}</div>
                                          ) : null}
                                          {e.eta ? (
                                            <div className="text-xs text-slate-600">
                                              ETA: {new Date(e.eta).toLocaleDateString()}
                                            </div>
                                          ) : null}
                                          {e.note ? (
                                            <div className="text-xs text-slate-600">Note: {e.note}</div>
                                          ) : null}
                                        </div>
                                        <button
                                          onClick={() => removePendingOrder(id, { entryId: e._id })}
                                          className="px-2 py-1 rounded-md text-white text-xs ml-3"
                                          style={{ backgroundColor: theme.red }}
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>

                            {/* Legacy linked order ids */}
                            <div className="mt-3">
                              {(s.pendingOrderIds || []).length === 0 ? (
                                <div className="text-sm text-slate-600">No linked pending orders.</div>
                              ) : (
                                <ul className="space-y-2">
                                  {s.pendingOrderIds.map((oid) => (
                                    <li
                                      key={String(oid)}
                                      className="flex items-center justify-between rounded-md border px-3 py-2 bg-white"
                                      style={{ borderColor: theme.border }}
                                    >
                                      <span className="text-sm font-mono">{String(oid)}</span>
                                      <button
                                        onClick={() => removePendingOrder(id, String(oid))}
                                        className="px-2 py-1 rounded-md text-white text-xs"
                                        style={{ backgroundColor: theme.red }}
                                      >
                                        Remove
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
