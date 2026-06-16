import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

const formatOrderItems = (items) => {
  return items.map((item) => `${item.quantity} ${item.name}`).join(" | ");
};

const getOrderStatusMessage = (status) => {
  const messages = {
    pending: "is waiting for confirmation",
    confirmed: "has been confirmed by the restaurant",
    preparing: "is now being prepared by the kitchen",
    ready: "is ready for pickup",
    out_for_delivery: "is out for delivery 🚚",
    delivered: "has been delivered successfully 🎉",
    cancelled: "has been cancelled",
  };

  return messages[status] || `status updated to ${status}`;
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // get cart
    const cart = await Cart.findOne({ userId }).populate("items.foodId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let items = [];
    let subTotal = 0;

    for (let item of cart.items) {
      const food = item.foodId;
      const quantity = item.quantity;
      const price = food.price;
      const totalPrice = price * quantity;
      subTotal += totalPrice;
      items.push({
        foodId: food._id,
        name: food.name,
        image: food.image || "",
        quantity,
        price,
        totalPrice,
      });
    }

    // Taxes + Fees (You can Customize it Later)
    const deliveryFee = 50;
    const tax = Math.round(subTotal * 0.05); // 5% tax
    const discount = 0;
    const totalAmount = subTotal + deliveryFee + tax - discount;

    const order = await Order.create({
      userId,
      items,
      subTotal,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      deliveryAddress: req.body.deliveryAddress,
      payment: {
        method: req.body.paymentMethod || "COD",
        status: "pending",
      },
    });

    await Cart.findOneAndDelete({ userId });

    await createNotification({
      userId,
      title: "Order Placed Successfully 🎉",
      message: `Your Order for ${formatOrderItems(items)} at Rs.${totalAmount} has been placed successfully.`,
      type: "order",
      orderId: order._id,
    });

    const user = await User.findById(userId);
    const admins = await User.find({ role: "admin" });

    for (let admin of admins) {
      await createNotification({
        userId: admin._id,
        title: "🆕 New Order Received",
        message: `New order for ${formatOrderItems(items)} has been received. The total amount is Rs.${totalAmount} and placed by ${user.name}.`,
        type: "order",
        orderId: order._id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderByIdAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "userId",
      "name email",
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order Status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order status cannot be changed",
      });
    }

    const previousStatus = order.orderStatus;

    order.orderStatus = orderStatus;

    await order.save();

    const itemSummary = formatOrderItems(order.items);

    const statusMessage = getOrderStatusMessage(orderStatus);

    // CUSTOMER NOTIFICATION

    await createNotification({
      userId: order.userId,

      title: `Order ${orderStatus.replace("_", " ")} 📦`,

      message: `Your order for ${itemSummary} ${statusMessage}. 
             Order total: Rs.${order.totalAmount}.`,

      type: "order",

      orderId: order._id,
    });

    // ADMIN NOTIFICATION

    const admins = await User.find({
      role: "admin",
    });

    const customer = await User.findById(order.userId);

    for (let admin of admins) {
      await createNotification({
        userId: admin._id,

        title: "Order Status Updated 🔔",

        message: `Order ${itemSummary} status changed from ${previousStatus} to ${orderStatus}.
                 Customer: ${customer.name}.
                 Total amount: Rs.${order.totalAmount}.`,

        type: "order",

        orderId: order._id,
      });
    }

    return res.status(200).json({
      success: true,

      message: "Order status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    if (
      order.orderStatus === "out_for_delivery" ||
      order.orderStatus === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    const previousStatus = order.orderStatus;

    order.orderStatus = "cancelled";

    await order.save();

    const itemSummary = formatOrderItems(order.items);

    const user = await User.findById(userId);

    // CUSTOMER NOTIFICATION

    await createNotification({
      userId: order.userId,

      title: "Order Cancelled ❌",

      message: `Your order for ${itemSummary} has been cancelled successfully. 
             Previous status was ${previousStatus}. 
             Total amount: Rs.${order.totalAmount}.`,

      type: "order",

      orderId: order._id,
    });

    // ADMIN NOTIFICATION

    const admins = await User.find({
      role: "admin",
    });

    for (let admin of admins) {
      await createNotification({
        userId: admin._id,

        title: "Order Cancelled ⚠️",

        message: `Order for ${itemSummary} has been cancelled by ${user.name}.
                 Previous status: ${previousStatus}.
                 Order amount: Rs.${order.totalAmount}.`,

        type: "order",

        orderId: order._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodayOrders = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("items");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderStatusCounts = async (req, res) => {
  try {
    const [pending, delivered, cancelled] = await Promise.all([
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
    ]);

    return res.status(200).json({
      success: true,
      counts: {
        pending,
        delivered,
        cancelled,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
