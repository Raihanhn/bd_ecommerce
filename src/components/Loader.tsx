// components/Loader.tsx
import React from "react";

interface LoaderProps {
  color?: string; 
  size?: number; 
}

const Loader: React.FC<LoaderProps> = ({ color = "#22c55e", size = 50 }) => {
  return (
    <div className="flex justify-center items-center py-10">
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
  );
};

export default Loader;
