import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden text-white">
      {/* blue horizon gradient + subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2F6EE5] to-[#3B82F6]" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />
      {/* top divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="relative max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        {/* Brand */}
        <div className="rounded-2xl/clean p-4 -m-4 md:m-0 md:p-0">
          <h3 className="font-extrabold text-xl tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]">
            TechNova
          </h3>
          <p className="mt-2 text-sm text-white/85 leading-relaxed">
            Future-ready gadgets. Curated by humans, powered by tech.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2">
          <Link
            to="/about"
            className="w-fit px-3 py-1.5 rounded-lg border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-colors shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            About Us
          </Link>
          <Link
            to="/privacy"
            className="w-fit px-3 py-1.5 rounded-lg border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-colors shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Privacy Policy
          </Link>
          <Link
            to="/feedback"
            className="w-fit px-3 py-1.5 rounded-lg border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-colors shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Send Feedback
          </Link>
        </nav>

        {/* Contact */}
        <div className="text-sm">
          <p className="text-white/85">Need any technical support?</p>
          <Link
            to="/TicketForm"
            className="mt-2 inline-block w-fit px-3 py-1.5 rounded-lg border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-colors shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Request Support
          </Link>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/15 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/85 flex items-center justify-between">
          <span>© {new Date().getFullYear()} TechNova. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
