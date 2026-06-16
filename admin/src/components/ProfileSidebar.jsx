import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  CirclePlus,
  X,
  LogOut,
  ChevronRight,
  Shield,
  ShoppingBag,
  User,
  BadgeDollarSign,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApi";
import { logoutUser } from "../redux/slices/userSlice";

const ProfileSidebar = ({ open, setOpen, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const panelRef = useRef();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999">
  
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />

      <div className="fixed inset-0 flex justify-end pointer-events-none">
        {/* SIDEBAR */}
        <div
          ref={panelRef}
          className="
            pointer-events-auto
            h-screen
            w-full sm:w-95 md:w-105
            bg-white
            shadow-2xl
            border-l border-gray-200
            flex flex-col
            animate-slide-in
            overflow-hidden
          "
        >
          {/* ================= HEADER ================= */}
          <div className="relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500 via-orange-600 to-red-600"></div>
            
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-400 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 -left-8 w-24 h-24 bg-red-400 rounded-full opacity-20 blur-3xl"></div>

            {/* Content */}
            <div className="relative px-5 sm:px-6 py-5 sm:py-6 text-white">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex items-center gap-4 pr-8">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-white/20 rounded-xl blur opacity-75"></div>
                  <img
                    src={
                      user?.profileImage ||
                      `https://ui-avatars.com/api/?name=${user?.name}&background=FF8C00&color=fff`
                    }
                    alt={user?.name || "Profile"}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white/30"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg sm:text-xl leading-tight">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 rounded-full">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= MENU SECTION ================= */}
          <div className="flex-1 px-3 sm:px-4 py-5 sm:py-6 overflow-y-auto">
            <h3 className="px-3 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Management
            </h3>

            <div className="space-y-2">
              {/* Menu Item 1 - Manage Menu */}
              <button
                onClick={() => navigateTo("/menu")}
                className="
                  w-full px-4 py-3 sm:py-3.5 rounded-xl
                  text-left text-gray-700 font-medium
                  transition-all duration-300
                  group
                  hover:bg-linear-to-r hover:from-orange-50 hover:to-orange-100
                  active:scale-95
                  flex items-center justify-between
                  border border-transparent hover:border-orange-200
                "
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-orange-100 to-orange-50 group-hover:from-orange-200 group-hover:to-orange-100 transition-all">
                    <UtensilsCrossed className="w-5 h-5 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">Menu</span>
                    <span className="text-xs text-gray-500">Manage your items</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Menu Item 2 - Add Food */}
              <button
                onClick={() => navigateTo("/add-food")}
                className="
                  w-full px-4 py-3 sm:py-3.5 rounded-xl
                  text-left text-gray-700 font-medium
                  transition-all duration-300
                  group
                  hover:bg-linear-to-r hover:from-green-50 hover:to-green-100
                  active:scale-95
                  flex items-center justify-between
                  border border-transparent hover:border-green-200
                "
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-green-100 to-green-50 group-hover:from-green-200 group-hover:to-green-100 transition-all">
                    <CirclePlus className="w-5 h-5 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">Add Food</span>
                    <span className="text-xs text-gray-500">Create new item</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={() => navigateTo("/all-orders")}
                className="
                  w-full px-4 py-3 sm:py-3.5 rounded-xl
                  text-left text-gray-700 font-medium
                  transition-all duration-300
                  group
                  hover:bg-linear-to-r hover:from-green-50 hover:to-green-100
                  active:scale-95
                  flex items-center justify-between
                  border border-transparent hover:border-green-200
                "
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-green-100 to-green-50 group-hover:from-green-200 group-hover:to-green-100 transition-all">
                    <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">Orders</span>
                    <span className="text-xs text-gray-500">Let's take a look at all orders</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={() => navigateTo("/all-users")}
                className="
                  w-full px-4 py-3 sm:py-3.5 rounded-xl
                  text-left text-gray-700 font-medium
                  transition-all duration-300
                  group
                  hover:bg-linear-to-r hover:from-green-50 hover:to-green-100
                  active:scale-95
                  flex items-center justify-between
                  border border-transparent hover:border-green-200
                "
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-green-100 to-green-50 group-hover:from-green-200 group-hover:to-green-100 transition-all">
                    <User className="w-5 h-5 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">Users</span>
                    <span className="text-xs text-gray-500">Manage Your Users</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={() => navigateTo("/all-payments")}
                className="
                  w-full px-4 py-3 sm:py-3.5 rounded-xl
                  text-left text-gray-700 font-medium
                  transition-all duration-300
                  group
                  hover:bg-linear-to-r hover:from-green-50 hover:to-green-100
                  active:scale-95
                  flex items-center justify-between
                  border border-transparent hover:border-green-200
                "
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-green-100 to-green-50 group-hover:from-green-200 group-hover:to-green-100 transition-all">
                    <BadgeDollarSign className="w-5 h-5 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">Payments</span>
                    <span className="text-xs text-gray-500">Let's take a look at all your payments</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

          </div>

          {/* ================= FOOTER ================= */}
          <div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-gray-200 bg-linear-to-b from-gray-50 to-white">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="
                w-full px-4 py-3 sm:py-3.5 rounded-xl
                bg-linear-to-r from-red-500 to-red-600
                text-white font-semibold
                hover:from-red-600 hover:to-red-700
                active:scale-95
                transition-all duration-300
                flex items-center justify-center gap-2
                disabled:opacity-70 disabled:cursor-not-allowed
                shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40
                border border-red-600/50
              "
            >
              <LogOut className={`w-5 h-5 ${isLoggingOut ? "animate-spin" : ""}`} />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>

            {/* Footer info */}
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
              Foodie<span className="text-orange-600 font-semibold">Express</span> Admin v1.0
            </p>
          </div>
        </div>
      </div>

      {/* ================= CSS ANIMATIONS ================= */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Smooth scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ProfileSidebar;