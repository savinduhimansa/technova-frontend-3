import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      token(tokenFromUrl);
    } else {
      toast.error('Invalid or missing password reset token.');
      navigate('/forgot-password');
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    else setConfirmPassword(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && token) {
      try {
        await axios.post('http://localhost:5001/api/auth/reset-password-otp', {
          token,
          newPassword: password,
        });

        toast.success('Password has been reset successfully!');
        navigate('/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('Failed to reset password. The token may be invalid or expired.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white p-6 relative overflow-hidden">
    
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.3),transparent_50%)] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 border border-[#BFDBFE] rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.25)] backdrop-blur-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#1E40AF]">
          Set New Password
        </h2>
        <p className="text-[#1E3A8A]/80 text-sm mb-6 text-center">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-[#1E40AF] mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[#EF4444] text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1E40AF] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#1E3A8A] placeholder-[#1E3A8A]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-[#EF4444] text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold shadow-md transition-transform hover:scale-105"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
