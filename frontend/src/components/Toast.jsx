import React, { useEffect } from "react";
import { X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseStyles =
    "fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between gap-2 min-w-[300px] animate-slide-up";

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80 transition-opacity">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
