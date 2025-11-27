//pages/api/order/cod.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { orderId, items, amount, user, shippingAddress } = req.body;

  try {
    const order = await Order.create({
      user: user || null,
      items: items.map((i: any) => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      total: amount,
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      status: "pending",
      transactionId: null,
      paymentInfo: null,
      shippingAddress,
    });

    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "COD order failed", error });
  }
}
