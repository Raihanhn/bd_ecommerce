//pages/payment/success-view.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <img src="/success.png" alt="success" className="w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold text-green-600">
        {orderId ? "Order Confirmed!" : "Payment Successful!"}
      </h1>
      {orderId && (
        <p className="text-gray-700 mt-3 max-w-md">
          Thank you! Your order <strong>{orderId}</strong> has been placed successfully.
          {router && " Our delivery team will contact you soon."}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => router.push("/orders")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          View My Orders
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
