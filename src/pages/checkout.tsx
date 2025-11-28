// pages/checkout.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [method, setMethod] = useState<"ssl" | "cod" | null>(null); // State to hold dummy shipping info (replace with a form input state in a real app)
  const dummyShippingAddress = {
    name: "Guest User",
    email: "guest@example.com",
    phone: "01XXXXXXXXX",
    address: "123 Test St, Gulshan",
    city: "Dhaka",
    postcode: "1212",
  };
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const clearCart = useCartStore((s) => s.clear);

  const handleConfirm = async () => {
    if (!method) return alert("Please choose a payment method."); // --- COD Logic (No changes needed) ---
    if (method === "cod") {
      // COD DIRECT ORDER SAVE
      const orderId = "ORDER-" + Date.now(); // Generate a client-side orderId for URL clarity
      const res = await fetch("/api/order/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          amount: total,
          orderId,
          shippingAddress: dummyShippingAddress,
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
    } // --- SSLCommerz Logic (Fix applied here) ---

    if (method === "ssl") {
      // RUN SSL PAYMENT API
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          amount: total,
          user: null,
          shippingAddress: dummyShippingAddress,
        }),
      });

      const data = await res.json(); // 🚀 CRITICAL FIX: Check for the 'success: true' and 'paymentUrl'

      // returned by the updated backend /api/payment/initiate.ts
      if (data.success && data.paymentUrl) {
        clearCart(); // 🎯 Correctly redirect to the payment gateway URL
        window.location.replace(data.paymentUrl);
      } else {
        // Show the specific error message from the backend
        const errorMessage =
          data.message || "SSL Payment Failed! Check server logs.";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>     
      {/* --- Shipping Info Display (Good practice) --- */}
      <div className="border p-4 rounded mb-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
        <p>
          <strong>Name:</strong> {dummyShippingAddress.name}
        </p>
        <p>
          <strong>Address:</strong> {dummyShippingAddress.address},{" "}
          {dummyShippingAddress.city} - {dummyShippingAddress.postcode}
        </p>
        <p>
          <strong>Contact:</strong> {dummyShippingAddress.phone} (
          {dummyShippingAddress.email})
        </p>
      </div>
      {/* --- Payment Method Selection --- */}     {" "}
      <div className="border p-4 rounded mb-6">
               {" "}
        <h2 className="text-xl font-semibold mb-2">Choose Payment Method</h2>   
           {" "}
        <div className="flex flex-col gap-3">
                   {" "}
          <label className="flex items-center gap-2">
                       {" "}
            <input
              type="radio"
              name="payment"
              checked={method === "ssl"}
              onChange={() => setMethod("ssl")}
            />
                        Pay Online (
            <strong className="text-green-600">
              Total: BDT {total.toFixed(2)}
            </strong>
            )          {" "}
          </label>
                   {" "}
          <label className="flex items-center gap-2">
                       {" "}
            <input
              type="radio"
              name="payment"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
            />
                        Cash on Delivery (
            <strong className="text-blue-600">
              Total: BDT {total.toFixed(2)}
            </strong>
            )          {" "}
          </label>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <button
        onClick={handleConfirm}
        disabled={total === 0 || !method} // Disable if cart is empty or method not selected
        className="w-full py-3 bg-green-600 text-white rounded text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
                Confirm Order      {" "}
      </button>
         {" "}
    </div>
  );
}
