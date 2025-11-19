// pages/home.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const cartAdd = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg overflow-hidden">
            <Link href={`/products/${p.slug}`}>
              <div className="w-full h-40">
                <img
                  src={p.images?.[0] || "/default-avatar.png"}
                  alt={p.name}
                  className="w-full h-full object-contain block"
                />
              </div>
            </Link>
            <div className="p-3">
              <Link href={`/products/${p.slug}`} className="block font-medium">
                {p.name}
              </Link>
              <div className="text-sm text-gray-600">${p.price.toFixed(2)}</div>
              <button
                onClick={() =>
                  cartAdd({
                    productId: p._id,
                    name: p.name,
                    price: p.price,
                    qty: 1,
                    image: p.images?.[0],
                    slug: p.slug,
                  })
                }
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded w-full cursor-pointer "
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
