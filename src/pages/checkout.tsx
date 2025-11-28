//pages/checkout.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [method, setMethod] = useState<"ssl" | "cod" | null>(null);
  // 💡 NEW: State to hold dummy shipping info (replace with a form input state in a real app)
  const dummyShippingAddress = {
    name: "Guest User",
    email: "guest@example.com", 
    phone: "01XXXXXXXXX",
    address: "123 Test St, Gulshan",
    city: "Dhaka",
    postcode: "1212" // Added postcode as it is often required by payment gateways
  };
  
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const clearCart = useCartStore((s) => s.clear);

  const handleConfirm = async () => {
    if (!method) return alert("Please choose a payment method.");
    
    // In a real application, you would validate the shippingAddress data here

    const orderId = "ORDER-" + Date.now();
    
    // 💡 NOTE: The backend API uses the generated MongoDB _id as tran_id,
    // so sending 'orderId' here isn't used by the backend initiate API, but it's fine for COD.

    if (method === "cod") {
      // COD DIRECT ORDER SAVE
      const res = await fetch("/api/order/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            items, 
            amount: total, 
            orderId, // Sending orderId here
            shippingAddress: dummyShippingAddress // 💡 Added shippingAddress for consistency
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/payment/success?orderId=${orderId}`);
      }
      return;
    }

    if (method === "ssl") {
      // RUN SSL PAYMENT API
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 🚀 CRITICAL FIX: The backend needs 'items' to create the order
          items: items, 
          amount: total,
          user: null, // Placeholder for authenticated user ID
          // 🚀 CRITICAL FIX: The backend needs 'shippingAddress' to save the order and send to SSLCommerz
          shippingAddress: dummyShippingAddress,
          // The following fields were redundant as they are derived from shippingAddress in the backend
          // customerName: "Guest User", 
          // customerEmail: "guest@gmail.com",
          // customerPhone: "0123456789",
        }),
      });

      const data = await res.json();

      if (data.GatewayPageURL) {
        clearCart();
        window.location.href = data.GatewayPageURL;
      } else {
        // 💡 IMPROVEMENT: Show the actual error message from the backend
        const errorMessage = data.message || "SSL Payment Failed! Check server logs.";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {/* 💡 NOTE: In a real app, you would add a form here to collect dummyShippingAddress data */}
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Choose Payment Method</h2>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              onChange={() => setMethod("ssl")}
            />
            Pay Online (SSLCommerz)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              onChange={() => setMethod("cod")}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full py-3 bg-green-600 text-white rounded text-lg"
      >
        Confirm Order
      </button>
    </div>
  );
}