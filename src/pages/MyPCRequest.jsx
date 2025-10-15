import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Dropdown options
const options = {
  cpu: ["Intel i9", "Intel i7", "Intel i5", "AMD Ryzen 9", "AMD Ryzen 7", "AMD Ryzen 5"],
  motherboard: ["ASUS ROG Strix Z690", "MSI B550 Tomahawk", "Gigabyte X570 Aorus Elite"],
  ram: ["Corsair Vengeance 16GB", "G.Skill TridentZ 32GB", "Kingston Fury 16GB"],
  gpu: ["NVIDIA RTX 4090", "NVIDIA RTX 4070", "AMD Radeon RX 7900XT", "AMD Radeon RX 6800"],
  case: ["NZXT H510", "Corsair iCUE 4000X", "Cooler Master MasterBox TD500"],
  ssd: ["Samsung 980 Pro 1TB", "WD Black SN850X 1TB", "Crucial P5 Plus 1TB"],
  hdd: ["Seagate Barracuda 2TB", "WD Blue 2TB", "Toshiba X300 4TB"],
  psu: ["Corsair RM850x", "EVGA SuperNOVA 750W", "Seasonic Focus GX-650W"],
  fans: ["Noctua NF-A12", "Corsair LL120", "Cooler Master SickleFlow"]
};

export default function MyPCRequest() {
  const [builds, setBuilds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Get token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user?.email;

  // Redirect or alert if not logged in
  if (!token || !userEmail) {
    return (
      <p className="text-center text-red-600 mt-10">
        You must log in to view your PC requests.
      </p>
    );
  }

  // Axios instance with auth header
  const api = axios.create({
    baseURL: "http://localhost:5001",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      const res = await api.get(`/api/builds?email=${userEmail}`);
      setBuilds(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch PC requests");
    }
  };

  const handleEdit = (build) => {
    setEditingId(build._id);
    setFormData(build);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    console.log("Editing build:", editingId, "userEmail:", userEmail, "formData:", formData);

    try {
      await api.put(`/api/builds/${editingId}`, formData);
      setEditingId(null);
      fetchBuilds();
      toast.success("Build updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update build");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this build?")) return;
    try {
      await api.delete(`/api/builds/${id}`);
      fetchBuilds();
      toast.success("Build deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete build");
    }
  };

  const handlePay = async (id) => {
    try {
      // simulate payment
      fetchBuilds();
      toast.success("Payment successful!");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 font-semibold";
      case "rejected":
        return "text-red-600 font-semibold";
      case "pending":
      default:
        return "text-yellow-500 font-semibold";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">💻 My PC Requests</h2>
      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border text-left">Customer Email</th>
              {Object.keys(options).map((field) => (
                <th key={field} className="p-3 border text-left capitalize">{field}</th>
              ))}
              <th className="p-3 border text-left">Total Price</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {builds.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center p-4 text-gray-500">No PC requests found.</td>
              </tr>
            ) : (
              builds.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{b.customerEmail}</td>
                  {Object.keys(options).map((field) => (
                    <td key={field} className="p-2 border">
                      {editingId === b._id ? (
                        <select
                          value={formData[field] || ""}
                          onChange={(e) => handleChange(field, e.target.value)}
                          className="border rounded p-1 w-full focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="">Select {field}</option>
                          {options[field].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : b[field] || "-"}
                    </td>
                  ))}
                  <td className="p-2 border font-semibold text-blue-600">${b.totalPrice || 0}</td>
                  <td className={`p-2 border ${getStatusClass(b.status)}`}>{b.status || "pending"}</td>
                  <td className="p-2 border space-x-2">
                    {editingId === b._id ? (
                      <>
                        <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
                        <button onClick={handleCancel} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                      </>
                    ) : (
                      <>
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => handleEdit(b)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                            <button onClick={() => handleDelete(b._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                          </>
                        )}
                        {b.status === "approved" && !b.paid && (
                          <button onClick={() => handlePay(b._id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Pay</button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
