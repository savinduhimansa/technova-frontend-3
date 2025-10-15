import { useEffect, useState } from "react";
import { getDeliveries, updateDeliveryStatus, deleteDelivery } from "../api/deliveries";
import { FiTrash2 } from "react-icons/fi";

export default function DeliveryList({ refresh }) {
  const [deliveries, setDeliveries] = useState([]);

  const fetchAll = async () => {
    const res = await getDeliveries();
    setDeliveries(res.data);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { fetchAll(); }, [refresh]);

  const update = async (id, status) => { await updateDeliveryStatus(id, status); fetchAll(); };
  const remove = async (id) => { if (confirm("Delete this delivery?")) { await deleteDelivery(id); fetchAll(); } };

  const badge = (s) =>
    s === "Pending" ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
    s === "Delivered" ? "border-green-200 text-green-700 bg-green-50" :
    s === "Out for Delivery" ? "border-[#BFDBFE] text-[#1E40AF] bg-[#EFF6FF]" :
    "border-red-200 text-red-700 bg-red-50";

  return (
    <div className="rounded-xl border border-[#BFDBFE] bg-white p-5 shadow-sm mt-6">
      <h2 className="text-lg font-semibold text-[#1E40AF] mb-4">Deliveries</h2>

      <div className="overflow-x-auto rounded-xl border border-[#BFDBFE]">
        <table className="w-full text-sm">
          <thead className="bg-[#BFDBFE] text-[#1E40AF]">
            <tr>
              {["OrderID","Courier","Scheduled","Status","Update"].map(h => (
                <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#1E3A8A]">
            {deliveries.map((d) => (
              <tr key={d._id} className="hover:bg-[#EFF6FF]">
                <td className="px-4 py-2">{d.orderId}</td>
                <td className="px-4 py-2">{d.courierService}</td>
                <td className="px-4 py-2">{d.scheduledDate ? new Date(d.scheduledDate).toLocaleString() : "N/A"}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded border text-xs ${badge(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={d.status}
                      onChange={(e) => update(d._id, e.target.value)}
                      className="rounded-lg bg-white border border-[#BFDBFE] px-2 py-1 text-[#1E3A8A] focus:outline-none"
                    >
                      <option>Pending</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      <option>Delayed</option>
                    </select>
                    <button onClick={() => remove(d._id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
                      <FiTrash2 /> Delete
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

