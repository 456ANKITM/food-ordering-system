import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
} from "../controller/userController.js";

const router = express.Router();

router.get("/getAll", protect, isAdmin, getAllUsers);
router.get("/profile", protect, getUserProfile);
router.get("/:id", protect, isAdmin, getUserById);

export default router;
