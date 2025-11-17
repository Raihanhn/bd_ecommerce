// pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category"; // Ensure this is loaded
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected.");

    const { method } = req;
    if (method !== "GET") {
      console.log("Method not allowed:", method);
      return res.status(405).end();
    }

    const { q, page = "1", limit = "20", category, visible } = req.query;
    console.log("Query params:", { q, page, limit, category, visible });

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const lim = Math.max(1, Math.min(100, parseInt(limit as string, 10)));

    const filter: any = {};
    if (category) filter.category = category;
    if (visible) filter.isVisible = visible === "true";

    console.log("Filter object:", filter);

    // Simple find test without populate
    const testProducts = await Product.find(filter).limit(1);
    console.log("Found products (test without populate):", testProducts);

    let products;
    let total;

    if (q && (q as string).trim().length > 0) {
      console.log("Performing text search for:", q);
      filter.$text = { $search: q };

      products = await Product.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip((pageNum - 1) * lim)
        .limit(lim)
        .populate("category");

      total = await Product.countDocuments(filter);
    } else {
      console.log("Fetching normal product list...");
      products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * lim)
        .limit(lim)
        .populate("category");

      total = await Product.countDocuments(filter);
    }

    console.log("Products fetched:", products.length, "Total:", total);

    return res.json({ products, total, page: pageNum, limit: lim });
  } catch (err) {
    console.error("API error:", err);
    // Show actual error for debugging
    return res.status(500).json({ message: "Failed to fetch products", error: err });
  }
}
