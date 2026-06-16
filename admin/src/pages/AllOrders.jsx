import { useState, useMemo } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useGetAllOrdersQuery } from "../redux/api/orderApi";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const navigate = useNavigate();
  const { data } = useGetAllOrdersQuery();
  const [activeStatus, setActiveStatus] = useState("all");

  // Extract unique statuses and prepare status-based display
  const statuses = useMemo(() => {
    if (!data?.orders) return [];
    const uniqueStatuses = [
      ...new Set(data.orders.map((order) => order.orderStatus)),
    ];
    return ["all", ...uniqueStatuses.sort()];
  }, [data?.orders]);

  // Filter orders by selected status
  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    if (activeStatus === "all") return data.orders;
    return data.orders.filter((order) => order.orderStatus === activeStatus);
  }, [data?.orders, activeStatus]);

  // Status counts
  const statusCounts = useMemo(() => {
    if (!data?.orders) return {};
    const counts = { all: data.orders.length };
    data.orders.forEach((order) => {
      counts[order.orderStatus] = (counts[order.orderStatus] || 0) + 1;
    });
    return counts;
  }, [data?.orders]);

  // Get status color and icon
  const getStatusConfig = (status) => {
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
    return configs[status] || configs.pending;
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

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage all customer orders in one place
              </p>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeStatus === status
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="capitalize">{status}</span>
                  <span className="ml-2 font-semibold">
                    ({statusCounts[status] || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
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
                No orders found
              </h3>
              <p className="text-gray-600">
                There are no {activeStatus === "all" ? "" : activeStatus} orders
                yet
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.orderStatus);
                return (
                  <div
                    key={order._id}
                    className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${statusConfig.bg} ${statusConfig.border} bg-white`}
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
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
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          Rs. {order.totalAmount}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.payment?.status === "paid"
                            ? "Payment Confirmed"
                            : "Payment Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
                      {/* Customer Info */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          Delivery To
                        </p>
                        <p className="font-semibold text-gray-900">
                          {order.deliveryAddress?.fullName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.deliveryAddress?.phone}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {order.deliveryAddress?.street},
                          {order.deliveryAddress?.city}
                        </p>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          Order Summary
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">Items:</span>{" "}
                            <span className="text-gray-900 font-semibold">
                              {order.items?.length || 0}
                            </span>
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Subtotal:</span>{" "}
                            <span className="text-gray-900">
                              Rs. {order.subTotal}
                            </span>
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Tax:</span>{" "}
                            <span className="text-gray-900">
                              Rs. {order.tax}
                            </span>
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Delivery:</span>{" "}
                            <span className="text-gray-900">
                              Rs. {order.deliveryFee}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          Payment Details
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          <span className="font-medium">Method:</span>{" "}
                          <span className="inline-block mt-1 px-2 py-1 bg-gray-100 rounded text-gray-900 text-xs font-semibold">
                            {order.payment?.method || "N/A"}
                          </span>
                        </p>
                        {order.payment?.stripePaymentId && (
                          <p className="text-xs text-gray-600 break-all font-mono bg-gray-50 p-2 rounded">
                            {order.payment.stripePaymentId}
                          </p>
                        )}
                        {order.payment?.paidAt && (
                          <p className="text-xs text-gray-600 mt-2">
                            Paid: {formatDate(order.payment.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Order Items
                      </p>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {item.productName || item.name || "Product"}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900 text-sm ml-4">
                              Rs. {(item.price * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
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

export default AllOrders;
