import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserTie } from "react-icons/fa"; // staff profile icon

export default function StaffProfile() {
  const [form, setForm] = useState({ name: "", age: "", address: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5001",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/staff/me");
        console.log(data.staff);
        setForm({
          name: data.staff["name"],
          age: data.staff["age"],
          address: data.staff["address"],
          id: data.staff["staffId"],
        });
      } catch (e) {
        toast.error("Failed to load profile");
      }
    })();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/staff/me", { ...form, age: Number(form.age) || 0 });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (pwd.newPassword !== pwd.confirm) return toast.error("Passwords do not match");
    try {
      await api.put("/api/staff/change-password", {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      toast.success("Password changed");
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Change password failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-[#1E3A8A] bg-white">
      {/* Profile header with icon */}
      <div className="flex items-center gap-3 mb-6">
        <FaUserTie className="text-4xl text-blue-500 drop-shadow" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow">
          My Staff Profile
        </h1>
      </div>

      <form
        onSubmit={saveProfile}
        className="space-y-4 bg-[#DBEAFE] p-5 rounded-2xl border border-blue-200 shadow-sm"
      >
        <input
          className="bg-white border border-blue-200 rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="bg-white border border-blue-200 rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          placeholder="Age"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
        />
        <input
          className="bg-white border border-blue-200 rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <input type="hidden" id="staffId" value={form.id} />
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 
                           text-white font-semibold shadow-md hover:scale-[1.02] transition">
          Save Profile
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-blue-700">
        Change Password
      </h2>

      <form
        onSubmit={changePassword}
        className="space-y-3 bg-[#DBEAFE] p-5 rounded-2xl border border-blue-200 shadow-sm"
      >
        <input
          type="password"
          className="bg-white border border-blue-200 rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
          placeholder="Current password"
          value={pwd.currentPassword}
          onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })}
        />
        <input
          type="password"
          className="bg-white border border-blue-200 rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
          placeholder="New password"
          value={pwd.newPassword}
          onChange={e => setPwd({ ...pwd, newPassword: e.target.value })}
        />
        <input
          type="password"
          className="bg-white border border-blue-200 rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
          placeholder="Confirm new password"
          value={pwd.confirm}
          onChange={e => setPwd({ ...pwd, confirm: e.target.value })}
        />
        <button className="px-4 py-2 rounded-lg font-semibold text-white
                           bg-gradient-to-r from-indigo-400 via-blue-500 to-sky-400
                           shadow-md hover:scale-[1.02] transition">
          Change Password
        </button>
      </form>
    </div>
  );
}
