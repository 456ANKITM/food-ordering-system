import {
  useDeleteFoodMutation,
  useGetAllFoodsQuery,
  useUpdateFoodMutation,
  useUpdateFoodImageMutation,
} from "../redux/api/foodApi";

import AdminNavbar from "../components/AdminNavbar";
import {
  Edit,
  Trash2,
  X,
  Upload,
  Loader2,
  Search,
  Plus,
  Filter,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllFoodsQuery();
  const [deleteFood, { isLoading: deleteLoading }] = useDeleteFoodMutation();
  const [updateFood, { isLoading: updateLoading }] = useUpdateFoodMutation();
  const [updateFoodImage, { isLoading: imageLoading }] =
    useUpdateFoodImageMutation();

  const foods = data?.foods || [];

  const [selectedFood, setSelectedFood] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Lock background scroll
  useEffect(() => {
    if (selectedFood) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFood]);

  // Get unique categories
  const categories = ["all", ...new Set(foods.map((f) => f.category))];

  // Filter foods based on search and filters
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || food.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && food.isAvailable) ||
      (statusFilter === "unavailable" && !food.isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: foods.length,
    available: foods.filter((f) => f.isAvailable).length,
    featured: foods.filter((f) => f.isFeatured).length,
    bestSellers: foods.filter((f) => f.isBestSeller).length,
  };

  const openEdit = (food) => {
    setSelectedFood(food);
    setForm({
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price,
      discount: food.discount || "",
      isAvailable: food.isAvailable,
      isFeatured: food.isFeatured,
      isBestSeller: food.isBestSeller,
    });
    setImage(null);
    setImagePreview(null);
  };

  const closeEdit = () => {
    setSelectedFood(null);
    setImage(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateFood({
        id: selectedFood._id,
        ...form,
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : null,
      }).unwrap();

      if (image) {
        const fd = new FormData();
        fd.append("foodImage", image);
        await updateFoodImage({
          id: selectedFood._id,
          formData: fd,
        }).unwrap();
      }

      setSuccessMsg("Food Updated Successfully");
      closeEdit();
    } catch (error) {
      setErrorMsg(error?.data?.message || "Failed to update food");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        let res = await deleteFood(id).unwrap();
        if (res.success) setSuccessMsg(res.message);
        else setErrorMsg(res.message);
      } catch (error) {
        setErrorMsg(error?.data?.message || "Failed to delete food");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-indigo-600 animate-spin" />
              <p className="text-gray-600">Loading food items...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {successMsg && (
        <SuccessToast message={successMsg} onClose={() => setSuccessMsg("")} />
      )}
      {errorMsg && (
        <ErrorToast message={errorMsg} onClose={() => setErrorMsg("")} />
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Food Menu</h1>
              <p className="text-indigo-100 mt-2">
                Manage your restaurant menu items
              </p>
            </div>
            <button
              onClick={() => navigate("/add-food")}
              className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
            >
              <Plus size={18} />
              Add Food
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: TrendingUp,
              label: "Total Items",
              value: stats.total,
              color: "blue",
            },
            {
              icon: CheckCircle2,
              label: "Available",
              value: stats.available,
              color: "green",
            },
            {
              icon: Star,
              label: "Featured",
              value: stats.featured,
              color: "yellow",
            },
            {
              icon: TrendingUp,
              label: "Best Sellers",
              value: stats.bestSellers,
              color: "purple",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-50 text-blue-600",
              green: "bg-green-50 text-green-600",
              yellow: "bg-yellow-50 text-yellow-600",
              purple: "bg-purple-50 text-purple-600",
            };

            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      colorClasses[stat.color]
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* SEARCH */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2  rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer bg-white"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-2xl p-12  shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              {foods.length === 0
                ? "No food items yet. Add your first item!"
                : "No items match your search or filters."}
            </p>
          </div>
        ) : (
          <>
            {/* RESULTS COUNT */}
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold">{filteredFoods.length}</span> of{" "}
              <span className="font-semibold">{foods.length}</span> items
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFoods.map((food) => {
                const discountedPrice = food.discount
                  ? Math.round(food.price - (food.price * food.discount) / 100)
                  : null;

                return (
                  <div
                    key={food._id}
                    className="bg-white rounded-2xl  shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* STATUS BADGES */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {!food.isAvailable && (
                          <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                            Unavailable
                          </span>
                        )}
                        {food.isFeatured && (
                          <span className="bg-yellow-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Star size={12} />
                            Featured
                          </span>
                        )}
                        {food.isBestSeller && (
                          <span className="bg-purple-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                            <TrendingUp size={12} />
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* DISCOUNT BADGE */}
                      {food.discount && (
                        <div className="absolute top-3 right-3 bg-orange-600 text-white px-2.5 py-1 rounded-lg font-bold text-sm">
                          -{food.discount}%
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-3">
                      {/* NAME & PRICE */}
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {food.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {food.category}
                        </p>
                      </div>

                      {/* PRICE */}
                      <div className="flex items-baseline gap-2">
                        {discountedPrice ? (
                          <>
                            <span className="text-lg font-bold text-indigo-600">
                              Rs {discountedPrice}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              Rs {food.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-indigo-600">
                            Rs {food.price}
                          </span>
                        )}
                      </div>

                      {/* DESCRIPTION */}
                      {food.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {food.description}
                        </p>
                      )}

                      {/* AVAILABILITY INDICATOR */}
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            food.isAvailable ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span
                          className={
                            food.isAvailable ? "text-green-600" : "text-red-600"
                          }
                        >
                          {food.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <button
                          onClick={() => openEdit(food)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(food._id)}
                          disabled={deleteLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                        >
                          {deleteLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              onClick={closeEdit}
              className="absolute right-4 top-4 z-10 text-gray-500 hover:text-red-500 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>

            {/* CONTENT */}
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Food Item
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update the food details below
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* BASIC INFO SECTION */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-600 rounded" />
                    Basic Information
                  </h3>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Food name"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  />

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* PRICING SECTION */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-green-600 rounded" />
                    Pricing
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (Rs)
                      </label>
                      <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount (%)
                      </label>
                      <input
                        name="discount"
                        type="number"
                        value={form.discount}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {form.discount && form.price && (
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <p className="text-gray-600">
                        Final Price:{" "}
                        <span className="font-bold text-blue-600">
                          Rs{" "}
                          {Math.round(
                            form.price - (form.price * form.discount) / 100,
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* IMAGE SECTION */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-orange-600 rounded" />
                    Image
                  </h3>

                  {imagePreview && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* ATTRIBUTES SECTION */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-600 rounded" />
                    Attributes
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={form.isAvailable}
                        onChange={handleChange}
                        className="w-5 h-5 rounded cursor-pointer accent-indigo-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Available</p>
                        <p className="text-xs text-gray-500">
                          Make this item available for order
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-yellow-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="w-5 h-5 rounded cursor-pointer accent-yellow-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Featured</p>
                        <p className="text-xs text-gray-500">
                          Display on featured section
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isBestSeller"
                        checked={form.isBestSeller}
                        onChange={handleChange}
                        className="w-5 h-5 rounded cursor-pointer accent-purple-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Best Seller</p>
                        <p className="text-xs text-gray-500">
                          Mark as popular/best selling item
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="flex-1 px-4 py-3 border rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updateLoading || imageLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateLoading || imageLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Update Food
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
