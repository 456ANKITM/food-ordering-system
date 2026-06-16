// components/SuccessToast.jsx
import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const SuccessToast = ({ message = "Success!", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="flex items-start gap-3 bg-white border border-green-200 shadow-xl rounded-xl p-4 w-80">
        {/* Icon */}
        <div className="text-green-500 mt-1">
          <CheckCircle size={22} />
        </div>

        {/* Message */}
        <div className="flex-1">
          <h4 className="font-semibold text-green-600">Success</h4>
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

export default SuccessToast;
