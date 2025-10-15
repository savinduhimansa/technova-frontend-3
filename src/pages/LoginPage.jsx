// Login.jsx
import React, { useState } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const [greetEmail, setGreetEmail] = useState(''); // NEW

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Try login as user first
    axios.post("http://localhost:5001/api/user/login", { email, password })
      .then((response) => {
        toast.success("Login successful");
        const { token, user } = response.data;

        // ✅ Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("authType", "user");
        localStorage.setItem("user", JSON.stringify(user || {}));

        // ✅ Set default header for future axios requests
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        setGreetEmail(user?.email || email); // NEW
        toast.success(`Hi, ${user?.email || email}`); // NEW

        if (user.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        // If user login fails, try staff login
        axios.post("http://localhost:5001/api/staff/login", { email, password })
          .then((staffResponse) => {
            toast.success("Login successful");
            const { token, user: staffMember } = staffResponse.data;

            // ✅ Save staff details
            localStorage.setItem("token", token);
            localStorage.setItem("authType", "staff");
            localStorage.setItem("user", JSON.stringify(staffMember || {}));

            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            setGreetEmail(staffMember?.email || email); // NEW
            toast.success(`Hi, ${staffMember?.email || email}`); // NEW

            if (staffMember.role === 'inventoryManager') {
              navigate("/inv/dashboard", { state: { email: staffMember.email } });
            }
            if (staffMember.role === 'productManager') {
              navigate("/productManager", { state: { email: staffMember.email } });
            }
            if (staffMember.role === 'technician') {
              navigate("/dash", { state: { email: staffMember.email } });
            }
            if (staffMember.role === 'salesManager') {
              navigate("/salesdashboard", { state: { email: staffMember.email } });
            }
          })
          .catch((staffError) => {
            toast.error(staffError.response?.data?.message || "Login failed. Invalid email or password.");
          });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/90 border border-[#BFDBFE] shadow-[0_0_25px_rgba(59,130,246,0.3)]">
        <h2 className="text-3xl font-extrabold text-[#1E40AF] text-center drop-shadow-sm">
          Welcome Back!
        </h2>
        <p className="mt-2 text-center text-sm text-[#1E3A8A]/80">
          Login to your account!
        </p>

        {greetEmail && ( // NEW
          <p className="mt-3 text-center text-sm font-semibold text-[#1E40AF]">
            Hi, {greetEmail}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-white border border-[#BFDBFE] px-4 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] shadow-sm"
            />
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-white border border-[#BFDBFE] px-4 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] shadow-sm"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="/forget" className="text-xs text-[#3B82F6] hover:underline hover:text-[#1E40AF]">
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-[#1E3A8A]/70">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#3B82F6] hover:underline hover:text-[#1E40AF]">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
