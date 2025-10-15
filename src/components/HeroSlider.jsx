import { useEffect, useState } from "react";

// All tech/CRM-friendly hero images (no food)
const slides = [
  {
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600",
    title: "Create. Game. Dominate.",
    pill: "LAPTOPS & DESKTOPS",
  },
  {
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600",
    title: "Latest-Gen Processors",
    pill: "AMD | INTEL",
  },
  {
    img: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600",
    title: "Analytics at a Glance",
    pill: "MONITORS & DISPLAYS",
  },
  {
    img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600",
    title: "Responsive Support",
    pill: "HEADSETS & MICS",
  },
  {
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600",
    title: "Power Your Workflow",
    pill: "STORAGE & MEMORY",
  },
{
  img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1600",
  title: "Cool & Quiet",
  pill: "PC COMPONENTS",
},
{
  img: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?q=80&w=1600",
  title: "Ultimate Productivity",
  pill: "ACCESSORIES",
},

];

export default function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-64 sm:h-80 lg:h-[28rem] overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
      {slides.map((s, idx) => (
        <img
          key={idx}
          src={s.img}
          alt={s.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => (e.currentTarget.style.opacity = 0)}
        />
      ))}

      {/* layered gradient for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(2,6,23,0.65),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-fuchsia-500/10" />

      {/* copy */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 text-white drop-shadow">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-wide bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-3 py-1 rounded-full shadow-lg">
          <span>●</span> {slides[i].pill}
        </div>
        <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          {slides[i].title}
        </h2>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              idx === i ? "bg-white" : "bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
