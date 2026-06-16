import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { useGetCartQuery } from "../redux/api/cartApi";
import { useState, useRef, useEffect } from "react";
import ProfileSidebar from "./ProfileSidebar";
import {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllAsReadMutation,
} from "../redux/api/notificationApi";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.5 12.5h10.61c.464 0 .87-.3 1.02-.74l2.02-6.06a.75.75 0 00-.713-.99H5.106m0 0L4.723 4.835M16.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a2.25 2.25 0 01-4.714 0M18.75 16.5V11a6.75 6.75 0 10-13.5 0v5.5l-1.5 1.5h16.5l-1.5-1.5z"
    />
  </svg>
);

const NotifItem = ({ n }) => (
  <div className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-orange-500 text-sm">🔔</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-800 leading-snug">
          {n.title}
        </p>
        {!n.isRead && (
          <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-1.5" />
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
        {n.message}
      </p>
      {n.createdAt && (
        <p className="text-[11px] text-gray-400 mt-1.5">
          {new Date(n.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          {" · "}
          {new Date(n.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  </div>
);

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { data: cartData } = useGetCartQuery();
  const { data: notifData } = useGetMyNotificationsQuery();
  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 5000,
    skip: !isAuthenticated,
  });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);

  const notifRef = useRef();

  const cartCount =
    cartData?.cart?.items?.reduce((t, i) => t + i.quantity, 0) || 0;
  const notifications = notifData?.notifications || [];
  const unreadCount = unreadData?.unreadCount || 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBellClick = async () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setMobileNotifOpen(true);
    } else {
      setOpenNotif((p) => !p);
    }
    if (unreadCount > 0) await markAllAsRead();
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-9 h-9 object-contain rounded-xl"
            />
            <span className="hidden md:flex text-lg font-semibold text-gray-900 tracking-tight">
              Foodie<span className="text-orange-500">Express</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            {isAuthenticated &&  <div className="relative" ref={notifRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Desktop dropdown */}
              {openNotif && (
                <div className="hidden md:flex flex-col absolute right-0 mt-2 w-96 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-gray-400">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setOpenNotif(false)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl mb-3">
                          🔔
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          All caught up
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => <NotifItem key={n._id} n={n} />)
                    )}
                  </div>
                </div>
              )}
            </div> }
           

            {/* Auth */}
            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/signup")}
                className="ml-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
              >
                Sign up
              </button>
            ) : (
              <button
                onClick={() => setOpenProfile(true)}
                className="ml-1 p-0.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <img
                  src={
                    user?.profileImage ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-[10px] object-cover"
                />
              </button>
            )}
          </div>
        </div>

        <ProfileSidebar
          open={openProfile}
          setOpen={setOpenProfile}
          user={user}
        />
      </nav>

      {/* Mobile notifications panel */}
      {mobileNotifOpen && (
        <div className="fixed inset-0 z-9999 md:hidden bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <button
              onClick={() => setMobileNotifOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Notifications list */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  🔔
                </div>
                <p className="text-base font-semibold text-gray-800">
                  All caught up
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  We'll notify you when something arrives.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="flex gap-3 px-5 py-4 hover:bg-white transition-colors bg-white mb-1 mx-4 my-2 rounded-2xl border border-gray-100"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <span className="text-orange-500">🔔</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      {n.createdAt && (
                        <p className="text-xs text-gray-400 mt-1.5">
                          {new Date(n.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {" · "}
                          {new Date(n.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;
