import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import { FaEdit } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
    phone: '',
    isDisable: false,
    isEmailVerified: false
  });
  const [editingUser, setEditingUser] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);

  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [newlyCreatedUsers, setNewlyCreatedUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");


  //Admin list
  const [adminUsers, setAdminUsers] = useState([]);

  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5001/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const allUsers = response.data.users;
    const isAdmin = (role) => String(role || '').toLowerCase() === 'admin';

    // Split once
    const admins = allUsers.filter(u => isAdmin(u.role));
    const nonAdmins = allUsers.filter(u => !isAdmin(u.role));

    // Exclude admins from these two tables
    const loggedIn = nonAdmins.filter(u => u.lastLogin);
    const newlyCreated = nonAdmins.filter(u => !u.lastLogin);

    //calling
    setLoggedInUsers(loggedIn);
    setNewlyCreatedUsers(newlyCreated);
    setAdminUsers(admins);
    setUsers(allUsers);

    toast.success("User data loaded successfully.");
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    toast.error("Failed to load user data.");
  }
};
  useEffect(() => {
    fetchUsers();
  }, []);
//add new user
  const handleAddInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  const v = type === 'checkbox' ? checked : value;

  setNewUser(prev => ({ ...prev, [name]: v }));

  //validation 
  let msg = "";
  if (name === "userId") {
    if (!/^\d*$/.test(String(v).trim())) msg = "User ID must be numbers.";
  }
  if (name === "firstName") {
    if (!/^[A-Za-z\s]+$/.test(String(v).trim())) msg = "First name must contain only letters.";
  }
  if (name === "lastName") {
    if (!/^[A-Za-z\s]+$/.test(String(v).trim())) msg = "Last name must contain only letters.";
  }
  if (name === "email") {
    if (!/^\S+@\S+\.\S+$/.test(String(v).trim())) msg = "Enter a valid email address.";
  }
  if (name === "role") {
    if (!/^user|admin$/.test(String(v))) msg = "Select a valid role.";
  }
  if (name === "password") {
    if (!/^(?=.*\d).{6,}$/.test(String(v))) msg = "Password must be ≥6 chars and include a number.";
  }
 if (name === "phone" && String(v).trim() !== "") {
  if (!/^\d{10}$/.test(String(v).trim())) msg = "Phone number must be exactly 10 digits.";
}


  // Set browser validity
  e.target.setCustomValidity(msg);
  // Update error
  setErrors(prev => {
    if (!msg) {
      const { [name]: _omit, ...rest } = prev;
      return rest;
    }
    return { ...prev, [name]: msg };
  });
};

//user edit
  const handleEditInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  const v = type === 'checkbox' ? checked : value;

  setEditingUser(prev => ({ ...prev, [name]: v }));
