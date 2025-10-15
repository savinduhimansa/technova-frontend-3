import { NavLink, useNavigate } from "react-router-dom";
import { FiBarChart2, FiPackage, FiTruck, FiCompass, FiLogOut } from "react-icons/fi";

const linkClasses = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition
   ${isActive ? "bg-[#1E40AF] text-white" : "text-white/90 hover:bg-[#1E40AF]"}`;

export default function SalesSidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1E3A8A] text-white">
      <div className="h-14 flex items-center px-4 font-semibold">TechNova CRM</div>

      <nav className="p-3 space-y-1">
        <NavLink to="/salesdashboard" end className={linkClasses}>
          <FiBarChart2 /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/salesdashboard/orders" className={linkClasses}>
          <FiPackage /> <span>Orders</span>
        </NavLink>
        <NavLink to="/salesdashboard/deliveries" className={linkClasses}>
          <FiTruck /> <span>Deliveries</span>
        </NavLink>
        <NavLink to="/salesdashboard/couriers" className={linkClasses}>
          <FiCompass /> <span>Couriers</span>
        </NavLink>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-[#1E40AF]"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
