import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import {
  createResturant,
  updateResturantDetails,
  updateResturantImages,
} from "../controller/resturantController.js";
import { uploadFields } from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", protect, isAdmin, createResturant);
router.put("/:id", protect, isAdmin, updateResturantDetails);
router.put(
  "/updateImage/:id",
  protect,
  isAdmin,
  uploadFields,
  updateResturantImages,
);

export default router;
