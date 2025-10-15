import { useState } from "react";
import CourierForm from "../components/CourierForm";
import { FiCompass } from "react-icons/fi";

export default function CourierReportsPage() {
  const [selectedCourier, setSelectedCourier] = useState(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1E40AF] flex items-center gap-2">
        <FiCompass /> Couriers
      </h1>
      <CourierForm selectedCourier={selectedCourier} onSuccess={() => setSelectedCourier(null)} />
    </div>
  );
}
