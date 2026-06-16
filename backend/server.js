import "./config/env.js";
import "./utils/cron-jobs.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import resturantRoutes from "./routes/resturantRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { stripeWebhook } from "./controller/paymentController.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://food-ordering-system-iota-opal.vercel.app",
       "https://food-ordering-system-q2zd.vercel.app"],
    credentials: true,
  }),
);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resturant", resturantRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

const startServer = async () => {
  try {
    // Connect database first
    await connectDB();

    // Connect to Cloudinary after database is Connected and then start the server
    await connectCloudinary();

    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
