import React, { createContext, useContext, useState, type ReactNode } from "react";

// Define form type
interface FormData {
  name: string;
  dob: string;
  email: string;
  otp: string;
}

// Context type
interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  resetForm: () => void;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Initial state
const initialState: FormData = {
  name: "",
  dob: "",
  email: "",
  otp: "",
};


// Provider component
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialState);

  const resetForm = () => setFormData(initialState);

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for using context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used inside FormProvider");
  }
  return context;
};
