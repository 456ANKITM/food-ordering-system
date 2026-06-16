import { AlertTriangle, RefreshCcw } from "lucide-react";

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex  items-center justify-center min-h-55 px-4">
      <div className="bg-white   rounded-2xl p-6 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-50 p-3 rounded-full">
            <AlertTriangle className="text-red-500 w-6 h-6" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{message}</p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
