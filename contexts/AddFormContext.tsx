"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormType } from "@/components/AddFormPopup";

// Represents one layer (form) in the stack
interface formState {
  formType: FormType;
  title?: string;
  onSuccess?: (data: any) => void;
}

interface AddFormContextType {
  isOpen: boolean;
  formType: FormType | null;
  title?: string;
  openForm: (formType: FormType, title?: string) => void;
  closeForm: () => void;
  onSuccess?: (data: any) => void;
  setOnSuccess: (callback: (data: any) => void) => void;
}

const AddFormContext = createContext<AddFormContextType | undefined>(undefined);

export function AddFormProvider({ children }: { children: ReactNode }) {
  // The "stack" of open forms (e.g., [FormA, FormB])
  const [formStack, setFormStack] = useState<formState[]>([]);

  /**
   * Opens a new form and pushes it onto the stack.
   * Example: openForm("materials") → then openForm("sizes")
   * Result: formStack = [FormA, FormB]
   */
  const openForm = (formType: FormType, title?: string) => {
    setFormStack((prev) => [...prev, { formType, title }]);
  };

  /**
   * Closes the top form (pops it off the stack).
   * Example: [FormA, FormB] → close → [FormA]
   */
  const closeForm = () => {
    setFormStack((prev) => prev.slice(0, -1));
  };

  const setOnSuccess = (callback: (data: any) => void) => {
    setFormStack((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1].onSuccess = callback;
      return updated;
    });
  };

  const top = formStack[formStack.length - 1];

  return (
    <AddFormContext.Provider
      value={{
        isOpen: formStack.length > 0,
        formType: top?.formType ?? null,
        title: top?.title,
        openForm,
        closeForm,
        onSuccess: top?.onSuccess,
        setOnSuccess,
      }}
    >
      {children}
    </AddFormContext.Provider>
  );
}

export function useAddForm() {
  const context = useContext(AddFormContext);
  if (context === undefined) {
    throw new Error("useAddForm must be used within an AddFormProvider");
  }
  return context;
}
