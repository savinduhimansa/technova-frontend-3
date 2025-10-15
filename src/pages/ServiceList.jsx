


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") + "/api/services";

// const ServiceList = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     dateCreated: '',
//     service: '',
//     description: '',
//     cost: '',
//     _id: '',
//     serviceNumber: '',
//   });
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const authHeaders = () => {
//     const token = localStorage.getItem('token');
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(API, { headers: authHeaders() });
//       setServices(res.data || []);
//     } catch (err) {
//       setError(
//         'Error fetching services: ' + (err.response?.data?.message || err.message),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'cost' ? (value === '' ? '' : Number(value)) : value,
//     }));
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     // Form validation
//     if (
//       !formData.service.trim() ||
//       !formData.description.trim() ||
//       formData.cost === '' ||
//       isNaN(formData.cost)
//     ) {
//       setError('Please fill in all mandatory fields: service, description, and cost.');
//       return;
//     }

//     try {
//       const payload = {
//         dateCreated: formData.dateCreated || undefined,
//         service: formData.service.trim(),
//         description: formData.description.trim(),
//         cost: Number(formData.cost),
//       };

//       if (formData._id) {
//         await axios.put(`${API}/${formData._id}`, payload, {
//           headers: {
//             'Content-Type': 'application/json',
//             ...authHeaders(),
//           },
//         });
//       } else {
//         await axios.post(API, payload, {
//           headers: {
//             'Content-Type': 'application/json',
//             ...authHeaders(),
//           },
//         });
//       }

//       closeForm();
//       fetchServices();
//     } catch (err) {
//       setError(
//         'Failed to save service: ' + (err.response?.data?.message || err.message),
//       );
//     }
//   };

//   const handleDeleteService = async (id) => {
//     if (!id || !window.confirm('Are you sure you want to delete this service?')) return;

//     try {
//       await axios.delete(`${API}/${id}`, { headers: authHeaders() });
//       fetchServices();
//     } catch (err) {
//       setError(
//         'Error deleting service: ' + (err.response?.data?.message || err.message),
//       );
//     }
//   };

//   const handleEditService = (s) => {
//     setFormData({
//       ...s,
//       dateCreated: s.dateCreated?.split('T')[0] || '',
//     });
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setFormData({
//       dateCreated: '',
//       service: '',
//       description: '',
//       cost: '',
//       _id: '',
//       serviceNumber: '',
//     });
//   };

//   const filteredServices = services.filter((s) => {
//     if (!searchTerm.trim()) return true;
//     return s.serviceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   return (
//     <div className="p-4 md:p-8 bg-white min-h-screen text-[#0F172A]">
//       <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-[#1E40AF]">
//         Service List
//       </h2>
      
//       <div className="mb-6 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search by Service Number..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-1/2 px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//         />
//       </div>

//       <button
//         className="w-full md:w-auto mb-6 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
//         onClick={() => setShowForm(true)}
//       >
//         Add New Service
//       </button>

//       {error && (
//         <div className="p-4 mb-4 text-center bg-red-100 text-red-700 rounded-lg border border-red-200">
//           {error}
//         </div>
//       )}
//       {loading && (
//         <div className="text-center text-lg text-[#1E40AF]">Loading services...</div>
//       )}

//       {showForm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//           <div className="bg-[#DBEAFE] p-6 rounded-2xl shadow-xl border w-full max-w-lg"
//                style={{ borderColor: "#BFDBFE" }}>
//             <h3 className="text-2xl font-bold mb-4 text-[#1E40AF]">
//               {formData._id ? 'Update Service' : 'Add New Service'}
//             </h3>
//             <form onSubmit={handleFormSubmit} className="space-y-4">
//               <input
//                 type="date"
//                 name="dateCreated"
//                 value={formData.dateCreated}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               />
//               <input
//                 type="text"
//                 name="service"
//                 value={formData.service}
//                 onChange={handleInputChange}
//                 placeholder="Service"
//                 required
//                 className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               />
//               <input
//                 type="text"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Description"
//                 required
//                 className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               />
//               <input
//                 type="number"
//                 name="cost"
//                 value={formData.cost}
//                 onChange={handleInputChange}
//                 placeholder="Cost"
//                 step="0.01"
//                 required
//                 className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               />
//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition"
//                 >
//                   {formData._id ? 'Update' : 'Add'}
//                 </button>
//                 <button
//                   type="button"
//                   className="px-6 py-2 bg-white border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] font-semibold rounded-lg transition"
//                   onClick={closeForm}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//             {formData._id && (
//               <p className="mt-4 text-center text-[#1E40AF]">
//                 Service Number: <span className="font-semibold">{formData.serviceNumber}</span>
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto shadow-sm rounded-2xl border bg-[#DBEAFE]" style={{ borderColor: "#BFDBFE" }}>
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
//               <th className="py-3 px-6 text-left">No</th>
//               <th className="py-3 px-6 text-left">Service Number</th>
//               <th className="py-3 px-6 text-left">Date Created</th>
//               <th className="py-3 px-6 text-left">Service</th>
//               <th className="py-3 px-6 text-left">Description</th>
//               <th className="py-3 px-6 text-left">Cost</th>
//               <th className="py-3 px-6 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="[&>tr]:border-b text-sm" style={{ borderColor: "#BFDBFE" }}>
//             {filteredServices.length > 0 ? (
//               filteredServices.map((s, idx) => (
//                 <tr key={s._id || idx} className="hover:bg-[#EFF6FF]">
//                   <td className="py-3 px-6 whitespace-nowrap">{idx + 1}</td>
//                   <td className="py-3 px-6">{s.serviceNumber || '-'}</td>
//                   <td className="py-3 px-6">
//                     {s.dateCreated ? new Date(s.dateCreated).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="py-3 px-6">{s.service}</td>
//                   <td className="py-3 px-6">{s.description}</td>
//                   <td className="py-3 px-6">{Number(s.cost).toFixed(2)}</td>
//                   <td className="py-3 px-6 text-center">
//                     <button
//                       className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg transition mr-2"
//                       onClick={() => handleEditService(s)}
//                     >
//                       Update
//                     </button>
//                     <button
//                       className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
//                       onClick={() => handleDeleteService(s._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr className="bg-white">
//                 <td colSpan="7" className="py-4 text-center text-[#1E40AF]/70">
//                   No services found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ServiceList;





import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") + "/api/services";

// Local YYYY-MM-DD (timezone-safe)
const getTodayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dateCreated: '',
    service: '',
    description: '',
    cost: '',
    _id: '',
    serviceNumber: '',
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateErr, setDateErr] = useState(''); // inline date-only error

  const todayStr = getTodayStr();

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API, { headers: authHeaders() });
      setServices(res.data || []);
    } catch (err) {
      setError(
        'Error fetching services: ' + (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  // When modal opens for creating, default date to today
  useEffect(() => {
    if (showForm && !formData._id && !formData.dateCreated) {
      setFormData((p) => ({ ...p, dateCreated: todayStr }));
    }
  }, [showForm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dateCreated') {
      if (value !== todayStr) {
        setDateErr('Date must be today.');
        setFormData((prev) => ({ ...prev, dateCreated: todayStr }));
        return;
      }
      setDateErr('');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cost' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDateErr('');

    // Date must be today
    if (formData.dateCreated !== todayStr) {
      setDateErr('Date must be today.');
      return;
    }

    // Form validation
    if (
      !formData.service.trim() ||
      !formData.description.trim() ||
      formData.cost === '' ||
      isNaN(formData.cost)
    ) {
      setError('Please fill in all mandatory fields: service, description, and cost.');
      return;
    }

    try {
      const payload = {
        dateCreated: todayStr, // enforce today
        service: formData.service.trim(),
        description: formData.description.trim(),
        cost: Number(formData.cost),
      };

      if (formData._id) {
        await axios.put(`${API}/${formData._id}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
        });
      } else {
        await axios.post(API, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
        });
      }

      closeForm();
      fetchServices();
    } catch (err) {
      setError(
        'Failed to save service: ' + (err.response?.data?.message || err.message),
      );
    }
  };

  const handleDeleteService = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`${API}/${id}`, { headers: authHeaders() });
      fetchServices();
    } catch (err) {
      setError(
        'Error deleting service: ' + (err.response?.data?.message || err.message),
      );
    }
  };

  const handleEditService = (s) => {
    setFormData({
      ...s,
      // Enforce "today only" even when editing
      dateCreated: todayStr,
    });
    setDateErr('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setDateErr('');
    setFormData({
      dateCreated: '',
      service: '',
      description: '',
      cost: '',
      _id: '',
      serviceNumber: '',
    });
  };

  const filteredServices = services.filter((s) => {
    if (!searchTerm.trim()) return true;
    return s.serviceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen text-[#0F172A]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-[#1E40AF]">
        Service List
      </h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by Service Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        />
      </div>

      <button
        className="w-full md:w-auto mb-6 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
        onClick={() => {
          setFormData({
            dateCreated: todayStr,
            service: '',
            description: '',
            cost: '',
            _id: '',
            serviceNumber: '',
          });
          setDateErr('');
          setShowForm(true);
        }}
      >
        Add New Service
      </button>

      {error && (
        <div className="p-4 mb-4 text-center bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {loading && (
        <div className="text-center text-lg text-[#1E40AF]">Loading services...</div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div
            className="bg-[#DBEAFE] p-6 rounded-2xl shadow-xl border w-full max-w-lg"
            style={{ borderColor: '#BFDBFE' }}
          >
            <h3 className="text-2xl font-bold mb-4 text-[#1E40AF]">
              {formData._id ? 'Update Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <input
                  type="date"
                  name="dateCreated"
                  value={formData.dateCreated || todayStr}
                  onChange={handleInputChange}
                  required
                  min={todayStr}
                  max={todayStr}
                  className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                {dateErr && <p className="text-red-600 text-sm mt-1">{dateErr}</p>}
              </div>

              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                placeholder="Service"
                required
                className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
                className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="Cost"
                step="0.01"
                required
                className="w-full px-4 py-2 bg-white border border-[#BFDBFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition"
                >
                  {formData._id ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-white border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] font-semibold rounded-lg transition"
                  onClick={closeForm}
                >
                  Cancel
                </button>
              </div>
            </form>
            {formData._id && (
              <p className="mt-4 text-center text-[#1E40AF]">
                Service Number:{' '}
                <span className="font-semibold">{formData.serviceNumber}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div
        className="overflow-x-auto shadow-sm rounded-2xl border bg-[#DBEAFE]"
        style={{ borderColor: '#BFDBFE' }}
      >
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Service Number</th>
              <th className="py-3 px-6 text-left">Date Created</th>
              <th className="py-3 px-6 text-left">Service</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Cost</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-b text-sm" style={{ borderColor: '#BFDBFE' }}>
            {filteredServices.length > 0 ? (
              filteredServices.map((s, idx) => (
                <tr key={s._id || idx} className="hover:bg-[#EFF6FF]">
                  <td className="py-3 px-6 whitespace-nowrap">{idx + 1}</td>
                  <td className="py-3 px-6">{s.serviceNumber || '-'}</td>
                  <td className="py-3 px-6">
                    {s.dateCreated ? new Date(s.dateCreated).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-6">{s.service}</td>
                  <td className="py-3 px-6">{s.description}</td>
                  <td className="py-3 px-6">{Number(s.cost).toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg transition mr-2"
                      onClick={() => handleEditService(s)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleDeleteService(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td colSpan="7" className="py-4 text-center text-[#1E40AF]/70">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceList;
