import mongoose, { Schema, models } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  sku: { type: String },
  quantity: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  images: [{ type: String }], // array of image URLs
  isVisible: { type: Boolean, default: true },
  attributes: { type: Object }, // e.g. color, size
}, { timestamps: true });

productSchema.index({
  name: "text",
  description: "text",
  slug: "text"
});

export default models.Product || mongoose.model("Product", productSchema);
