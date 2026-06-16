import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  cancelOrder,
  createOrder,
  getAllOrdersAdmin,
  getMyOrders,
  getOrderByIdAdmin,
  getOrderDetails,
  getOrderStatusCounts,
  getTodayOrders,
  updateOrderStatus,
} from "../controller/orderController.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/getMyOrders", protect, getMyOrders);
router.get("/all", protect, isAdmin, getAllOrdersAdmin);
router.get("/getTodayOrders", protect, isAdmin, getTodayOrders);
router.get("/orderStatusCount", protect, isAdmin, getOrderStatusCounts);
router.get("/:orderId", protect, getOrderDetails);
router.get("/admin/:orderId", protect, isAdmin, getOrderByIdAdmin);
router.patch("/:orderId/status", protect, isAdmin, updateOrderStatus);
router.patch("/cancel/:orderId", protect, cancelOrder);

export default router;
