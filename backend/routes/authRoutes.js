import express from "express";
import {
  getMe,
  login,
  logout,
  registerAdmin,
  registerUser,
} from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/registerAdmin", registerAdmin);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
