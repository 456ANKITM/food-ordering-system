import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useAddFoodMutation } from "../redux/api/foodApi";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
  TrendingUp,
  DollarSign,
  Image as ImageIcon,
  X,
} from "lucide-react";

const AddFood = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [addFood, { isLoading }] = useAddFoodMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    isFeatured: false,
    isBestSeller: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Food name is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!image) newErrors.image = "Food image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("discount", form.discount || 0);
      formData.append("isFeatured", form.isFeatured);
      formData.append("isBestSeller", form.isBestSeller);

      if (image) {
        formData.append("foodImage", image);
      }

      let res = await addFood(formData).unwrap();

      if (res.success) {
        setSuccessMsg(res.message);
        setForm({
          name: "",
          description: "",
          category: "",
          price: "",
          discount: "",
          isFeatured: false,
          isBestSeller: false,
        });
        setImage(null);
        setImagePreview(null);
        setTimeout(() => navigate("/menu"), 1500);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || "Failed to add the food");
    }
  };

  const finalPrice =
    form.price && form.discount
      ? Math.round(
          Number(form.price) -
            (Number(form.price) * Number(form.discount)) / 100,
        )
      : Number(form.price);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {successMsg && (
        <SuccessToast message={successMsg} onClose={() => setSuccessMsg("")} />
      )}

      {errorMsg && (
        <ErrorToast message={errorMsg} onClose={() => setErrorMsg("")} />
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* BREADCRUMB & BACK */}
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Menu
        </button>

        {/* HEADER */}
        <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Add New Food Item</h1>
          <p className="text-indigo-100 mt-2">
            Create a new dish for your restaurant menu
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFORMATION SECTION */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-6 bg-indigo-600 rounded" />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Margherita Pizza"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your dish... (optional)"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {form.description.length}/200 characters
                </p>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Pizza, Burger, Dessert"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                    errors.category
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* PRICING SECTION */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-6 bg-green-600 rounded" />
              Pricing & Discount
            </h2>

            <div className="space-y-4">
              {/* PRICE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (Rs) *
                </label>
                <div className="relative">
                  <DollarSign
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={form.price}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                      errors.price
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* DISCOUNT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount (%) - Optional
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-3 text-gray-400 font-semibold">
                    %
                  </span>
                  <input
                    type="number"
                    name="discount"
                    placeholder="0"
                    value={form.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* PRICE PREVIEW */}
              {form.price && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-semibold text-gray-900">
                      Rs {form.price}
                    </span>
                  </div>
                  {form.discount && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-semibold text-red-600">
                          -{form.discount}%
                        </span>
                      </div>
                      <div className="border-t border-indigo-200 pt-2 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Final Price:
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          Rs {finalPrice}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-6 bg-orange-600 rounded" />
              Food Image
            </h2>

            <div className="space-y-4">
              {/* IMAGE PREVIEW */}
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-100 h-64">
                  <img
                    src={imagePreview}
                    alt="Food Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : null}

              {/* FILE INPUT */}
              <label
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  errors.image
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Upload size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Click to upload image
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>

              {errors.image && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* ATTRIBUTES SECTION */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-6 bg-purple-600 rounded" />
              Item Attributes
            </h2>

            <div className="space-y-3">
              {/* FEATURED CHECKBOX */}
              <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded cursor-pointer accent-yellow-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-700">
                    Featured Item
                  </p>
                  <p className="text-sm text-gray-500">
                    Display this item in the featured section
                  </p>
                </div>
                <Star size={20} className="text-yellow-500" />
              </label>

              {/* BEST SELLER CHECKBOX */}
              <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={form.isBestSeller}
                  onChange={handleChange}
                  className="w-5 h-5 rounded cursor-pointer accent-purple-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-700">
                    Best Seller
                  </p>
                  <p className="text-sm text-gray-500">
                    Mark this as a popular or trending item
                  </p>
                </div>
                <TrendingUp size={20} className="text-purple-600" />
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding Food...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Add Food Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
