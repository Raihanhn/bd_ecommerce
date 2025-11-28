// /pages/api/payment/initiate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  try {
    const { items, amount, user, shippingAddress } = req.body;

    // ===== Validation =====
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    // Ensure we have enough data in the shippingAddress object
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone ||
      !shippingAddress.email
    )
      return res
        .status(400)
        .json({ message: "Missing required shipping address fields." });

    // Create ORDER first with unpaid
    const order = await Order.create({
      user: user || null,
      items: items.map((i: any) => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      total: amount,
      paymentMethod: "sslcommerz",
      paymentStatus: "unpaid",
      status: "pending",
      shippingAddress,
    });

    const store_id = process.env.SSLCOMMERZ_STORE_ID!;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
    const isSandbox = true;

    // 🚀 FIX: Added cus_country, ship_name, ship_add1, ship_city, and ship_country as required by SSLCommerz
    const postData: any = {
      store_id,
      store_passwd,
      total_amount: amount,
      currency: "BDT",
      tran_id: order._id.toString(), // order ID used as transaction ID
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
      shipping_method: "Courier",
      product_name: "Ecommerce Order",
      product_category: "General",
      product_profile: "general",

      // Customer Info (Mandatory fields)
      cus_name: shippingAddress.name,
      cus_email: shippingAddress.email,
      cus_add1: shippingAddress.address,
      cus_city: shippingAddress.city,
      cus_phone: shippingAddress.phone,
      cus_postcode: shippingAddress.postcode || "1000",
      cus_country: "Bangladesh", // <-- CRITICAL FIX

      // Shipping Info (Often mandatory or highly recommended)
      ship_name: shippingAddress.name,
      ship_add1: shippingAddress.address,
      ship_city: shippingAddress.city,
      ship_postcode: shippingAddress.postcode || "1000",
      ship_country: "Bangladesh", // <-- CRITICAL FIX
    };

    const response = await fetch(
      isSandbox
        ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
        : "https://securepay.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        body: new URLSearchParams(postData).toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = await response.json();

    console.log("==========================================");
    console.log("SSLCOMMERZ RESPONSE DATA:");
    console.log(data); // 🐞 Log the raw response for debugging
    console.log("==========================================");

    // Check if the response contains the gateway URL
    if (data.status === "SUCCESS" && data.GatewayPageURL) {
      // 🚀 CRITICAL FIX: Use GatewayPageURL here, as it points to the method selection page
      return res.json({
        success: true,
        paymentUrl: data.GatewayPageURL,
        orderId: order._id,
      });
    } else {
      // 💡 Send the specific error message back to the frontend for better debugging
      const errorMessage =
        data.failedreason ||
        data.error_reason ||
        data.message ||
        "SSLCommerz API failed to return a payment URL.";

      console.error("Payment initiation failed:", errorMessage);

      // If payment initiation fails, we should delete the 'pending' order to keep the database clean
      await Order.findByIdAndDelete(order._id);

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error during payment initiation.",
      });
  }
}
