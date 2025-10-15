import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import CategorySidebar from "../components/CategorySidebar";
import { useEffect, useMemo, useState } from "react";
import { getProductsList } from "../api/product";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ChatWidget from "../components/ChatWidget";

export default function HomePage() {
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [sort, setSort] = useState("relevance"); // relevance | priceAsc | priceDesc | nameAsc

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => {
    const p = {};
    if (category) p.category = category;
    if (brand) p.brand = brand;
    if (search.trim()) p.search = search.trim();
    if (minPrice !== "") p.minPrice = Number(minPrice);
    if (maxPrice !== "") p.maxPrice = Number(maxPrice);
    if (inStock) p.inStock = true;
    return p;
  }, [category, brand, search, minPrice, maxPrice, inStock]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getProductsList(params);
        if (!mounted) return;
        setProducts(list);
      } catch (e) {
        console.error("Failed to load products", e);
        if (mounted) setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [params]);

  // client-side sort
  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "priceAsc") arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "priceDesc") arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "nameAsc") arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return arr;
  }, [products, sort]);

  const brandOptions = useMemo(() => {
    const s = new Set();
    (products || []).forEach((p) => p.brand && s.add(p.brand));
    return Array.from(s).sort();
  }, [products]);

  const clearFilters = () => {
    setCategory(null);
    setBrand("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(true);
    setSort("relevance");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAFF_0%,#F8FAFF_50%,#EEF2FF_100%)]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <HeroSlider />

        <div className="mt-6 flex gap-6">
          <CategorySidebar value={category} onChange={setCategory} />

          <section className="flex-1" id="catalog">
            {/* filter + sort bar */}
            <div className="rounded-2xl border border-white/10 bg-white/70 backdrop-blur-md p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />

                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
                >
                  <option value="">All brands</option>
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <label className="inline-flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  In stock only
                </label>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="priceAsc">Price: Low → High</option>
                  <option value="priceDesc">Price: High → Low</option>
                  <option value="nameAsc">Name: A → Z</option>
                </select>
              </div>

              {/* price range */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Min</span>
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Max</span>
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none"
                  />
                </div>
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-slate-800 hover:bg-white transition"
                >
                  Clear filters
                </button>
              </div>

              {/* active chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {category && (
                  <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-900">
                    {category}
                  </span>
                )}
                {brand && (
                  <span className="px-2 py-1 rounded-full bg-fuchsia-100 text-fuchsia-900">
                    {brand}
                  </span>
                )}
                {inStock && (
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-900">
                    In stock
                  </span>
                )}
                {(minPrice !== "" || maxPrice !== "") && (
                  <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-900">
                    ${minPrice || 0} – ${maxPrice || "∞"}
                  </span>
                )}
              </div>
            </div>

            {/* header row */}
            <div className="mt-4 mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E40AF]">
                {category ? category : "All Products"}
              </h2>
              <div className="text-sm text-slate-600">
                {loading ? "Loading…" : `${sorted.length} items`}
              </div>
            </div>

            {/* product grid */}
            {sorted.length === 0 && !loading ? (
              <p className="text-slate-700">No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sorted.map((p) => (
                  <div key={p._id} className="group">
                    <ProductCard product={p} onAdd={addToCart} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <ChatWidget />
      <Footer />
    </div>
  );
}
