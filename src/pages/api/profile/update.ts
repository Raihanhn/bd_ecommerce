import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  // ✅ Pass options to the constructor
  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
    multiples: false, // single file upload
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parsing error" });

    const { email, name, mobile, address } = fields;
    let imagePath;

    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const newPath = `/uploads/${path.basename(file.filepath)}`;
      fs.renameSync(file.filepath, path.join(process.cwd(), "public", newPath));
      imagePath = newPath;
    }

    const updateData: any = { name, mobile, address };
    if (imagePath) updateData.image = imagePath;

    const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
    res.status(200).json({ message: "Profile updated", user });
  });
}
