//pages/api/payment/success.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const paymentData = req.body;
    const orderId = paymentData.tran_id;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "processing",
      transactionId: paymentData.bank_tran_id,
      paymentInfo: paymentData,
    });

    return res.redirect("/payment/success-view");
  } catch (error) {
    return res.status(500).json({ message: "Payment success processing failed" });
  }
}

