import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

// -----------------------------
//  VALIDATION FUNCTION (with logs)
// -----------------------------
async function validateSSLPayment(val_id: string) {
  const store_id = process.env.SSLCOMMERZ_STORE_ID!;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;

  const url = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(
    val_id
  )}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`;

  console.log("🔍 Validation URL:", url);

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log("🔍 SSL Validation Response:", json);
    return json;
  } catch (err) {
    console.error("❌ SSL Validation API Error:", err);
    return null;
  }
}

// -----------------------------
// SUCCESS HANDLER
// -----------------------------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("========================================");
  console.log("🔥 SUCCESS API HIT");
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("========================================");

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  await dbConnect();

  try {
    const data = req.method === "POST" ? req.body : req.query;

    console.log("🔍 Incoming SSLCommerz Data:", data);

    const tran_id = data.tran_id as string;
    const val_id = data.val_id as string;

    console.log("🔍 tran_id:", tran_id);
    console.log("🔍 val_id:", val_id);

    if (!tran_id || !val_id) {
      console.log("❌ Missing tran_id or val_id");
      return res.redirect("/payment/fail");
    }

    // -----------------------------
    // FIND ORDER
    // -----------------------------
    console.log("🔍 Trying to find order:", tran_id);

    const order = await Order.findById(tran_id);
    console.log("🔍 Found Order:", order);

    if (!order) {
      console.log("❌ Order not found!");
      return res.redirect(`/payment/fail?orderId=${tran_id}`);
    }

    if (order.paymentStatus === "paid") {
      console.log("ℹ️ Order already marked as paid");
      return res.redirect(`/payment/success?orderId=${tran_id}`);
    }

    // -----------------------------
    // VALIDATE PAYMENT WITH SSLCOMMERZ
    // -----------------------------
    console.log("🔍 Sending validation request...");
    const validation = await validateSSLPayment(val_id);

    if (!validation) {
      console.log("❌ Validation API returned null");
      return res.redirect(`/payment/fail?orderId=${tran_id}`);
    }

    console.log("🔍 Validation Status:", validation.status);
    console.log("🔍 Validation Amount:", validation.amount);

    if (
      validation.status !== "VALID" &&
      validation.status !== "VALIDATED"
    ) {
      console.log("❌ Validation status is invalid:", validation.status);
      return res.redirect(`/payment/fail?orderId=${tran_id}`);
    }

    // -----------------------------
    // AMOUNT CHECK
    // -----------------------------
    const validatedAmount = parseFloat(validation.amount);
    console.log("🔍 Comparing amounts:", validatedAmount, order.amount);

    if (process.env.NODE_ENV === "production") {
      if (validatedAmount !== order.total) {
        console.log("❌ Amount mismatch!");
        return res.redirect(`/payment/fail?orderId=${tran_id}`);
      }
    }

    // -----------------------------
    // MARK ORDER AS PAID
    // -----------------------------
    console.log("✅ Marking order as paid...");

   await Order.findByIdAndUpdate(tran_id, {
  paymentStatus: "paid",
  status: "processing",
  transactionId: validation.tran_id,
  paymentInfo: validation,
});


    console.log("🎉 Payment Success!");

    return res.redirect(`/payment/success?orderId=${tran_id}`);
  } catch (err) {
    console.error("❌ Payment Success Error:", err);
    return res.redirect("/payment/fail");
  }
}
