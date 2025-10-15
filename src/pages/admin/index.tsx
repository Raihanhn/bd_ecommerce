"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  // Still loading session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Checking access...</p>
      </div>
    );
  }

  // No session or not admin
  if (!session || (session.user as any).role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You must be an admin to view this page.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  // ✅ Admin dashboard content
  const sections = [
    { title: "Manage Products", href: "/admin/products" },
    { title: "Manage Categories", href: "/admin/categories" },
    { title: "Manage Orders", href: "/admin/orders" },
    { title: "Upload Images", href: "/admin/upload" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {sections.map((sec) => (
          <Link
            key={sec.href}
            href={sec.href}
            className="bg-white shadow-md hover:shadow-lg rounded-2xl p-8 transition transform hover:-translate-y-1 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{sec.title}</h2>
            <p className="text-gray-500 text-sm">
              Click to view and manage {sec.title.toLowerCase()}.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
