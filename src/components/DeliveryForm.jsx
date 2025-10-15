import { useEffect, useState } from "react";
import { createDelivery } from "../api/deliveries";
import { getConfirmedOrders } from "../api/orders";

export default function DeliveryForm({ onSuccess }) {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderId: "", courierService: "", scheduledDate: "" });

  useEffect(() => { (async () => {
    const res = await getConfirmedOrders(); setOrders(res.data);
  })(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createDelivery(form);
      setForm({ orderId: "", courierService: "", scheduledDate: "" });
      onSuccess?.();
    } catch (e) { alert(e?.response?.data?.message || "Error creating delivery"); }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-[#BFDBFE] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#1E40AF] mb-4">Assign Delivery</h2>

      <label className="block mb-3">
        <span className="text-sm text-[#1E3A8A]">Order (Confirmed)</span>
        <select
          value={form.orderId}
          onChange={e => setForm({ ...form, orderId: e.target.value })}
          required
          className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
        >
          <option value="">Select OrderID</option>
          {orders.map(o => <option key={o.orderID} value={o.orderID}>{o.orderID} - {o.customerName}</option>)}
        </select>
      </label>

      <label className="block mb-3">
        <span className="text-sm text-[#1E3A8A]">Courier Service</span>
        <select
          value={form.courierService}
          onChange={e => setForm({ ...form, courierService: e.target.value })}
          required
          className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
        >
          <option value="">Select Service</option>
          <option value="Express">Express</option>
          <option value="DHL">DHL</option>
          <option value="Fedex">Fedex</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="text-sm text-[#1E3A8A]">Scheduled Date/Time</span>
        <input
          type="datetime-local"
          value={form.scheduledDate}
          onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
          required
          className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
        />
      </label>

      <button type="submit" className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition">
        Assign Delivery
      </button>
    </form>
  );
}

