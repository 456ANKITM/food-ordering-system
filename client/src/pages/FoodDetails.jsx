import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFoodByIdQuery, useGetAllFoodsQuery } from "../redux/api/foodApi";
import { useAddToCartMutation } from "../redux/api/cartApi";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetFoodByIdQuery(id);
  const { data: allFoodsData } = useGetAllFoodsQuery();

  const { isAuthenticated } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();

  const [errorToast, setErrorToast] = useState({ show: false, message: "" });
  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  const food = data?.food;
  const allFoods = allFoodsData?.foods || [];

  const showError = (message) => {
    setErrorToast({ show: true, message });
  };

  const showSuccess = (message) => {
    setSuccessToast({ show: true, message });
  };

  const discount = Number(food?.discount) || 0;
  const hasDiscount = discount > 0;

  const finalPrice = food?.price || 0;

  const originalPrice = hasDiscount
    ? Math.round(finalPrice / (1 - discount / 100))
    : null;

  const savings = hasDiscount && originalPrice ? originalPrice - finalPrice : 0;

  // loading state
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold">Loading details...</p>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Item not found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find this delicious dish
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const finalTotal = finalPrice * quantity;
  const originalTotal = originalPrice ? originalPrice * quantity : null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showError("You are not logged in. Please login first.");
      return;
    }

    try {
      await addToCart({
        foodId: food._id,
        quantity,
      }).unwrap();

      showSuccess(`${quantity}x ${food.name} added to cart! 🛒`);
      setQuantity(1);
    } catch (error) {
      showError(error?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <>
      {errorToast.show && (
        <ErrorToast
          message={errorToast.message}
          onClose={() => setErrorToast({ show: false, message: "" })}
        />
      )}

      {successToast.show && (
        <SuccessToast
          message={successToast.message}
          onClose={() => setSuccessToast({ show: false, message: "" })}
        />
      )}

      <PublicNavbar />

      {/* BREADCRUMB */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/menu")}
              className="text-gray-600 hover:text-orange-600"
            >
              Menu
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">{food.name}</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* IMAGE */}
            <div className="relative bg-gray-100 rounded-3xl overflow-hidden aspect-square">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />

              {hasDiscount && (
                <div className="absolute top-6 left-6 w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="space-y-8">
              <h1 className="text-4xl font-bold">{food.name}</h1>

              <p className="text-gray-600">{food.description}</p>

              {/* PRICE */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-orange-600">
                    Rs {finalPrice}
                  </span>

                  {hasDiscount && (
                    <span className="text-xl text-gray-400 line-through">
                      Rs {originalPrice}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <p className="text-green-600 font-semibold mt-2">
                    Save Rs {savings}
                  </p>
                )}

                {/* TOTAL */}
                <div className="mt-4 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    Total ({quantity} items)
                  </p>

                  <div className="flex gap-3">
                    <span className="text-2xl font-bold text-orange-600">
                      Rs {finalTotal}
                    </span>

                    {originalTotal && (
                      <span className="text-gray-400 line-through">
                        Rs {originalTotal}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <input value={quantity} readOnly className="w-12 text-center" />
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>

              {/* ADD BUTTON */}
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full py-4 bg-orange-500 text-white rounded-xl"
              >
                {adding ? "Adding..." : `Add ${quantity} to Cart`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FoodDetails;
