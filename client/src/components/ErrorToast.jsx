// components/ErrorToast.jsx
import { useEffect } from "react";
import { XCircle, X } from "lucide-react";

const ErrorToast = ({ message = "Something went wrong!", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in">
      <div className="flex items-start gap-3 bg-white border border-red-200 shadow-xl rounded-xl p-4 w-80">
        {/* Icon */}
        <div className="text-red-500 mt-1">
          <XCircle size={22} />
        </div>

        {/* Message */}
        <div className="flex-1">
          <h4 className="font-semibold text-red-600">Error</h4>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Close */}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
