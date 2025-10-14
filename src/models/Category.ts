import mongoose, { Schema, models } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // optional friendly URL
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.Category || mongoose.model("Category", categorySchema);
