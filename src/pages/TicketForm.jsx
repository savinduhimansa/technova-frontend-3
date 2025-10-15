


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// export default function TicketForm() {
//   const { id } = useParams();               // /dash/TicketForm/:id/edit
//   const isEdit = Boolean(id);

//   const API_BASE = (
//     import.meta.env?.VITE_BACKEND_URL || "http://localhost:5001"
//   ).replace(/\/+$/g, "");

//   // Keep BOTH keys so the textarea never blanks
//   const [formData, setFormData] = useState({
//     Name: "",
//     Contact: "",
//     issueType: "",
//     Description: "",  // display compatibility
//     description: "",  // backend expects lowercase
//     urgency: "Low",
//   });

//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const { Name, Contact, issueType, description, urgency } = formData;

//   // ---- Prefill when editing ----
//   useEffect(() => {
//     if (!isEdit) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`${API_BASE}/api/ticket/${id}`);
//         setFormData({
//           Name: data?.Name || "",
//           Contact: data?.Contact || "",
//           issueType: data?.issueType || "",
//           Description: data?.description || "",
//           description: data?.description || "",
//           urgency: data?.urgency || "Low",
//         });
//         setErrors({});
//         setMessage("");
//       } catch (e) {
//         console.error("GET /api/ticket/:id failed:", e.response?.data || e.message);
//         setMessage("❌ Failed to load ticket.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [API_BASE, id, isEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Keep Description and description synchronized
//     if (name === "description") {
//       setFormData((prev) => ({ ...prev, description: value, Description: value }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }

//     // Validation for Contact (10 digits only)
//     if (name === "Contact") {
//       const ok = /^[0-9]{10}$/.test(value);
//       setErrors((prev) =>
//         ok ? (({ Contact, ...rest }) => rest)(prev) : { ...prev, Contact: "Contact number must be 10 digits." }
//       );
//     }

//     // Validation for Name (letters and spaces only)
//     if (name === "Name") {
//       const ok = /^[A-Za-z\s]+$/.test(value.trim());
//       setErrors((prev) =>
//         ok ? (({ Name, ...rest }) => rest)(prev) : { ...prev, Name: "Name must contain only letters." }
//       );
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Final guard for Name
//     if (!/^[A-Za-z\s]+$/.test(Name.trim())) {
//       setErrors((prev) => ({ ...prev, Name: "Please enter a valid name (letters only)." }));
//       return;
//     }

//     // Final guard for Contact
//     if (!/^[0-9]{10}$/.test(Contact)) {
//       setErrors((prev) => ({ ...prev, Contact: "Please enter a valid 10-digit contact number." }));
//       return;
//     }

//     try {
//       const payload = { Name, Contact, issueType, description, urgency };

//       if (isEdit) {
//         const { data } = await axios.put(`${API_BASE}/api/ticket/${id}`, payload, {
//           headers: { "Content-Type": "application/json" },
//         });
//         setMessage(`✅ Ticket updated! Code: ${data?.ticketId || "N/A"}`);
//       } else {
//         const { data } = await axios.post(`${API_BASE}/api/ticket`, payload, {
//           headers: { "Content-Type": "application/json" },
//         });
//         const shortId = (data?.ticketId || data?._id || "N/A").toString().slice(0, 4);
//         setMessage(`✅ Service request submitted! Your Ticket ID is: ${shortId}`);

//         // Reset form
//         setFormData({
//           Name: "",
//           Contact: "",
//           issueType: "",
//           Description: "",
//           description: "",
//           urgency: "Low",
//         });
//       }

//       setErrors({});
//     } catch (error) {
//       let errorMsg = "❌ Error submitting request.";
//       if (error.response) {
//         errorMsg = `❌ Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
//       } else if (error.request) {
//         errorMsg = "❌ No response from backend.";
//       } else {
//         errorMsg = `❌ ${error.message}`;
//       }
//       setMessage(errorMsg);
//       console.error("Submission Error:", error);
//     }
//   };

