// src/components/CategorySidebar.jsx
const CATS = [
  // Original inventory categories
  { key: "Laptops",        label: "Laptops",        emoji: "💻" },
  { key: "Desktops",       label: "Desktops",       emoji: "🖥️" },
  { key: "Monitors",       label: "Monitors",       emoji: "🖼️" },
  { key: "Keyboards",      label: "Keyboards",      emoji: "⌨️" },
  { key: "Mice",           label: "Mice",           emoji: "🖱️" },
  { key: "Headsets",       label: "Headsets",       emoji: "🎧" },
  { key: "Graphics Cards", label: "Graphics Cards", emoji: "🎮" },
  { key: "Storage",        label: "Storage",        emoji: "💾" },

  // New PC-builder categories (match your Product model enum exactly)
  { key: "CPUs",        label: "CPUs",        emoji: "🧠" },
  { key: "Motherboards",label: "Motherboards",emoji: "🧩" },
  { key: "RAM",        label: "RAMs",        emoji: "📗" },
  { key: "Cases",       label: "Cases",       emoji: "🗄️" },
  { key: "SSDs",        label: "SSDs",        emoji: "💽" },
  { key: "HDDs",        label: "HDDs",        emoji: "💿" },
  { key: "PSUs",        label: "PSUs",        emoji: "🔌" },
  { key: "Fans",       label: "Fans",       emoji: "𖣘" },
];

export default function CategorySidebar({ value, onChange }) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-2xl border border-white/10 bg-white/60 backdrop-blur-md shadow-sm p-3">
        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Browse categories
        </div>
        <nav className="mt-1 space-y-1.5">
          {CATS.map((c) => {
            const active = value === c.key;
            return (
              <button
                key={c.key}
                onClick={() => onChange(active ? null : c.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition border ${
                  active
                    ? "border-cyan-400/70 bg-cyan-50 text-cyan-900 shadow-sm"
                    : "border-slate-200 hover:bg-white text-slate-700"
                }`}
              >
                <span className="text-lg">{c.emoji}</span>
                <div className="flex-1 text-sm font-medium">{c.label}</div>
                {active && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
