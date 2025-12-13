"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [method, setMethod] = useState<"ssl" | "cod" | null>(null);
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });

  const items = useCartStore((s) => s.items);
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const clearCart = useCartStore((s) => s.clear);
  const router = useRouter();

  useEffect(() => {
    // Get shipping from localStorage
    const savedShipping = localStorage.getItem("shippingAddress");
    if (savedShipping) setShipping(JSON.parse(savedShipping));
  }, []);

  const handleConfirm = async () => {
    if (!method) return alert("Please choose a payment method.");

    // Validate shipping
    const { name, email, phone, address, city, postcode } = shipping;
    if (!name || !email || !phone || !address || !city || !postcode) {
      return alert("Shipping information is incomplete.");
    }

    if (method === "cod") {
      const orderId = "ORDER-" + Date.now();
      const res = await fetch("/api/order/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          amount: total,
          orderId,
          shippingAddress: shipping,
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/payment/success?orderId=${data.orderId || orderId}`);
      } else {
        alert(data.message || "COD Order failed to process.");
      }
      return;
    }

    if (method === "ssl") {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          amount: total,
          user: null,
          shippingAddress: shipping,
        }),
      });

      const data = await res.json();

      if (data.success && data.paymentUrl) {
        clearCart();
        window.location.replace(data.paymentUrl);
      } else {
        alert(data.message || "SSL Payment Failed! Check server logs.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Info */}
        <div className="flex-1 border rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Shipping Details
          </h2>
          <p className="mb-2">
            <span className="font-medium">Name:</span> {shipping.name}
          </p>
          <p className="mb-2">
            <span className="font-medium">Address:</span> {shipping.address}, {shipping.city} - {shipping.postcode}
          </p>
          <p className="mb-2">
            <span className="font-medium">Contact:</span> {shipping.phone} ({shipping.email})
          </p>
        </div>

        {/* Payment Method */}
        <div className="flex-1 border rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Payment Method
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
              <input
                type="radio"
                name="payment"
                checked={method === "ssl"}
                onChange={() => setMethod("ssl")}
                className="w-5 h-5"
              />
              <span className="text-gray-800 font-medium">
                Pay Online (<span className="text-green-600 font-bold">BDT {total.toFixed(2)}</span>)
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="radio"
                name="payment"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
                className="w-5 h-5"
              />
              <span className="text-gray-800 font-medium">
                Cash on Delivery (<span className="text-blue-600 font-bold">BDT {total.toFixed(2)}</span>)
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={total === 0 || !method}
        className="mt-10 w-full lg:w-1/3 mx-auto block py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Confirm Order
      </button>
    </div>
  );
}
