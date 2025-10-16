"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: string | number;
  quantity: string | number;
  category: string;
  images: string[];
  isVisible: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    images: [],
    isVisible: true,
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("/api/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking access...</p>
      </div>
    );
  }

  if (!session || (session.user as any).role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You must be an admin to view this page.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const target = e.target;

  // If checkbox, use checked, otherwise use value
  const value =
    target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;

  setForm((prev) => ({
    ...prev,
    [target.name]: value,
  }));
};


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await axios.post("/api/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Fixed TypeScript issue
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), res.data.url],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!form.category) {
    alert("Please select a category");
    return;
  }
  
    setLoading(true);

    try {
      await axios.post("/api/admin/products", form);
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
          />
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
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
          <label className="block mb-2 font-medium">Product Image Upload</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}

          <div className="flex flex-wrap gap-3 mt-3">
            {form.images.map((url) => (
              <img
                key={url}
                src={url}
                alt="Uploaded"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
