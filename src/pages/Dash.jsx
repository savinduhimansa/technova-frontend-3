import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, Outlet } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// main layout
export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#EFF6FF] text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E3A8A] text-white shadow-2xl border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-wide">Technova</h2>
        </div>
        <nav className="p-4">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                to="/dash"
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition text-white hover:bg-[#1E40AF] ${
                    isActive ? "bg-[#1E40AF]" : ""
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/dash/TicketForm"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition text-white hover:bg-[#1E40AF] ${
                    isActive ? "bg-[#1E40AF]" : ""
                  }`
                }
              >
                Service Requests
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/dash/ServiceList"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition text-white hover:bg-[#1E40AF] ${
                    isActive ? "bg-[#1E40AF]" : ""
                  }`
                }
              >
                Our Service List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/RepairList"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition text-white hover:bg-[#1E40AF] ${
                    isActive ? "bg-[#1E40AF]" : ""
                  }`
                }
              >
                Repair List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dash/TicketList"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition text-white hover:bg-[#1E40AF] ${
                    isActive ? "bg-[#1E40AF]" : ""
                  }`
                }
              >
                Ticket List
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition text-white hover:bg-[#1E40AF] ${
                    isActive ? "bg-[#1E40AF]" : ""
                  }`
                }
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Dashboard Home
export function DashboardHome() {
  const [counts, setCounts] = useState({
    services: 0,
    totalTickets: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    inProgress: 0,
    checking: 0,
    done: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      const url = `${base}/api/dashboard/counts`;
      const response = await axios.get(url);
      setCounts(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = [
    { name: "Pending", value: counts.pendingRequests },
    { name: "Approved", value: counts.approvedRequests },
    { name: "In Progress", value: counts.inProgress },
    { name: "Checking", value: counts.checking },
    { name: "Done", value: counts.done },
    { name: "Cancelled", value: counts.cancelled },
  ];

  const COLORS = [
    "#FACC15", // Pending
    "#22C55E", // Approved
    "#3B82F6", // In Progress
    "#6366F1", // Checking
    "#14B8A6", // Done
    "#EF4444", // Cancelled
  ];

  if (loading) {
    return <div className="mt-4 text-[#1F2937]">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="mt-4 text-red-600">{error}</div>;
  }

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] p-4 rounded-xl shadow-lg text-white">
        <h1 className="text-2xl font-bold text-white">
          Welcome to IT Service Management System
        </h1>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            Technician
          </span>

          <img
            src="https://placehold.co/40x40/4a5568/ffffff?text=U"
            alt="user"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Services</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.services}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Total Repairs</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.totalTickets}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Pending Requests</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.pendingRequests}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Approved Requests</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.approvedRequests}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">In Progress</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.inProgress}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Checking</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.checking}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Done</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.done}</p>
        </div>
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-[#3B82F6]">Cancelled</h3>
          <p className="text-2xl font-bold text-[#3B82F6]">{counts.cancelled}</p>
        </div>
      </section>

      {/* Pie Chart */}
      <section className="bg-white border border-[#BFDBFE] p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-[#3B82F6] mb-4">
          Repair Status Distribution
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E3A8A",
                borderRadius: "0.5rem",
                border: "1px solid #3B82F6",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
