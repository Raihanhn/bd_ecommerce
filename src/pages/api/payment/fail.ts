//pages/api/payment/fail.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const orderId = req.body.tran_id;

    await Order.findByIdAndUpdate(orderId, {
      status: "cancelled",
      paymentStatus: "unpaid",
      paymentInfo: req.body,
    });

    return res.redirect("/payment/failed-view");
  } catch (err) {
    res.status(500).json({ message: "Failed to process payment failure" });
  }
}

