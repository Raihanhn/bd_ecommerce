//components/AdminGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Checking access...</p>
      </div>
    );
  }

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

  return <>{children}</>;
}
