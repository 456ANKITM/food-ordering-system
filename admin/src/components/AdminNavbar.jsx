import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllAsReadMutation,
} from "../redux/api/notificationApi";
import { Bell, Clock } from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { data: notificationData } = useGetMyNotificationsQuery();
  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 5000,
    skip: !isAuthenticated,
  });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isMobileNotifOpen, setIsMobileNotifOpen] = useState(false);

  const notifications = notificationData?.notifications || [];
  const unreadCount = unreadData?.unreadCount || 0;

  const handleOpenNotifications = async () => {
    setOpenNotifications((prev) => !prev);
    if (!openNotifications) {
      setIsMobileNotifOpen(true);
      await markAllAsRead();
    }
  };

  const formatTime = (date) => {
    if (!date) return "Just now";
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-r from-white via-orange-50 to-white backdrop-blur-xl"></div>
        
        {/* Border */}
        <div className="absolute bottom-0 w-full h-px bg-linear-to-r from-transparent via-orange-200 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition"></div>
                <img
                  src={logo}
                  alt="Foodie Express Logo"
                  className="relative w-10 h-8 sm:w-12 sm:h-10 object-contain rounded-lg shadow-md"
                />
              </div>

              <div className="hidden sm:flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Foodie<span className="text-orange-500">Express</span>
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Admin Panel</span>
              </div>
            </div>

          
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* NOTIFICATION BUTTON */}
              <div className="relative">
                <button
                  onClick={handleOpenNotifications}
                  className="relative p-2 sm:p-2.5 rounded-xl text-gray-700 hover:text-orange-600 transition-all duration-300 group"
                  aria-label="Notifications"
                >
                  {/* Button background on hover */}
                  <div className="absolute inset-0 bg-orange-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Bell Icon */}
                  <Bell className="relative w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />

                  {/* Badge - unread count */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-0.5 sm:-right-0.5 bg-linear-to-br from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

              
                {openNotifications && (
                  <div className="hidden md:block absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl shadow-orange-500/10 z-50 overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-5 bg-linear-to-r from-orange-50 to-white border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Notifications
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {unreadCount > 0 ? `${unreadCount} new` : "All caught up"}
                        </p>
                      </div>
                      <button
                        onClick={() => setOpenNotifications(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-105 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <div className="w-16 h-16 bg-linear-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-3">
                            <Bell className="w-8 h-8 text-orange-400" />
                          </div>
                          <p className="text-gray-600 font-medium">No notifications</p>
                          <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((n, index) => (
                          <div
                            key={n._id}
                            className={`px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-50 transition-all duration-300 hover:bg-orange-50 cursor-pointer group ${
                              !n.isRead ? "bg-linear-to-r from-orange-50 to-transparent" : "opacity-70 hover:opacity-100"
                            } ${index === notifications.length - 1 ? "border-b-0" : ""}`}
                          >
                            <div className="flex gap-3">
                              {/* Unread indicator */}
                              {!n.isRead && (
                                <div className="shrink-0 mt-1">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition">
                                  {n.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {n.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {formatTime(n.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* PROFILE BUTTON */}
              <button
                onClick={() => setOpenProfile(true)}
                className="relative p-1 rounded-xl transition-all duration-300 group hover:bg-orange-100"
                aria-label="Open profile menu"
              >
                <img
                  src={
                    user?.profileImage ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=FF8C00&color=fff`
                  }
                  alt={user?.name || "Profile"}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

  
      {isMobileNotifOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-linear-to-r from-orange-50 to-white border-b border-gray-100 shadow-sm">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Notifications
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} new updates` : "All caught up"}
              </p>
            </div>

            <button
              onClick={() => {
                setIsMobileNotifOpen(false);
                setOpenNotifications(false);
              }}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center py-12">
                <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-orange-400" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">No notifications yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  We'll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                      !n.isRead
                        ? "bg-linear-to-r from-orange-50 to-orange-25 border-l-4 border-orange-500"
                        : "bg-gray-50 border-l-4 border-transparent"
                    } shadow-sm hover:shadow-md p-4 sm:p-5`}
                  >
                    {/* Header with badge */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-bold text-gray-900 text-base sm:text-lg flex-1">
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="shrink-0 inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                      {n.message}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(n.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ProfileSidebar
        open={openProfile}
        setOpen={setOpenProfile}
        user={user}
      />
    </>
  );
};

export default AdminNavbar;