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

          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-center w-12">#</th>
                <th className="border px-3 py-2">Order ID</th>
                <th className="border px-3 py-2">Customer</th>
                <th className="border px-3 py-2">Shipping</th>
                <th className="border px-3 py-2 text-right">Total</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center w-16">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, index) => (
                <tr key={o._id} className="hover:bg-gray-50 transition">
                  {/* SL */}
                  <td className="border px-3 py-2 text-center text-gray-600">
                    {index + 1}
                  </td>

                  {/* Order ID */}
                  <td className="border px-3 py-2 font-mono text-xs text-gray-700">
                    {o._id.slice(-8)}
                  </td>

                  {/* Customer */}
                  <td className="border px-3 py-2">
                    <div className="font-medium text-gray-800">
                      {o.shippingAddress?.name || o.user?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {o.shippingAddress?.phone}
                    </div>
                  </td>

                  {/* Shipping */}
                  <td className="border px-3 py-2 text-xs text-gray-600 max-w-[260px]">
                    <div className="truncate">{o.shippingAddress?.address}</div>
                    <div className="text-gray-500">
                      {o.shippingAddress?.city} – {o.shippingAddress?.postcode}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="border px-3 py-2 text-right font-semibold">
                    ৳{o.total.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="border px-3 py-2 text-center">
                    <select
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) =>
                        handleStatusChange(o._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-xs bg-white cursor-pointer"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action */}
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleDelete(o._id)}
                      title="Delete Order"
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={16} />
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
