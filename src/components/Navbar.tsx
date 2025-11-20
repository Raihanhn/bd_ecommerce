"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../stores/useCartStore";
import { useSession, signOut } from "next-auth/react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = useCartStore((s) => s.cartCount);
  const { data: session } = useSession();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => signOut({ redirect: true, callbackUrl: "/" });

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? "bg-green-200 text-black shadow-md" : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Hamburger menu for mobile */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <img
            src="/logo.png" 
            alt="Auric Mart"
            className="h-8 sm:h-10 md:h-12 w-auto bg-white/5 backdrop-blur-sm " 
          />
        </Link>

        {/* Navbar links (desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-[18px] ">
          <Link href="/home">Home</Link>
          <Link href="/products" className="hover:text-green-600">
            Products
          </Link>
          <Link href="/category" className="hover:text-green-600">
            Category
          </Link>
          <Link href="/about">About</Link>
          <Link href="/cart" className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Icon */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 text-2xl focus:outline-none"
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUserCircle />
              )}
            </button>

            {/* Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                {!session ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col p-4 gap-2">
            <Link href="/home" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
              Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs w-5 h-5 inline-flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User section in mobile */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {!session ? (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-left w-full py-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
