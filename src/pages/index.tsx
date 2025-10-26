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
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white via-blue-50 to-gray-50 text-center px-6">
      {/* ===== Hero Section ===== */}
      <main className="flex flex-col items-center justify-center flex-grow py-20">
        <Image
          src="/logo2.gif"
          alt="E-Commerce Logo"
          width={150}
          height={150}
          className="mb-8 drop-shadow-lg "
          unoptimized
        />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold">
            Welcome
          </span>{" "}
          to{" "}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 inline-block text-transparent bg-clip-text font-bold">
            ShopVerse
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
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500  text-transparent bg-clip-text font-bold">
            Shopping
          </span>
        </h1>

        <p className="text-gray-600 max-w-2xl text-lg mb-8 leading-relaxed">
          Experience a next-generation eCommerce platform where shopping meets
          simplicity. Enjoy{" "}
          <span className="font-semibold bg-gradient-to-r from-[#FCD34D] via-[#0284C7] to-[#E11D48] text-transparent bg-clip-text">
            Cash on Delivery
          </span>{" "}
          or secure online payments through{" "}
          <span className="font-semibold text-orange-500">
            bKash, Rocket, Nagad, and Bank Transfers
          </span>
          . Fast, safe, and built for your lifestyle.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleClick("/auth/signup")}
            disabled={loadingButton === "/auth/signup"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            {loadingButton === "/auth/signup" ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Get Started"
            )}
          </button>

          <button
            onClick={() => handleClick("/auth/login")}
            disabled={loadingButton === "/auth/login"}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            {loadingButton === "/auth/login" ? (
              <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign In"
            )}
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
          desc="Choose from Cash on Delivery, bKash, Rocket, Nagad, or direct bank transfers — all SSL protected."
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
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Start Your Shopping Journey?
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of smart shoppers today and explore an online store
          that puts you first.
        </p>
        <Link href="/auth/signup" passHref>
          <button
            onClick={() => handleClick("/auth/signup")}
            disabled={loadingButton === "/auth/signup"}
            className="bg-white text-blue-600 font-semibold py-3 px-10 rounded-lg shadow-md hover:bg-gray-100 transition flex items-center justify-center mx-auto"
          >
            {loadingButton === "/auth/signup" ? (
              <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Create an Account"
            )}
          </button>
        </Link>
      </section>

      {/* ===== Footer ===== */}
      <footer className="text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} ShopVerse. All Rights Reserved.
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
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
