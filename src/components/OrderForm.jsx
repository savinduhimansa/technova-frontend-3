import { useEffect, useMemo, useState } from "react";
import { createOrder, updateOrder } from "../api/orders";
import { getProductsList } from "../api/product";

export default function OrderForm({ selectedOrder, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerName: "", phoneNumber: "", address: "",
    products: [], discount: 0, paymentMethod: "Cash",
    paymentStatus: "Pending", status: "Pending",
  });

  useEffect(() => { (async () => { setProducts(await getProductsList()); })(); }, []);

  useEffect(() => {
    if (selectedOrder) {
      setForm({
        customerName: selectedOrder.customerName,
        phoneNumber: selectedOrder.phoneNumber,
        address: selectedOrder.address,
        products: selectedOrder.products?.map(p => ({ productId: p.productId, quantity: p.quantity })) || [],
        discount: selectedOrder.discount || 0,
        paymentMethod: selectedOrder.paymentMethod || "Cash",
        paymentStatus: selectedOrder.paymentStatus || "Pending",
        status: selectedOrder.status || "Pending"
      });
    } else {
      setForm({
        customerName: "", phoneNumber: "", address: "",
        products: [], discount: 0, paymentMethod: "Cash",
        paymentStatus: "Pending", status: "Pending"
      });
    }
  }, [selectedOrder]);

  const lines = form.products.map(line => {
    const prod = products.find(p => p.productId === line.productId);
    const unit = prod ? prod.price : 0;
    return { ...line, unitPrice: unit, subtotal: unit * (line.quantity || 0), stock: prod?.stock ?? 0, name: prod?.name || line.productId };
  });

  const total = useMemo(() => {
    const sub = lines.reduce((s, l) => s + l.subtotal, 0);
    return Math.max(sub - (sub * (form.discount || 0) / 100), 0);
  }, [lines, form.discount]);

  const addLine = () => setForm(f => ({ ...f, products: [...f.products, { productId: "", quantity: 1 }] }));
  const removeLine = (i) => setForm(f => ({ ...f, products: f.products.filter((_, idx) => idx !== i) }));
  const updateLine = (i, patch) => setForm(f => { const copy = [...f.products]; copy[i] = { ...copy[i], ...patch }; return { ...f, products: copy }; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.products.length) return alert("Add at least one item.");
    for (const l of lines) {
      if (!l.productId) return alert("Select product for each line.");
      if (l.quantity > l.stock) return alert(`Not enough stock for ${l.name} (have ${l.stock}).`);
    }
    try {
      if (selectedOrder) await updateOrder(selectedOrder._id, form);
      else await createOrder(form);
      onSuccess();
    } catch (e) { alert(e?.response?.data?.message || "Error submitting order"); }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#BFDBFE] bg-white p-5 shadow-sm">
      <h2 className="text-lg md:text-xl font-semibold text-[#1E40AF] mb-4">
        {selectedOrder ? "Edit Order" : "New Order"}
      </h2>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm text-[#1E3A8A]">Name</span>
          <input
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
            value={form.customerName}
            onChange={e => setForm({ ...form, customerName: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm text-[#1E3A8A]">Phone</span>
          <input
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
            value={form.phoneNumber}
            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />
        </label>
        <label className="block md:col-span-3">
          <span className="text-sm text-[#1E3A8A]">Address</span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            required
          />
        </label>
      </div>

      <div className="rounded-lg border border-[#BFDBFE] bg-white p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <strong className="text-[#1E40AF]">Items</strong>
          <button type="button" onClick={addLine} className="px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition">
            + Add Item
          </button>
        </div>

        <div className="grid gap-2">
          {lines.map((l, idx) => (
            <div key={idx} className="grid md:grid-cols-5 gap-2 items-center">
              <select
                value={l.productId}
                onChange={e => updateLine(idx, { productId: e.target.value })}
                required
                className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
              >
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p._id} value={p.productId}>
                    {p.name} (${p.price}) [stock {p.stock ?? 0}]
                  </option>
                ))}
              </select>

              <input
                type="number" min={1} value={l.quantity}
                onChange={e => updateLine(idx, { quantity: Number(e.target.value) })}
                className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
              />
              <div className="text-[#1E3A8A]">${Number(l.unitPrice || 0).toFixed(2)}</div>
              <div className="text-[#1E40AF] font-semibold">${Number(l.subtotal || 0).toFixed(2)}</div>
              <button type="button" onClick={() => removeLine(idx)} className="px-3 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3 mt-4">
        <label className="block">
          <span className="text-sm text-[#1E3A8A]">Discount %</span>
          <input
            type="number" min={0} max={100}
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
            value={form.discount}
            onChange={e => setForm({ ...form, discount: Number(e.target.value) })}
          />
        </label>
        <label className="block">
          <span className="text-sm text-[#1E3A8A]">Payment Method</span>
          <select
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
            value={form.paymentMethod}
            onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
          >
            <option>Card</option><option>Cash</option><option>Invoice</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-[#1E3A8A]">Payment Status</span>
          <select
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
            value={form.paymentStatus}
            onChange={e => setForm({ ...form, paymentStatus: e.target.value })}
          >
            <option>Pending</option><option>Paid</option><option>Refunded</option><option>Failed</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-[#1E3A8A]">Order Status</span>
          <select
            className="mt-1 w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option>Pending</option><option>Confirmed</option><option>Processing</option><option>Completed</option><option>Cancelled</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="text-[#1E3A8A]">
          <strong>Total:</strong> <span className="text-[#1E40AF] font-semibold">${total.toFixed(2)}</span>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition">
          {selectedOrder ? "Update" : "Add"} Order
        </button>
      </div>
    </form>
  );
}
