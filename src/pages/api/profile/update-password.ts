//pages/api/profile/update-pasword.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ message: "Email and new password required" });

  await dbConnect();

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating password" });
  }
}
