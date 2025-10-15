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

  // Generate PDF
  const downloadPdf = () => {
    if (!filteredRequests.length) {
      toast.error("No data to download.");
      return;
    }
    const doc = new jsPDF();
    const today = new Date().toLocaleString();

    doc.text(
      `PC Builds Report - ${filter.charAt(0).toUpperCase() + filter.slice(1)}`,
      14,
      15
    );
    doc.text(`Generated on: ${today}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [
        ["Customer Email", ...partsList.map((p) => p.toUpperCase()), "Total Price", "Status"],
      ],
      body: filteredRequests.map((req) => [
        req.customerEmail,
        ...partsList.map((p) => req[p] || "-"),
        `$${req.totalPrice}`,
        req.status.charAt(0).toUpperCase() + req.status.slice(1),
      ]),
    });
    doc.save(`PC_Builds_Report_${filter}.pdf`);
  };

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
