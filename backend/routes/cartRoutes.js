import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  deleteCart,
  getCart,
  removeItem,
  updateCartItemQuantity,
} from "../controller/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.patch(
  "/updateCartItemQuantity/:foodId",
  protect,
  updateCartItemQuantity,
);
router.delete("/item/:foodId", protect, removeItem);
router.delete("/", protect, deleteCart);

export default router;
