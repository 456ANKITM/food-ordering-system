import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import {
  addFood,
  deleteFood,
  getAllFoods,
  getAllFoodsAdmin,
  getBestSellerFoods,
  getFeaturedFoods,
  getFoodById,
  searchFood,
  updateFood,
  updateFoodImage,
} from "../controller/foodController.js";
import { uploadFields } from "../middlewares/upload.js";

const router = express.Router();

router.post("/addFood", protect, isAdmin, uploadFields, addFood);
router.get("/allFoods", getAllFoods);
router.get("/allFoods/admin", protect, isAdmin, getAllFoodsAdmin);
router.get("/search", searchFood);
router.get("/featuredFoods", getFeaturedFoods);
router.get("/bestSellers", getBestSellerFoods);
router.put("/update/:id", protect, isAdmin, updateFood);
router.put(
  "/updateFoodImage/:id",
  protect,
  isAdmin,
  uploadFields,
  updateFoodImage,
);
router.get("/:id", getFoodById);
router.delete("/:id", protect, isAdmin, deleteFood);

export default router;
