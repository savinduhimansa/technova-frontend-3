import { useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";
import { FiPackage } from "react-icons/fi";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const bump = () => setRefresh((k) => k + 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1E40AF] flex items-center gap-2">
        <FiPackage /> Orders
      </h1>

      <OrderForm
        selectedOrder={selectedOrder}
        onSuccess={() => {
          setSelectedOrder(null);
          bump();
        }}
      />

      <OrderList onEdit={setSelectedOrder} refresh={refresh} />
    </div>
  );
}
