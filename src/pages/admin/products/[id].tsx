//pages/admin/products/[id].tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: session, status } = useSession();
  const [form, setForm] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch product + categories
  useEffect(() => {
    if (id) {
      axios.get(`/api/admin/products/${id}`).then((res) => setForm(res.data));
      axios.get("/api/admin/categories").then((res) => setCategories(res.data));
    }
  }, [id]);

  if (status === "loading" || !form)
    return <p className="text-center py-10">Loading...</p>;

  if (!session || (session.user as any).role !== "admin")
    return <div className="text-center py-10">Access Denied</div>;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await axios.post("/api/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), res.data.url],
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/admin/products/${id}`, form);
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
          />
        </div>

        <select
          name="category"
          value={form.category?._id || form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isVisible"
            checked={form.isVisible}
            onChange={handleChange}
          />
          <label>Visible</label>
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload New Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}

          <div className="flex flex-wrap gap-3 mt-3">
            {form.images?.map((url: string) => (
              <img
                key={url}
                src={url}
                alt="product"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
