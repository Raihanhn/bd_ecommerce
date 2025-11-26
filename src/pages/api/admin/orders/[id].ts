//pages/api/admin/orders/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/adminMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res); if (!admin) return;
  await dbConnect();

  const { id } = req.query;
  if (req.method === "GET") {
    const order = await Order.findById(id).populate("user").populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  }

  if (req.method === "PUT") {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return res.json(order);
  }

  res.status(405).end();
}
