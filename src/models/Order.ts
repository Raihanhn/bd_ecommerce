//models/Order.ts
import mongoose, { Schema, models } from "mongoose";
 
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["pending","processing","shipped","delivered","cancelled"], default: "pending" },
  shippingAddress: { type: Object },
  paymentInfo: { type: Object },
}, { timestamps: true });

export default models.Order || mongoose.model("Order", orderSchema);
