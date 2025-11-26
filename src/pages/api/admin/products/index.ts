//pages/api/admin/orders/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/adminMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res); if (!admin) return;
  await dbConnect();

  if (req.method === "GET") {
    const products = await Product.find().populate("category").sort({ createdAt: -1 });
    return res.json(products);
  }

  if (req.method === "POST") {
    const { name, slug, description, price, quantity, category, images, isVisible } = req.body;
    if (!name || typeof price === "undefined") return res.status(400).json({ message: "Name and price required" });

    const product = await Product.create({
      name, slug: slug || name.toLowerCase().replace(/\s+/g,"-"),
      description, price, quantity, category, images: images || [], isVisible: isVisible ?? true
    });
    return res.status(201).json(product);
  }

  res.status(405).end();
}
