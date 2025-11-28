//pages/checkout.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [method, setMethod] = useState<"ssl" | "cod" | null>(null);
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const clearCart = useCartStore((s) => s.clear);

  const handleConfirm = async () => {
    if (!method) return alert("Please choose a payment method.");

    const orderId = "ORDER-" + Date.now();

    if (method === "cod") {
      // COD DIRECT ORDER SAVE
      const res = await fetch("/api/order/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, amount: total, orderId }),
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
          amount: total,
          orderId,
          customerName: "Guest User",
          customerEmail: "guest@gmail.com",
          customerPhone: "0123456789",
        }),
      });

      const data = await res.json();

      if (data.GatewayPageURL) {
        clearCart();
        window.location.href = data.GatewayPageURL;
      } else {
        alert("SSL Payment Failed!");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

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
