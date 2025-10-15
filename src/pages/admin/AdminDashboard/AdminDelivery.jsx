// src/pages/admin/AdminDashboard/AdminDelivery.jsx
import { useState } from "react";
import DeliveryForm from "../../../components/DeliveryForm";
import DeliveryList from "../../../components/DeliveryList";

export default function AdminDelivery() {
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((k) => k + 1);

  return (
    <div className="space-y-6 p-6">
      <DeliveryForm onSuccess={bump} />
      <DeliveryList refresh={refresh} />
    </div>
  );
}
