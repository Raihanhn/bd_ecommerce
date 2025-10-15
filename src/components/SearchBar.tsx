// components/SearchBar.tsx
"use client";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!q) {
      setResults([]);
      if (onSearch) onSearch("");
      return;
    }

    timerRef.current = window.setTimeout(() => {
      doSearch(q);
    }, 350); // debounce 350ms

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [q]);

  async function doSearch(q: string) {
    setLoading(true);
    try {
      const url = new URL("/api/products", location.origin);
      url.searchParams.set("q", q);
      url.searchParams.set("limit", "10");
      const res = await fetch(url.toString());
      const data = await res.json();
      setResults(data.products || []);
      if (onSearch) onSearch(q);
    } finally {
      setLoading(false);
    }
  }

  function highlight(text = "", q = "") {
    if (!q) return text;
    // simple word-by-word highlight
    const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
    );
  }

  function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="w-full border rounded px-3 py-2"
      />
      {loading && <div className="absolute right-2 top-2 text-sm">...</div>}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border mt-1 z-50 max-h-64 overflow-auto">
          {results.map((r) => (
            <a key={r._id} href={`/products/${r.slug}`} className="block px-3 py-2 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <img src={r.images?.[0] || "/default-avatar.png"} alt={r.name} className="w-10 h-10 object-cover rounded" />
                <div>
                  <div className="font-medium">{highlight(r.name, q)}</div>
                  <div className="text-sm text-gray-500">${r.price.toFixed(2)}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
