// pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { q, page = "1", limit = "20", category, visible } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const lim = Math.max(1, Math.min(100, parseInt(limit as string, 10)));

    // Build filter
    const filter: any = {};
    if (category) filter.category = category;
    if (visible) filter.isVisible = visible === "true";

    // ⭐⭐⭐ Weighted Search Logic ⭐⭐⭐
    if (q && (q as string).trim().length > 0) {
      const search = (q as string).trim();

      filter.$or = [
        // 1️⃣ Starts with (highest priority)
        { name: { $regex: `^${search}`, $options: "i" } },

        // 2️⃣ Exact full-word match
        { name: { $regex: `\\b${search}\\b`, $options: "i" } },

        // 3️⃣ Contains word inside description
        { description: { $regex: `\\b${search}\\b`, $options: "i" } },

        // 4️⃣ Generic fallback partial match
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Count documents
    const total = await Product.countDocuments(filter);

    // Fetch products
    const products = await Product.find(filter)
      .sort({
        // ⭐ Prioritize name similarity – exact matches come first
        name: 1,
        createdAt: -1,
      })
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .populate("category");

    return res.json({
      products,
      total,
      page: pageNum,
      limit: lim,
      totalPages: Math.ceil(total / lim),
    });

  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ message: "Failed to fetch products", error: err });
  }
}
