import React from "react";

interface ErrorPopupProps {
  open: boolean;
  message: any;
  materials?: string[];
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  open,
  message,
  materials = [],
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
          Action Blocked
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-line">
          {message}
        </p>

        {materials.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
              Related materials
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm mt-1">
              {materials.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
