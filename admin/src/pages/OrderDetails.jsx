import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../redux/api/orderApi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { useState } from "react";
import {
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Package,
  AlertCircle,
  CheckCircle2,
  Truck,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";

const markerIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* STATUS CONFIGURATION */
const statusConfig = {
  pending: {
    color: "yellow",
    bgClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
    label: "Pending",
    step: 0,
  },
  confirmed: {
    color: "blue",
    bgClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
    label: "Confirmed",
    step: 1,
  },
  preparing: {
    color: "orange",
    bgClass: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Zap,
    label: "Preparing",
    step: 2,
  },
  ready: {
    color: "indigo",
    bgClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Package,
    label: "Ready",
    step: 3,
  },
  out_for_delivery: {
    color: "purple",
    bgClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Truck,
    label: "Out for Delivery",
    step: 4,
  },
  delivered: {
    color: "green",
    bgClass: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
    label: "Delivered",
    step: 5,
  },
  cancelled: {
    color: "red",
    bgClass: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
    label: "Cancelled",
    step: 6,
  },
};

const steps = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "Delivery" },
  { key: "delivered", label: "Delivered" },
];

/* STATUS TIMELINE COMPONENT */
const StatusTimeline = ({ currentStatus }) => {
  const currentStep = statusConfig[currentStatus]?.step || 0;

  return (
    <div className="bg-white rounded-2xl p-6  shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-6">Order Progress</h3>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = statusConfig[step.key].step <= currentStep;
          const isCurrent = step.key === currentStatus;
          const StepIcon = statusConfig[step.key].icon;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* STEP CIRCLE */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-all ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-lg scale-110"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <StepIcon size={18} />
                )}
              </div>

              {/* LABEL */}
              <p
                className={`text-xs font-medium text-center whitespace-nowrap ${
                  isCurrent
                    ? "text-indigo-600"
                    : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </p>

              {/* CONNECTOR LINE */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute h-1 w-full mt-5 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                  style={{
                    left: "calc(50% + 20px)",
                    top: "20px",
                    width: "calc(100% - 40px)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ORDER STATS COMPONENT */
const OrderStats = ({ order }) => {
  const stats = [
    {
      icon: Package,
      label: "Items",
      value: order.items?.length || 0,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Total",
      value: `Rs ${order.totalAmount}`,
      color: "green",
    },
    {
      icon: Calendar,
      label: "Order ID",
      value: `#${order.orderNumber}`,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: "bg-blue-50 text-blue-600",
          green: "bg-green-50 text-green-600",
          purple: "bg-purple-50 text-purple-600",
        };

        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-gray-200 text-center"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                colorClasses[stat.color]
              }`}
            >
              <Icon size={18} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const [loadingStatus, setLoadingStatus] = useState(false);

  const { data, isLoading, isError, refetch } =
    useGetAdminOrderByIdQuery(orderId);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const order = data?.order;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const handleStatusChange = async (newStatus) => {
    try {
      setLoadingStatus(true);
      await updateOrderStatus({
        orderId,
        orderStatus: newStatus,
      }).unwrap();
      await refetch();
    } finally {
      setLoadingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <AdminNavbar />
        <div className="p-6">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-gray-600 mt-3">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div>
        <AdminNavbar />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-medium">
              Order not found. Please check the order ID.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const position = [
    order.deliveryAddress?.latitude || 27.7,
    order.deliveryAddress?.longitude || 85.3,
  ];

  const StatusConfig = statusConfig[order.orderStatus];
  const StatusIcon = StatusConfig?.icon || Clock;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER WITH STATUS */}
        <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-indigo-100 mt-2">Order #{order.orderNumber}</p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl bg-white/20 backdrop-blur ${
                  statusConfig[order.orderStatus]?.bgClass
                }`}
              >
                <StatusIcon size={24} />
              </div>
              <div>
                <p className="text-indigo-100 text-sm">Current Status</p>
                <p className="text-lg font-bold capitalize">
                  {order.orderStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <OrderStats order={order} />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* TIMELINE */}
            <StatusTimeline currentStatus={order.orderStatus} />

            {/* CUSTOMER & STATUS UPDATE */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* CUSTOMER CARD */}
              <div className="bg-white rounded-2xl p-6  shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Customer Info</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {order.userId?.name}
                    </p>
                  </div>

                  <div className="pt-2 ">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                      <Mail size={12} />
                      Email
                    </p>
                    <p className="text-sm text-gray-700 break-all">
                      {order.userId?.email}
                    </p>
                  </div>

                  <div className="pt-2 ">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                      <Phone size={12} />
                      Phone
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.deliveryAddress?.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS UPDATE CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock size={18} className="text-purple-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Update Status</h2>
                </div>

                <div className="space-y-3">
                  <select
                    value={order.orderStatus}
                    disabled={
                      order.orderStatus === "delivered" ||
                      order.orderStatus === "cancelled" ||
                      loadingStatus
                    }
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`w-full px-4 py-3  rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 outline-none transition-all ${
                      loadingStatus
                        ? "opacity-50 cursor-not-allowed bg-gray-50"
                        : "bg-white cursor-pointer hover:border-indigo-300"
                    }`}
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ").toUpperCase()}
                      </option>
                    ))}
                  </select>

                  {loadingStatus && (
                    <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                      Updating status...
                    </div>
                  )}

                  {order.orderStatus === "delivered" && (
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                      <CheckCircle2 size={14} />
                      Order completed
                    </div>
                  )}

                  {order.orderStatus === "cancelled" && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                      <AlertCircle size={14} />
                      Order cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ITEMS SECTION */}
            <div className="bg-white rounded-2xl p-6  shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Package size={18} className="text-orange-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Items Ordered</h2>
                <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                  {order.items?.length} item
                  {order.items?.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-linear-to-r from-gray-50 to-transparent p-4 rounded-xl  border-gray-100 hover:border-gray-200 transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="font-bold text-indigo-600 text-lg">
                        Rs {item.totalPrice}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          Rs {Math.round(item.totalPrice / item.quantity)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="bg-white rounded-2xl p-6  shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CreditCard size={18} className="text-green-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Payment Details</h2>
              </div>

              <div className="space-y-4">
                {/* PAYMENT METHOD & STATUS ROW */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Method
                    </p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {order.payment?.method}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      {order.payment?.status === "paid" ? (
                        <>
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="font-semibold text-green-600">
                            Paid
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} className="text-yellow-600" />
                          <span className="font-semibold text-yellow-600">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    Rs {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* MAP */}
            <div className="bg-white rounded-2xl  shadow-sm overflow-hidden">
              <div className="p-4 ">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <MapPin size={16} className="text-red-600" />
                  </div>
                  Delivery Location
                </h2>
              </div>

              <div className="h-72 w-full">
                <MapContainer
                  center={position}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Marker position={position} icon={markerIcon}>
                    <Popup className="font-medium">
                      {order.deliveryAddress?.fullName}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* ADDRESS CARD */}
            <div className="bg-white rounded-2xl  shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <MapPin size={16} className="text-indigo-600" />
                </div>
                Delivery Address
              </h2>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Full Name
                  </p>
                  <p className="font-semibold text-gray-900">
                    {order.deliveryAddress?.fullName}
                  </p>
                </div>

                <div className="pt-2 ">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Street
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.deliveryAddress?.street}
                  </p>
                </div>

                <div className="pt-2 ">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    City
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.deliveryAddress?.city}
                  </p>
                </div>

                <div className="pt-2 ">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                    <Phone size={12} />
                    Phone
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.deliveryAddress?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
