 //pages/admin/products/index.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p: any) => p._id !== id));
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
            <Link
              href="/admin/products/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Product
            </Link>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">SL</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any, index: number) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">৳{p.price}</td>
                  <td className="border p-2">{p.category?.name}</td>
                  <td className="border p-2 space-x-3">
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
