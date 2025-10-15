import { useState } from "react";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryList from "../components/DeliveryList";
import { FiTruck } from "react-icons/fi";

export default function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((k) => k + 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1E40AF] flex items-center gap-2">
        <FiTruck /> Deliveries
      </h1>

      <DeliveryForm
        selectedDelivery={selectedDelivery}
        onSuccess={() => {
          setSelectedDelivery(null);
          bump();
        }}
      />

      <DeliveryList onEdit={setSelectedDelivery} refresh={refresh} />
    </div>
  );
}
