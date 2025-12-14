"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import axios from "axios";
import { Trash2 } from "lucide-react";

const STATUSES = [
  "pending",
  "processing",
  "packaging",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await axios.get("/api/admin/orders");
    setOrders(res.data.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await axios.put(`/api/admin/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order permanently?")) return;
    await axios.delete(`/api/admin/orders?id=${id}`);
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6">Orders</h1>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">SL</th>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr key={o._id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{o._id}</td>
                  {/* <td className="border p-2">
                    {o.user?.name || "Guest"}
                  </td> */}
                  <td className="border p-2">
                    <div className="font-medium text-gray-800">
                      {o.shippingAddress?.name || o.user?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {o.shippingAddress?.phone}
                    </div>
                  </td>
                  <td className="border p-2">৳{o.total}</td>
                  <td className="border p-2">
                    <select
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) =>
                        handleStatusChange(o._id, e.target.value)
                      }
                      className="border p-1 rounded cursor-pointer"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 space-x-3">
                    <button
                      onClick={() => handleDelete(o._id)}
                      title="Delete Order"
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
