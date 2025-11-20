"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCartStore } from "@/stores/useCartStore";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;

  // ---------------- STATE ----------------
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  // ---------------- REFS ----------------
  const imgRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);

  // ---------------- HOOKS ----------------
  // Fetch product
  useEffect(() => {
    if (!slug) return;
    fetchProduct(slug as string);
  }, [slug]);

  // Update zoom image whenever selectedImg changes
  useEffect(() => {
    if (zoomRef.current && selectedImg) {
      zoomRef.current.style.backgroundImage = `url(${selectedImg})`;
      zoomRef.current.style.backgroundSize = "200%"; // zoom level
    }
  }, [selectedImg]);

  // ---------------- FUNCTIONS ----------------
  async function fetchProduct(slug: string) {
    const res = await fetch(`/api/products/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setProduct(data);
      setSelectedImg(data.images?.[0] || "/default-avatar.png");
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const zoom = zoomRef.current;
    const imgContainer = imgRef.current;
    if (!zoom || !imgContainer) return;

    const rect = imgContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    zoom.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  };

  const handleMouseEnter = () => {
    if (zoomRef.current) zoomRef.current.style.display = "block";
  };

  const handleMouseLeave = () => {
    if (zoomRef.current) zoomRef.current.style.display = "none";
  };

  // ---------------- CONDITIONAL RENDER ----------------
  if (!product) return <div className="text-center mt-20">Loading...</div>;

  const inStock = (product.quantity ?? 0) > 0;

  // ---------------- JSX ----------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Product Images */}
        <div className="relative">
          {/* Zoom Div (Above product div) */}
          <div
            ref={zoomRef}
            className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded pointer-events-none hidden z-10 bg-no-repeat bg-cover"
          ></div>

          {/* Main Image */}
          <div
            ref={imgRef}
            className="overflow-hidden rounded border border-gray-200 cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={selectedImg || "/default-avatar.png"}
              alt={product.name}
              className="w-full h-[480px] object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {product.images?.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                className={`w-16 h-16 object-cover rounded border cursor-pointer ${
                  selectedImg === img ? "border-green-600" : "border-gray-200"
                }`}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl text-green-600 mt-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="mt-4 text-gray-700">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mt-6">
              <label className="font-medium">Quantity</label>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1 border rounded cursor-pointer hover:bg-gray-100 transition"
                >
                  -
                </button>
                <div className="px-4">{qty}</div>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1 border rounded cursor-pointer hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Go to Cart */}
            <div className="mt-6 flex gap-4">
              <button
                disabled={!inStock}
                onClick={() =>
                  addItem({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    qty,
                    image: product.images?.[0],
                    slug: product.slug,
                  })
                }
                className={`px-6 py-2 rounded font-semibold transition ${
                  inStock
                    ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Add to cart
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="px-6 py-2 border rounded font-semibold hover:bg-gray-100 transition cursor-pointer"
              >
                Go to cart
              </button>
            </div>

            {/* Stock Info */}
            <div className="mt-4 text-sm text-gray-600">
              {inStock ? <span>In stock: {product.quantity}</span> : <span>Out of stock</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
