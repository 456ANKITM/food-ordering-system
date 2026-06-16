import cron from "node-cron";
import Order from "../models/Order.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("🟡 Running order cleanup job...");

    const expiryTime = new Date(Date.now() - 30 * 60 * 1000);

    const orders = await Order.find({
      "payment.method": "STRIPE",
      "payment.status": "pending",
      createdAt: { $lt: expiryTime },
    });

    for (const order of orders) {
      await Order.findByIdAndDelete(order._id);
      console.log("❌ Deleted unpaid order:", order._id);
    }

    console.log(`✅ Cleanup done. Checked ${orders.length} orders`);
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
});
