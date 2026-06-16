import { useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { useGetCartQuery } from "../redux/api/cartApi";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { useNavigate } from "react-router-dom";
import {
  PaymentElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCreateStripeIntentMutation } from "../redux/api/paymentApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Map click component
const LocationPicker = ({ setAddress }) => {
  useMapEvents({
    click(e) {
      setAddress((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    },
  });
  return null;
};

const StripeCheckout = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMsg, setErrorMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const handlePay = async () => {
  if (!stripe || !elements) return;

  setProcessing(true);

  try {
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-result`,
      },
      redirect: "if_required", // ✅ Add this
    });

    setProcessing(false);

    if (result.error) {
      setErrorMsg(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      // Handle success immediately
      onSuccess();
    }
  } catch (err) {
    setProcessing(false);
    setErrorMsg("Payment failed. Please try again.");
  }
};

  return (
    <div className="space-y-5">
      <PaymentElement />
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errorMsg}
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={!stripe || processing}
        className="w-full py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Processing...
          </>
        ) : (
          <>
            <span>💳</span>
            <span>Pay Now</span>
          </>
        )}
      </button>
    </div>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const { data, refetch } = useGetCartQuery();
  const [createStripeIntent, { isLoading: stripeLoading }] =
    useCreateStripeIntentMutation();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const cart = data?.cart;
  const subTotal = cart?.totalAmount || 0;
  const deliveryFee = 50;
  const tax = Math.round(subTotal * 0.05);
  const discount = 0;
  const totalAmount = subTotal + deliveryFee + tax - discount;
  const [payment, setPayment] = useState("COD");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!address.fullName.trim()) errors.fullName = "Full name is required";
    if (!address.phone.trim()) errors.phone = "Phone number is required";
    if (!address.street.trim()) errors.street = "Street address is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.latitude || !address.longitude)
      errors.location = "Please select delivery location from map";
    return errors;
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Location not supported on your browser");
      setShowError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAddress((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        setErrorMsg("Unable to get your location. Please try again.");
        setShowError(true);
      },
    );
  };

  const placeCODOrder = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setErrorMsg("Please fill all required fields");
      setShowError(true);
      return;
    }
    try {
      const res = await createOrder({
        deliveryAddress: address,
        paymentMethod: "COD",
      }).unwrap();
      if (res.success) {
        setSuccessMsg(res.message || "Order Placed Successfully! 🎉");
        setShowSuccess(true);
        refetch();
        setTimeout(() => {
          navigate("/all-orders");
        }, 1500);
      } else {
        setErrorMsg(res.message || "Order Failed");
        setShowError(true);
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Failed to place order");
      setShowError(true);
    }
  };

  const handleStripeStart = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setErrorMsg("Please fill all required fields");
      setShowError(true);
      return;
    }
    try {
      const orderRes = await createOrder({
        deliveryAddress: address,
        paymentMethod: "STRIPE",
      }).unwrap();
      const orderId = orderRes.order._id;
      const paymentRes = await createStripeIntent(orderId).unwrap();
      setClientSecret(paymentRes.clientSecret);
      setPayment("STRIPE");
      setShowStripeModal(true);
    } catch (err) {
      setShowError(true);
      setErrorMsg(err?.data?.message || "Failed to initiate payment");
    }
  };
  return (
    <>
      <PublicNavbar />
      {/* TOASTS */}
      {showSuccess && (
        <SuccessToast
          message={successMsg}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorToast message={errorMsg} onClose={() => setShowError(false)} />
      )}

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/cart")}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Cart
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Checkout</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center justify-between max-w-md">
            {[
              { step: 1, label: "Delivery", icon: "📍" },
              { step: 2, label: "Payment", icon: "💳" },
            ].map((item, idx) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    {item.label}
                  </p>
                </div>

                {idx < 1 && (
                  <div className="w-16 h-1 bg-gray-300 mx-4 md:mx-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-[70vh] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            Checkout Your{" "}
            <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Order
            </span>
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📍</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>

                {formErrors.location && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                    {formErrors.location}
                  </div>
                )}

                {/* Form Grid */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        formErrors.fullName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-600 text-xs mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        formErrors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-600 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        formErrors.street
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    />
                    {formErrors.street && (
                      <p className="text-red-600 text-xs mt-1">
                        {formErrors.street}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Kathmandu"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        formErrors.city
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-red-600 text-xs mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={address.latitude}
                      readOnly
                      placeholder="27.7172"
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={address.longitude}
                      readOnly
                      placeholder="85.3240"
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={getLocation}
                    className="flex-1 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    📍 Use Current Location
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>

              {/* Map Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 overflow-hidden">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🗺️</span> Select Location on Map
                </h3>

                <div className="h-96 rounded-xl overflow-hidden border border-gray-300">
                  <MapContainer
                    center={[27.7172, 85.324]}
                    zoom={13}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <LocationPicker setAddress={setAddress} />

                    {address.latitude && address.longitude && (
                      <Marker
                        position={[address.latitude, address.longitude]}
                      />
                    )}
                  </MapContainer>
                </div>

                <p className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                  <span>💡</span> Click anywhere on the map to select your
                  delivery location
                </p>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Order Items
                  </h3>

                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {cart?.items?.map((item) => (
                      <div
                        key={item.foodId}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            × {item.quantity}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-orange-600 ml-2">
                          Rs {item.itemTotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">Rs {subTotal}</span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">Rs {deliveryFee}</span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Tax (5%)</span>
                      <span className="font-semibold">Rs {tax}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount</span>
                        <span>-Rs {discount}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Rs {totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Payment Method
                  </h3>

                  <div className="space-y-2">
                    {[
                      { value: "COD", icon: "💰", label: "Cash on Delivery" },
                      { value: "STRIPE", icon: "💳", label: "Card Payment" },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setPayment(method.value)}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-300 flex items-center gap-3 ${
                          payment === method.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">
                            {method.label}
                          </p>
                          <p className="text-xs text-gray-600">
                            {method.value === "COD"
                              ? "Pay when order arrives"
                              : "Secure online payment"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  disabled={isLoading}
                  onClick={
                    payment === "COD" ? placeCODOrder : handleStripeStart
                  }
                  className="w-full py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{payment === "COD" ? "✅" : "💳"}</span>
                      <span>
                        {payment === "COD" ? "Place Order" : "Pay with Stripe"}
                      </span>
                    </>
                  )}
                </button>

                {/* Info Badges */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span>🔒</span>
                    <span className="text-blue-700">
                      Your personal data is secure and encrypted
                    </span>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span>✅</span>
                    <span className="text-green-700">
                      Order confirmation will be sent to your email
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStripeModal && clientSecret && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowStripeModal(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowStripeModal(false)}
              className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span>💳</span> Complete Payment
              </h2>
              <p className="text-gray-600 mt-2">
                Total Amount:{" "}
                <span className="font-bold text-orange-600">
                  Rs {totalAmount}
                </span>
              </p>
            </div>

            {/* Stripe Elements */}
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                },
              }}
            >
              <StripeCheckout
                clientSecret={clientSecret}
                onSuccess={() => {
                  setShowSuccess(true);
                  setSuccessMsg("Payment successful! 🎉");
                  setTimeout(() => {
                    setShowStripeModal(false);
                    navigate("/all-orders");
                  }, 1500);
                }}
              />
            </Elements>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};
export default Orders;
