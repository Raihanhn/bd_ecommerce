// pages/cart.tsx
"use client";

import { useCartStore } from "@/stores/useCartStore";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clear);

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-blue-600 underline">Go to Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.productId} className="flex items-center gap-4 border p-3 rounded">
            <img src={i.image || "/default-avatar.png"} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h2 className="font-medium">{i.name}</h2>
              <p>${i.price.toFixed(2)} x {i.qty} = ${(i.price * i.qty).toFixed(2)}</p>
            </div>
            <button onClick={() => removeItem(i.productId)} className="text-red-600 hover:underline">Remove</button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
        <div className="flex gap-3">
          <button onClick={clearCart} className="px-4 py-2 bg-gray-300 rounded">Clear Cart</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded">Checkout</button>
        </div>
      </div>
    </div>
  );
}
