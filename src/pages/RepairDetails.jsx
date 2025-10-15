




// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams, useLocation } from "react-router-dom";

// const SERVICE_CHARGE_DEFAULT = 500;

// export default function RepairForm() {
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [services, setServices] = useState([]);
//   const [selectedServiceId, setSelectedServiceId] = useState("");

  

//   const [form, setForm] = useState({
//     clientName: "",
//     services: [],
//     materials: [],
//     remarks: "",
//     paymentStatus: "Unpaid",
//     status: "Pending",
//     code: "",
//     dateCreated: "",
//     serviceCharge: SERVICE_CHARGE_DEFAULT,
//   });

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [errors, setErrors] = useState({});

//   const sanitizeName = (raw) => {
//     const before = raw ?? "";
//     const cleaned = before
//       .replace(/[^A-Za-z\s]/g, "")
//       .replace(/\s{2,}/g, " ")
//       .replace(/^\s+/, "");
//     return { cleaned, hadInvalid: cleaned !== before };
//   };

//   const validateName = (name) => {
//     const trimmed = name.trim();
//     if (!trimmed) return "Client Name is required.";
//     if (!/^[A-Za-z\s]+$/.test(trimmed)) {
//       return "Client Name should only contain letters and spaces.";
//     }
//     return "";
//   };

//   const makeCode = () => {
//     const now = new Date();
//     const y = now.getFullYear();
//     const m = String(now.getMonth() + 1).padStart(2, "0");
//     const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
//     return `RSMS-${y}${m}${rand}`;
//   };

//   const toArray = (raw) => {
//     if (Array.isArray(raw)) return raw;
//     if (Array.isArray(raw?.data)) return raw.data;
//     if (Array.isArray(raw?.items)) return raw.items;
//     if (Array.isArray(raw?.services)) return raw.services;
//     return [];
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);

//         const svcRes = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/services`
//         );

//         const svcList = toArray(svcRes?.data);
//         const normalized = svcList.map((s, i) => ({
//           _id: s._id ?? s.id ?? String(s.value ?? s.code ?? i),
//           name: s.service ?? s.name ?? "Unnamed",
//           fee: Number(s.cost ?? s.fee ?? 0),
//         }));
//         setServices(normalized);

//         if (isEdit) {
//           const rep = await axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/app/repair/${id}`
//           );
//           const r = rep?.data ?? {};
//           setForm({
//             clientName: r.clientName || "",
//             ticketId: r.ticketId || "",
//             services: toArray(r.services).map((x, i2) => ({
//               serviceId:
//                 x.serviceId?._id ||
//                 x.service?._id ||
//                 x.serviceId ||
//                 x.service ||
//                 String(i2),
//               fee: Number(x.fee || 0),
//             })),
//             materials: toArray(r.materials).map((m) => ({
//               name: m.name ?? "Unnamed",
//               cost: Number(m.cost || 0),
//             })),
//             remarks: r.remarks || "",
//             paymentStatus: r.paymentStatus || "Unpaid",
//             status: r.status || "Pending",
//             code: r.code || makeCode(),
//             dateCreated: r.dateCreated || r.createdAt || new Date().toISOString(),
//             serviceCharge: Number(r.serviceCharge ?? SERVICE_CHARGE_DEFAULT),
//           });
//         } else {
//           setForm((f) => ({
//             ...f,
//             dateCreated: new Date().toISOString(),
//             code: f.code || makeCode(),
//             serviceCharge: SERVICE_CHARGE_DEFAULT,
//           }));
//         }

//         setErr(null);
//       } catch (e) {
//         console.error("load form failed:", e);
//         setErr("Failed to load form. See console for details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id, isEdit, location.state]);

//   const total = useMemo(() => {
//     const st = (form.services || []).reduce((sum, s) => sum + Number(s.fee || 0), 0);
//     const mt = (form.materials || []).reduce((sum, m) => sum + Number(m.cost || 0), 0);
//     return st + mt + Number(form.serviceCharge || 0);
//   }, [form.services, form.materials, form.serviceCharge]);

