import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [cartItemSchema],

    // cached total (for fast frontend response)
    totalAmount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "NPR",
    },

    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active",
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
