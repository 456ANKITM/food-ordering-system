import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
  orderId = null,
}) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      orderId,
    });
    return notification;
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};
