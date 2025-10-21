import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import AdminStaffPage from './AdminStaffPage';
import AdminUserPage from './AdminUserPage';
import AdminFeedbackPage from './AdminFeedbackPage';
import LoginPage from '../../LoginPage';
 import toast from 'react-hot-toast';
 import AdminRequestedPC from './AdminRequestedPC';
 import AdminOrder from "./AdminOrder";
 import AdminDelivery from "./AdminDelivery";
 import AdminRepairs from "./AdminRepairs";

import { FaHome, FaUsers, FaUserTie, FaBox, FaSitemap, FaStar, FaServer, FaBicycle, FaFile, FaSearch } from 'react-icons/fa';
import { FaSuitcase } from 'react-icons/fa6';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

//chart
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

//slide bar-navigations and logout
const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful');
    navigate('/login', { replace: true });
  };

  return (
    <div className="sidebar min-h-screen w-64 bg-[#1E3A8A] border-r border-[#BFDBFE] shadow-[0_0_18px_rgba(30,58,138,0.25)] text-blue-50 flex flex-col justify-between">
      <div>
        <div className="logo flex items-center gap-2 px-6 py-4 text-blue-100 text-lg font-bold">
          <FaUserTie />
          Admin Dashboard
        </div>
        <nav>
          <ul className="space-y-1 px-3">
            <li className="nav-item">
              <NavLink
                to="/admindashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaHome className="nav-icon" />
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admindashboard/users"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaUsers className="nav-icon" />
                Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admindashboard/staff"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaSuitcase className="nav-icon" />
                Staff Members
              </NavLink>
            </li>
             <li className="nav-item">
              <NavLink
                to="/admindashboard/requested-pc"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaBox className="nav-icon" />
                Requested PC
              </NavLink>
            </li>
           
            <li className="nav-item">
              <NavLink
                to="/inv/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaBox className="nav-icon" />
                Inventory
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admindashboard/feedback"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaStar className="nav-icon" />
                Feedback & Rating system
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admindashboard/admin-repair"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaServer className="nav-icon" />
                Repairs
              </NavLink>
              </li>
            <li className="nav-item">
              <NavLink
                to="/admindashboard/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaBicycle className="nav-icon" />
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admindashboard/delivery"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1E40AF] hover:text-white transition"
              >
                <FaFile className="nav-icon" />
                Delivery
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="user-info px-6 py-4 border-t border-[#BFDBFE]">
        <span className="block text-sm text-blue-100/80">Admin User</span>
        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded-md bg-[#3B82F6] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  //users
  const [userChartData, setUserChartData] = useState({
    labels: ['Logged-In Users', 'Newly Created Users'],
    datasets: [{ data: [0, 0], backgroundColor: ['#28a745', '#007bff'] }],
  });
  const [totalUsers, setTotalUsers] = useState(0);

  //user counting
  const fetchUserCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allUsers = response.data.users;
      const loggedInCount = allUsers.filter(user => user.lastLogin).length;
      const newlyCreatedCount = allUsers.filter(user => !user.lastLogin).length;
      setTotalUsers(allUsers.length);
      setUserChartData({
        labels: ['Logged-In Users', 'Newly Created Users'],
        datasets: [
          {
            label: 'Number of Users',
            data: [loggedInCount, newlyCreatedCount],
            backgroundColor: ['#28a745', '#007bff'],
            borderColor: ['#218838', '#0069d9'],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch user data for dashboard:", error);
    }
  };
//staff
  const [staffChartData, setStaffChartData] = useState({
    labels: ['Logged-In Staff', 'Newly Created Staff'],
    datasets: [{ data: [0, 0], backgroundColor: ['#17a2b8', '#dc3545'] }],
  });
  const [totalStaff, setTotalStaff] = useState(0);
//staff counting
  const fetchStaffCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allStaff = response.data.staffMembers;
      const loggedInCount = allStaff.filter(staff => staff.lastLogin).length;
      const newlyCreatedCount = allStaff.filter(staff => !staff.lastLogin).length;
      setTotalStaff(allStaff.length);
      setStaffChartData({
        labels: ['Logged-In Staff', 'Newly Created Staff'],
        datasets: [
          {
            label: 'Number of Staff',
            data: [loggedInCount, newlyCreatedCount],
            backgroundColor: ['#17a2b8', '#dc3545'],
            borderColor: ['#138496', '#c82333'],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch staff data for dashboard:", error);
    }
  };
//feddback
  const [feedbackChartData, setFeedbackChartData] = useState({
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Number of Feedbacks',
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#e44a05', '#f19e42', '#f0e66c', '#add8e6', '#28a745'],
      borderColor: ['#c33d04', '#d48a31', '#d4cd5d', '#99c2d1', '#218838'],
      borderWidth: 1,
    }],
  });
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
//feedback counting
  const fetchFeedbackCounts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/feedback');
      const feedbacks = response.data || [];
      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      feedbacks.forEach(f => {
        const rating = f.serviceRating;
        if (dist.hasOwnProperty(rating)) {
          dist[rating]++;
        }
      });
      setTotalFeedbacks(feedbacks.length);
      setFeedbackChartData({
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
          {
            label: 'Number of Feedbacks',
            data: [dist[1], dist[2], dist[3], dist[4], dist[5]],
            backgroundColor: ['#e44a05', '#f19e42', '#f0e66c', '#add8e6', '#28a745'],
            borderColor: ['#c33d04', '#d48a31', '#d4cd5d', '#99c2d1', '#218838'],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch feedback data for dashboard:", error);
    }
  };
//calling 
  useEffect(() => {
    fetchUserCounts();
    fetchStaffCounts();
    fetchFeedbackCounts();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="main-content flex-1 bg-gradient-to-br from-blue-50 via-blue-100 to-white text-[#1E3A8A] min-h-screen p-6">
      <header className="dashboard-header flex justify-between items-center border-b border-[#BFDBFE] pb-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1E40AF]">Dashboard Overview</h1>
        <div className="header-right flex items-center gap-3">
          {/* <input
            type="text"
            placeholder="Search..."
            className="rounded-md bg-white border border-blue-300 px-3 py-1 text-sm text-[#1E3A8A] focus:ring-2 focus:ring-[#3B82F6] shadow-sm"
          /> */}
          <div className="profile-icon h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow" />
        </div>
      </header>

      <div className="widgets-container grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
          <h3 className="text-[#1E40AF] font-semibold">Total Users</h3>
          <p className="text-2xl font-bold text-[#1E3A8A]">{totalUsers}</p>
        </div>
        <div className="card bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
          <h3 className="text-[#1E40AF] font-semibold">Total Staff</h3>
          <p className="text-2xl font-bold text-[#1E3A8A]">{totalStaff}</p>
        </div>
        <div className="card bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
          <h3 className="text-[#1E40AF] font-semibold">Total Feedbacks</h3>
          <p className="text-2xl font-bold text-[#1E3A8A]">{totalFeedbacks}</p>
        </div>
      </div>
<div className="card bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
  <h3 className="text-[#1E40AF] font-semibold mb-2">User Accounts Overview</h3>
  <div className="chart-container h-90 w-full">
    <Pie data={userChartData} options={options} />
  </div>
</div>

<div className="card bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
  <h3 className="text-[#1E40AF] font-semibold mb-2">Staff Accounts Overview</h3>
  <div className="chart-container h-90 w-full">
    <Pie data={staffChartData} options={options} />
  </div>
</div>

<div className="card full-width-card bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-4 shadow-sm">
  <h3 className="text-[#1E40AF] font-semibold mb-2">Feedback Rating Distribution</h3>
  <div className="chart-container h-90 w-full">
    <Bar data={feedbackChartData} options={options} />
  </div>
</div>

      </div>

  );
};

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <FaSearch className="text-[#1E40AF]" />;
  }

  return (
    <div className="app-container flex">
      <Sidebar />
      <div className="content-container flex-1">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/users" element={<AdminUserPage />} />
          <Route path="/staff" element={<AdminStaffPage />} />
          <Route path="/products" element={<h1 className="text-[#1E40AF] p-6">Products Page</h1>} />
          <Route path="/inventory" element={<h1 className="text-[#1E40AF] p-6">Inventory Page</h1>} />
          <Route path="/feedback" element={<AdminFeedbackPage />} />
         <Route path="admin-repair" element={<AdminRepairs />} />
         <Route path="/orders" element={<AdminOrder />} />
         <Route path="/delivery" element={<AdminDelivery />} />
          <Route path="/login" element={<LoginPage />} />
           <Route path="requested-pc" element={<AdminRequestedPC />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
