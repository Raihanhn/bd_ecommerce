//pages/admin/categories/create.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";

export default function CreateCategory() {
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/admin/categories");
    else alert("Error adding category");
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
        >
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
            Add Category
          </h1>

          <input
            placeholder="Name"
            className="w-full border p-2 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Slug (optional)"
            className="w-full border p-2 rounded-lg"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded-lg"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">
            Save
          </button>
        </form>
      </div>
    </AdminGuard>
  );
}
