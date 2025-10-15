import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({}); // NEW

  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // validation
    if (name === "firstName" || name === "lastName") {
      const ok = /^[A-Za-z\s]+$/.test(value.trim());
      setErrors((prev) =>
        ok ? (({ [name]: _, ...rest }) => rest)(prev) : { ...prev, [name]: "Name must contain only letters." }
      );
    }

    if (name === "email") {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      setErrors((prev) =>
        ok ? (({ email, ...rest }) => rest)(prev) : { ...prev, email: "Invalid email format." }
      );
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/user/register', formData);
      console.log('Registration successful:', response.data);
      toast.success('Account created successfully! Please check your email for the OTP.');
      setShowOtpInput(true);
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      toast.error(
        `Registration failed: ${
          error.response ? error.response.data.message : 'An error occurred'
        }`
      );
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/user/verify-otp', {
        email: formData.email,
        otp: otp,
      });
      console.log('OTP verification successful:', response.data);
      toast.success('Email successfully verified! You can now log in.');
      navigate('/');
    } catch (error) {
      console.error('OTP verification failed:', error.response ? error.response.data : error.message);
      toast.error(
        `OTP verification failed: ${
          error.response ? error.response.data.message : 'An error occurred'
        }`
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white p-6 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.3),transparent_50%)] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/95 border border-[#BFDBFE] rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.25)] backdrop-blur-md p-8">
        <h2 className="text-3xl font-bold mb-3 text-center text-[#1E40AF]">
          Create Account
        </h2>
        <p className="text-[#1E3A8A]/80 text-center mb-6">Create your account!</p>

        {!showOtpInput ? (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className="input-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold shadow-md transition-transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-[#1E3A8A]/80 text-center">Enter the OTP sent to your email</p>
            <div className="input-group">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold shadow-md transition-transform hover:scale-105"
            >
              Verify OTP
            </button>
          </form>
        )}

        <p className="text-[#1E3A8A]/70 text-sm text-center mt-6">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-[#3B82F6] hover:text-[#1E40AF] font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