//   if (isEdit && loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-[#1E40AF]">
//         Loading ticket…
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white text-[#0F172A] flex items-center justify-center p-4">
//       <div
//         className="w-full max-w-lg bg-[#DBEAFE] p-8 rounded-2xl shadow-md border"
//         style={{ borderColor: "#BFDBFE" }}
//       >
//         <h2 className="text-center text-3xl font-bold mb-6 text-[#3B82F6]">
//           {isEdit ? "Edit Service Request" : "Service Request Form"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-[#1E40AF]">Name</label>
//             <input
//               type="text"
//               name="Name"
//               value={Name}
//               onChange={handleChange}
//               required
//               pattern="[A-Za-z\s]+"
//               className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border ${
//                 errors.Name ? "border-red-500" : "border-[#BFDBFE]"
//               } text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 ${
//                 errors.Name ? "focus:ring-red-400" : "focus:ring-[#3B82F6]"
//               }`}
//             />
//             {errors.Name && <p className="text-red-600 text-xs mt-1">{errors.Name}</p>}
//           </div>

//           {/* Contact */}
//           <div>
//             <label className="block text-sm font-medium text-[#1E40AF]">Contact Number</label>
//             <input
//               type="text"
//               name="Contact"
//               value={Contact}
//               onChange={handleChange}
//               required
//               maxLength={10}         // stops typing beyond 10
//               inputMode="numeric"    // mobile numeric keyboard
//               className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border ${
//                 errors.Contact ? "border-red-500" : "border-[#BFDBFE]"
//               } text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 ${
//                 errors.Contact ? "focus:ring-red-400" : "focus:ring-[#3B82F6]"
//               }`}
//             />
//             {errors.Contact && <p className="text-red-600 text-xs mt-1">{errors.Contact}</p>}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-[#1E40AF]">
//               Description (device type, Device_issue)
//             </label>
//             <textarea
//               name="description"
//               value={description}
//               onChange={handleChange}
//               required
//               rows="4"
//               className="mt-1 block w-full px-3 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//             />
//           </div>

//           {/* Issue Type */}
//           <div>
//             <label className="block text-sm font-medium text-[#1E40AF]">Issue Type</label>
//             <select
//               name="issueType"
//               value={issueType}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full px-3 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//             >
//               <option value="">Select Issue Type</option>
//               <option value="User-Caused Issues">User-Caused Issues</option>
//               <option value="Hardware Issues">Hardware Issues</option>
//               <option value="Software Issues">Software Issues</option>
//             </select>
//           </div>

//           {/* Urgency */}
//           <div>
//             <label className="block text-sm font-medium text-[#1E40AF]">Urgency</label>
//             <select
//               name="urgency"
//               value={urgency}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//               <option value="Critical">Critical</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 px-4 rounded-lg text-white bg-[#3B82F6] hover:bg-[#2563EB] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
//           >
//             {isEdit ? "Update Request" : "Submit Request"}
//           </button>
//         </form>

//         {message && (
//           <p className="mt-4 text-center text-sm font-medium text-[#1E40AF]">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }


// src/pages/TicketForm.jsx (or wherever you keep it)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function TicketForm() {
  const { id } = useParams();               // /dash/TicketForm/:id/edit
  const isEdit = Boolean(id);

  const API_BASE = (
    import.meta.env?.VITE_BACKEND_URL || "http://localhost:5001"
  ).replace(/\/+$/g, "");

  // Keep BOTH keys so the textarea never blanks
  const [formData, setFormData] = useState({
    Name: "",
    Contact: "",
    issueType: "",
    Description: "",  // display compatibility
    description: "",  // backend expects lowercase
    urgency: "Low",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { Name, Contact, issueType, description, urgency } = formData;

  // ---- Read auth once ----
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(Boolean(token));
  }, []);

  // ---- Prefill when editing ----
  useEffect(() => {
    if (!isEdit) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("🔒 Please log in to load and edit this ticket.");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE}/api/ticket/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          Name: data?.Name || "",
          Contact: data?.Contact || "",
          issueType: data?.issueType || "",
          Description: data?.description || "",
          description: data?.description || "",
          urgency: data?.urgency || "Low",
        });
        setErrors({});
        setMessage("");
      } catch (e) {
        console.error("GET /api/ticket/:id failed:", e.response?.data || e.message);
        setMessage("❌ Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    })();
  }, [API_BASE, id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Keep Description and description synchronized
    if (name === "description") {
      setFormData((prev) => ({ ...prev, description: value, Description: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validation for Contact (10 digits only)
    if (name === "Contact") {
      const ok = /^[0-9]{10}$/.test(value);
      setErrors((prev) =>
        ok ? (({ Contact, ...rest }) => rest)(prev) : { ...prev, Contact: "Contact number must be 10 digits." }
      );
    }

    // Validation for Name (letters and spaces only)
    if (name === "Name") {
      const ok = /^[A-Za-z\s]+$/.test(value.trim());
      setErrors((prev) =>
        ok ? (({ Name, ...rest }) => rest)(prev) : { ...prev, Name: "Name must contain only letters." }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Must be logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthed(false);
      setMessage("🔒 You need to log in before submitting a request.");
      return;
    }

    // Final guard for Name
    if (!/^[A-Za-z\s]+$/.test(Name.trim())) {
      setErrors((prev) => ({ ...prev, Name: "Please enter a valid name (letters only)." }));
      return;
    }

    // Final guard for Contact
    if (!/^[0-9]{10}$/.test(Contact)) {
      setErrors((prev) => ({ ...prev, Contact: "Please enter a valid 10-digit contact number." }));
      return;
    }

    try {
      setSubmitting(true);
      const payload = { Name, Contact, issueType, description, urgency };

      if (isEdit) {
        const { data } = await axios.put(`${API_BASE}/api/ticket/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(`✅ Ticket updated! Code: ${data?.ticketId || "N/A"}`);
      } else {
        const { data } = await axios.post(`${API_BASE}/api/ticket`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const shortId = (data?.ticketId || data?._id || "N/A").toString().slice(0, 4);
        setMessage(`✅ Service request submitted! Your Ticket ID is: ${shortId}`);

        // Reset form
        setFormData({
          Name: "",
          Contact: "",
          issueType: "",
          Description: "",
          description: "",
          urgency: "Low",
        });
      }

      setErrors({});
    } catch (error) {
      let errorMsg = "❌ Error submitting request.";
      if (error.response) {
        errorMsg = `❌ Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMsg = "❌ No response from backend.";
      } else {
        errorMsg = `❌ ${error.message}`;
      }
      setMessage(errorMsg);
      console.error("Submission Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#1E40AF]">
        Loading ticket…
      </div>
    );
  }

  const disabledUI = !isAuthed || submitting;

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-[#DBEAFE] p-8 rounded-2xl shadow-md border"
        style={{ borderColor: "#BFDBFE" }}
      >
        <h2 className="text-center text-3xl font-bold mb-6 text-[#3B82F6]">
          {isEdit ? "Edit Service Request" : "Service Request Form"}
        </h2>

        {!isAuthed && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 p-3 text-sm">
            🔒 You must be logged in to submit this form.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#1E40AF]">Name</label>
            <input
              type="text"
              name="Name"
              value={Name}
              onChange={handleChange}
              required
              pattern="[A-Za-z\s]+"
              disabled={disabledUI}
              className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border ${
                errors.Name ? "border-red-500" : "border-[#BFDBFE]"
              } text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 ${
                errors.Name ? "focus:ring-red-400" : "focus:ring-[#3B82F6]"
              } ${disabledUI ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {errors.Name && <p className="text-red-600 text-xs mt-1">{errors.Name}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-[#1E40AF]">Contact Number</label>
            <input
              type="text"
              name="Contact"
              value={Contact}
              onChange={handleChange}
              required
              maxLength={10}         // stops typing beyond 10
              inputMode="numeric"    // mobile numeric keyboard
              disabled={disabledUI}
              className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border ${
                errors.Contact ? "border-red-500" : "border-[#BFDBFE]"
              } text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 ${
                errors.Contact ? "focus:ring-red-400" : "focus:ring-[#3B82F6]"
              } ${disabledUI ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {errors.Contact && <p className="text-red-600 text-xs mt-1">{errors.Contact}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1E40AF]">
              Description (device type, Device_issue)
            </label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              required
              rows="4"
              disabled={disabledUI}
              className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
                disabledUI ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-[#1E40AF]">Issue Type</label>
            <select
              name="issueType"
              value={issueType}
              onChange={handleChange}
              required
              disabled={disabledUI}
              className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
                disabledUI ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select Issue Type</option>
              <option value="User-Caused Issues">User-Caused Issues</option>
              <option value="Hardware Issues">Hardware Issues</option>
              <option value="Software Issues">Software Issues</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-[#1E40AF]">Urgency</label>
            <select
              name="urgency"
              value={urgency}
              onChange={handleChange}
              disabled={disabledUI}
              className={`mt-1 block w-full px-3 py-2 rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
                disabledUI ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={disabledUI}
            className={`w-full py-2 px-4 rounded-lg text-white bg-[#3B82F6] hover:bg-[#2563EB] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] ${
              disabledUI ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isEdit ? (submitting ? "Updating..." : "Update Request") : (submitting ? "Submitting..." : "Submit Request")}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-[#1E40AF]">{message}</p>
        )}
      </div>
    </div>
  );
}
