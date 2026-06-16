import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useGetPaidOrdersQuery } from "../redux/api/adminApi";

const AllPayments = () => {
  const { data, refetch, isLoading } = useGetPaidOrdersQuery();
  const [pollingActive, setPollingActive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Set up polling - refetch every 5 seconds
  useEffect(() => {
    if (!pollingActive) return;

    const pollingInterval = setInterval(() => {
      refetch();
      setLastUpdated(new Date());
    }, 5000); // 5 seconds

    // Cleanup interval on unmount or when polling is stopped
    return () => clearInterval(pollingInterval);
  }, [refetch, pollingActive]);

  const payments = data?.payments || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTotalAmount = (totals) => {
    return totals?.totalAmount || 0;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      STRIPE: "💳",
      KHALTI: "🇳🇵",
      ESEWA: "🏦",
      CASH: "💵",
    };
    return icons[method] || "💳";
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Payment Slips
                </h1>
                <p className="text-gray-600 mt-2">
                  Track all received payments in real-time
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Total Payments
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {payments.length}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Total Received
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    Rs.{" "}
                    {payments
                      .reduce((sum, p) => sum + getTotalAmount(p.totals), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 col-span-2 md:col-span-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    Last Updated
                  </p>
                  <p className="text-lg font-bold text-purple-600 mt-1">
                    {formatTime(lastUpdated)}
                  </p>
                </div>
              </div>
            </div>

            {/* Polling Status */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-blue-700">
                  Live polling enabled • Updates every 5 seconds
                </p>
              </div>
              <button
                onClick={() => setPollingActive(!pollingActive)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  pollingActive
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {pollingActive ? "Stop Polling" : "Start Polling"}
              </button>
            </div>
          </div>
        </div>

        {/* Payments Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading && payments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading payment slips...
              </p>
            </div>
          ) : payments.length === 0 ? (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No payments yet
              </h3>
              <p className="text-gray-600">
                Payment slips will appear here as orders are paid
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {payments.map((payment, index) => {
                const amount = getTotalAmount(payment.totals);
                const customer = payment.customer;
                const paymentMethod = getPaymentMethodIcon(
                  payment.payment?.method,
                );

                return (
                  <div
                    key={payment.orderId}
                    className="group relative bg-white rounded-2xl border-2 border-green-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-green-400"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-green-50 via-white to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative p-6">
                      {/* Header with amount and badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Payment Received
                          </p>
                          <p className="text-4xl font-bold text-green-600 mt-2">
                            Rs. {amount.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-4xl">{paymentMethod}</span>
                      </div>

                      {/* Payment message */}
                      <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          <span className="font-bold text-green-700">
                            Rs. {amount.toLocaleString()}
                          </span>{" "}
                          received for the payment of order{" "}
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {payment.orderNumber}
                          </span>{" "}
                          by{" "}
                          <span className="font-bold text-indigo-600">
                            {customer?.name}
                          </span>
                          .
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="border-b border-gray-200 my-4"></div>

                      {/* Order & Customer Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-600">
                            Order Items
                          </span>
                          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {payment.items?.length || 0}
                          </span>
                        </div>

                        {payment.items && payment.items.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {payment.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                              >
                                {item.foodName} x{item.quantity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          Customer
                        </p>
                        <p className="font-bold text-gray-900 text-sm">
                          {customer?.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 break-all">
                          {customer?.email}
                        </p>
                      </div>

                      {/* Payment Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Method
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {payment.payment?.method || "N/A"}
                          </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Status
                          </p>
                          <p className="text-sm font-bold text-green-600 mt-1">
                            ✓ {payment.payment?.status?.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Amount Breakdown */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            Rs. {payment.totals?.subTotal}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Tax:</span>
                          <span className="font-semibold text-gray-900">
                            Rs. {payment.totals?.tax}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Delivery:</span>
                          <span className="font-semibold text-gray-900">
                            Rs. {payment.totals?.deliveryFee}
                          </span>
                        </div>
                        {payment.totals?.discount > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Discount:</span>
                            <span className="font-semibold text-red-600">
                              -Rs. {payment.totals?.discount}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-blue-300 pt-2 mt-2 flex justify-between">
                          <span className="font-bold text-gray-900">
                            Total:
                          </span>
                          <span className="font-bold text-blue-600">
                            Rs. {payment.totals?.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <div className="text-xs">
                            <p className="text-gray-600 font-semibold">
                              Order Date
                            </p>
                            <p className="text-gray-900 font-medium mt-1">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                          {payment.payment?.paidAt && (
                            <div className="text-xs text-right">
                              <p className="text-gray-600 font-semibold">
                                Payment Date
                              </p>
                              <p className="text-gray-900 font-medium mt-1">
                                {formatDate(payment.payment.paidAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Slip ID / Receipt */}
                      {payment.payment?.stripePaymentId && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                            Payment ID
                          </p>
                          <p className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded break-all">
                            {payment.payment.stripePaymentId}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Index Badge */}
                    <div className="absolute top-0 right-0 bg-green-600 text-white font-bold px-3 py-1 rounded-bl-lg text-sm">
                      #{index + 1}
                    </div>

                    {/* Status Indicator */}
                    {payment.orderStatus === "delivered" && (
                      <div className="absolute bottom-0 right-0 bg-linear-to-l from-green-600 to-emerald-500 text-white px-4 py-2 rounded-tl-lg text-xs font-semibold">
                        ✓ Delivered
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

export default AllPayments;
