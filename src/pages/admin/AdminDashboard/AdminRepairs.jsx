import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";

export default function RepairList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);          // delete busy
  const [updatingStatusId, setUpdatingStatusId] = useState(null); // approve/reject busy

  const navigate = useNavigate();

  // ---- Base URL builder (keeps your existing env logic)
  const BASE = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.CLIENT_ORIGIN ||
    ""
  )
    .toString()
    .replace(/\/+$/, "");
  const toUrl = (path) => (BASE ? `${BASE}${path}` : path);

  // ---- Auth header helper
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchRepairs = () => {
    setLoading(true);
    axios
      .get(toUrl("/api/repair"), { headers: authHeaders() })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data);
        setErr(null);
      })
      .catch((e) => {
        console.error("GET /api/repair failed:", e.response?.data || e.message);
        setErr("Failed to load repairs.");
        toast.error("Failed to load repairs.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  // ---- Status helpers
  const badgeClass = (status = "") => {
    const s = String(status).toLowerCase();
    if (s === "done" || s === "approved")
      return "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200";
    if (s === "cancelled" || s === "cancel" || s === "rejected")
      return "px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200";
    return "px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  // ---- Accept/Reject
  const handleAction = async (id, action /* 'approved' | 'rejected' */) => {
    if (updatingStatusId) return;
    setUpdatingStatusId(id);
    try {
      const res = await axios.put(
        toUrl(`/api/repair/${id}/status`),
        { status: action },
        { headers: authHeaders() }
      );
      const newStatus = res?.data?.status || action;
      setRows((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      toast.success(`Repair ${action} successfully!`);
    } catch (e) {
      console.error(`PUT /api/repair/${id}/status failed:`, e.response?.data || e.message);
      toast.error(`Failed to ${action} repair.`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ---- Delete
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this repair?");
    if (!ok) return;
    try {
      setBusyId(id);
      await axios.delete(toUrl(`/api/repair/${id}`), { headers: authHeaders() });
      toast.success("Deleted.");
      fetchRepairs();
    } catch (e) {
      console.error("DELETE /api/repair/:id failed:", e.response?.data || e.message);
      toast.error("Failed to delete. See console for details.");
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = (id) => navigate(`/dash/edit-repair/${id}`);

  // ---- Client-side PDF using jsPDF/autoTable (table of filtered results)
  const downloadPdf = () => {
    const data = filtered; // from memo below
    if (!data.length) {
      toast.error("No data to download.");
      return;
    }

    const doc = new jsPDF();
    const title =
      `Repairs Report - ${filter.charAt(0).toUpperCase() + filter.slice(1)}` +
      (q ? ` (Search: "${q}")` : "");
    doc.text(title, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Date", "Repair ID", "Client", "Status", "Total"]],
      body: data.map((r) => [
        new Date(r.dateCreated || r.createdAt).toLocaleDateString(),
        r.ticketId || r.code || "-",
        r.clientName || "-",
        (r.status || "-")
          .toString()
          .replace(/^\w/, (c) => c.toUpperCase()),
        Number(r.totalAmount || 0).toFixed(2),
      ]),
    });

    doc.save(`Repairs_Report_${filter}${q ? `_search_${q}` : ""}.pdf`);
  };

  // ---- Search + Filter
  const searched = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        String(r.ticketId || "").toLowerCase().includes(term) ||
        String(r.code || "").toLowerCase().includes(term) ||
        String(r.clientName || "").toLowerCase().includes(term)
    );
  }, [q, rows]);

  const filtered =
    filter === "all"
      ? searched
      : searched.filter((r) => String(r.status).toLowerCase() === filter);

  const pendingCount = rows.filter((r) => String(r.status).toLowerCase() === "pending").length;

  if (loading) return <div className="p-8 text-[#1E40AF]">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1E40AF]">Repairs</h2>

      {/* Top Info Bar */}
      <div className="flex flex-wrap items-center justify-between bg-[#3B82F6]/20 border border-[#3B82F6] rounded-xl p-4 mb-2 shadow-md gap-3">
        <span className="text-lg font-semibold text-[#1E40AF]">
          Pending Repairs: <span className="text-[#DC2626]">{pendingCount}</span>
        </span>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              className="w-64 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Search by Repair ID / Name…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                className="absolute right-3 top-2 text-[#1F2937] hover:text-[#111827]"
                onClick={() => setQ("")}
                title="Clear"
              >
                ×
              </button>
            )}
          </div>

          <button
            className="px-4 py-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold transition"
            onClick={downloadPdf}
          >
            Download PDF
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold transition"
            onClick={() => navigate("/dash/add-repair")}
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-2">
        {["all", "pending", "approved", "rejected", "done", "cancelled"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              filter === status ? "bg-[#1E40AF]" : "bg-[#3B82F6] hover:bg-[#1E40AF]"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#BFDBFE] text-[#1E40AF]">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Repair ID</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Status / Action</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2 text-center">More</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-[#1E40AF]/70 py-6 italic">
                  No results{q ? ` for "${q}"` : ""} in “{filter}”.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-[#BFDBFE] hover:bg-[#EFF6FF] text-[#1E3A8A]"
                >
                  <td className="px-4 py-2">
                    {new Date(r.dateCreated || r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{r.ticketId || r.code || "-"}</td>
                  <td className="px-4 py-2">{r.clientName || "-"}</td>
                  <td className="px-4 py-2">
                    {String(r.status).toLowerCase() === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                          onClick={() => handleAction(r._id, "approved")}
                          disabled={updatingStatusId === r._id}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                          onClick={() => handleAction(r._id, "rejected")}
                          disabled={updatingStatusId === r._id}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={badgeClass(r.status)}>
                        {String(r.status).replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {Number(r.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Link
                        className="px-3 py-1 rounded-md border border-[#3B82F6] text-[#3B82F6] hover:bg-white transition"
                        to={`/dash/RepairList/${r._id}`}
                      >
                        View
                      </Link>
                      <button
                        className="px-3 py-1 rounded-md border border-[#1E40AF] text-[#1E40AF] hover:bg-white transition"
                        onClick={() => handleEdit(r._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                        onClick={() => handleDelete(r._id)}
                        disabled={busyId === r._id}
                      >
                        {busyId === r._id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
