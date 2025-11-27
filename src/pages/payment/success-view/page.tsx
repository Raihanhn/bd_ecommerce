//app/payment/success-view/page.tsx
export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <img
        src="/success.png"
        alt="success"
        className="w-24 h-24 mb-4"
      />

      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-700 mt-3 max-w-md">
        Thank you! Your payment has been confirmed.  
        Your order is now being processed.
      </p>

      <a
        href="/orders"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        View My Orders
      </a>
    </div>
  );
}
