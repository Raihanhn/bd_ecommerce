"use client";

import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-28">
      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        About Auric Mart
      </h1>

      <p className="text-lg text-gray-600 max-w-3xl mb-10">
        Auric Mart is a modern online shopping platform designed to bring you 
        premium products at affordable prices. We focus on delivering a clean, 
        fast, and enjoyable shopping experience for every customer.
      </p>

      {/* HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-white hover:bg-green-200 shadow rounded-xl border">
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            ✨ Quality Products
          </h3>
          <p className="text-gray-600 text-sm">
            We handpick the best products so you always get top-notch quality.
          </p>
        </div>

        <div className="p-6 bg-white hover:bg-green-200  shadow rounded-xl border">
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            🚚 Fast Delivery
          </h3>
          <p className="text-gray-600 text-sm">
            Get your orders delivered quickly and securely across the country.
          </p>
        </div>

        <div className="p-6 bg-white hover:bg-green-200  shadow rounded-xl border">
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            💳 Secure Payments
          </h3>
          <p className="text-gray-600 text-sm">
            Your payments are encrypted and protected for a safe experience.
          </p>
        </div>
      </div>

      {/* OUR STORY */}
      <div className="bg-green-50 p-8 rounded-xl border shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Our Story
        </h2>

        <p className="text-gray-700 leading-7 mb-4">
          Auric Mart was built with a simple mission — to create a smooth and 
          reliable shopping experience for everyone. Our platform is constantly 
          evolving to bring the latest technology, modern UI, and user-friendly 
          features. 
        </p>

        <p className="text-gray-700 leading-7 mb-6">
          From small households to premium categories, we aim to be your trusted 
          shopping destination every day.
        </p>

        <Link
          href="/products"
          className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Explore Products →
        </Link>
      </div>
    </div>
  );
}
