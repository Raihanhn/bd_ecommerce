// pages/api/products/test.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("MongoDB connected.");

    // Try fetching first 5 products (without populate first)
    const products = await Product.find().limit(5);
    console.log("Fetched products:", products);

    return res.status(200).json({
      message: "DB connection successful",
      products,
    });
  } catch (err) {
    console.error("DB test failed:", err);
    return res.status(500).json({ message: "DB connection failed", error: err });
  }
}
