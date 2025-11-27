 //app/api/order/create/route.ts
import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, items, shippingAddress, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items in order" },
        { status: 400 }
      );
    }

    // Calculate total from DB price (for security)
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      total += product.price * item.qty;
    }

    // PAYMENT FLAGS
    const isCOD = paymentMethod === "cod";

    const payment = {
      method: paymentMethod,
      status: isCOD ? "unpaid" : "init",       // sslcommerz = init
      transactionId: null,
    };

    const newOrder = await Order.create({
      user: userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: payment.status,
      transactionId: payment.transactionId,
      status: isCOD ? "processing" : "pending",
      orderHistory: [
        {
          status: isCOD ? "processing" : "pending",
          message: isCOD ? "COD order placed" : "Awaiting SSL payment",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id,
      paymentMethod,
    });
  } catch (error) {
    console.log("ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
