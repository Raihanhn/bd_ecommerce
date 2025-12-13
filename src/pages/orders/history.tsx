// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";

// export default function OrderHistoryPage() {
//   const { data: session } = useSession();
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     if (session?.user?._id) {
//       fetch(`/api/order/my-orders?userId=${session.user._id}`)
//         .then((res) => res.json())
//         .then((data) => setOrders(data.orders));
//     }
//   }, [session]);

//   if (!session) return <p className="text-center py-10">Please login to view order history.</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>
//       {orders.map((order: any) => (
//         <div key={order._id} className="border rounded-xl p-4 bg-white shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-2">Order ID: {order._id}</h2>
//           <p className="text-sm text-gray-500 mb-2">
//             Ordered on: {new Date(order.createdAt).toLocaleString()}
//           </p>
//           <div className="mb-2">
//             {order.items.map((item: any) => (
//               <div key={item.productId} className="flex justify-between border-b py-1 text-sm">
//                 <span>{item.name} x {item.qty}</span>
//                 <span>৳{(item.price * item.qty).toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="mt-2 flex justify-between font-bold text-gray-800">
//             <span>Total:</span>
//             <span>৳{order.total.toFixed(2)}</span>
//           </div>
//           <div className={`mt-2 text-right font-semibold ${
//             order.status === "Delivered" ? "text-green-600" :
//             order.status === "Cancelled" ? "text-red-600" : "text-blue-600"
//           }`}>
//             Status: {order.status}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
