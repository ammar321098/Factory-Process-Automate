"use client";
import React, { useState, useEffect } from "react";

interface UpdateWeightModalProps {
  open: boolean;
  currentWeight: number;
  currentQuantity: number;
  unitWeight: number;
  onClose: () => void;
  onUpdate: (
    newQuantity: number,
    newTotalWeight: number,
    description: string
  ) => Promise<void>;
}

export const UpdateWeightModal: React.FC<UpdateWeightModalProps> = ({
  open,
  currentWeight,
  currentQuantity,
  unitWeight,
  onClose,
  onUpdate,
}) => {
  const [addedWeight, setAddedWeight] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(currentWeight);
  const [updatedQuantity, setUpdatedQuantity] =
    useState<number>(currentQuantity);
  const [updating, setUpdating] = useState(false);

  // New field
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const newTotal = currentWeight + addedWeight;
    setTotalWeight(newTotal);

    const newQty = unitWeight > 0 ? (newTotal * 1000) / unitWeight : 0;
    setUpdatedQuantity(Number(newQty.toFixed(2)));
  }, [addedWeight, currentWeight, unitWeight]);

  if (!open) return null;

  const increment = () => setAddedWeight((prev) => prev + 1);

  const decrement = () => {
    setAddedWeight((prev) => {
      const newVal = prev - 1;
      const afterWeight = currentWeight + newVal;

      if (afterWeight <= 0) return -currentWeight; // Stop before totalWeight goes negative
      return newVal;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
          Update Material Weight
        </h3>

        {/* Weight Controller */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {/* Circle Input */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-green-600 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-inner overflow-hidden">
              <input
                type="number"
                value={addedWeight}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow negative, decimal, and blank input
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    // Limit to max 6 characters
                    if (value.length <= 6) {
                      setAddedWeight(value === "" ? 0 : Number(value));
                    }
                  }
                }}
                step="any"
                inputMode="decimal"
                className={`[appearance:textfield]
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
        text-center bg-transparent focus:outline-none font-bold
        ${String(addedWeight).length > 3 ? "text-3xl" : "text-5xl"}`}
                placeholder="0"
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              />
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              New Weight (kg)
            </p>
          </div>

          {/* + and – Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={increment}
              className="w-12 h-12 rounded-full bg-green-600 text-white text-2xl shadow hover:bg-green-700"
            >
              +
            </button>
            <button
              onClick={decrement}
              className="w-12 h-12 rounded-full bg-red-500 text-white text-2xl shadow hover:bg-red-600"
            >
              −
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Summary
          </h4>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Current Weight
            </span>
            <span className="font-medium">{currentWeight.toFixed(4)} kg</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Added Weight
            </span>
            <span className="font-medium">{addedWeight.toFixed(2)} kg</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              New Total Weight
            </span>
            <span className="font-bold text-green-700 dark:text-green-400">
              {totalWeight.toFixed(2)} kg
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Updated Qty
            </span>
            <span className="font-bold text-blue-700 dark:text-blue-400">
              {updatedQuantity}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500">
            Based on unit weight of {unitWeight}g per piece.
          </div>
        </div>

        {/* Description Field */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="Why are you updating this weight?"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={updating}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              setUpdating(true);
              await onUpdate(updatedQuantity, totalWeight, description);
              onClose();
              setUpdating(false);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};
