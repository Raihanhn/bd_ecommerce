"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import SearchBar from "@/components/SearchBar";
import RawLoader from "@/components/RawLoader";

type Product = any;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  const cartAdd = useCartStore((s) => s.addItem);

  async function fetchProducts(pageNum = 1, searchQuery = "") {
    setLoading(true);

    const url = new URL("/api/products", location.origin);
    url.searchParams.set("limit", "20");
    url.searchParams.set("page", String(pageNum));
    if (searchQuery) url.searchParams.set("q", searchQuery);

    const res = await fetch(url.toString());
    const data = await res.json();

    setProducts(data.products || []);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts(page, query);
  }, [page]);

  function handleSearch(q: string) {
    setQuery(q);
    setPage(1);
    fetchProducts(1, q);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-28 ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div style={{ width: 360 }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RawLoader />
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div>No products found</div>
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
                      className="mt-2 px-3 py-1 bg-green-600 text-white rounded w-full cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center mt-10 gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              ← Prev
            </button>

            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
