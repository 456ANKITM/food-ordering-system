import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationAsRead,
  deleteAllNotifcation,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/getMyNotifications", protect, getMyNotifications);
router.get("/getUnreadCount", protect, getUnreadNotificationCount);
router.put("/markAllNotificationAsRead", protect, markAllNotificationAsRead);
router.delete("/deleteAllNotifications", protect, deleteAllNotifcation);

export default router;
