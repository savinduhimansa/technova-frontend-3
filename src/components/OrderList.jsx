// src/components/OrderList.jsx
import { useEffect, useState } from "react";
import { getOrders, deleteOrder } from "../api/orders";
import { generateInvoice } from "../api/invoices";
import { FiTrash2, FiEdit2, FiFileText } from "react-icons/fi";

export default function OrderList({ onEdit, refresh }) {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { fetchOrders(); }, [refresh]);

  const filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const m1 = o.orderID?.toLowerCase().includes(s);
    const m2 = o.customerName?.toLowerCase().includes(s);
    return (m1 || m2) && (statusFilter ? o.status === statusFilter : true);
  });

  const handleInvoice = async (orderMongoId) => {
    const res = await generateInvoice(orderMongoId);
    const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const a = document.createElement("a"); a.href = url; a.download = `invoice-${orderMongoId}.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  // --- Blue Horizon status badge palette ---
  const badge = (status) => {
    const base = "inline-block px-2 py-1 rounded-full text-xs font-medium border";
    switch (status) {
      case "Completed":
        return `${base} bg-[#DCFCE7] text-[#065F46] border-[#22C55E]`;
      case "Pending":
        return `${base} bg-[#FEF9C3] text-[#92400E] border-[#FACC15]`;
      case "Cancelled":
        return `${base} bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]`;
      case "Processing":
        return `${base} bg-[#E0E7FF] text-[#3730A3] border-[#93C5FD]`;
      case "Confirmed":
      default:
        return `${base} bg-[#DBEAFE] text-[#1E40AF] border-[#3B82F6]`;
    }
  };

  return (
    <div className="rounded-xl border border-[#BFDBFE] bg-white p-5 shadow-sm mt-6">
      <h2 className="text-lg font-semibold text-[#1E40AF] mb-4">Order History</h2>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          placeholder="Search by OrderID or Customer Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A]"
        >
          <option value="">All Statuses</option>
          <option>Pending</option><option>Confirmed</option><option>Processing</option>
          <option>Completed</option><option>Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#BFDBFE]">
        <table className="w-full text-sm">
          <thead className="bg-[#BFDBFE] text-[#1E40AF]">
            <tr>
              {["OrderID","Customer","Address","Items","Payment","Total","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#1E3A8A]">
            {filtered.map((o) => (
              <tr key={o._id} className="hover:bg-[#EFF6FF]">
                <td className="px-4 py-2">{o.orderID}</td>
                <td className="px-4 py-2">
                  {o.customerName}
                  <div className="text-xs opacity-70">{o.phoneNumber}</div>
                </td>
                <td className="px-4 py-2 max-w-[260px]">{o.address}</td>
                <td className="px-4 py-2">
                  <ul className="m-0 pl-4 list-disc">
                    {o.products?.map((p, idx) => (
                      <li key={idx}>
                        {p.product?.name || p.productId} × {p.quantity} @ ${p.unitPrice}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <div>{o.paymentMethod}</div>
                  <div className="text-xs opacity-70">{o.paymentStatus}</div>
                </td>
                <td className="px-4 py-2 font-semibold text-[#1E40AF]">${o.totalPrice?.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span className={badge(o.status)}>{o.status}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3B82F6] text-[#1E40AF] hover:bg-[#DBEAFE] transition"
                      onClick={() => onEdit(o)}
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#EF4444] text-[#991B1B] hover:bg-[#FEE2E2] transition"
                      onClick={() => deleteOrder(o._id).then(fetchOrders)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#93C5FD] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
                      onClick={() => handleInvoice(o._id)}
                    >
                      <FiFileText /> Invoice
                    </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

