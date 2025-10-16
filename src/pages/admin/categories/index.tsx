"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
            <Link
              href="/admin/categories/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Category
            </Link>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Slug</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c: any) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.slug}</td>
                  <td className="border p-2">{c.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
