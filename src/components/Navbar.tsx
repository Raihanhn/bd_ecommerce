import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../stores/useCartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCartStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-xl">ShopifyPro</Link>
        <div className="flex items-center gap-4">
          <Link href="/about">About</Link>
          <Link href="/cart" className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/auth/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
