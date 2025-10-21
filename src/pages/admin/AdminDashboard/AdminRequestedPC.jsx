import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const AdminRequestedPC = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all requested PC builds (admin view)
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/builds/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requested PC builds:", err);
      toast.error("Failed to load PC build requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Accept/Reject
  const handleAction = async (id, action) => {
    if (updatingStatusId) return;
    setUpdatingStatusId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5001/api/builds/${id}/status`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Build ${action} successfully!`);
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: res.data.status } : req))
      );
    } catch (err) {
      console.error(`Error updating status to ${action}:`, err);
      toast.error(`Failed to ${action} build.`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const partsList = [
    "cpu",
    "motherboard",
    "ram",
    "gpu",
    "case",
    "ssd",
    "hdd",
    "psu",
    "fans",
  ];

  // Filtered requests
  const filteredRequests =
    filter === "all" ? requests : requests.filter((req) => req.status === filter);

  // Pending requests count
  const pendingCount = requests.filter((req) => req.status === "pending").length;

  // Generate PDF with centered TechNova header
  const downloadPdf = () => {
    if (!filteredRequests.length) {
      toast.error("No data to download.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const marginX = 40;
    const marginY = 40;
    const usableW = pageW - marginX * 2;
    const now = new Date().toLocaleString();
    const title = `PC Builds Report — ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;

    // Centered Header
    const drawHeader = () => {
      const centerX = pageW / 2;
      let y = marginY + 5;

      // TechNova company name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("TechNova", centerX, y, { align: "center" });

      // Quote
      y += 16;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.text("“Empowering Digital Operations”", centerX, y, { align: "center" });

      // Title and date (left aligned under header)
      y += 24;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title, marginX, y);

      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated on: ${now}`, marginX, y);

      // Divider
      y += 10;
      doc.setLineWidth(0.5);
      doc.setDrawColor(180, 200, 255);
      doc.line(marginX, y, marginX + usableW, y);

      return y + 12;
    };

    const drawFooter = (data) => {
      const pageCount = doc.getNumberOfPages();
      const str = `Page ${data.pageNumber} of ${pageCount}`;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(str, pageW - marginX, pageH - 20, { align: "right" });
    };

    // Table setup
    const headRow = [
      "Customer Email",
      ...partsList.map((p) => p.toUpperCase()),
      "Total Price",
      "Status",
    ];

    const bodyRows = filteredRequests.map((req) => [
      req.customerEmail || "-",
      ...partsList.map((p) => (req[p] ? String(req[p]) : "-")),
      typeof req.totalPrice === "number" ? `$${req.totalPrice}` : (req.totalPrice || "-"),
      req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : "-",
    ]);

    // Updated column widths (fit exactly within usable width)
    const columnStyles = {
      0:  { cellWidth: 115 },
      1:  { cellWidth: 55 },
      2:  { cellWidth: 65 },
      3:  { cellWidth: 55 },
      4:  { cellWidth: 75 },
      5:  { cellWidth: 55 },
      6:  { cellWidth: 55 },
      7:  { cellWidth: 55 },
      8:  { cellWidth: 55 },
      9:  { cellWidth: 55 },
      10: { cellWidth: 60, halign: "right" },
      11: { cellWidth: 60 },
    };

    const startY = drawHeader();

    autoTable(doc, {
      startY,
      head: [headRow],
      body: bodyRows,
      margin: { left: marginX, right: marginX },
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
        lineWidth: 0.1,
        valign: "middle",
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: { textColor: [20, 20, 20] },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      columnStyles,
      tableLineColor: [180, 200, 255],
      tableLineWidth: 0.1,
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: (data) => {
        drawFooter(data);
      },
    });

    doc.save(`PC_Builds_Report_${filter}.pdf`);
  };

  // Webpage table UI
  const renderTable = (data) => (
    <div className="overflow-x-auto rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] shadow-sm">
      <table className="w-full text-xs sm:text-sm text-left">
        <thead className="bg-[#BFDBFE] text-[#1E40AF]">
          <tr>
            <th className="px-4 py-2">Customer Email</th>
            {partsList.map((part) => (
              <th key={part} className="px-4 py-2 capitalize">{part}</th>
            ))}
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Status / Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((req) => (
            <tr
              key={req._id}
              className="border-b border-[#BFDBFE] hover:bg-[#EFF6FF] text-[#1E3A8A]"
            >
              <td className="px-4 py-2">{req.customerEmail}</td>
              {partsList.map((part) => (
                <td key={part} className="px-4 py-2">{req[part] || "-"}</td>
              ))}
              <td className="px-4 py-2">${req.totalPrice}</td>
              <td className="px-4 py-2">
                {req.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                      onClick={() => handleAction(req._id, "approved")}
                      disabled={updatingStatusId === req._id}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      onClick={() => handleAction(req._id, "rejected")}
                      disabled={updatingStatusId === req._id}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`font-bold ${
                      req.status === "approved"
                        ? "text-green-600"
                        : req.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1E40AF]">Requested PC Builds</h2>

      {/* Top Info Bar */}
      <div className="flex flex-wrap items-center justify-between bg-[#3B82F6]/20 border border-[#3B82F6] rounded-xl p-4 mb-4 shadow-md">
        <span className="text-lg font-semibold text-[#1E40AF]">
          Pending Requests: <span className="text-[#DC2626]">{pendingCount}</span>
        </span>
        <button
          className="px-4 py-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold transition"
          onClick={downloadPdf}
        >
          Download PDF
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              filter === status
                ? "bg-[#1E40AF]"
                : "bg-[#3B82F6] hover:bg-[#1E40AF]"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-[#1E3A8A]">Loading requests...</p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-[#1E3A8A]">No requested builds found for "{filter}".</p>
      ) : (
        renderTable(filteredRequests)
      )}
    </div>
  );
};

export default AdminRequestedPC;
