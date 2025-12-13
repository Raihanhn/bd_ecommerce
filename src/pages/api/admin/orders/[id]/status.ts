// pages/api/admin/orders/[id]/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/adminMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  await dbConnect();
  const { id } = req.query;

  if (req.method === "PUT") {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status required" });

    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = status;
      await order.save();

      return res.json({ success: true, order });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update order" });
    }
  }

  res.status(405).end();
}
