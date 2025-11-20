// pages/home.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import HeroSlider from "@/components/HeroSlider";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const cartAdd = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const slides = [
  {
    id: 1,
    image: "/slider/slide1.png",
    buttonText: "Shop Now",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: "/slider/slide2.png",
    buttonText: "Explore",
    buttonLink: "/products",
  },
  {
    id: 3,
    image: "/slider/slide3.png",
    buttonText: "Shop Deals",
    buttonLink: "/products",
  },
  {
    id: 4,
    image: "/slider/slide4.png",
    buttonText: "Buy Now",
    buttonLink: "/products",
  },
  {
    id: 5,
    image: "/slider/slide5.png",
    buttonText: "Start Shopping",
    buttonLink: "/products",
  },
];

  return (
    <div className=" mx-auto  ">
      <HeroSlider slides={slides} />

      <h1 className="text-3xl font-bold mb-6 mt-10">Featured Products</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg overflow-hidden">
            <Link href={`/products/${p.slug}`}>
              <div className="w-full h-40">
                <img
                  src={p.images?.[0] || "/default-avatar.png"}
                  alt={p.name}
                  className="w-full h-full object-contain block"
                />
              </div>
            </Link>
            <div className="p-3">
              <Link href={`/products/${p.slug}`} className="block font-medium">
                {p.name}
              </Link>
              <div className="text-sm text-gray-600">${p.price.toFixed(2)}</div>
              <button
                onClick={() =>
                  cartAdd({
                    productId: p._id,
                    name: p.name,
                    price: p.price,
                    qty: 1,
                    image: p.images?.[0],
                    slug: p.slug,
                  })
                }
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded w-full cursor-pointer "
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