//validation
  let msg = "";
  if (name === "userId") {
    
    if (!/^\d*$/.test(String(v).trim())) msg = "User ID must be numbers.";
  }
  if (name === "firstName") {
    if (!/^[A-Za-z\s]+$/.test(String(v).trim())) msg = "First name must contain only letters.";
  }
  if (name === "lastName") {
    if (!/^[A-Za-z\s]+$/.test(String(v).trim())) msg = "Last name must contain only letters.";
  }
  if (name === "email") {
    if (!/^\S+@\S+\.\S+$/.test(String(v).trim())) msg = "Enter a valid email address.";
  }
  if (name === "role") {
    if (!/^user|admin$/.test(String(v))) msg = "Select a valid role.";
  }
 if (name === "phone" && String(v).trim() !== "") {
  if (!/^\d{10}$/.test(String(v).trim())) msg = "Phone number must be exactly 10 digits.";
}


  e.target.setCustomValidity(msg);
  setErrors(prev => {
    if (!msg) {
      const { [name]: _omit, ...rest } = prev;
      return rest;
    }
    return { ...prev, [name]: msg };
  });
};


  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const addUser = async (e) => {
    e.preventDefault();
    // Trigger built-in validation UI and block if invalid
if (!e.currentTarget.checkValidity()) {
  e.currentTarget.reportValidity();
  return;
}
// Also block if our custom error bag has any messages
if (Object.values(errors).some(Boolean)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/user/add',
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User added successfully!");
      fetchUsers();
      setNewUser({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        password: '',
        phone: '',
        isDisable: false,
        isEmailVerified: false
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error(error.response?.data?.message || "Failed to add user.");
    }
  };

  const editUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

// Trigger validation UI and block if invalid
if (!e.currentTarget.checkValidity()) {
  e.currentTarget.reportValidity();
  return;
}
if (Object.values(errors).some(Boolean)) return;

    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/user/${editingUser._id}`,
        editingUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User updated successfully!");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data?.message || "Failed to update user.");
    }
  };
//delete user
  const deleteUser = (userId) => {
    toast((t) => (
      <div className="bg-white border border-[#BFDBFE] text-[#1E3A8A] rounded-xl p-4 shadow">
        <p className="text-sm">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(userId);
            }}
            className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-3 py-1.5 text-sm font-semibold text-white transition"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-3 py-1.5 text-sm font-semibold transition"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 99999, style: { minWidth: '350px' } });
  };
//comfirm deleting
  const confirmDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5001/api/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };
//clear form
  const handleClearForm = () => {
    setNewUser({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      password: '',
      phone: '',
      isDisable: false,
      isEmailVerified: false
    });
  };
const downloadPdf = (users, title) => {
  // Landscape A4 = more horizontal space so columns don't crush
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = `Generated on: ${dateStr} at ${timeStr}`;

  // === HEADER (colors unchanged) ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("TechNova", pageWidth / 2, 16, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Empowering Digital Operations", pageWidth / 2, 23, { align: "center" });

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text(`Topic: ${title}`, 14, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(formattedDate, pageWidth - 14, 36, { align: "right" });

  // divider for clarity
  doc.setDrawColor(200);
  doc.line(14, 42, pageWidth - 14, 42);

  // === TABLE ===
  // Build rows (keep full content)
  const body = users.map(user => [
    user.userId ?? '',
    user.firstName ?? '',
    user.lastName ?? '',
    user.email ?? '',
    (user.role ?? '').toString(),
    (user.phone && String(user.phone).trim()) ? user.phone : 'Not given',
    user.isDisable ? 'Yes' : 'No',
    user.isEmailVerified ? 'Yes' : 'No',
    user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'
  ]);

  // Fixed, readable column widths (will be scaled to fit exactly)
  // [ID, First, Last, Email, Role, Phone, Disabled, Email Verified, Last Login]
  const marginLeft = 14;
  const marginRight = 14;
  const tableWidth = pageWidth - marginLeft - marginRight;

  // Tuned widths to show full values; wrap is ON so long text goes to next line, not mid-word split.
  const colWidths = [14, 28, 28, 75, 20, 30, 18, 26, 30]; // sum = 269 (A4 landscape usable ≈ 269mm)
  const sum = colWidths.reduce((a, b) => a + b, 0);
  const scale = tableWidth / sum;
  const W = colWidths.map(w => w * scale);

  autoTable(doc, {
    startY: 50,
    tableWidth,
    margin: { left: marginLeft, right: marginRight },
    head: [[
      'ID', 'First Name', 'Last Name', 'Email', 'Role', 'Phone', 'Disabled', 'Email Verified', 'Last Login'
    ]],
    body,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,            // compact but readable
      cellPadding: 3.5,
      overflow: 'linebreak',   // wrap to next line (no truncation)
      wordBreak: 'normal',     // don't break words in the middle
      valign: 'top',
      textColor: [30, 58, 138],
      lineColor: [191, 219, 254],
    },
    headStyles: {
      fillColor: [30, 64, 175], // keep your blue
      textColor: 255,
      fontStyle: 'bold',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255], // light zebra
    },
    columnStyles: {
      0: { cellWidth: W[0] }, // ID
      1: { cellWidth: W[1] }, // First
      2: { cellWidth: W[2] }, // Last
      3: { cellWidth: W[3] }, // Email
      4: { cellWidth: W[4] }, // Role
      5: { cellWidth: W[5] }, // Phone
      6: { cellWidth: W[6] }, // Disabled
      7: { cellWidth: W[7] }, // Email Verified
      8: { cellWidth: W[8] }, // Last Login
    },
    didDrawPage: () => {
      // Footer per page
      const page = doc.internal.getCurrentPageInfo().pageNumber;
      const pages = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor(130);
      doc.text(`Page ${page} of ${pages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    },
  });

  // === SAVE ===
  doc.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);
};


//acoount activation and deactivation
  const handleToggleAccountStatus = async (userId) => {
    if (togglingUserId) return;

    setTogglingUserId(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5001/api/user/toggle-status/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error(error.response?.data?.message || "Failed to toggle account status.");
    } finally {
      setTogglingUserId(null);
    }
  };
