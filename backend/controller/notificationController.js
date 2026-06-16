import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    }); // latest first

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAllNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } },
    );
    return res.status(200).json({
      success: true,
      message: "All Notification is marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAllNotifcation = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Notification.deleteMany({ userId });
    return res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
