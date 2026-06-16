import Food from "../models/Food.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const addFood = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discount,
      isFeatured,
      isBestSeller,
    } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Required Fields are missing",
      });
    }
    if (
      !req.files ||
      !req.files.foodImage ||
      req.files.foodImage.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Food image is required",
      });
    }

    const file = req.files.foodImage[0];

    // upload to cloudinary
    const uploadResult = await uploadToCloudinary(file.buffer, "foods");

    const food = await Food.create({
      name,
      description,
      category,
      price,
      discount,
      isFeatured,
      isBestSeller,
      image: uploadResult.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Food Created Successfully",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true });

    return res.status(200).json({
      success: true,
      total: foods.length,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllFoodsAdmin = async (req, res) => {
  try {
    const foods = await Food.find();

    return res.status(200).json({
      success: true,
      total: foods.length,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchFood = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search Keyword is required",
      });
    }
    const foods = await Food.find(
      {
        $text: {
          $search: query,
        },
      },
      {
        score: {
          $meta: "textScore",
        },
      },
    ).sort({
      score: {
        $meta: "textScore",
      },
    });

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "discount",
      "isAvailable",
      "isFeatured",
      "isBestSeller",
    ];

    // update only provided Fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        food[field] = req.body[field];
      }
    });

    const updatedFood = await food.save();
    return res.status(200).json({
      success: true,
      message: "Food Updated Successfully",
      food: updatedFood,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFoodImage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the request is coming");

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // ✅ FIXED CHECK
    if (
      !req.files ||
      !req.files.foodImage ||
      req.files.foodImage.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Food Image is required",
      });
    }

    const file = req.files.foodImage[0];

    const uploadResult = await uploadToCloudinary(file.buffer, "foods");

    food.image = uploadResult.secure_url;

    await food.save();

    return res.status(200).json({
      success: true,
      message: "Food image updated successfully",
      image: food.image,
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    await Food.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Food Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeaturedFoods = async (req, res) => {
  try {
    const foods = await Food.find({
      isFeatured: true,
      isAvailable: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(8);

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBestSellerFoods = async (req, res) => {
  try {
    const foods = await Food.find({
      isBestSeller: true,
      isAvailable: true,
    })
      .sort({
        "rating.average": -1,
      })
      .limit(8);

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
