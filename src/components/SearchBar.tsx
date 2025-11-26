//components/SearchBar.tsx
"use client";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);    

    timerRef.current = window.setTimeout(() => {
      if (onSearch) onSearch(q.trim());
    }, 350); // debounce 350ms

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [q]);

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="w-full border rounded px-3 py-2"
      />
      {loading && <div className="absolute right-2 top-2 text-sm">...</div>}
    </div>
  );
}
