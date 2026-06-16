import { ErrorState } from "../components/ErrorState";
import Footer from "../components/Footer";
import { Loader } from "../components/Loader";
import PublicNavbar from "../components/PublicNavbar";
import { useGetProfileQuery } from "../redux/api/userApi";

const STATUS_CONFIG = {
  delivered: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    label: "Delivered",
  },
  cancelled: {
    pill: "bg-red-50 text-red-600 ring-1 ring-red-200",
    label: "Cancelled",
  },
  confirmed: {
    pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    label: "Confirmed",
  },
  pending: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    label: "Pending",
  },
};

const getStatusCfg = (s) => STATUS_CONFIG[s] || STATUS_CONFIG.pending;

const StatCard = ({ label, value, accent }) => (
  <div
    className={`rounded-2xl p-5 border ${accent ? "bg-gray-900 border-gray-900" : "bg-white border-gray-100"}`}
  >
    <p
      className={`text-xs uppercase tracking-widest mb-1 ${accent ? "text-gray-400" : "text-gray-400"}`}
    >
      {label}
    </p>
    <p
      className={`text-3xl font-semibold ${accent ? "text-white" : "text-gray-900"}`}
    >
      {value}
    </p>
  </div>
);

const Profile = () => {
  const { data, isLoading, error } = useGetProfileQuery();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState />;

  const user = data?.user;
  const orders = data?.recentOrders || [];
  const totalOrders = data?.totalOrders || 0;

  const avatar =
    user?.profileImage ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <PublicNavbar />

      <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
          {/* ── Profile header ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-gray-100"
                />
                {user?.isActive && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900 truncate">
                    {user?.name}
                  </h1>
                  <span className="inline-block text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-full capitalize self-center">
                    {user?.role}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
                {memberSince && (
                  <p className="text-xs text-gray-400 mt-2">
                    Member since {memberSince}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${user?.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {user?.isVerified ? "✓ Verified" : "Unverified"}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total orders" value={totalOrders} accent />
            <StatCard label="Recent" value={orders.length} />
            <StatCard
              label="Favourites"
              value={user?.favourites?.length ?? 0}
            />
          </div>

          {/* ── Recent orders ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                Recent orders
              </h2>
              <span className="text-xs text-gray-400">
                {orders.length} of {totalOrders}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-14">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                  🛍️
                </div>
                <p className="text-sm font-medium text-gray-700">
                  No orders yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Your recent orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const cfg = getStatusCfg(order.orderStatus);
                  return (
                    <div
                      key={order._id}
                      className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
                    >
                      {/* Order header */}
                      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}{" "}
                            ·{" "}
                            {new Date(order.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}
                          >
                            {cfg.label}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 mt-1.5">
                            NPR {order.totalAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gray-50 mx-4" />

                      {/* Items */}
                      <div className="px-4 py-3 space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover bg-gray-50 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Qty {item.quantity} · NPR{" "}
                                {item.price?.toLocaleString()} each
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 shrink-0">
                              NPR {item.totalPrice?.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gray-50 mx-4" />

                      {/* Order summary */}
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                          <div>
                            <p className="text-gray-400 mb-0.5">Subtotal</p>
                            <p className="font-medium text-gray-700">
                              NPR {order.subTotal?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-0.5">Delivery</p>
                            <p className="font-medium text-gray-700">
                              NPR {order.deliveryFee?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-0.5">Tax</p>
                            <p className="font-medium text-gray-700">
                              NPR {order.tax?.toLocaleString()}
                            </p>
                          </div>
                          {order.discount > 0 && (
                            <div>
                              <p className="text-gray-400 mb-0.5">Discount</p>
                              <p className="font-medium text-emerald-600">
                                -NPR {order.discount?.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Payment + total row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium">
                              {order.payment?.method}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                                order.payment?.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {order.payment?.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-base font-semibold text-gray-900">
                              NPR {order.totalAmount?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
