import { useState, useMemo } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useGetAllUsersQuery } from "../redux/api/userApi";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const navigate = useNavigate();
  const { data } = useGetAllUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Extract unique roles
  const roles = useMemo(() => {
    if (!data?.users) return ["all"];
    const uniqueRoles = [
      "all",
      ...new Set(data.users.map((user) => user.role)),
    ];
    return uniqueRoles.sort();
  }, [data?.users]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];

    return data.users.filter((user) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = filterRole === "all" || user.role === filterRole;

      // Status filter
      let matchesStatus = true;
      if (filterStatus === "active") matchesStatus = user.isActive;
      if (filterStatus === "inactive") matchesStatus = !user.isActive;
      if (filterStatus === "verified") matchesStatus = user.isVerified;
      if (filterStatus === "unverified") matchesStatus = !user.isVerified;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [data?.users, searchTerm, filterRole, filterStatus]);

  // Count statistics
  const stats = useMemo(() => {
    if (!data?.users) return {};
    return {
      total: data.users.length,
      active: data.users.filter((u) => u.isActive).length,
      verified: data.users.filter((u) => u.isVerified).length,
      inactive: data.users.filter((u) => !u.isActive).length,
    };
  }, [data?.users]);

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      customer: {
        bg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
      },
      admin: {
        bg: "bg-purple-50",
        badge: "bg-purple-100 text-purple-700",
        dot: "bg-purple-500",
      },
      freelancer: {
        bg: "bg-green-50",
        badge: "bg-green-100 text-green-700",
        dot: "bg-green-500",
      },
    };
    return colors[role] || colors.customer;
  };

  const getStatusColor = (isActive, isVerified) => {
    if (!isActive)
      return { bg: "bg-red-50", text: "text-red-700", label: "Inactive" };
    if (!isVerified)
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Unverified",
      };
    return { bg: "bg-green-50", text: "text-green-700", label: "Active" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all registered users on your platform
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 uppercase">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {stats.total || 0}
                </p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 uppercase">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.active || 0}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 uppercase">
                  Verified
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {stats.verified || 0}
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 uppercase">
                  Inactive
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.inactive || 0}
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Role Filter */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700 self-center">
                    Role:
                  </span>
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filterRole === role
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700 self-center">
                    Status:
                  </span>
                  {["all", "active", "inactive", "verified", "unverified"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          filterStatus === status
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredUsers.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => {
                const roleColor = getRoleColor(user.role);
                const statusColor = getStatusColor(
                  user.isActive,
                  user.isVerified,
                );

                return (
                  <div
                    key={user._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Card Header */}
                    <div
                      className={`h-24 ${roleColor.bg} border-b border-gray-200`}
                    ></div>

                    {/* Profile Section */}
                    <div className="relative px-6 pb-6">
                      {/* Avatar */}
                      <div className="flex flex-col items-center -mt-12 mb-4">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-20 h-20 rounded-full border-4 border-white object-cover bg-gray-200"
                          />
                        ) : (
                          <div
                            className={`w-20 h-20 rounded-full border-4 border-white ${roleColor.bg} flex items-center justify-center font-bold text-lg text-gray-700`}
                          >
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 break-all">
                          {user.email}
                        </p>
                      </div>

                      {/* Status & Role Badges */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${roleColor.badge}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${roleColor.dot}`}
                          ></span>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}
                        >
                          {user.isActive
                            ? user.isVerified
                              ? "✓ Verified"
                              : "⚠ Unverified"
                            : "✕ Inactive"}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {user.totalOrders || 0}
                          </p>
                          <p className="text-xs text-gray-600 font-medium">
                            Total Orders
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {user.favourites?.length || 0}
                          </p>
                          <p className="text-xs text-gray-600 font-medium">
                            Favourites
                          </p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 mb-4 text-xs text-gray-600">
                        <p>
                          <span className="font-medium">Joined:</span>{" "}
                          {formatDate(user.createdAt)}
                        </p>
                        <p>
                          <span className="font-medium">Updated:</span>{" "}
                          {formatDate(user.updatedAt)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate(`/user/${user._id}`)}
                          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          View Profile
                        </button>
                        {!user.isVerified && (
                          <button className="bg-purple-100 text-purple-700 font-semibold py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                            Verify
                          </button>
                        )}
                        {user.isActive && (
                          <button className="bg-red-100 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-200 transition-colors text-sm">
                            Block
                          </button>
                        )}
                        {!user.isActive && (
                          <button className="bg-green-100 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-200 transition-colors text-sm">
                            Unblock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Results Count */}
          {filteredUsers.length > 0 && (
            <div className="text-center mt-8 text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredUsers.length}</span> of{" "}
              <span className="font-semibold">{data?.count}</span> users
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
