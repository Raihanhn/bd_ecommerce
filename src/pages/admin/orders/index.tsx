//pages/admin/orders/index.tsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders") // adjust if your list route differs
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Order ID</th>
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Total</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="border p-2">{o._id}</td>
                  <td className="border p-2">{o.user?.name || "Guest"}</td>
                  <td className="border p-2">${o.total}</td>
                  <td className="border p-2">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
