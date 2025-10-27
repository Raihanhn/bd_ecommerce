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

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // ✅ Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parsing error" });

    // ✅ Safely extract values
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const mobile = Array.isArray(fields.mobile) ? fields.mobile[0] : fields.mobile;
    const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;

    let imagePath;
    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const tempPath = file.filepath; // where formidable temporarily stored the file
      const newFileName = `${Date.now()}-${file.originalFilename}`;
      const newFilePath = path.join(uploadDir, newFileName);

      try {
        // ✅ Move file safely
        fs.copyFileSync(tempPath, newFilePath);
        fs.unlinkSync(tempPath); // remove temp file
        imagePath = `/uploads/${newFileName}`;
      } catch (e) {
        console.error("File move error:", e);
        return res.status(500).json({ message: "File move failed" });
      }
    }

    const updateData: any = { name, mobile, address };
    if (imagePath) updateData.image = imagePath;

    try {
      const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Database update failed", error });
    }
  });
}
