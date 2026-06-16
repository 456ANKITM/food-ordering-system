import express from "express"; 
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { getMonthStats, getPaidOrders, getTodayStats, getWeekStats, getYearStats } from "../controller/adminController.js";

const router = express.Router(); 

router.get("/getTodayStats", protect, isAdmin, getTodayStats);
router.get("/getWeekStats", protect, isAdmin, getWeekStats);
router.get("/getMonthStats", protect, isAdmin, getMonthStats);
router.get("/getYearStats", protect, isAdmin, getYearStats);
router.get("/payments", protect, isAdmin, getPaidOrders );


export default router;