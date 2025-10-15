// pages/products/[slug].tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCartStore } from "@/stores/useCartStore";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!slug) return;
    fetchProduct(slug as string);
  }, [slug]);

  async function fetchProduct(slug: string) {
    const res = await fetch(`/api/products/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setProduct(data);
    }
  }

  if (!product) return <div>Loading...</div>;

  const inStock = (product.quantity ?? 0) > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img src={product.images?.[0] || "/default-avatar.png"} alt={product.name} className="w-full h-[480px] object-cover rounded" />
          {/* thumbnails */}
          <div className="flex gap-2 mt-3">
            {product.images?.map((img: string, i: number) => (
              <img key={i} src={img} className="w-16 h-16 object-cover rounded cursor-pointer" alt={`thumb-${i}`} />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-lg text-green-600 mt-2">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>

          {/* variants (placeholder) */}
          {/* implement variant logic if product.attributes exist */}
          <div className="mt-4">
            <label>Quantity</label>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 border">-</button>
              <div className="px-4">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-1 border">+</button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              disabled={!inStock}
              onClick={() => {
                addItem({ productId: product._id, name: product.name, price: product.price, qty, image: product.images?.[0], slug: product.slug });
              }}
              className={`px-5 py-2 rounded ${inStock ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              Add to cart
            </button>
            <button onClick={() => router.push("/cart")} className="px-5 py-2 border rounded">Go to cart</button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {inStock ? <span>In stock: {product.quantity}</span> : <span>Out of stock</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
