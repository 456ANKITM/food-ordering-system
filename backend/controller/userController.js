import Order from "../models/Order.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "customer",
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }


    const orders = await Order.find({
      userId: id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.foodId",
        select: "name image category",
      });


    return res.status(200).json({
      success: true,
      user,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  console.log("The request is comming");
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("favourites");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // total orders (source of truth from DB)
    const totalOrders = await Order.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      user,
      recentOrders,
      totalOrders, // ⭐ added explicitly
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
