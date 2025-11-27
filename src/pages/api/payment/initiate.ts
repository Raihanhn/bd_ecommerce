// /pages/api/payment/initiate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  try {
    const { items, amount, user, shippingAddress } = req.body;

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

      cus_name: shippingAddress.name,
      cus_email: shippingAddress.email,
      cus_add1: shippingAddress.address,
      cus_city: shippingAddress.city,
      cus_phone: shippingAddress.phone,
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

    return res.json({ success: true, paymentUrl: data.GatewayPageURL, orderId: order._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Payment initiation error" });
  }
}
