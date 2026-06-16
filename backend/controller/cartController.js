import { createReadStream } from "streamifier";
import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "foodId is required",
      });
    }
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be atleast 1",
      });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalAmount: 0,
      });
    }

    // check if the items already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        foodId,
        quantity,
      });
    }

    let total = 0;

    for (const item of cart.items) {
      const foodData = await Food.findById(item.foodId);
      total += foodData.price * item.quantity;
    }

    cart.totalAmount = total;

    cart.lastUpdatedAt = new Date();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.foodId");
    if (!cart || cart.items.lenth === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          items: [],
          totalAmount: 0,
        },
      });
    }
    let totalAmount = 0;
    const formattedItems = cart.items.map((item) => {
      const food = item.foodId;
      const itemTotal = food.price * item.quantity;
      totalAmount += itemTotal;
      return {
        foodId: food._id,
        name: food.name,
        image: food.image,
        price: food.price,
        quantity: item.quantity,
        itemTotal,
      };
    });

    return res.status(200).json({
      success: true,
      message: "cart fetched successfully",
      cart: {
        _id: cart._id,
        items: formattedItems,
        totalAmount,
        currency: cart.currency,
        status: cart.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity Can not be negative",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    if (cart.items.length === 0) {
      cart.totalAmount = 0;
      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Cart is now empty",
        cart,
      });
    }

    // Recalculate total amount
    let total = 0;
    for (const item of cart.items) {
      const food = await Food.findById(item.foodId);
      if (!food) continue;
      total += food.price * item.quantity;
    }
    cart.totalAmount = total;
    cart.lastUpdatedAt = new Date();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart Updated Successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.params;

    // find cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // remove the item
    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {
      cart.totalAmount = 0;
      cart.lastUpdatedAt = new Date();

      await cart.save();

      return res.status(200).json({
        success: true,
        message: "Item removed..Cart is now empty",
      });
    }

    let total = 0;

    for (const item of cart.items) {
      const food = await Food.findById(item.foodId);
      if (!food) continue;
      total += food.price * item.quantity;
    }

    cart.totalAmount = total;
    cart.lastUpdatedAt = new Date();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed Successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Cart Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
