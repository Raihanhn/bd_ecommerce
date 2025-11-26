//pages/api/admin/categories/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res); if (!admin) return;

  await dbConnect();
  if (req.method === "GET") {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  }
  if (req.method === "POST") {
    const { name, slug, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category exists" });
    const cat = await Category.create({ name, slug: slug || name.toLowerCase().replace(/\s+/g,"-"), description });
    return res.status(201).json(cat);
  }
  res.status(405).end();
}
