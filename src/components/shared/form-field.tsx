import React from "react";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <span className="inline-block w-4 h-4 text-error-500">⚠</span>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;
