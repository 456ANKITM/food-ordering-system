import mongoose from "mongoose";
import Order from "../models/Order.js";
import { stripe } from "../utils/stripe.js";

export const createStripePaymentIntent = async (req, res) => {
  try {
    console.log(1);
    const userId = req.user._id;
    const { orderId } = req.body;
    console.log("orderId:", orderId);

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid orderId",
      });
    }

    const order = await Order.findById(orderId);
    console.log(order);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // optional security check
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    console.log(2);

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    console.log(3);

    // store intent id (optional but recommended)
    order.payment.stripePaymentId = paymentIntent.id;
    await order.save();

    console.log(paymentIntent.client_secret);

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const retryStripePaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Already Paid",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    order.payment.stripePaymentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  console.log("Web hook running");
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ PAYMENT SUCCESS
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findById(orderId);

    if (order) {
      order.payment.status = "paid";
      order.payment.paidAt = new Date();
      order.orderStatus = "confirmed";

      await order.save();

      console.log("✅ Payment successful for order:", orderId);
    }
  }

  // ❌ PAYMENT FAILED
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;

    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findById(orderId);

    if (order) {
      order.payment.status = "failed";
      await order.save();
    }
  }

  if (order.payment.status === "paid") {
    return res.json({ received: true });
  }
};