//   // --- Realtime onChange for Client Name ---
//   const onClientNameChange = (e) => {
//     const { cleaned, hadInvalid } = sanitizeName(e.target.value);
//     setForm((f) => ({ ...f, clientName: cleaned }));

//     let msg = validateName(cleaned);
//     if (!msg && hadInvalid) {
//       msg = "Only letters and spaces are allowed.";
//     }
//     setErrors((prev) => ({ ...prev, clientName: msg || undefined }));
//   };

//   /// add service
//   const addService = () => {
//     const svc = services.find((x) => x._id === selectedServiceId);
//     if (!svc) return;
//     if ((form.services || []).some((x) => x.serviceId === svc._id)) return;
//     setForm((f) => ({
//       ...f,
//       services: [...f.services, { serviceId: svc._id, fee: svc.fee }],
//     }));
//     setSelectedServiceId("");
//   };

//   const removeRow = (type, index) => {
//     setForm((f) => ({ ...f, [type]: f[type].filter((_, i) => i !== index) }));
//   };

//   // add materials
//   const addMaterial = () => {
//     const name = prompt("Material Name");
//     if (!name) return;
//     const cost = parseFloat(prompt("Cost") || "0");
//     setForm((f) => ({
//       ...f,
//       materials: [...f.materials, { name, cost: Number.isNaN(cost) ? 0 : cost }],
//     }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     // Final guard on submit
//     const nameError = validateName(form.clientName);
//     if (nameError) {
//       setErrors((prev) => ({ ...prev, clientName: nameError }));
//       return;
//     }

//     try {
//       const payload = { ...form, totalAmount: total };

//       if (isEdit) {
//         await axios.put(`${import.meta.env.VITE_BACKEND_URL}/app/repair/${id}`, payload);
//         alert("Repair updated");
//       } else {
//         await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app/repair`, payload);
//         alert("Repair created");
//       }

//       navigate("/dash/RepairList", { replace: true });
//     } catch (e2) {
//       console.error("save failed:", e2.response?.status, e2.response?.data || e2.message);
//       alert("Save failed. See console.");
//     }
//   };

//   if (loading) return <div className="p-8 text-[#1E40AF]">Loading…</div>;
//   if (err) return <div className="p-8 text-red-600">{err}</div>;

//   const nameHasError = Boolean(errors.clientName);
//   const isSaveDisabled = nameHasError || !form.clientName.trim();

//   return (
//     <div
//       className="mx-auto mt-6 p-6 rounded-2xl bg-[#DBEAFE] text-[#0F172A] shadow-md border"
//       style={{ maxWidth: 900, borderColor: "#BFDBFE" }}
//     >
//       <h3 className="mb-3 text-2xl font-semibold text-[#3B82F6]">
//         {isEdit ? "Edit Repair" : "Add New Repair"}
//       </h3>

//       <form onSubmit={onSubmit}>
//         {/* Row */}
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//           <div className="md:col-span-6">
//             <label className="block text-sm text-[#1E40AF] mb-1">Client Name</label>
//             <input
//               className={`w-full rounded-lg bg-white border ${
//                 nameHasError ? "border-red-500" : "border-[#BFDBFE]"
//               } text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 ${
//                 nameHasError ? "focus:ring-red-400" : "focus:ring-[#3B82F6]"
//               }`}
//               value={form.clientName}
//               onChange={onClientNameChange}
//               pattern="[A-Za-z\s]+"
//               title="Only letters (A–Z, a–z) and spaces are allowed"
//               aria-invalid={nameHasError ? "true" : "false"}
//               required
//             />
//             {errors.clientName && (
//               <p className="text-red-600 text-sm mt-1">{errors.clientName}</p>
//             )}
//           </div>

//           <div className="md:col-span-3">
//             <label className="block text-sm text-[#1E40AF] mb-1">Internal Code</label>
//             <input
//               className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2"
//               value={form.code}
//               readOnly
//             />
//           </div>

