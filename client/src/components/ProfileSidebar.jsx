import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, LogOut, X, ChevronRight, UtensilsCrossed } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApi";
import { logoutUser } from "../redux/slices/userSlice";

const MENU_ITEMS = [
  {
    icon: User,
    label: "My profile",
    sub: "Account details & settings",
    path: "/profile",
  },
  {
    icon: ShoppingBag,
    label: "My orders",
    sub: "Track and manage orders",
    path: "/all-orders",
  },
  {
    icon: UtensilsCrossed,
    label: "Menu",
    sub: "Browse through different food items",
    path: "/menu",
  },
];

const ProfileSidebar = ({ open, setOpen, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const panelRef = useRef();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      setOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "auto";
    };
  }, [open, setOpen]);

  if (!open) return null;

  const avatar =
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex">
        <div
          ref={panelRef}
          className="w-full sm:w-90 h-screen bg-white flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Account
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User card */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={user?.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                />
                {user?.isActive !== false && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {user?.email || "—"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] font-medium bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full capitalize">
                    {user?.role || "customer"}
                  </span>
                  {memberSince && (
                    <span className="text-[11px] text-gray-400">
                      · Since {memberSince}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">
              Navigation
            </p>

            {MENU_ITEMS.map(({ icon: Icon, label, sub, path }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 pb-6 pt-3 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
