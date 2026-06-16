import express from "express";
import {
  createStripePaymentIntent,
  retryStripePaymentIntent,
} from "../controller/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-intent", protect, createStripePaymentIntent);
router.post("/retry-intent", protect, retryStripePaymentIntent);

export default router;
