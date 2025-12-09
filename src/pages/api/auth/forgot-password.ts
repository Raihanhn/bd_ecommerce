import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>This link expires in 15 minutes.</p>`,
  });

  res.json({ message: "Password reset email sent" });
}
