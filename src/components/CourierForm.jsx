import { useEffect, useMemo, useState } from "react";
import { getCourierReport, getCouriers, deleteCourier } from "../api/couriers";
import { FiTrash2 } from "react-icons/fi";

export default function CourierForm() {
  const [month, setMonth] = useState("");
  const [report, setReport] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const [couriers, setCouriers] = useState([]);
  const [loadingCouriers, setLoadingCouriers] = useState(false);

  const fetchReport = async () => {
    setLoadingReport(true);
    try { const res = await getCourierReport(month); setReport(res.data || []); }
    catch { alert("Failed to fetch courier report"); }
    finally { setLoadingReport(false); }
  };

  const fetchCouriers = async () => {
    setLoadingCouriers(true);
    try { const res = await getCouriers(); setCouriers(res.data || []); }
    catch { alert("Failed to fetch couriers"); }
    finally { setLoadingCouriers(false); }
  };

  useEffect(() => { fetchReport(); fetchCouriers(); }, []);

  // ✅ Beautified CSV export (only this part changed)
  const handleExportCSV = () => {
    if (!report.length) return;

    // pull server-provided timestamps if present (from your enhanced backend),
    // else fall back to "now"
    const nowLocal =
      report[0]?.generatedAtLocal || new Date().toLocaleString();
    const nowISO =
      report[0]?.generatedAtISO || new Date().toISOString();

    // basic CSV escaper
    const esc = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    // headers
    const headers = [
      "Courier",
      "Assigned Orders",
      "Completed Orders",
      "Delayed Orders",
      "On-time Rate (%)",
      "Avg Delay (min)",
      "Avg Lead (hrs)",
      "Overall Performance",
    ];

    // rows
    const rows = report.map((r) => [
      r.courier,
      r.assignedOrders ?? 0,
      r.completedOrders ?? 0,
      r.delayedOrders ?? 0,
      // pretty percent, keep number-like format
      typeof r.onTimeRatePct === "number" ? `${r.onTimeRatePct}` : (r.onTimeRatePct ?? ""),
      r.avgDelayMinutes ?? "",
      r.avgLeadHours ?? "",
      r.overallPerformance ?? "",
    ]);

    // top “pretty” meta block
    const prettyHeader = [
      ["Courier Performance Report"],
      ["Report Month", month || "All"],
      ["Created At (Local)", nowLocal],
      ["Created At (ISO)", nowISO],
      [], // blank line
      headers
    ];

    // build CSV
    const csv = [
      ...prettyHeader.map((arr) => arr.map(esc).join(",")),
      ...rows.map((arr) => arr.map(esc).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.setAttribute("download", `courier_report_${month || "all"}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleDeleteCourier = async (id, name) => {
    if (!window.confirm(`Delete courier "${name}"?`)) return;
    try { await deleteCourier(id); await fetchCouriers(); }
    catch { alert("Failed to delete courier"); }
  };

  const hasReport = useMemo(() => report && report.length > 0, [report]);

  return (
    <div className="grid gap-6">
      {/* REPORT */}
      <section className="rounded-xl border border-[#BFDBFE] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#1E40AF]">Courier Performance Report</h2>
          <div className="flex items-center gap-2">
            <label className="text-[#1E3A8A] text-sm flex items-center gap-2">
              <span>Month</span>
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-1.5 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
              />
            </label>
            <button onClick={fetchReport} disabled={loadingReport} className="px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition disabled:opacity-60">
              {loadingReport ? "Loading..." : "Filter"}
            </button>
            <button onClick={handleExportCSV} disabled={!hasReport} className="px-3 py-1.5 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition disabled:opacity-50">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#BFDBFE]">
          <table className="w-full text-sm">
            <thead className="bg-[#BFDBFE] text-[#1E40AF]">
              <tr>
                {["Courier","Assigned","Completed","Delayed","On-time Rate (%)","Avg Delay (min)","Avg Lead (hrs)","Overall Perf."].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#1E3A8A]">
              {!hasReport ? (
                <tr><td colSpan="8" className="px-4 py-6 text-center opacity-70">No data</td></tr>
              ) : report.map((r) => (
                <tr key={r.courier} className="hover:bg-[#EFF6FF]">
                  <td className="px-4 py-2">{r.courier}</td>
                  <td className="px-4 py-2">{r.assignedOrders ?? 0}</td>
                  <td className="px-4 py-2">{r.completedOrders ?? 0}</td>
                  <td className="px-4 py-2">{r.delayedOrders ?? 0}</td>
                  <td className="px-4 py-2">{r.onTimeRatePct ?? 0}</td>
                  <td className="px-4 py-2">{r.avgDelayMinutes ?? "-"}</td>
                  <td className="px-4 py-2">{r.avgLeadHours ?? "-"}</td>
                  <td className="px-4 py-2">{r.overallPerformance ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MANAGE COURIERS 
      <section className="rounded-xl border border-[#BFDBFE] bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1E40AF] mb-3">Manage Couriers</h3>
        <div className="overflow-x-auto rounded-xl border border-[#BFDBFE]">
          <table className="w-full text-sm">
            <thead className="bg-[#BFDBFE] text-[#1E40AF]">
              <tr>
                {["Name","Assigned","Completed","Delayed","Overall Perf.","Month","Actions"].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#1E3A8A]">
              {!couriers.length ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center opacity-70">
                    {loadingCouriers ? "Loading..." : "No couriers"}
                  </td>
                </tr>
              ) : couriers.map((c) => (
                <tr key={c._id} className="hover:bg-[#EFF6FF]">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.assignedOrders}</td>
                  <td className="px-4 py-2">{c.completedOrders}</td>
                  <td className="px-4 py-2">{c.delayedOrders}</td>
                  <td className="px-4 py-2">{c.overallPerformance || "-"}</td>
                  <td className="px-4 py-2">{c.month || "-"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteCourier(c._id, c.name)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>*/}
    </div>
  );
}
