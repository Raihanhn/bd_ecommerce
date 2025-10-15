"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-gray-50 px-6">
      {/* Hero Section */}
      <div className="max-w-2xl">
        <Image
          src="/logo.png"
          alt="Site Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Your App Name</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          A modern platform built with Next.js — fast, secure, and designed for the future.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Explore Products
          </Link>
          <Link
            href="/about"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  );
}
