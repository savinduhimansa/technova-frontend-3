import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-xl border border-[#BFDBFE] bg-white p-4 shadow-sm">
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#BFDBFE] mb-3 bg-white">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.style.opacity = 0)}
        />
      </div>
      <h3 className="text-lg font-semibold text-[#1E40AF]">{product.name}</h3>
      <p className="text-[#1E3A8A] text-sm mb-2 line-clamp-2">{product.description}</p>
      <p className="font-semibold text-[#1E40AF] mb-3">${product.price.toFixed(2)}</p>
      <div className="flex gap-2">
        <Link to={`/product/${product._id}`} className="flex-1 text-center px-3 py-2 rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition">
          View
        </Link>
        <button onClick={() => onAdd(product)} className="flex-1 px-3 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition">
          Add
        </button>
      </div>
    </div>
  );
}
