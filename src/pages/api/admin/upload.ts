import { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/adminMiddleware";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parse error" });
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ message: "No file" });

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath || (file as any).path, {
        folder: "shopifypro_products",
        use_filename: true,
        resource_type: "image",
      });
      return res.status(200).json({ url: result.secure_url });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Upload failed" });
    }
  });
}
