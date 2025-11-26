//pages/api/profile/get.ts
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  await dbConnect();
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
}
