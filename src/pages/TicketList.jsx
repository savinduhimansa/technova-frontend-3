


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function TicketList() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null); // for delete spinner
  const navigate = useNavigate();

  const API_BASE = (
    import.meta.env?.VITE_BACKEND_URL || "http://localhost:5001"
  ).replace(/\/+$/g, "");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/ticket`);
      setRows(Array.isArray(data) ? data : []);
      setErr(null);
    } catch (e) {
      console.error(
        "GET /api/ticket failed:",
        e.response?.status,
        e.response?.data || e.message
      );
      setErr("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [
        "Name",
        "Contact",
        "issueType",
        "urgency",
        "description",
        "status",
        "_id",
        "ticketId",
      ].some((k) => String(r[k] || "").toLowerCase().includes(term))
    );
  }, [q, rows]);

  const handleEdit = (id) => {
    navigate(`/dash/TicketForm/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this ticket? ");
    if (!ok) return;
    try {
      setBusyId(id);
      await axios.delete(`${API_BASE}/api/ticket/${id}`);
      await fetchTickets(); // refresh
    } catch (e) {
      console.error(
        "DELETE /api/ticket/:id failed:",
        e.response?.status,
        e.response?.data || e.message
      );
      alert("Failed to delete ticket. See console for details.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="p-8 text-[#1E40AF]">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;

  return (
    <div className="p-8 min-h-screen bg-white text-[#0F172A]">
      <h2 className="text-3xl font-bold text-[#1E40AF] mb-6">Ticket List</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <input
          className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          placeholder="Search name, contact, issue…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {/* <Link className="px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg shadow-sm transition" to="/TicketForm">+ New Ticket</Link> */}
      </div>

      <div
        className="overflow-x-auto rounded-2xl border shadow-sm bg-[#DBEAFE]"
        style={{ borderColor: "#BFDBFE" }}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
              <th className="px-4 py-3 text-left" style={{ width: 56 }}>
                #
              </th>
              <th className="px-4 py-3 text-left">Ticket ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Issue Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Device Issue</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-center" style={{ width: 180 }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody className="[&>tr]:border-b" style={{ borderColor: "#BFDBFE" }}>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center text-[#1E40AF]/70 py-6 italic"
                >
                  No tickets
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => (
                <tr key={t._id} className="hover:bg-[#EFF6FF] transition">
                  <td className="px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{t.ticketId || t._id}</td>
                  <td className="px-4 py-3">{t.Name}</td>
                  <td className="px-4 py-3">{t.Contact}</td>
                  <td className="px-4 py-3">{t.issueType}</td>
                  <td className="px-4 py-3">
                    {/* urgency pill colors */}
                    <span
                      className={
                        t.urgency === "High" || t.urgency === "Critical"
                          ? "px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200"
                          : t.urgency === "Medium"
                          ? "px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                      }
                    >
                      {t.urgency || "Low"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      maxWidth: 320,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        (t.status || "Open").toLowerCase() === "closed"
                          ? "px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                          : (t.status || "Open").toLowerCase() === "cancelled"
                          ? "px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200"
                          : "px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }
                    >
                      {t.status || "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(t.createdAt || Date.now()).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        className="px-3 py-1 rounded-md border border-[#3B82F6] text-[#3B82F6] hover:bg-white transition"
                        onClick={() => handleEdit(t._id)}
                      >
                        Update
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                        onClick={() => handleDelete(t._id)}
                        disabled={busyId === t._id}
                      >
                        {busyId === t._id ? "Deleting…" : "Delete"}
                      </button>
                      <Link
                        className="px-3 py-1 rounded-md border border-[#1E40AF] text-[#1E40AF] hover:bg-white transition"
                        to="/dash/RepairList"
                      >
                        Open Repair
                      </Link>
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

