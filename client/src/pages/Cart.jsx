import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import {
  useGetCartQuery,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} from "../redux/api/cartApi";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCartQuery();

  const [updateQuantity, { isLoading: updatingQty }] =
    useUpdateQuantityMutation();
  const [removeItem, { isLoading: removing }] = useRemoveItemMutation();
  const [clearCart, { isLoading: clearing }] = useClearCartMutation();
  const [appliedPromo, setAppliedPromo] = useState(null);

  const cart = data?.cart;

  const handleIncrease = async (foodId, qty) => {
    await updateQuantity({
      foodId,
      quantity: qty + 1,
    });
  };

  const handleDecrease = async (foodId, qty) => {
    if (qty === 1) {
      await removeItem(foodId);
    } else {
      await updateQuantity({
        foodId,
        quantity: qty - 1,
      });
    }
  };

  const handleRemove = async (foodId) => {
    await removeItem(foodId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      await clearCart();
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorState />;

  const isEmpty = !cart || cart.items.length === 0;
  const subtotal = cart?.totalAmount || 0;
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal - discount + shipping + tax;

  return (
    <>
      <PublicNavbar />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate("/menu")}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Menu
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Shopping Cart</span>
          </div>
        </div>
      </div>
      {isEmpty ? (
        <div className="min-h-[60vh] flex items-center justify-center bg-linear-to-b from-white to-gray-50">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any delicious items yet. Start
              exploring our menu!
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shopping{" "}
                <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Cart
                </span>
              </h1>
              <p className="text-gray-600">
                You have{" "}
                <span className="font-bold text-orange-600">
                  {cart.items.length}
                </span>{" "}
                item{cart.items.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* ===== LEFT: CART ITEMS ===== */}
              <div className="md:col-span-2 space-y-4">
                {/* Items List */}
                {cart.items.map((item, idx) => (
                  <div
                    key={item.foodId}
                    className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all  hover:border-orange-200 animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex gap-5 items-start">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.category}
                        </p>

                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-orange-600">
                            Rs {item.price}
                          </span>
                          <span className="text-sm text-gray-500">each</span>
                        </div>
                      </div>

                      {/* Right Side: Quantity + Total + Remove */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Total Price */}
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-1">Total</p>
                          <p className="text-xl font-bold text-orange-600">
                            Rs {item.itemTotal}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleDecrease(item.foodId, item.quantity)
                            }
                            disabled={updatingQty || removing}
                            className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = Math.max(
                                1,
                                parseInt(e.target.value) || 1,
                              );
                              if (newQty !== item.quantity) {
                                updateQuantity({
                                  foodId: item.foodId,
                                  quantity: newQty,
                                });
                              }
                            }}
                            className="w-12 text-center bg-gray-100 border-0 outline-none font-semibold text-gray-900"
                            min="1"
                            disabled={updatingQty || removing}
                          />

                          <button
                            onClick={() =>
                              handleIncrease(item.foodId, item.quantity)
                            }
                            disabled={updatingQty || removing}
                            className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.foodId)}
                          disabled={removing}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {removing ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping & Clear Cart Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/menu")}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>

                  <button
                    onClick={handleClearCart}
                    disabled={clearing}
                    className="px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {clearing ? "Clearing..." : "Clear Cart"}
                  </button>
                </div>
              </div>

              {/* ===== RIGHT: ORDER SUMMARY ===== */}
              <div className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Summary Card */}
                  <div className="bg-linear-to-b from-gray-50 to-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                      {/* Subtotal */}
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-semibold">Rs {subtotal}</span>
                      </div>

                      {/* Discount */}
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>Discount (10%)</span>
                          <span>-Rs {discount}</span>
                        </div>
                      )}

                      {/* Shipping */}
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">
                          {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `Rs ${shipping}`
                          )}
                        </span>
                      </div>

                      {/* Tax */}
                      <div className="flex justify-between text-gray-700">
                        <span>Tax (5%)</span>
                        <span className="font-semibold">Rs {tax}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Rs {total}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => navigate("/order")}
                      className="w-full py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 mb-3"
                    >
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={() => navigate("/menu")}
                      className="w-full py-3 border border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      Add More Items
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Cart;
