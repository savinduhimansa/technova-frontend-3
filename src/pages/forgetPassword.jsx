import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'otp') setOtp(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (step === 1) {
      const emailRegex = /^\S+@\S+$/i;
      if (!email) newErrors.email = 'Email is required';
      else if (!emailRegex.test(email)) newErrors.email = 'Invalid email address';
    } else if (step === 2) {
      if (!otp) newErrors.otp = 'OTP is required';
      if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (step === 1) {
          await axios.post('http://localhost:5001/api/auth/forgot-password-otp', { email });
          toast.success('An OTP has been sent to your email.');
          setStep(2);
        } else if (step === 2) {
          await axios.post('http://localhost:5001/api/auth/reset-password-otp', { email, otp, newPassword: password });
          toast.success('Password has been reset successfully!');
          setEmail('');
          setOtp('');
          setPassword('');
          setConfirmPassword('');
          setErrors({});
          setStep(1);
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    }
  };

  const renderForm = () => {
    if (step === 1) {
      return (
        <>
          <div className="form-group mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-[#1E40AF] mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
              placeholder="yourname@example.com"
            />
            {errors.email && <p className="text-[#EF4444] text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold shadow-md transition"
            >
              Send OTP
            </button>
          </div>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <div className="form-group mb-4">
            <label htmlFor="otp" className="block text-sm font-semibold text-[#1E40AF] mb-2">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
              placeholder="Enter the OTP from your email"
            />
            {errors.otp && <p className="text-[#EF4444] text-sm mt-1">{errors.otp}</p>}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-[#1E40AF] mb-2">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[#EF4444] text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="form-group mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1E40AF] mb-2">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-[#EF4444] text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold shadow-md transition"
            >
              Reset Password
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white p-6 relative overflow-hidden">
      {/* Subtle Blue Horizon glows */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.35),transparent_55%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/80 border border-[#BFDBFE] rounded-2xl shadow-xl backdrop-blur-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-center text-[#1E40AF]">
          {step === 1 ? 'Forgot Your Password?' : 'Enter OTP & New Password'}
        </h2>
        <p className="text-[#1E3A8A]/80 text-sm mb-6 text-center">
          {step === 1 ? 'Enter your email address to get a password reset OTP.' : `An OTP has been sent to ${email}.`}
        </p>
        <form onSubmit={handleSubmit}>
          {renderForm()}
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
