// src/AppShell.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaGaugeHigh,
  FaBoxesStacked,
  FaTruckField,
  FaBell,
  FaRightFromBracket,
} from "react-icons/fa6";

export default function AppShell() {
  const blue = {
    sidebarBg: "#1E3A8A",
    sidebarHover: "#1E40AF",
    accent: "#3B82F6",
    cardBg: "#DBEAFE",
    cardBorder: "#BFDBFE",
    rowHover: "#EFF6FF",
    textPri: "#1E40AF",
    textSec: "#1E3A8A",
  };

  const navigate = useNavigate();

  // Low stock alerts
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const fetchAlerts = async () => {
      setLoadingAlerts(true);
      try {
        const res = await fetch("/api/products?inStock=true");
        const j = await res.json().catch(() => ({}));
        const list = Array.isArray(j.data) ? j.data : [];
        const low = list.filter((p) => Number(p.stock) < 5);
        if (active) setAlerts(low);
      } catch (e) {
        if (active) setAlerts([]);
      } finally {
        if (active) setLoadingAlerts(false);
      }
    };
    fetchAlerts();
    const t = setInterval(fetchAlerts, 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside
        className="text-white p-5 flex flex-col"
        style={{ backgroundColor: blue.sidebarBg }}
      >
        <div className="text-2xl font-extrabold tracking-wide">TechNova</div>

        <nav className="space-y-1 mt-4 grow">
          <SideLink to="/inv/dashboard" icon={<FaGaugeHigh />} label="Dashboard" end />
          <SideLink to="/inv/inventory" icon={<FaBoxesStacked />} label="Inventory" />
          <SideLink to="/inv/suppliers" icon={<FaTruckField />} label="Suppliers" />
        </nav>

        {/* Logout styled like sidebar links */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors"
        >
          <FaRightFromBracket className="text-white" />
          <span className="text-white">Logout</span>
        </button>
      </aside>

      {/* Main column */}
      <div className="flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10 bg-white/90 backdrop-blur"
          style={{ borderColor: blue.cardBorder }}
        >
          <div className="text-sm" style={{ color: blue.textSec }}>
            {crumb(location.pathname)}
          </div>

          <div className="relative">
            <button
              className="px-3 py-2 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: blue.accent }}
              onClick={() => setAlertsOpen((s) => !s)}
              title="Low stock alerts"
            >
              <FaBell />
              <span>Alerts</span>
              <Badge count={alerts.length} />
            </button>

            {/* Alerts panel */}
            {alertsOpen && (
              <div
                className="absolute right-0 mt-2 w-[380px] rounded-lg border shadow-xl overflow-hidden"
                style={{ backgroundColor: "#fff", borderColor: blue.cardBorder }}
              >
                <div
                  className="px-4 py-2 text-sm font-semibold"
                  style={{ backgroundColor: blue.cardBg, color: blue.textSec }}
                >
                  Low Stock (&lt; 5)
                </div>
                <div
                  className="max-h-[50vh] overflow-auto divide-y"
                  style={{ borderColor: blue.cardBorder }}
                >
                  {loadingAlerts ? (
                    <div className="p-4 text-sm text-slate-500">Loading…</div>
                  ) : alerts.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">
                      All good! No low-stock items.
                    </div>
                  ) : (
                    alerts.map((p) => (
                      <div
                        key={p._id || p.productId}
                        className="p-3 hover:bg-[#EFF6FF]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold" style={{ color: blue.textPri }}>
                            {p.name}
                          </div>
                          <span className="text-xs text-slate-500">{p.productId}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          Stock: <b>{p.stock}</b> • Cost:{" "}
                          <b>${Number(p.labeledPrice).toLocaleString()}</b>
                        </div>
                        <div className="mt-2">
                          <Link
                            className="text-sm underline"
                            style={{ color: blue.accent }}
                            to={`/inv/products/edit?id=${encodeURIComponent(
                              p._id || p.productId
                            )}`}
                            onClick={() => setAlertsOpen(false)}
                          >
                            Edit product
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ---------- tiny helpers ---------- */
function SideLink({ to, icon, label, end }) {
  const blue = { hover: "#1E40AF" };
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg ${
          isActive ? "bg-[#1E40AF]" : "hover:bg-[#1E40AF]"
        }`
      }
      style={({ isActive }) => (isActive ? { backgroundColor: blue.hover } : undefined)}
    >
      <span className="text-white">{icon}</span>
      <span className="text-white">{label}</span>
    </NavLink>
  );
}

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-1 inline-flex items-center justify-center text-xs min-w-[18px] px-1 rounded-full bg-white text-[#1E40AF]">
      {count}
    </span>
  );
}

function crumb(pathname) {
  if (pathname === "/") return "/ dashboard";
  return `/ ${pathname.replace(/^\//, "")}`;
}