//table
  const renderUserTable = (usersToRender) => (
    <div className="table-responsive overflow-x-auto rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] shadow-sm">
      <table className="user-table w-full text-sm text-left">
        <thead className="bg-[#BFDBFE] text-[#1E40AF]">
          <tr>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Is Email Verified</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToRender.map(user => (
            <tr key={user._id} className="border-b border-[#BFDBFE] hover:bg-[#EFF6FF]">
              <td className="px-4 py-2 text-[#1E3A8A]">{user.userId}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.firstName}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.lastName}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.email}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.role}</td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.phone}</td>
              <td className="px-4 py-2">
                {user.isDisable ? (
                  <span className="inline-flex items-center rounded-full bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-0.5 text-xs border border-[#EF4444]/40">
                    Deactivated
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-0.5 text-xs border border-[#22C55E]/40">
                    Active
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-[#1E3A8A]">{user.isEmailVerified ? 'Yes' : 'No'}</td>
              <td className="actions px-4 py-2 whitespace-nowrap">
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-[#BFDBFE] text-[#1E40AF] px-2.5 py-1.5 mr-2 hover:bg-[#EFF6FF]"
                  onClick={() => setEditingUser(user)}
                >
                  <FaEdit />
                </button>
                <button
                  className={`${user.isDisable ? 'activate' : 'deactivate'} inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 mr-2 text-white ${user.isDisable ? 'bg-[#22C55E] hover:bg-[#16A34A]' : 'bg-[#3B82F6] hover:bg-[#1E40AF]'} transition`}
                  onClick={() => handleToggleAccountStatus(user._id)}
                  disabled={togglingUserId === user._id}
                >
                  {user.isDisable ? 'Activate' : 'Deactivate'}
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-lg bg-[#EF4444] hover:bg-[#DC2626] px-2.5 py-1.5 text-white transition"
                  onClick={() => deleteUser(user._id)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const matchUser = (u, q) => {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [
    u.userId,
    u.firstName,
    u.lastName,
    u.email,
    u.role,
    u.phone
  ].some(v => String(v ?? "").toLowerCase().includes(s));
};

const filteredLoggedIn = loggedInUsers.filter(u => matchUser(u, search));
const filteredNewlyCreated = newlyCreatedUsers.filter(u => matchUser(u, search));
const filteredAdmins = adminUsers.filter(u => matchUser(u, search));



  return (
    <div className="admin-user-container min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#E0ECFF] to-white text-[#1E3A8A] p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#1E40AF]">Add New User</h2>

      <form
        key="add-user-form"
        onSubmit={addUser}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border border-[#BFDBFE] p-4 rounded-xl shadow-sm"
      >
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={newUser.userId}
          onChange={handleAddInputChange}
          required
         className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.userId ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.userId && <p className="mt-1 text-xs text-red-500">{errors.userId}</p>}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={handleAddInputChange}
          required
          className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.firstName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={handleAddInputChange}
          required
          className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.lastName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleAddInputChange}
          required
          className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}


        <select
          name="role"
          value={newUser.role}
          onChange={handleAddInputChange}
          required
         className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] focus:ring-2 
    ${errors.role ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
        >
          <option value="" disabled>Select a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleAddInputChange}
          required
         className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newUser.phone}
          onChange={handleAddInputChange}
         className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.phone ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
          Is Disabled:
          <input type="checkbox" name="isDisable" checked={newUser.isDisable} onChange={handleAddInputChange} className="h-4 w-4 accent-[#3B82F6]" />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
          Is Email Verified:
          <input type="checkbox" name="isEmailVerified" checked={newUser.isEmailVerified} onChange={handleAddInputChange} className="h-4 w-4 accent-[#3B82F6]" />
        </label>
        <div className="col-span-full flex gap-3">
          <button type="submit" className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition">Add User</button>
          <button type="button" onClick={handleClearForm} className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-4 py-2 text-sm font-semibold transition">Clear Form</button>
        </div>
      </form>

      <hr className="border-[#BFDBFE]" />

      {editingUser && (
        <>
          <h2 className="text-2xl font-bold text-[#1E40AF]">Edit User</h2>
          <form
            key="edit-user-form"
            onSubmit={editUser}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border border-[#BFDBFE] p-4 rounded-xl shadow-sm"
          >
           <input
  type="text"
  name="userId"
  placeholder="User ID"
  value={editingUser.userId}
  onChange={handleEditInputChange}
  required
  className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    `}
/>
{errors.userId && <p className="mt-1 text-xs text-red-500">{errors.userId}</p>}

           <input
  type="text"
  name="firstName"
  placeholder="First Name"
  value={editingUser.firstName}
  onChange={handleEditInputChange}
  required
  className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.firstName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}

           <input
  type="text"
  name="lastName"
  placeholder="Last Name"
  value={editingUser.lastName}
  onChange={handleEditInputChange}
  required
  className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.lastName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}

           <input
  type="email"
  name="email"
  placeholder="Email"
  value={editingUser.email}
  onChange={handleEditInputChange}
  required
  className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}

            <select
  name="role"
  value={editingUser.role}
  onChange={handleEditInputChange}
  required
  className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] focus:ring-2 
    ${errors.role ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>
{errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}

           <input
  type="text"
  name="phone"
  placeholder="Phone"
  value={editingUser.phone}
  onChange={handleEditInputChange}
  className={`rounded-lg bg-white border px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 
    ${errors.phone ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#BFDBFE] focus:ring-[#3B82F6] focus:border-[#3B82F6]"}`}
/>
{errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}

            <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
              Is Disabled:
              <input type="checkbox" name="isDisable" checked={editingUser.isDisable} onChange={handleEditInputChange} className="h-4 w-4 accent-[#3B82F6]" />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#1E3A8A]">
              Is Email Verified:
              <input type="checkbox" name="isEmailVerified" checked={editingUser.isEmailVerified} onChange={handleEditInputChange} className="h-4 w-4 accent-[#3B82F6]" />
            </label>
            <div className="col-span-full flex gap-3">
              <button type="submit" className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition">Save Changes</button>
              <button type="button" onClick={() => setEditingUser(null)} className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-4 py-2 text-sm font-semibold transition">Cancel</button>
            </div>
          </form>
          <hr className="border-[#BFDBFE]" />
        </>
      )}

      <div className="flex items-center gap-3 mb-4">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by name, email, ID, role, or phone..."
    className="w-full rounded-lg bg-white border border-[#BFDBFE] px-3 py-2 text-sm text-[#1E3A8A] placeholder-[#1E3A8A]/60 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
  />
  {search && (
    <button
      type="button"
      onClick={() => setSearch("")}
      className="rounded-lg border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] px-3 py-2 text-sm font-semibold transition"
    >
      Clear
    </button>
  )}
</div>


     <h2 className="text-xl font-semibold text-[#1E40AF]">Logged-In Accounts</h2>

<div className="flex items-center gap-2 mb-3">
  {/* PDF for all logged-in users */}
  <button
    className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition"
    onClick={() => downloadPdf(loggedInUsers, 'Logged-In Accounts')}
  >
    Download Logged-In Users PDF (All)
  </button>

  {/* PDF for filtered results */}
  <button
    className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-50"
    onClick={() => downloadPdf(filteredLoggedIn, 'Logged-In Accounts (Filtered)')}
    disabled={!search?.trim() || filteredLoggedIn.length === 0}
  >
    Download Logged-In Users PDF (Filtered)
  </button>
</div>

{/* Show filtered table only when searching; otherwise show all */}
{(search?.trim() ? filteredLoggedIn.length > 0 : loggedInUsers.length > 0) ? (
  renderUserTable(search?.trim() ? filteredLoggedIn : loggedInUsers)
) : (
  <p className="text-[#1E3A8A]">
    {search?.trim() ? "No users match your search." : "No users have logged in yet."}
  </p>
)}


      <hr className="border-[#BFDBFE]" />

     <h2 className="text-xl font-semibold text-[#1E40AF]">Newly Created Accounts (Never Logged In)</h2>

<div className="flex items-center gap-2 mb-3">
  {/* PDF for all newly created users */}
  <button
    className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition"
    onClick={() => downloadPdf(newlyCreatedUsers, 'Newly Created Accounts')}
  >
    Download New Users PDF (All)
  </button>

  {/* PDF for filterd results */}
  <button
    className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-50"
    onClick={() => downloadPdf(filteredNewlyCreated, 'Newly Created Accounts (Filtered)')}
    disabled={!search?.trim() || filteredNewlyCreated.length === 0}
  >
    Download New Users PDF (Filtered)
  </button>
</div>

{/* Show filtered table only when searching; otherwise show all */}
{(search?.trim() ? filteredNewlyCreated.length > 0 : newlyCreatedUsers.length > 0) ? (
  renderUserTable(search?.trim() ? filteredNewlyCreated : newlyCreatedUsers)
) : (
  <p className="text-[#1E3A8A]">
    {search?.trim() ? "No new users match your search." : "No new accounts have been created recently."}
  </p>
)}


      <hr className="border-[#BFDBFE]" />

     
      <h2 className="text-xl font-semibold text-[#1E40AF]">Admin Accounts</h2>
      <button
        className="rounded-lg bg-[#3B82F6] hover:bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white shadow transition mb-3"
        onClick={() => downloadPdf(adminUsers, 'Admin Accounts')}
      >
        Download Admin Users PDF
      </button>
      {adminUsers.length > 0 ? (
        renderUserTable(adminUsers)
      ) : (
        <p className="text-[#1E3A8A]">No admin accounts found.</p>
      )}
    </div>
  );
};

export default AdminUserPage;
