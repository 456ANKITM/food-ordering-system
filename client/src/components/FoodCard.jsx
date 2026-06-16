import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../redux/api/cartApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();

  const [addToCart, { isLoading }] = useAddToCartMutation();

  const { isAuthenticated } = useSelector((state) => state.user);

  const [errorToast, setErrorToast] = useState({
    show: false,
    message: "",
  });

  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  const showError = (message) => {
    setErrorToast({
      show: true,
      message,
    });
  };

  const showSuccess = (message) => {
    setSuccessToast({
      show: true,
      message,
    });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showError("You are not logged in. Please login first.");
      return;
    }

    try {
      await addToCart({
        foodId: food._id,
        quantity: 1,
      }).unwrap();

      showSuccess(`${food.name} added to cart!`);
    } catch (error) {
      showError(error?.data?.message || "Failed to add item to cart");
    }
  };

  // Discount calculation
  const hasDiscount = Number(food.discount) > 0;

  const originalPrice = hasDiscount
    ? Math.round(food.price / (1 - food.discount / 100))
    : null;

  return (
    <>
      {errorToast.show && (
        <ErrorToast
          message={errorToast.message}
          onClose={() =>
            setErrorToast({
              show: false,
              message: "",
            })
          }
        />
      )}

      {successToast.show && (
        <SuccessToast
          message={successToast.message}
          onClose={() =>
            setSuccessToast({
              show: false,
              message: "",
            })
          }
        />
      )}

      <div
        onClick={() => navigate(`/food/${food._id}`)}
        className="
        group h-full bg-white rounded-2xl overflow-hidden
        shadow-md hover:shadow-xl transition-all duration-300
        border border-gray-100 hover:border-orange-200
        cursor-pointer flex flex-col
        "
      >
        {/* IMAGE */}

        <div className="relative overflow-hidden bg-gray-100 h-48">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Discount Badge */}

          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <div
                className="
                flex items-center justify-center
                w-12 h-12 rounded-full
                bg-linear-to-br from-red-500 to-red-600
                text-white shadow-lg
                "
              >
                <span className="font-bold text-sm text-center">
                  {Math.round(food.discount)}%
                  <br />
                  <span className="text-xs">OFF</span>
                </span>
              </div>
            </div>
          )}

          <div
            className="
            absolute inset-0 flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity
            "
          >
            <div
              className="
              px-4 py-2 bg-white/95 rounded-lg
              font-semibold text-sm
              "
            >
              View Details
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-5 flex flex-col grow">
          <div className="mb-2">
            <span
              className="
              inline-block text-xs font-semibold
              text-orange-600 bg-orange-50
              px-3 py-1 rounded-full capitalize
              "
            >
              {food.category}
            </span>
          </div>

          <h3
            className="
            text-lg font-bold text-gray-900
            line-clamp-2 group-hover:text-orange-600
            transition mb-2
            "
          >
            {food.name}
          </h3>

          {food.description && (
            <p
              className="
              text-sm text-gray-600
              line-clamp-2 mb-3 grow
              "
            >
              {food.description}
            </p>
          )}

          <div className="border-t border-gray-100 my-3" />

          {/* PRICE */}

          <div className="flex items-end justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="
                  text-2xl font-bold text-orange-600
                  "
                >
                  Rs {food.price}
                </span>

                {hasDiscount && (
                  <span
                    className="
                    text-sm text-gray-400 line-through
                    "
                  >
                    Rs {originalPrice}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <p
                  className="
                  text-xs text-green-600
                  font-semibold mt-1
                  "
                >
                  Save Rs {originalPrice - food.price}
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="
              px-5 py-2.5
              bg-linear-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700
              text-white font-semibold rounded-lg text-sm
              transition shadow-md active:scale-95
              disabled:opacity-50
              "
            >
              {isLoading ? (
                <span className="flex gap-2 items-center">
                  <span
                    className="
                    w-4 h-4 border-2
                    border-white border-t-transparent
                    rounded-full animate-spin
                    "
                  />
                  Adding
                </span>
              ) : (
                <>🛒 Add</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodCard;
