import { useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from "../redux/api/orderApi";
import { useRetryStripeIntentMutation } from "../redux/api/paymentApi";

import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const STATUS_CONFIG = {
  pending: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: "⏳",
    iconBg: "bg-amber-50",
    label: "Pending",
  },
  confirmed: {
    pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    icon: "✓",
    iconBg: "bg-blue-50",
    label: "Confirmed",
  },
  delivered: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: "📦",
    iconBg: "bg-emerald-50",
    label: "Delivered",
  },
  cancelled: {
    pill: "bg-red-50 text-red-600 ring-1 ring-red-200",
    icon: "✕",
    iconBg: "bg-red-50",
    label: "Cancelled",
  },
};

const FILTERS = ["all", "pending", "confirmed", "delivered", "cancelled"];

const StripeCheckout = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    onSuccess();
  };

  return (
    <div className="mt-2">
      <PaymentElement />
      {error && (
        <p className="text-red-500 text-sm mt-3 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full mt-5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm tracking-wide transition-colors"
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>
    </div>
  );
};

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

const OrderCard = ({ order, onPayNow, onCancel, isCancelling }) => {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  const showPay =
    order.orderStatus === "pending" &&
    order.payment.method === "STRIPE" &&
    order.payment.status === "pending";
  const showCancel =
    order.orderStatus !== "delivered" &&
    order.orderStatus !== "cancelled" &&
    order.payment.status !== "paid";

  return (
    <div
      onClick={() => navigate(`/order/${order._id}`)}
      className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start gap-4 px-5 pt-5 pb-4">
        {/* Status icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 ${cfg.iconBg}`}
        >
          {cfg.icon}
        </div>

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {order.orderNumber}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            ·{" "}
            {new Date(order.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Status + amount */}
        <div className="text-right shrink-0">
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}
          >
            {cfg.label}
          </span>
          <p className="text-base font-semibold text-gray-900 mt-1.5">
            NPR {order.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-50 mx-5" />

      {/* Address + method */}
      <div className="flex items-center gap-2 px-5 py-3">
        <svg
          className="w-3.5 h-3.5 text-gray-300 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-xs text-gray-400 flex-1 truncate">
          {order.deliveryAddress.fullName} · {order.deliveryAddress.phone}
        </p>
        <span className="text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-md">
          {order.payment.method}
        </span>
      </div>

      {/* Items + actions */}
      <div className="flex items-center justify-between gap-3 px-5 pb-4">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {order.items.map((item, i) => (
            <span
              key={i}
              className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full"
            >
              {item.name} × {item.quantity}
            </span>
          ))}
        </div>

        {(showPay || showCancel) && (
          <div
            className="flex gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {showPay && (
              <button
                onClick={() => onPayNow(order._id)}
                className="text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl transition-colors"
              >
                Pay now
              </button>
            )}
            {showCancel && (
              <button
                disabled={isCancelling}
                onClick={() => onCancel(order._id)}
                className="text-xs font-semibold text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling…" : "Cancel"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ filter }) => (
  <div className="text-center py-20">
    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
      🛍️
    </div>
    <p className="text-gray-900 font-medium mb-1">No orders found</p>
    <p className="text-sm text-gray-400">
      {filter === "all"
        ? "You haven't placed any orders yet."
        : `No ${filter} orders at the moment.`}
    </p>
  </div>
);

const AllOrders = () => {
  const { data, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [retryStripeIntent] = useRetryStripeIntentMutation();

  const [clientSecret, setClientSecret] = useState("");
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const orders = data?.orders || [];

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === activeFilter);

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const countByStatus = (s) => orders.filter((o) => o.orderStatus === s).length;

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId).unwrap();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const handlePayNow = async (orderId) => {
    try {
      const res = await retryStripeIntent(orderId).unwrap();
      setClientSecret(res.clientSecret);
      setShowStripeModal(true);
    } catch (err) {
      console.error("Stripe retry failed:", err);
    }
  };

  const closeModal = () => {
    setShowStripeModal(false);
    setClientSecret("");
  };

  const handleSuccess = async () => {
    closeModal();
    setTimeout(() => refetch(), 2000);
  };

  return (
    <>
      <PublicNavbar />

      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
            {!isLoading && orders.length > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                {orders.length} orders · NPR {totalSpent.toLocaleString()} total
                spent
              </p>
            )}
          </div>

          {isLoading && <Loader />}
          {error && <ErrorState />}

          {!isLoading && !error && orders.length > 0 && (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <StatCard label="Total" value={orders.length} />
                <StatCard
                  label="Confirmed"
                  value={countByStatus("confirmed")}
                />
                <StatCard
                  label="Delivered"
                  value={countByStatus("delivered")}
                />
                <StatCard
                  label="Total spent"
                  value={`${(totalSpent / 1000).toFixed(1)}k`}
                  sub="NPR"
                />
              </div>

              {/* Filter chips */}
              <div className="flex gap-2 flex-wrap mb-6">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-xs font-medium px-4 py-2 rounded-full border transition-all capitalize ${
                      activeFilter === f
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {f === "all" ? "All orders" : f}
                    {f !== "all" && countByStatus(f) > 0 && (
                      <span
                        className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                          activeFilter === f
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {countByStatus(f)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Orders list */}
              {filteredOrders.length === 0 ? (
                <EmptyState filter={activeFilter} />
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onPayNow={handlePayNow}
                      onCancel={handleCancelOrder}
                      isCancelling={isCancelling}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <EmptyState filter="all" />
          )}
        </div>
      </div>

      <Footer />

      {/* Stripe payment modal */}
      {showStripeModal && clientSecret && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Complete payment
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Secured by Stripe
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeCheckout onSuccess={handleSuccess} />
            </Elements>
          </div>
        </div>
      )}
    </>
  );
};

export default AllOrders;
