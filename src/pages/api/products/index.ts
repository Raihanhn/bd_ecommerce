// pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

/**
 * GET /api/products
 * Query params:
 *  - q: search query (optional)
 *  - page, limit (pagination)
 *  - category (optional)
 *  - visible (optional)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method } = req;
  if (method !== "GET") return res.status(405).end();

  try {
    const { q, page = "1", limit = "20", category, visible } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const lim = Math.max(1, Math.min(100, parseInt(limit as string, 10)));

    const filter: any = {};
    if (category) filter.category = category;
    if (typeof visible !== "undefined") filter.isVisible = visible === "true";

    // If a search query exists, use MongoDB text search (ensure text index on product fields)
    if (q && (q as string).trim().length > 0) {
      filter.$text = { $search: q };
      // optionally project score
      const products = await Product.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip((pageNum - 1) * lim)
        .limit(lim)
        .populate("category");
      const total = await Product.countDocuments(filter);
      return res.json({ products, total, page: pageNum, limit: lim });
    }

    // Normal list
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .populate("category");
    const total = await Product.countDocuments(filter);
    return res.json({ products, total, page: pageNum, limit: lim });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}