//           <div className="md:col-span-3">
//             <label className="block text-sm text-[#1E40AF] mb-1">Date</label>
//             <input
//               type="date"
//               className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               value={form.dateCreated ? new Date(form.dateCreated).toISOString().slice(0, 10) : ""}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, dateCreated: new Date(e.target.value).toISOString() }))
//               }
//             />
//           </div>

//           <div className="md:col-span-3">
//             <label className="block text-sm text-[#1E40AF] mb-1">Service Charge</label>
//             <input
//               type="number"
//               className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2"
//               value={form.serviceCharge}
//               readOnly
//             />
//           </div>
//         </div>

//         {/* Services */}
//         <div className="mt-6">
//           <h5 className="text-lg font-semibold text-[#3B82F6]">Services</h5>
//           <div className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center mt-2">
//             <div className="md:col-span-6">
//               <select
//                 className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//                 value={selectedServiceId}
//                 onChange={(e) => setSelectedServiceId(e.target.value)}
//               >
//                 <option value="">Select a service…</option>
//                 {Array.isArray(services) &&
//                   services.map((s) => (
//                     <option key={s._id} value={s._id}>
//                       {s.name} — ${Number(s.fee || 0).toFixed(2)}
//                     </option>
//                   ))}
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <button
//                 type="button"
//                 className="w-full px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg shadow-sm transition"
//                 onClick={addService}
//               >
//                 + Add
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto mt-3 rounded-xl border shadow-sm" style={{ borderColor: "#BFDBFE" }}>
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
//                   <th className="px-3 py-2 text-left" style={{ width: 50 }}>#</th>
//                   <th className="px-3 py-2 text-left">Service</th>
//                   <th className="px-3 py-2 text-right" style={{ width: 120 }}>Fee</th>
//                   <th className="px-3 py-2 text-center" style={{ width: 110 }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="[&>tr]:border-b" style={{ borderColor: "#BFDBFE" }}>
//                 {(form.services?.length ?? 0) === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="text-center text-[#1E40AF]/70 py-4">
//                       No services
//                     </td>
//                   </tr>
//                 ) : (
//                   form.services.map((s, i) => {
//                     const svc = services.find((x) => x._id === s.serviceId);
//                     return (
//                       <tr
//                         key={`${s.serviceId}-${i}`}
//                         className="hover:bg-[#EFF6FF]"
//                       >
//                         <td className="px-3 py-2 text-center">{i + 1}</td>
//                         <td className="px-3 py-2">{svc?.name || "—"}</td>
//                         <td className="px-3 py-2 text-right">{Number(s.fee || 0).toFixed(2)}</td>
//                         <td className="px-3 py-2 text-center">
//                           <button
//                             type="button"
//                             className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
//                             onClick={() => removeRow("services", i)}
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Materials */}
//         <div className="mt-6">
//           <h5 className="text-lg font-semibold text-[#3B82F6]">Materials</h5>
//           <button
//             type="button"
//             className="px-4 py-2 mb-2 rounded-lg border border-[#3B82F6] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
//             onClick={addMaterial}
//           >
//             + Add Material
//           </button>

//           <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderColor: "#BFDBFE" }}>
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
//                   <th className="px-3 py-2 text-left" style={{ width: 50 }}>#</th>
//                   <th className="px-3 py-2 text-left">Material</th>
//                   <th className="px-3 py-2 text-right" style={{ width: 120 }}>Cost</th>
//                   <th className="px-3 py-2 text-center" style={{ width: 110 }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="[&>tr]:border-b" style={{ borderColor: "#BFDBFE" }}>
//                 {(form.materials?.length ?? 0) === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="text-center text-[#1E40AF]/70 py-4">
//                       No materials
//                     </td>
//                   </tr>
//                 ) : (
//                   form.materials.map((m, i) => (
//                     <tr key={`${m.name}-${i}`} className="hover:bg-[#EFF6FF]">
//                       <td className="px-3 py-2 text-center">{i + 1}</td>
//                       <td className="px-3 py-2">{m.name}</td>
//                       <td className="px-3 py-2 text-right">{Number(m.cost || 0).toFixed(2)}</td>
//                       <td className="px-3 py-2 text-center">
//                         <button
//                           type="button"
//                           className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
//                           onClick={() => removeRow("materials", i)}
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="mt-4 text-[#0F172A]">
//           <div>
//             Service Charge:{" "}
//             <span className="text-[#3B82F6]">${Number(form.serviceCharge).toFixed(2)}</span>
//           </div>
//           <strong className="text-[#3B82F6]">Total Payable Amount: ${total.toFixed(2)}</strong>
//         </div>

