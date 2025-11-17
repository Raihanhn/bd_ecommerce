// pages/products/index.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import SearchBar from "@/components/SearchBar";

type Product = any;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const cartAdd = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  async function fetchProducts(q?: string) {
    setLoading(true);
    const url = new URL("/api/products", location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", "24");
    if (q) url.searchParams.set("q", q);

    const res = await fetch(url.toString());
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div style={{ width: 360 }}>
          <SearchBar onSearch={(q) => fetchProducts(q)} />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p: Product) => (
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
                <Link
                  href={`/products/${p.slug}`}
                  className="block font-medium"
                >
                  {p.name}
                </Link>
                <div className="text-sm text-gray-600">
                  ${p.price.toFixed(2)}
                </div>
                <div className="mt-3 flex gap-2">
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
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Add
                  </button>
                  <Link
                    href={`/products/${p.slug}`}
                    className="px-3 py-1 border rounded"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
