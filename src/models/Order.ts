//models/Order.ts
import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" }, // user may be guest or logged in

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    total: { type: Number, required: true },

    // PAYMENT FIELDS
    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    transactionId: { type: String }, // SSLCommerz tran_id
    paymentInfo: { type: Object },   // full callback response

    // ORDER STATUS STEPS
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "packaging",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // CUSTOMER SHIPPING INFO
    shippingAddress: {
      name: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", orderSchema);
