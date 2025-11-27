// /pages/api/payment/initiate.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { amount, customerName, customerEmail, customerPhone, orderId } = req.body;

  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_sandbox = true; // sandbox mode

  const postData = {
    store_id,
    store_passwd,
    total_amount: amount,
    currency: "BDT",
    tran_id: orderId,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    cus_name: customerName,
    cus_email: customerEmail,
    cus_phone: customerPhone,
    shipping_method: "NO",
    product_name: "Order Payment",
    product_category: "E-commerce",
    product_profile: "general",
  };

  try {
    const response = await fetch(
      is_sandbox
        ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
        : "https://securepay.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        body: new URLSearchParams(postData as any).toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Payment initiation failed", details: err });
  }
}
