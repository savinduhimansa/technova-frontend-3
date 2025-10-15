import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

export default function UserProfile() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5001",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/user/me");
        setForm({
          firstName: data.user["firstName"],
          lastName: data.user["lastName"],
          phone: data.user["phone"],
        });
      } catch (e) {
        toast.error("Failed to load profile");
      }
    })();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/user/me", form);
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
      await api.put("/api/user/change-password", {
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
    <div className="min-h-screen max-w-2xl mx-auto p-6 text-[#1E3A8A] bg-white">
      {/* Profile Header with Icon */}
      <div className="flex items-center gap-3 mb-5">
        <FaUserCircle className="text-4xl text-blue-500 drop-shadow" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow">
          My Profile
        </h1>
      </div>

      {/* Profile Update Form */}
      <form
        onSubmit={saveProfile}
        className="space-y-4 bg-[#DBEAFE] p-5 rounded-2xl border border-blue-200 shadow-sm"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="bg-white border border-blue-200 rounded-xl px-3 py-2 text-[#0f172a]
                       placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-300
                       focus:border-blue-500 transition shadow-sm"
            placeholder="First name"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
          />
          <input
            className="bg-white border border-blue-200 rounded-xl px-3 py-2 text-[#0f172a]
                       placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-300
                       focus:border-blue-500 transition shadow-sm"
            placeholder="Last name"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <input
          className="bg-white border border-blue-200 rounded-xl px-3 py-2 w-full text-[#0f172a]
                     placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-300
                     focus:border-blue-500 transition shadow-sm"
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <button
          className="px-4 py-2 rounded-xl font-semibold text-white transition
                     bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500
                     shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          Save Profile
        </button>
      </form>

      {/* Change Password Section */}
      <h2 className="text-2xl font-bold mt-8 mb-3 text-blue-700">
        Change Password
      </h2>

      <form
        onSubmit={changePassword}
        className="space-y-3 bg-[#DBEAFE] p-5 rounded-2xl border border-blue-200 shadow-sm"
      >
        <input
          type="password"
          className="bg-white border border-blue-200 rounded-xl px-3 py-2 w-full text-[#0f172a]
                     placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-300
                     focus:border-blue-500 transition shadow-sm"
          placeholder="Current password"
          value={pwd.currentPassword}
          onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })}
        />
        <input
          type="password"
          className="bg-white border border-blue-200 rounded-xl px-3 py-2 w-full text-[#0f172a]
                     placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-300
                     focus:border-blue-500 transition shadow-sm"
          placeholder="New password"
          value={pwd.newPassword}
          onChange={e => setPwd({ ...pwd, newPassword: e.target.value })}
        />
        <input
          type="password"
          className="bg-white border border-blue-200 rounded-xl px-3 py-2 w-full text-[#0f172a]
                     placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-300
                     focus:border-blue-500 transition shadow-sm"
          placeholder="Confirm new password"
          value={pwd.confirm}
          onChange={e => setPwd({ ...pwd, confirm: e.target.value })}
        />
        <button
          className="px-4 py-2 rounded-xl font-semibold text-white transition
                     bg-gradient-to-r from-indigo-400 via-blue-500 to-sky-400
                     shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
