// lib/adminMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { dbConnect } from "./db";
import User from "../models/User";

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  await dbConnect();
  const user = await User.findById(token.sub);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: admin only" });
    return null;
  }

  return user; // return user if ok
}
