//models/User.ts
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    mobile: { type: String, default: "123***" },           
    address: { type: String, default: "Your default address" }, 
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", userSchema);