//         <div className="mt-4">
//           <label className="block text-sm text-[#1E40AF] mb-1">Remarks</label>
//           <textarea
//             className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//             rows={3}
//             value={form.remarks}
//             onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block text-sm text-[#1E40AF] mb-1">Payment Status</label>
//             <select
//               className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               value={form.paymentStatus}
//               onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}
//             >
//               <option>Unpaid</option>
//               <option>Paid</option>
//               <option>Partial</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm text-[#1E40AF] mb-1">Status</label>
//             <select
//               className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
//               value={form.status}
//               onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
//             >
//               <option>Pending</option>
//               <option>Checking</option>
//               <option>In Progress</option>
//               <option>Done</option>
//               <option>Cancelled</option>
//             </select>
//           </div>
//         </div>

//         <div className="mt-6 flex gap-2">
//           <button
//             type="submit"
//             disabled={isSaveDisabled}
//             className={`px-4 py-2 rounded-lg shadow-sm transition text-white ${
//               isSaveDisabled
//                 ? "bg-[#93C5FD] cursor-not-allowed opacity-60"
//                 : "bg-[#3B82F6] hover:bg-[#2563EB]"
//             }`}
//             title={isSaveDisabled ? "Enter a valid client name" : ""}
//           >
//             {isEdit ? "Save Changes" : "Save"}
//           </button>
//           <button
//             type="button"
//             className="px-4 py-2 bg-white border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition"
//             onClick={() => navigate("/dash/RepairList")}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const SERVICE_CHARGE_DEFAULT = 500;

