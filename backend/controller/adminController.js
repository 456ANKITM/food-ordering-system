import Order from "../models/Order.js";

const getDateRange = (type) => {
  const now = new Date();

  let start;

  switch (type) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      break;

    case "week":
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;

    case "month":
      start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      break;

    case "year":
      start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end: new Date() };
};

const getDashboardStats = async (type) => {
  const { start, end } = getDateRange(type);

  const orders = await Order.find({
    createdAt: { $gte: start, $lte: end },
  });

  const totalOrders = orders.length;

  const revenue = orders
    .filter(
      (o) =>
        o.payment?.status === "paid" &&
        o.orderStatus === "delivered"
    )
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    totalOrders,
    revenue,
  };
};

export const getTodayStats = async (req, res) => {
  const data = await getDashboardStats("today");
  res.json(data);
};

export const getWeekStats = async (req, res) => {
  const data = await getDashboardStats("week");
  res.json(data);
};

export const getMonthStats = async (req, res) => {
  const data = await getDashboardStats("month");
  res.json(data);
};

export const getYearStats = async (req, res) => {
  const data = await getDashboardStats("year");
  res.json(data);
};


export const getPaidOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "payment.status": "paid",
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .populate({
        path: "items.foodId",
        select: "name image",
      });

    const formattedPayments = orders.map((order) => ({
      orderId: order._id,
      orderNumber: order.orderNumber,

      customer: {
        id: order.userId?._id,
        name: order.userId?.name,
        email: order.userId?.email,
        phone: order.userId?.phone,
      },

      items: order.items.map((item) => ({
        foodName: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      })),

      payment: {
        method: order.payment.method, // COD or STRIPE
        status: order.payment.status,
        stripePaymentId: order.payment.stripePaymentId,
        paidAt: order.payment.paidAt,
      },

      totals: {
        subTotal: order.subTotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        discount: order.discount,
        totalAmount: order.totalAmount,
      },

      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formattedPayments.length,
      payments: formattedPayments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
