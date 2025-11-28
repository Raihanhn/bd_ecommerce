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
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 ">
        <div className="mb-4 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m15-9l2 9m-5-4a2 2 0 11-4 0"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your Cart is Empty
        </h1>

        <p className="text-gray-600 mb-6 max-w-md">
          Looks like you haven’t added anything yet. Explore our products and
          find something you’ll love!
        </p>

        <Link
          href="/products"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i.productId}
            className="flex items-center gap-4 border p-3 rounded"
          >
            <img
              src={i.image || "/default-avatar.png"}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-medium">{i.name}</h2>
              <p>
                ${i.price.toFixed(2)} x {i.qty} = $
                {(i.price * i.qty).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeItem(i.productId)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
        <div className="flex gap-3">
          <button onClick={clearCart} className="px-4 py-2 bg-gray-300 rounded">
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
