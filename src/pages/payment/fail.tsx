//app/payment/fail.tsx
export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <img
        src="/failed.jpeg"
        alt="failed"
        className="w-24 h-24 mb-4"
      />

      <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
      <p className="text-gray-700 mt-3 max-w-md">
        Unfortunately the payment didn’t go through.  
        You can try again or choose Cash on Delivery.
      </p>

      <a
        href="/checkout"
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
      >
        Try Again
      </a>
    </div>
  );
}

