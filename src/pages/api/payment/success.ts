// /pages/api/payment/success.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

// You may need to create a utility function for verification
async function verifyPayment(tran_id: string, amount: number, currency: string): Promise<boolean> {
    const store_id = process.env.SSLCOMMERZ_STORE_ID!;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
    const isSandbox = true;

    // Data for verification
    const verificationData = {
        val_id: tran_id, // Note: You often use 'val_id' or 'tran_id' depending on the response
        store_id,
        store_passwd,
        format: 'json'
    };

    const endpoint = isSandbox
        ? "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
        : "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: new URLSearchParams(verificationData).toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const data = await response.json();
        
        // 💡 CRITICAL: Check the SSLCommerz validation response status
        if (data && data.status === 'VALID' || data.status === 'VALIDATED') {
            // Also check if the amount and currency match your order amount to prevent tampering
            const validatedAmount = parseFloat(data.amount);
            
            if (validatedAmount === amount && data.currency === currency) {
                console.log(`SSLCommerz Verification SUCCESS for Order ID: ${tran_id}`);
                return true;
            }
        }
        
        console.error(`SSLCommerz Verification FAILED for Order ID: ${tran_id}. Reason: ${data?.status}`);
        return false;

    } catch (err) {
        console.error("Error during SSLCommerz verification call:", err);
        return false;
    }
} 


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // SSLCommerz typically sends a POST request, but handling GET as well is safer.
    if (req.method !== "POST" && req.method !== "GET") {
        return res.status(405).send("Method Not Allowed");
    }

    await dbConnect();

    try {
        // Use req.body for POST (IPN) and req.query for GET (User Redirect)
        const paymentData = req.body || req.query; 
        const orderId = paymentData.tran_id;

        if (!orderId) {
            return res.status(400).send("Missing transaction ID.");
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send("Order not found.");
        }

        // 1. CHECK IF ALREADY PROCESSED
        if (order.paymentStatus === 'paid') {
            // If the order is already marked as paid, we redirect the user immediately
            return res.redirect(`/payment/success-view?orderId=${orderId}`);
        }
        
        // 2. RUN PAYMENT VERIFICATION
        const isVerified = await verifyPayment(
            orderId, 
            order.total, 
            "BDT" // Assuming your currency is BDT
        );

        if (!isVerified) {
            // If verification fails, redirect to a failure page
            console.error(`Unverified/Invalid payment attempt for Order ID: ${orderId}`);
            return res.redirect(`/payment/fail?orderId=${orderId}`);
        }

        // 3. UPDATE ORDER STATUS (Only if verified)
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "paid",
            status: "processing", // Or 'paid', depending on your business logic
            transactionId: paymentData.bank_tran_id || paymentData.val_id,
            paymentInfo: paymentData,
        });
        
        // 4. REDIRECT USER TO SUCCESS PAGE
        return res.redirect(`/payment/success-view?orderId=${orderId}`);
    } catch (error) {
        console.error("Payment success processing error:", error);
        // If a server error occurs, we redirect to a generic failure page
        return res.redirect("/payment/fail");
    }
}