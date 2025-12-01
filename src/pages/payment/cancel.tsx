//app/payment/cancel.tsx
export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <img
        src="/cancelled.jpeg"
        alt="cancelled"
        className="w-24 h-24 mb-4"
      />

      <h1 className="text-3xl font-bold text-yellow-600">Payment Cancelled</h1>
      <p className="text-gray-700 mt-3 max-w-md">
        You cancelled the payment process.  
        You can continue shopping or try again.
      </p>

      <a
        href="/checkout"
        className="mt-6 px-6 py-3 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700"
      >
        Back to Checkout
      </a>
    </div>
  );
}

