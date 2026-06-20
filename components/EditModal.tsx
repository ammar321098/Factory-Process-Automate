import { useState } from "react";

interface EditModalProps {
  open: boolean;
  record: any;
  columns: any[];
  onClose: () => void;
  onSave: () => Promise<void>; // make onSave async
  onChange: (key: string, value: any) => void;
}

export default function EditModal({
  open,
  record,
  columns,
  onClose,
  onSave,
  onChange,
}: EditModalProps) {
  const [saving, setSaving] = useState(false);

  if (!open || !record) return null;

  // Helper for nested values
  const getValue = (obj: any, path: string) =>
    path.split(".").reduce((acc: any, key) => acc?.[key], obj);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      onClose(); // optional: close after save
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Edit Record
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {columns.map((col) => {
            if (
              col.key === "createdAt" ||
              col.key === "updatedAt" ||
              col.key === "weight" ||
              col.key === "totalQuantity" ||
              col.key === "totalEarn" ||
              col.key === "department" ||
              col.key === "salaryType" ||
              col.key === "monthlySalary" ||
              col.key.includes(".")
            ) {
              return null;
            }

            const value = getValue(record, col.key);

            return (
              <div key={col.key} className={col.fullWidth ? "col-span-2" : ""}>
                <label className="text-xs text-gray-500">{col.label}</label>

                {col.type === "textarea" || col.key === "description" ? (
                  <textarea
                    className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
                    value={value ?? ""}
                    maxLength={100}
                    onChange={(e) => onChange(col.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={col.type === "number" ? "number" : "text"}
                    className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
                    value={value ?? ""}
                    maxLength={35}
                    onChange={(e) =>
                      onChange(
                        col.key,
                        col.type === "number"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
