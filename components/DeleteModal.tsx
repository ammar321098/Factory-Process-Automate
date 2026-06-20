import { useState } from "react";

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ open, onCancel, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      onConfirm();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Delete Record
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <b className="text-red-600">Record</b>
          ? This action cannot be undone.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={handleConfirm}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
