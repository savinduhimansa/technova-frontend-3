import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiLogOut, FiLogIn, FiUserPlus, FiLayout, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

function getRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload?.role || null;
  } catch {
    return null;
  }
}

export default function Header() {
  const { items = [] } = useCart();
  const navigate = useNavigate();

  // Pull from storage (no AuthContext)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const localUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const role = getRole();
  const authed = Boolean(role || token);
  const currentUser = localUser;

  const count = items.reduce((s, it) => s + (it?.quantity || 0), 0);

  // Staff/User profile routing
  const handleProfile = () => {
    const roleNorm = String(currentUser?.role || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");
    const isStaff =
      currentUser?.staffId != null ||
      roleNorm === "staff" ||
      roleNorm === "productmanager" ||
      roleNorm === "inventorymanager" ||
      roleNorm === "technician" ||
      roleNorm === "salesmanager";

    const profilePath = isStaff ? "/staff/profile" : "/profile";
    navigate(profilePath);
  };

  // Logout: clear all related keys
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authType");
    toast.success("Logout successful");
    navigate("/");
  };

  const dash =
    role === "salesManager"
      ? { to: "/salesdashboard", label: "Sales Dashboard" }
      : role === "admin"
      ? { to: "/admindashboard", label: "Admin Dashboard" }
      : null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#BFDBFE]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* --- Logo + TechNova text --- */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Icon.svg"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="font-bold text-lg text-[#1E40AF]">TechNova</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/buildpc"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
          >
            Build My PC
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
          >
            <FiShoppingCart />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-[#3B82F6] text-white rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </Link>

          {!authed ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                <FiLogIn /> Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-[#3B82F6] text-white hover:bg-[#2563EB] transition"
              >
                <FiUserPlus /> Sign up
              </Link>
            </>
          ) : (
            <>
              {/* Greeting (from localStorage user) */}
              {currentUser?.email && (
                <span className="text-sm text-[#1F2937]/80 hidden sm:block">
                  Hi, {currentUser.email}
                </span>
              )}

               <Link
                to="/mypc"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                My PC Request
              </Link>

              {/* Profile button */}
              <button
                onClick={handleProfile}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                <FiUser /> Profile
              </button>

              {/* Role-based dashboard */}
              {dash && (
                <Link
                  to={dash.to}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
                >
                  <FiLayout /> {dash.label}
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
              >
                <FiLogOut /> Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
