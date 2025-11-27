//app/api/order/cod-confirm/route.ts 
import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentMethod !== "cod") {
      return NextResponse.json(
        { success: false, message: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Update order
    order.paymentStatus = "unpaid";
    order.status = "processing";

    order.orderHistory.push({
      status: "processing",
      message: "COD order confirmed",
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: "COD order confirmed",
      orderId: order._id,
    });
  } catch (error) {
    console.log("COD CONFIRM ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
