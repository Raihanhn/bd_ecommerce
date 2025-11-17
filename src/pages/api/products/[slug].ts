// pages/api/products/[slug].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method } = req;
  if (method !== "GET") return res.status(405).end();

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ message: "Missing slug" });

  try {
    const product = await Product.findOne({ slug }).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}
