//components/LandingPageClient.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = (path: string) => {
    setLoadingButton(path);
    setTimeout(() => {
      router.push(path);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-[#FDFCFB] text-center px-6 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#c3f8ff]/30 via-[#d0f0ff]/20 to-[#fff]/10 blur-2xl -z-10" />

      {/* ===== Hero Section ===== */}
      <main className="flex flex-col items-center justify-center flex-grow py-20">
        <Image
          src="/logo2.gif"
          alt="AuricMart Logo"
          width={160}
          height={160}
          className="mb-8 drop-shadow-2xl"
          unoptimized 
        />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold">
            Welcome
          </span>{" "}
          to{" "}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 inline-block text-transparent bg-clip-text font-bold">
            AuricMart
          </span>{" "}
          — <br />
          The{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 inline-block text-transparent bg-clip-text font-bold">
            Future
          </span>{" "}
          of{" "}
          <span className="bg-gradient-to-r from-lime-400 via-yellow-400 to-orange-400 inline-block text-transparent bg-clip-text font-bold">
            Online
          </span>{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 text-transparent bg-clip-text font-bold">
            Shopping
          </span>
        </h1>

        <p className="text-gray-600 max-w-2xl text-lg mb-10 leading-relaxed">
          Experience a{" "}
          <span className="font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-transparent bg-clip-text">
            next-generation
          </span>{" "}
          eCommerce platform where{" "}
          <span className="font-semibold bg-gradient-to-r from-sky-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
            shopping
          </span>{" "}
          meets simplicity.
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Gradient Get Started Button */}
          <button
            onClick={() => handleClick("/auth/signup")}
            disabled={loadingButton === "/auth/signup"}
            className="relative bg-gradient-to-r from-blue-500 cursor-pointer via-cyan-400 to-teal-400 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-cyan-300 flex items-center justify-center gap-2"
          >
            {loadingButton === "/auth/signup" && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </span>
            )}
            <span
              className={`${
                loadingButton === "/auth/signup" ? "opacity-60" : "opacity-100"
              } transition`}
            >
              Get Started
            </span>
          </button>
        </div>
      </main>

      {/* ===== Features Section ===== */}
      <section className="max-w-5xl w-full py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        <FeatureCard
          icon="🛒"
          title="Seamless Shopping"
          desc="Discover a modern marketplace built for convenience, variety, and reliability."
        />
        <FeatureCard
          icon="💳"
          title="Secure Payments"
          desc="Choose from COD, bKash, Rocket, Nagad, or direct bank transfers — all SSL protected."
        />
        <FeatureCard
          icon="🚚"
          title="Fast Delivery"
          desc="Nationwide delivery with real-time order tracking and easy returns."
        />
        <FeatureCard
          icon="🎁"
          title="Exclusive Offers"
          desc="Enjoy special discounts, referral bonuses, and seasonal sales."
        />
        <FeatureCard
          icon="⭐"
          title="Trusted by Customers"
          desc="Thousands of satisfied buyers rely on us for quality and authenticity."
        />
        <FeatureCard
          icon="🌿"
          title="Aesthetic Experience"
          desc="Clean design, refreshing vibes — because online shopping should feel good."
        />
      </section>

      {/* ===== CTA Section ===== */}
      <section className="text-center py-20 w-full px-4">
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white rounded-3xl shadow-xl py-14 px-6 sm:px-12 overflow-hidden flex flex-col items-center">
          {/* soft glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-400 opacity-20 blur-2xl"></div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">
            Ready to Start Your Shopping Journey?
          </h2>

          <p className="text-blue-100 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of smart shoppers today and explore an online store
            that puts you first.
          </p>

          {/* ===== Centered Button ===== */}
          <div className="relative z-10 flex justify-center">
            <button
              onClick={() => handleClick("/auth/signup")}
              disabled={loadingButton === "/auth/signup"}
              className="relative bg-white text-blue-700 cursor-pointer font-semibold py-3 px-10 rounded-full shadow-md hover:bg-gradient-to-r hover:from-white hover:to-blue-100 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2"
            >
              {loadingButton === "/auth/signup" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></span>
                </span>
              )}
              <span
                className={`${
                  loadingButton === "/auth/signup"
                    ? "opacity-60"
                    : "opacity-100"
                } transition`}
              >
                Create an Account
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} AuricMart. All Rights Reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
