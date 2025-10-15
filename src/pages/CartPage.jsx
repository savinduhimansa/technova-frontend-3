import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useEffect, useMemo, useState } from "react";
import { createPublicOrder, getMyOrders, cancelMyOrder } from "../api/orders";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiCreditCard, FiLock } from "react-icons/fi";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // shipping details
  const [customer, setCustomer] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
  });

  // payment (card) details — UI-only
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "", // MM/YY
    cvc: "",
  });

  const [loading, setLoading] = useState(false);

  // ---- order history state ----
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // fetch my orders when logged in
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoadingOrders(true);
        const res = await getMyOrders();
        setMyOrders(res.data || []);
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, [token]);

  const cancelOrder = async (orderId) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await cancelMyOrder(orderId);
      // refresh list
      const res = await getMyOrders();
      setMyOrders(res.data || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to cancel order");
    }
  };

  // ---- helpers ----
  const formatCardNumber = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 19)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const isFutureExpiry = (mmYY) => {
    const m = mmYY.split("/");
    if (m.length !== 2) return false;
    const mm = parseInt(m[0], 10);
    const yy = parseInt(m[1], 10);
    if (!(mm >= 1 && mm <= 12) || Number.isNaN(yy)) return false;
    const year = 2000 + yy;
    const now = new Date();
    const exp = new Date(year, mm, 0, 23, 59, 59); // end of month
    return exp >= now;
  };

  const cardValid = useMemo(() => {
    const nameOK = card.name.trim().length >= 2;
    const numDigits = card.number.replace(/\D/g, "");
    const numOK = numDigits.length >= 13 && numDigits.length <= 19;
    const expOK = isFutureExpiry(card.expiry);
    const cvcOK = /^\d{3,4}$/.test(card.cvc);
    return nameOK && numOK && expOK && cvcOK;
  }, [card]);

  const canSubmit = useMemo(() => {
    const hasItems = items.length > 0;
    const shippingOK =
      customer.customerName && customer.phoneNumber && customer.address;
    return hasItems && shippingOK && cardValid && !!token && !loading;
  }, [items.length, customer, cardValid, token, loading]);

  // ---- submit ----
  const placeOrder = async () => {
    if (!token) return alert("Please login first.");
    if (!items.length) return alert("Cart is empty.");
    if (!cardValid) return alert("Please check your card details.");

    try {
      setLoading(true);
      const payload = {
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        products: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        discount: 0,
        paymentMethod: "Card",
        status: "Confirmed",
      };
      await createPublicOrder(payload);
      clearCart();
      alert("Payment successful! Order placed.");
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-[#1E40AF]">Your Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
            >
              <FiTrash2 /> Clear cart
            </button>
          )}
        </div>

        {!items.length ? (
          <div className="rounded-xl border border-[#BFDBFE] bg-white p-8 text-center text-[#1E3A8A]">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div
                  key={it.productId}
                  className="flex items-center gap-4 rounded-xl border border-[#BFDBFE] bg-white p-4"
                >
                  <div className="relative">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-24 h-24 object-cover rounded-lg border border-[#BFDBFE]"
                      onError={(e) => (e.currentTarget.style.opacity = 0)}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-[#1E40AF]">{it.name}</div>
                    {typeof it.stock === "number" && (
                      <div className="text-xs text-[#1E3A8A] mt-0.5">
                        In stock: {it.stock}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm text-[#1E3A8A]">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={it.stock || 999}
                        value={it.quantity}
                        onChange={(e) =>
                          updateQty(
                            it.productId,
                            Math.max(1, Number(e.target.value || 1))
                          )
                        }
                        className="w-24 rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
                      />
                    </div>
                  </div>

                  <div className="w-28 text-right font-bold text-[#1E40AF]">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(it.productId)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary + Checkout */}
            <div className="lg:sticky lg:top-24 h-fit rounded-xl border border-[#BFDBFE] bg-white p-5">
              <h2 className="text-lg font-semibold text-[#1E40AF] mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-[#1E3A8A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E40AF]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Shipping */}
              <h3 className="mt-6 text-sm font-semibold text-[#1E40AF] mb-2">
                Shipping details
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                  placeholder="Full name"
                  value={customer.customerName}
                  onChange={(e) =>
                    setCustomer({ ...customer, customerName: e.target.value })
                  }
                />
                <input
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                  placeholder="Phone number"
                  value={customer.phoneNumber}
                  onChange={(e) =>
                    setCustomer({ ...customer, phoneNumber: e.target.value })
                  }
                />
                <textarea
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 w-full text-[#1E3A8A] focus:outline-none"
                  rows={3}
                  placeholder="Address"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                />
              </div>

              {/* Payment */}
              <h3 className="mt-6 text-sm font-semibold text-[#1E40AF] mb-2">
                Payment
              </h3>

              <div className="rounded-lg border border-[#BFDBFE] p-3 space-y-3">
                <div className="flex items-center gap-2 text-[#1E40AF]">
                  <FiCreditCard className="opacity-80" />
                  <span className="font-medium">Card</span>
                  <span className="ml-auto text-xs text-[#1E3A8A] opacity-70">
                    Secured <FiLock className="inline -mt-1" />
                  </span>
                </div>

                <input
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                  placeholder="Name on card"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />

                <input
                  className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                  placeholder="Card number"
                  inputMode="numeric"
                  value={card.number}
                  onChange={(e) =>
                    setCard({ ...card, number: formatCardNumber(e.target.value) })
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                    placeholder="MM/YY"
                    inputMode="numeric"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: formatExpiry(e.target.value) })
                    }
                  />
                  <input
                    className="rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none"
                    placeholder="CVC"
                    inputMode="numeric"
                    value={card.cvc}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                  />
                </div>

                {!cardValid && (
                  <p className="text-xs text-[#B91C1C]">
                    Please enter valid card details (name, number, expiry, CVC).
                  </p>
                )}
              </div>

              <button
                onClick={placeOrder}
                disabled={!canSubmit}
                className="mt-5 w-full px-4 py-3 rounded-lg bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay & Confirm Order"}
              </button>

              {!token && (
                <p className="mt-2 text-xs text-[#1E3A8A]">
                  Please sign in to place an order.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ✅ My Orders (only if logged in) */}
        {token && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-[#1E40AF] mb-4">Your Orders</h2>
            <div className="rounded-xl border border-[#BFDBFE] bg-white p-4 overflow-x-auto">
              {loadingOrders ? (
                <div className="text-[#1E3A8A]">Loading...</div>
              ) : !myOrders.length ? (
                <div className="text-[#1E3A8A]">No orders yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-[#1E3A8A]">
                    <tr>
                      <th className="text-left p-2">OrderID</th>
                      <th className="text-left p-2">Items</th>
                      <th className="text-left p-2">Payment</th>
                      <th className="text-left p-2">Total</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1E3A8A]">
                    {myOrders.map((o) => {
                      const total = (o.products || []).reduce(
                        (s, l) => s + (l.unitPrice || 0) * (l.quantity || 0),
                        0
                      );
                      const cancellable =
                        o.status === "Pending" && o.paymentStatus === "Pending";
                      return (
                        <tr key={o._id} className="border-t border-[#BFDBFE]">
                          <td className="p-2">{o.orderID}</td>
                          <td className="p-2">
                            <ul className="list-disc pl-5">
                              {(o.products || []).map((p, i) => (
                                <li key={i}>
                                  {p.product?.name || p.productId} × {p.quantity} @ ${p.unitPrice}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-2">
                            {o.paymentMethod}{" "}
                            <span className="opacity-70">({o.paymentStatus})</span>
                          </td>
                          <td className="p-2">${total.toFixed(2)}</td>
                          <td className="p-2">{o.status}</td>
                          <td className="p-2">
                            <button
                              disabled={!cancellable}
                              onClick={() => cancelOrder(o._id)}
                              className={`px-3 py-1.5 rounded-lg border ${
                                cancellable
                                  ? "border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF]"
                                  : "opacity-40 cursor-not-allowed border-[#E5E7EB] text-[#9CA3AF]"
                              } transition`}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
