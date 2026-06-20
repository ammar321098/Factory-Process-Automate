interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  record: any;
  columns: any[];
}

export default function ViewModal({
  open,
  onClose,
  onEdit,
  record,
  columns,
}: ViewModalProps) {
  if (!open || !record) return null;

  // Helper: get nested values ("size.name")
  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc: any, key: string) => acc?.[key], obj);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Record Details
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {columns.map((col) => {
            const rawValue = getValue(record, col.key);
            const value = col.render ? col.render(record) : rawValue;

            return (
              <div key={col.key}>
                <p className="text-xs text-gray-500">{col.label}</p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {value ?? "—"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={onEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
