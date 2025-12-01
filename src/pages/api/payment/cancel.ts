import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export const config = {
api: {
bodyParser: true,
},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== "POST" && req.method !== "GET") {
return res.status(405).send("Method Not Allowed");
}

await dbConnect();

try {
const data = req.method === "POST" ? req.body : req.query;

const tran_id = data.tran_id as string;

if (!tran_id) {
  return res.redirect("/payment/cancel");
}

// Find order using orderId (NOT Mongo _id)
const order = await Order.findOne({ orderId: tran_id });

if (!order) {
  return res.redirect(`/payment/cancel?orderId=${tran_id}`);
}

// Update order as cancelled
await Order.findOneAndUpdate(
  { orderId: tran_id },
  {
    status: "cancelled",
    paymentStatus: "cancelled",
    paymentInfo: data,
  }
);

return res.redirect(`/payment/cancel?orderId=${tran_id}`);


} catch (err) {
console.error("Cancel Payment Error:", err);
return res.redirect("/payment/cancel");
}
}
