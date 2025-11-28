import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category"; // Assuming the path to your model is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Fetch only active categories (if you use the isActive field)
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ message: "Internal server error fetching categories." });
    }
  }

  // Reject all other methods
  res.status(405).json({ message: "Method Not Allowed" });
}