export default function RepairForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  // --- NEW: products state for Materials dropdown ---
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [form, setForm] = useState({
    clientName: "",
    services: [],
    materials: [],
    remarks: "",
    paymentStatus: "Unpaid",
    status: "Pending",
    code: "",
    dateCreated: "",
    serviceCharge: SERVICE_CHARGE_DEFAULT,
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [errors, setErrors] = useState({});

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/+$/g, "");

  const sanitizeName = (raw) => {
    const before = raw ?? "";
    const cleaned = before
      .replace(/[^A-Za-z\s]/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/^\s+/, "");
    return { cleaned, hadInvalid: cleaned !== before };
  };

  const validateName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return "Client Name is required.";
    if (!/^[A-Za-z\s]+$/.test(trimmed)) {
      return "Client Name should only contain letters and spaces.";
    }
    return "";
  };

  const makeCode = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    return `RSMS-${y}${m}${rand}`;
  };

  const toArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.services)) return raw.services;
    return [];
  };

  
  const fetchProducts = async () => {
    try {
      
      const r1 = await axios.get(`${API_BASE}/api/products`);
      const arr = toArray(r1.data).map((p, i) => ({
        _id: p._id ?? p.id ?? String(i),
        productId: p.productId ?? p.code ?? undefined,
        name: p.name ?? "Unnamed",
        // pick a price field that exists
        price: Number(p.price ?? p.labeledPrice ?? p.cost ?? 0),
        brand: p.brand ?? "",
        category: p.category ?? "",
        stock: Number(p.stock ?? 0),
      }));
      return arr;
    } catch (e1) {
      try {
        
        const r2 = await axios.get(`${API_BASE}/api/product`);
        const arr = toArray(r2.data).map((p, i) => ({
          _id: p._id ?? p.id ?? String(i),
          productId: p.productId ?? p.code ?? undefined,
          name: p.name ?? "Unnamed",
          price: Number(p.price ?? p.labeledPrice ?? p.cost ?? 0),
          brand: p.brand ?? "",
          category: p.category ?? "",
          stock: Number(p.stock ?? 0),
        }));
        return arr;
      } catch (e2) {
        console.error("Products fetch failed at both endpoints:", e1?.response?.status, e2?.response?.status);
        throw e2;
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1) Load services
        const svcRes = await axios.get(`${API_BASE}/api/services`);
        const svcList = toArray(svcRes?.data);
        const normalizedServices = svcList.map((s, i) => ({
          _id: s._id ?? s.id ?? String(s.value ?? s.code ?? i),
          name: s.service ?? s.name ?? "Unnamed",
          fee: Number(s.cost ?? s.fee ?? 0),
        }));
        setServices(normalizedServices);

        // 2) Load products (for Materials dropdown)
        const prodList = await fetchProducts();
        setProducts(prodList);

        // 3) If editing, load the existing repair
        if (isEdit) {
          const rep = await axios.get(`${API_BASE}/api/repair/${id}`);
          const r = rep?.data ?? {};
          setForm({
            clientName: r.clientName || "",
            ticketId: r.ticketId || "",
            services: toArray(r.services).map((x, i2) => ({
              serviceId:
                x.serviceId?._id ||
                x.service?._id ||
                x.serviceId ||
                x.service ||
                String(i2),
              fee: Number(x.fee || 0),
            })),
            materials: toArray(r.materials).map((m) => ({
              name: m.name ?? "Unnamed",
              cost: Number(m.cost || 0),
            })),
            remarks: r.remarks || "",
            paymentStatus: r.paymentStatus || "Unpaid",
            status: r.status || "Pending",
            code: r.code || makeCode(),
            dateCreated: r.dateCreated || r.createdAt || new Date().toISOString(),
            serviceCharge: Number(r.serviceCharge ?? SERVICE_CHARGE_DEFAULT),
          });
        } else {
          setForm((f) => ({
            ...f,
            dateCreated: new Date().toISOString(),
            code: f.code || makeCode(),
            serviceCharge: SERVICE_CHARGE_DEFAULT,
          }));
        }

        setErr(null);
      } catch (e) {
        console.error("load form failed:", e);
        setErr("Failed to load form. See console for details.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, location.state]);

  const total = useMemo(() => {
    const st = (form.services || []).reduce((sum, s) => sum + Number(s.fee || 0), 0);
    const mt = (form.materials || []).reduce((sum, m) => sum + Number(m.cost || 0), 0);
    return st + mt + Number(form.serviceCharge || 0);
  }, [form.services, form.materials, form.serviceCharge]);

  // --- Realtime onChange for Client Name ---
  const onClientNameChange = (e) => {
    const { cleaned, hadInvalid } = sanitizeName(e.target.value);
    setForm((f) => ({ ...f, clientName: cleaned }));

    let msg = validateName(cleaned);
    if (!msg && hadInvalid) {
      msg = "Only letters and spaces are allowed.";
    }
    setErrors((prev) => ({ ...prev, clientName: msg || undefined }));
  };

  /// add service
  const addService = () => {
    const svc = services.find((x) => x._id === selectedServiceId);
    if (!svc) return;
    if ((form.services || []).some((x) => x.serviceId === svc._id)) return;
    setForm((f) => ({
      ...f,
      services: [...f.services, { serviceId: svc._id, fee: svc.fee }],
    }));
    setSelectedServiceId("");
  };

  const removeRow = (type, index) => {
    setForm((f) => ({ ...f, [type]: f[type].filter((_, i) => i !== index) }));
  };

  // --- NEW: Add material from Products dropdown ---
  const addMaterialFromProduct = () => {
    const p = products.find((x) => x._id === selectedProductId || x.productId === selectedProductId);
    if (!p) return;
    setForm((f) => ({
      ...f,
      materials: [...f.materials, { name: p.name, cost: Number(p.price || 0) }],
    }));
    setSelectedProductId("");
  };

  // Keep your original prompt-based adder as an option
  const addMaterialCustom = () => {
    const name = prompt("Material Name");
    if (!name) return;
    const cost = parseFloat(prompt("Cost") || "0");
    setForm((f) => ({
      ...f,
      materials: [...f.materials, { name, cost: Number.isNaN(cost) ? 0 : cost }],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Final guard on submit
    const nameError = validateName(form.clientName);
    if (nameError) {
      setErrors((prev) => ({ ...prev, clientName: nameError }));
      return;
    }

    try {
      const payload = { ...form, totalAmount: total };

      if (isEdit) {
        await axios.put(`${API_BASE}/api/repair/${id}`, payload);
        alert("Repair updated");
      } else {
        await axios.post(`${API_BASE}/api/repair`, payload);
        alert("Repair created");
      }

      navigate("/dash/RepairList", { replace: true });
    } catch (e2) {
      console.error("save failed:", e2.response?.status, e2.response?.data || e2.message);
      alert("Save failed. See console.");
    }
  };

  if (loading) return <div className="p-8 text-[#1E40AF]">Loading…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;

  const nameHasError = Boolean(errors.clientName);
  const isSaveDisabled = nameHasError || !form.clientName.trim();

  return (
    <div
      className="mx-auto mt-6 p-6 rounded-2xl bg-[#DBEAFE] text-[#0F172A] shadow-md border"
      style={{ maxWidth: 900, borderColor: "#BFDBFE" }}
    >
      <h3 className="mb-3 text-2xl font-semibold text-[#3B82F6]">
        {isEdit ? "Edit Repair" : "Add New Repair"}
      </h3>

      <form onSubmit={onSubmit}>
        {/* Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-sm text-[#1E40AF] mb-1">Client Name</label>
            <input
              className={`w-full rounded-lg bg-white border ${
                nameHasError ? "border-red-500" : "border-[#BFDBFE]"
              } text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 ${
                nameHasError ? "focus:ring-red-400" : "focus:ring-[#3B82F6]"
              }`}
              value={form.clientName}
              onChange={onClientNameChange}
              pattern="[A-Za-z\s]+"
              title="Only letters (A–Z, a–z) and spaces are allowed"
              aria-invalid={nameHasError ? "true" : "false"}
              required
            />
            {errors.clientName && (
              <p className="text-red-600 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-[#1E40AF] mb-1">Internal Code</label>
            <input
              className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2"
              value={form.code}
              readOnly
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-[#1E40AF] mb-1">Date</label>
            <input
              type="date"
              className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              value={form.dateCreated ? new Date(form.dateCreated).toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateCreated: new Date(e.target.value).toISOString() }))
              }
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-[#1E40AF] mb-1">Service Charge</label>
            <input
              type="number"
              className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2"
              value={form.serviceCharge}
              readOnly
            />
          </div>
        </div>

        {/* Services */}
        <div className="mt-6">
          <h5 className="text-lg font-semibold text-[#3B82F6]">Services</h5>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center mt-2">
            <div className="md:col-span-6">
              <select
                className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                <option value="">Select a service…</option>
                {Array.isArray(services) &&
                  services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} — ${Number(s.fee || 0).toFixed(2)}
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg shadow-sm transition"
                onClick={addService}
              >
                + Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-3 rounded-xl border shadow-sm" style={{ borderColor: "#BFDBFE" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
                  <th className="px-3 py-2 text-left" style={{ width: 50 }}>#</th>
                  <th className="px-3 py-2 text-left">Service</th>
                  <th className="px-3 py-2 text-right" style={{ width: 120 }}>Fee</th>
                  <th className="px-3 py-2 text-center" style={{ width: 110 }}>Action</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b" style={{ borderColor: "#BFDBFE" }}>
                {(form.services?.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-[#1E40AF]/70 py-4">
                      No services
                    </td>
                  </tr>
                ) : (
                  form.services.map((s, i) => {
                    const svc = services.find((x) => x._id === s.serviceId);
                    return (
                      <tr key={`${s.serviceId}-${i}`} className="hover:bg-[#EFF6FF]">
                        <td className="px-3 py-2 text-center">{i + 1}</td>
                        <td className="px-3 py-2">{svc?.name || "—"}</td>
                        <td className="px-3 py-2 text-right">{Number(s.fee || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
                            onClick={() => removeRow("services", i)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Materials */}
        <div className="mt-6">
          <h5 className="text-lg font-semibold text-[#3B82F6]">Materials</h5>

          {/* NEW: Products dropdown row */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center mt-2">
            <div className="md:col-span-6">
              <select
                className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Select a product…</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} {p.brand ? `(${p.brand})` : ""} — ${p.price.toFixed(2)} {p.stock <= 0 ? " — Out of stock" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={addMaterialFromProduct}
                disabled={!selectedProductId}
              >
                + Add
              </button>
            </div>
          </div>

          {/* (Optional) keep custom adder for non-catalog items */}
          <button
            type="button"
            className="px-4 py-2 mt-3 rounded-lg border border-[#3B82F6] text-[#1E40AF] hover:bg-[#EFF6FF] transition"
            onClick={addMaterialCustom}
          >
            + Add Custom Material
          </button>

          <div className="overflow-x-auto mt-3 rounded-xl border shadow-sm" style={{ borderColor: "#BFDBFE" }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#BFDBFE] text-[#1E40AF] uppercase text-xs">
                  <th className="px-3 py-2 text-left" style={{ width: 50 }}>#</th>
                  <th className="px-3 py-2 text-left">Material</th>
                  <th className="px-3 py-2 text-right" style={{ width: 120 }}>Cost</th>
                  <th className="px-3 py-2 text-center" style={{ width: 110 }}>Action</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b" style={{ borderColor: "#BFDBFE" }}>
                {(form.materials?.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-[#1E40AF]/70 py-4">
                      No materials
                    </td>
                  </tr>
                ) : (
                  form.materials.map((m, i) => (
                    <tr key={`${m.name}-${i}`} className="hover:bg-[#EFF6FF]">
                      <td className="px-3 py-2 text-center">{i + 1}</td>
                      <td className="px-3 py-2">{m.name}</td>
                      <td className="px-3 py-2 text-right">{Number(m.cost || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
                          onClick={() => removeRow("materials", i)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-[#0F172A]">
          <div>
            Service Charge:{" "}
            <span className="text-[#3B82F6]">${Number(form.serviceCharge).toFixed(2)}</span>
          </div>
          <strong className="text-[#3B82F6]">Total Payable Amount: ${total.toFixed(2)}</strong>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-[#1E40AF] mb-1">Remarks</label>
          <textarea
            className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            rows={3}
            value={form.remarks}
            onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-[#1E40AF] mb-1">Payment Status</label>
            <select
              className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              value={form.paymentStatus}
              onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}
            >
              <option>Unpaid</option>
              <option>Paid</option>
              <option>Partial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#1E40AF] mb-1">Status</label>
            <select
              className="w-full rounded-lg bg-white border border-[#BFDBFE] text-[#0F172A] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option>Pending</option>
              <option>Checking</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={isSaveDisabled}
            className={`px-4 py-2 rounded-lg shadow-sm transition text-white ${
              isSaveDisabled
                ? "bg-[#93C5FD] cursor-not-allowed opacity-60"
                : "bg-[#3B82F6] hover:bg-[#2563EB]"
            }`}
            title={isSaveDisabled ? "Enter a valid client name" : ""}
          >
            {isEdit ? "Save Changes" : "Save"}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-white border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition"
            onClick={() => navigate("/dash/RepairList")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
