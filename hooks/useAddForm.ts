"use client";

import { useAddForm as useAddFormContext } from "@/contexts/AddFormContext";
import { FormType } from "@/components/AddFormPopup";

export function useAddForm() {
  const context = useAddFormContext();

  const openAddForm = (formType: FormType, title?: string) => {
    context.openForm(formType, title);
  };

  const closeAddForm = () => {
    context.closeForm();
  };

  const setFormSuccessCallback = (callback: (data: any) => void) => {
    context.setOnSuccess(callback);
  };

  return {
    isOpen: context.isOpen,
    formType: context.formType,
    title: context.title,
    openAddForm,
    closeAddForm,
    setFormSuccessCallback,
  };
}