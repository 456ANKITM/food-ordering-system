import { useNavigate } from "react-router-dom";
import { useGetTodayOrdersQuery } from "../redux/api/orderApi";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import {
  ChevronRight,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

const statusColors = {
  pending: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    icon: "text-yellow-600",
  },
  confirmed: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: "text-blue-600",
  },
  preparing: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    icon: "text-orange-600",
  },
  outForDelivery: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    icon: "text-purple-600",
  },
  delivered: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    icon: "text-green-600",
  },
  cancelled: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: "text-red-600",
  },
};

const statusPriority = {
  pending: 1,
  confirmed: 2,
  preparing: 3,
  outForDelivery: 4,
  delivered: 5,
  cancelled: 0,
};

const OrdersList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { data, isLoading } = useGetTodayOrdersQuery(undefined, {
    pollingInterval: 5000,
    skip: !isAuthenticated,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const orders = data?.orders || [];


  // Calculate statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pending = orders.filter((o) => o.orderStatus === "pending").length;
    const completed = orders.filter((o) => o.orderStatus === "delivered").length;
    const avgOrderValue = total > 0 ? Math.round(totalRevenue / total) : 0;

    return { total, totalRevenue, pending, completed, avgOrderValue };
  }, [orders]);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || order.orderStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "amount-high") {
      filtered.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    } else if (sortBy === "amount-low") {
      filtered.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
    } else if (sortBy === "status") {
      filtered.sort(
        (a, b) =>
          (statusPriority[a.orderStatus] || 0) -
          (statusPriority[b.orderStatus] || 0)
      );
    }

    return filtered;
  }, [orders, searchTerm, selectedStatus, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading today's orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Today's Orders</h1>
          <p className="text-gray-600">Manage and track all orders in real-time</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  Rs {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Order #, customer name, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="outForDelivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              >
                <option value="recent">Most Recent</option>
                <option value="status">By Status</option>
                <option value="amount-high">Highest Amount</option>
                <option value="amount-low">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Search className="text-gray-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {orders.length === 0
                ? "No orders placed yet today"
                : "No orders match your search criteria"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const colors = statusColors[order.orderStatus] || statusColors.pending;

              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className={`bg-white border-2 rounded-xl transition-all cursor-pointer hover:shadow-lg ${colors.border} ${colors.bg}`}
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-start justify-between flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()} at{" "}
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${colors.badge}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1).replace(/([A-Z])/g, " $1")}
                        </span>
                        <ChevronRight className="text-gray-400 hidden md:block" />
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Customer Info */}
                      <div className="">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Customer
                        </p>
                        <p className="font-semibold text-gray-900 mb-2">
                          {order.userId?.name}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                          <Phone size={14} />
                          {order.deliveryAddress?.phone || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail size={14} /> {order.userId?.email}
                        </p>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Delivery Address
                        </p>
                        <p className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                          <MapPin size={16} className="text-orange-600 shrink-0" />
                          {order.deliveryAddress?.city}
                        </p>
                        <p className="text-sm text-gray-600 ml-6 line-clamp-2">
                          {order.deliveryAddress?.street}
                        </p>
                        <p className="text-sm text-gray-500 ml-6">
                          {order.deliveryAddress?.postalCode}
                        </p>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Payment Details
                        </p>
                        <p className="font-semibold text-gray-900 mb-1">
                          {order.payment?.method || "N/A"}
                        </p>
                        <p className={`text-sm font-medium ${
                          order.payment?.status === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}>
                          {order.payment?.status || "Pending"}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Amount: Rs {order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Items</p>
                          <p className="text-lg font-bold text-gray-900">
                            {order.items?.length || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">
                            Rs {order.subTotal || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Delivery</p>
                          <p className="text-lg font-bold text-gray-900">
                            Rs {order.deliveryFee || 0}
                          </p>
                        </div>
                      </div>

                      <div className="bg-linear-to-r from-orange-50 to-orange-100 rounded-lg px-4 py-3 text-right">
                        <p className="text-xs text-gray-600 uppercase font-semibold">Total Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                          Rs {order.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Counter */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{orders.length}</span> orders
        </div>
      </div>
    </div>
  );
};

export default OrdersList;

