// pages/category/index.tsx
"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import Link from "next/link";
import RawLoader from "@/components/RawLoader";

type Product = any;
type Category = { _id: string; name: string; slug: string };

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cartAdd = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }

  async function fetchProducts(categoryId?: string) {
    setLoading(true);
    const url = new URL("/api/products", location.origin);
    if (categoryId) url.searchParams.set("category", categoryId);

    const res = await fetch(url.toString());
    const data = await res.json();
    setProducts(data.products || data); // handle different API responses
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-28">
      <h1 className="text-2xl font-bold mb-6">CATEGORIES</h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded border ${
            selectedCategory === null ? "bg-green-600 text-white" : "bg-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-4 py-2 rounded border cursor-pointer hover:bg-green-500 ${
              selectedCategory === cat._id
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RawLoader />
        </div>
      ) : products.length === 0 ? (
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
