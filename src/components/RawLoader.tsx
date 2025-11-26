//components/RawLoader.tsx
"use client";

export default function RawLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className="h-12 w-12 animate-spin rounded-full 
                      border-4 border-green-500 
                      border-t-green-300 
                      border-r-green-400 
                      border-b-green-600 
                      border-l-green-700"
      ></div>
    </div>
  );
}


