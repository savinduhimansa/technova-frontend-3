import { React, useState, useEffect } from "react";
import axios from "axios";

export default function BuildMyPC() {
  const [formData, setFormData] = useState({
    customerEmail: "",
    cpu: "",
    motherboard: "",
    ram: "",
    gpu: "",
    case: "",
    ssd: "",
    hdd: "",
    psu: "",
    fans: "",
  });

  const [total, setTotal] = useState(0);
  const [parts, setParts] = useState({});

  // Fetch available parts
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/parts")
      .then((res) => setParts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Calculate total dynamically
  useEffect(() => {
    let sum = 0;
    Object.keys(formData).forEach((key) => {
      if (formData[key] && parts[key]) {
        const selectedPart = parts[key].find((p) => p.name === formData[key]);
        if (selectedPart) sum += selectedPart.price;
      }
    });
    setTotal(sum);
  }, [formData, parts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5001/api/builds", { ...formData, totalPrice: total });
      alert("Build submitted successfully!");
      setFormData({
        customerEmail: "",
        cpu: "",
        motherboard: "",
        ram: "",
        gpu: "",
        case: "",
        ssd: "",
        hdd: "",
        psu: "",
        fans: "",
      });
      setTotal(0);
    } catch (error) {
      console.error("Error submitting build:", error.response?.data || error.message);
      alert("Error submitting build! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white flex items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-7xl bg-white/95 border border-[#BFDBFE] rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.25)] backdrop-blur-md p-12">
        <h1 className="text-3xl font-extrabold text-[#1E3A8A]/80 mb-8 text-center">💻 Build Your PC</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
            />
          </div>

          {/* Parts Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["cpu", "motherboard", "ram", "gpu", "case", "ssd", "hdd", "psu", "fans"].map((partKey) => (
              <div key={partKey} className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-2 capitalize">{partKey}</label>
                <select
                  name={partKey}
                  value={formData[partKey]}
                  onChange={handleChange}
                  className="border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 border-gray-300"
                >
                  <option value="">Select {partKey} (optional)</option>
                  {parts[partKey]?.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className="text-3xl font-bold text-gray-800 text-right mt-6">
            Total: <span className="text-blue-600">${total}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg transform transition-all hover:scale-105"
          >
            Submit Build
          </button>
        </form>
      </div>
    </div>
  );
}
