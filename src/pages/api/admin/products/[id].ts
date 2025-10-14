import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/adminMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  await dbConnect();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const product = await Product.findById(id).populate("category");
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.json(product);
      } catch (error) {
        return res.status(500).json({ message: "Failed to fetch product" });
      }

    case "PUT":
      try {
        const update = req.body;
        const product = await Product.findByIdAndUpdate(id, update, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.json(product);
      } catch (error) {
        return res.status(500).json({ message: "Failed to update product" });
      }

    case "DELETE":
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.json({ message: "Product deleted successfully" });
      } catch (error) {
        return res.status(500).json({ message: "Failed to delete product" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
