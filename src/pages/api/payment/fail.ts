import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const body = req.body;

    const orderId = body.tran_id || body["tran_id"];
    if (!orderId) {
      return res.status(400).send("Transaction ID (tran_id) missing");
    }

    // Update order as cancelled/failed
    await Order.findByIdAndUpdate(orderId, {
      status: "cancelled",
      paymentStatus: "unpaid",
      paymentInfo: body,
    });

    // Redirect user to failed page
    return res.status(200).send(`<script>window.location.href='/payment/failed-view'</script>`);
  } catch (err) {
    console.error("Payment Fail Error:", err);
    res.status(500).json({ message: "Failed to process failed payment" });
  }
}
