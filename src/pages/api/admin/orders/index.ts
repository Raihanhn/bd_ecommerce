import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/adminMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  await dbConnect();

  // 🔹 GET all orders
  if (req.method === "GET") {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  }

  // 🔹 DELETE order
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Order ID required" });
    }

    try {
      await Order.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete order",
      });
    }
  }

  return res.status(405).end();
}
