"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";

export default function UploadPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();

    setUrl(data.url);
    setLoading(false);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">Upload Image</h1>
          <input type="file" onChange={handleFile} className="mb-4 w-full" />
          {loading && <p className="text-gray-500 mb-3">Uploading...</p>}
          {url && (
            <img
              src={url}
              alt="Uploaded"
              className="w-48 h-48 mx-auto rounded-lg border object-cover"
            />
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
