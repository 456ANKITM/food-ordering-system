import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "succeeded") {
      setStatus("success");
    } else if (redirectStatus === "failed") {
      setStatus("failed");
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
          {status === "success" && (
            <>
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                Payment Successful
              </h1>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully.
              </p>

              <button
                onClick={() => navigate("/all-orders")}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
              >
                Go to My Orders
              </button>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-6">
                Something went wrong with your payment.
              </p>

              <button
                onClick={() => navigate("/all-orders")}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
              >
                Go to My Orders
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentResult;
