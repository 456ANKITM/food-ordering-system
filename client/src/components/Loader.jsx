export const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-50">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-orange-500"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-orange-200 border-b-transparent border-l-transparent animate-spin"></div>
      </div>

      {/* Glow Pulse */}
      <div className="mt-4 flex gap-1">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>

      {/* Text */}
      <p className="mt-3 text-gray-500 text-sm">{text}</p>
    </div>
  );
};
