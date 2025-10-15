
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RepairList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const BASE = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.CLIENT_ORIGIN ||
    ""
  ).toString().replace(/\/+$/, "");

  const toUrl = (path) => (BASE ? `${BASE}${path}` : path);

  const fetchRepairs = () => {
    
    setLoading(true);
    axios
      .get(toUrl("/api/repair")) //  no token headers
      .then((res) => {
        setRows(Array.isArray(res.data) ? res.data : []);
        setErr(null);
        
      })
      .catch((e) => {
        console.log("hello");
        console.error("GET /api/repair failed:", e.message);
        setErr("Failed to load repairs.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  // Status pill per spec: green, yellow, red
  const badgeClass = (status = "") => {
    const s = String(status).toLowerCase();
    if (s === "done" || s === "approved")
      return "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200";
    if (s === "cancelled" || s === "cancel" || s === "rejected")
      return "px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200";
    // pending / checking / in progress -> yellow
    return "px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        String(r.ticketId || "").toLowerCase().includes(term) ||
        String(r.code || "").toLowerCase().includes(term) ||
        String(r.clientName || "").toLowerCase().includes(term)
    );
  }, [q, rows]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this repair? ");
    if (!ok) return;
    try {
      setBusyId(id);
      await axios.delete(toUrl(`/api/repair/${id}`));
      fetchRepairs();
    } catch (e) {
      console.error("DELETE /api/repair/:id failed:", e.message);
      alert("Failed to delete. See console for details.");
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dash/edit-repair/${id}`);
  };

  if (loading) return <div className="p-8 text-[#1E40AF]">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;

  return (
    <div className="p-8 min-h-screen bg-white text-[#0F172A]">
      {/* Title */}
      <h2 className="text-3xl font-bold text-[#1E40AF] mb-6">
        List of Repairs 🌊
      </h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            placeholder="Search by Ticket ID, Code, or Name…"
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
          className="px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg shadow-sm transition"
          onClick={() => navigate("/dash/add-repair")}
        >
          + Add Entry
        </button>
      </div>

      {/* Table Card */}
      <div
        className="overflow-x-auto rounded-xl border shadow-sm bg-[#DBEAFE]"
        style={{ borderColor: "#BFDBFE" }}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Date Created</th>
              <th className="px-4 py-3 text-left">Ticket ID</th>
              <th className="px-4 py-3 text-left">Client Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-b" style={{ borderColor: "#BFDBFE" }}>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-[#1E40AF]/70 py-6 italic">
                  No results{q ? ` for "${q}"` : ""}.
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r._id} className="hover:bg-[#EFF6FF] transition">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">
                    {new Date(r.dateCreated || r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{r.ticketId || r.code}</td>
                  <td className="px-4 py-3">{r.clientName}</td>
                  <td className="px-4 py-3">
                    <span className={badgeClass(r.status)}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {Number(r.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
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
                      <a
                        className="px-3 py-1 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] text-white transition"
                        href={toUrl(`/api/repair/${r._id}/pdf`)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        PDF
                      </a>
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
