import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { useGetUserByIdQuery } from "../redux/api/userApi";

const UserDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetUserByIdQuery(id);

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading user details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !data?.user) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              User not found
            </h3>
            <p className="text-gray-600">
              Unable to load user details. Please try again.
            </p>
          </div>
        </div>
      </>
    );
  }

  const user = data.user;
  const orders = data.orders || [];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      customer: { bg: "bg-blue-100", text: "text-blue-800" },
      admin: { bg: "bg-purple-100", text: "text-purple-800" },
      freelancer: { bg: "bg-green-100", text: "text-green-800" },
    };
    return colors[role] || colors.customer;
  };

  const getStatusConfig = (orderStatus) => {
    const configs = {
      pending: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-800",
        dot: "bg-yellow-500",
      },
      processing: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-800",
        dot: "bg-blue-500",
      },
      delivered: {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-800",
        dot: "bg-green-500",
      },
      cancelled: {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
        dot: "bg-red-500",
      },
    };
    return configs[orderStatus] || configs.pending;
  };

  const roleColor = getRoleColor(user.role);
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue =
    orders.length > 0 ? (totalSpent / orders.length).toFixed(0) : 0;

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white">
        {/* User Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Card */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Avatar Section */}
                <div className="flex flex-col items-center md:items-start">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-4xl">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>

                {/* User Info Section */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">{user.email}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${roleColor.bg} ${roleColor.text}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "✓ Active" : "✕ Inactive"}
                      </span>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${
                          user.isVerified
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isVerified ? "✓ Verified" : "⚠ Unverified"}
                      </span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {orders.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-indigo-600 mt-1">
                        Rs. {totalSpent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase">
                        Avg Order
                      </p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        Rs. {averageOrderValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-blue-200">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Favourites
                  </p>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {user.favourites?.length || 0} items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order History
            </h2>
            <p className="text-gray-600">
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600">
                This user hasn't placed any orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.orderStatus);
                return (
                  <div
                    key={order._id}
                    className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-md ${statusConfig.bg} ${statusConfig.border} bg-white`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.badge}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                            ></span>
                            {order.orderStatus.charAt(0).toUpperCase() +
                              order.orderStatus.slice(1)}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              <span className="font-semibold">Items:</span>{" "}
                              {order.items?.length || 0}
                            </p>
                            <p className="text-gray-600 mt-1">
                              <span className="font-semibold">Delivery:</span>{" "}
                              {order.deliveryAddress?.city},{" "}
                              {order.deliveryAddress?.street}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <span className="font-semibold">Order Date:</span>{" "}
                              {formatDate(order.createdAt)}
                            </p>
                            <p className="text-gray-600 mt-1">
                              <span className="font-semibold">Payment:</span>{" "}
                              <span
                                className={`font-semibold ${
                                  order.payment?.status === "paid"
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {order.payment?.status === "paid"
                                  ? "✓ Paid"
                                  : "Pending"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="md:text-right md:pl-6 md:border-l border-gray-300">
                        <p className="text-2xl font-bold text-gray-900">
                          Rs. {order.totalAmount}
                        </p>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Subtotal: Rs. {order.subTotal}</p>
                          <p>Tax: Rs. {order.tax}</p>
                          <p>Delivery: Rs. {order.deliveryFee}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          Items Ordered
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {item.productName || item.name || "Product"} x
                              {item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
