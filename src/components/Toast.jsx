import React, { useEffect } from "react";

// Removed TypeScript type and React.FC
export const Toasts = ({ toasts, onClose }) => {
  useEffect(() => {
    // set timers for auto-dismiss
    const timers = []; // Removed NodeJS.Timeout[] type
    toasts.forEach((t) => {
      const ms = t.timeout ?? 4000;
      const handle = setTimeout(() => onClose(t.id), ms);
      timers.push(handle);
    });
    return () => timers.forEach((m) => clearTimeout(m));
  }, [toasts, onClose]);

  return (
    <div className="fixed right-4 top-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-gray-900 text-white px-4 py-2 rounded shadow-lg border"
          role="status"
        >
          <div className="flex items-center justify-between gap-4">
            <div>{t.message}</div>
            <button
              onClick={() => onClose(t.id)}
              className="ml-2 text-sm opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toasts;