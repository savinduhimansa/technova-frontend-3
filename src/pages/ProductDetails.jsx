import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsList } from "../api/product";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      const list = await getProductsList();
      setProduct(list.find((p) => p._id === id) || null);
    })();
  }, [id]);

  if (!product)
    return <div className="min-h-screen bg-[#F8FAFF] p-6 text-[#1E3A8A]">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      <header>
        <Header />
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6 text-sm">
          <Link to="/" className="text-[#3B82F6] hover:underline">Home</Link>
          <span className="mx-2 text-[#1E3A8A]/70">/</span>
          <span className="text-[#1E3A8A]">Product</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 rounded-xl border border-[#BFDBFE] bg-white p-5">
          {/* Image */}
          <div>
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#BFDBFE] bg-white">
              <img
                className="w-full h-full object-cover"
                src={product.images?.[0]}
                alt={product.name}
                onError={(e) => (e.currentTarget.style.opacity = 0)}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-[#1E40AF]">{product.name}</h1>
            <p className="mt-3 text-[#1E3A8A] leading-relaxed">{product.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-2xl font-bold text-[#1E40AF]">
                ${product.price.toFixed(2)}
              </span>
              {product.productId && (
                <span className="px-2.5 py-1 rounded-full text-xs border border-[#BFDBFE] bg-[#EFF6FF] text-[#1E40AF]">
                  ID: {product.productId}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#1E3A8A]">Qty</label>
                <input
                  type="number"
                  min={1}
                  max={product.stock || 999}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                  className="w-24 rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
                />
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                className="px-5 py-2.5 rounded-lg bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition"
              >
                Add to Cart
              </button>

              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                ← Back to products
              </Link>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-[#BFDBFE] bg-white p-3">
                <div className="text-xs uppercase tracking-wide text-[#1E3A8A]/80">Category</div>
                <div className="text-[#1E40AF]">{product.category || "—"}</div>
              </div>
              <div className="rounded-lg border border-[#BFDBFE] bg-white p-3">
                <div className="text-xs uppercase tracking-wide text-[#1E3A8A]/80">Brand</div>
                <div className="text-[#1E40AF]">{product.brand || "—"}</div>
              </div>
              <div className="rounded-lg border border-[#BFDBFE] bg-white p-3">
                <div className="text-xs uppercase tracking-wide text-[#1E3A8A]/80">Warranty</div>
                <div className="text-[#1E40AF]">{product.warranty || "Standard"}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
