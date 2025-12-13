"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
  createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/order/my-orders"); // backend route
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading orders...</div>;

  if (orders.length === 0)
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">You have no orders yet.</h1>
        <Link
          href="/products"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
        >
          {/* Header: Order ID & Status */}
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">
              Order ID: {order._id}
            </span>
            <span
              className={`font-semibold ${
                order.status === "delivered"
                  ? "text-green-600"
                  : order.status === "cancelled"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Shipping Info */}
          <div className="mb-2">
            <h2 className="font-semibold text-gray-800">Shipping Info:</h2>
            <p>{order.shippingAddress?.name || "N/A"}</p>
            <p>
              {order.shippingAddress
                ? `${order.shippingAddress.address || "N/A"}, ${
                    order.shippingAddress.city || "N/A"
                  } - ${order.shippingAddress.postalCode || "N/A"}`
                : "N/A"}
            </p>
            <p>
              {order.shippingAddress
                ? `${order.shippingAddress.phone || "N/A"} (${
                    order.shippingAddress.email || "N/A"
                  })`
                : "N/A"}
            </p>
          </div>

          {/* Items List */}
          <div>
            <h2 className="font-semibold text-gray-800">Items:</h2>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>
                  {item.name} x {item.qty}
                </span>
                <span>৳{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-2 flex justify-between font-bold text-gray-800">
            <span>Total:</span>
            <span>৳{order.total.toFixed(2)}</span>
          </div>

          {/* Order Date */}
          <div className="mt-2 text-right text-xs text-gray-500">
            Ordered on: {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
