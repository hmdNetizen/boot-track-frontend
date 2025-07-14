import React from "react";
import { Loader2, Plus, UserPlus, X } from "lucide-react";
import type { InputField } from "../../hooks/use-dynamic-input";

type DynamicInputFieldsProps = {
  fields: InputField[];
  handlePaste: (pastedText: string, fieldIndex: number) => void;
  updateField: (id: string, value: string) => void;
  addField: () => void;
  removeField: (id: string) => void;
  onRegister: () => void;
  isPending: boolean;
};

const DynamicInputFields = ({
  addField,
  fields,
  handlePaste,
  removeField,
  updateField,
  onRegister,
  isPending,
}: DynamicInputFieldsProps) => {
  const handleInputPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    fieldIndex: number
  ) => {
    const pastedText = e.clipboardData.getData("text");

    // Check if it looks like comma-separated values
    if (pastedText.includes(",")) {
      e.preventDefault();
      handlePaste(pastedText, fieldIndex);
    }
  };

  return (
    <div className="space-y-4 px-3 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold dark:text-slate-200">
          Register Attendees
        </h2>
        <p className="text-muted-foreground dark:text-slate-400">
          Paste comma-separated wallet address and they'll automatically
          populate separate fields
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <div className="flex-1">
              <input
                placeholder="Enter value"
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
                onPaste={(e) => handleInputPaste(e, index)}
                className={`input-field font-mono ${
                  !field.isValid ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {!field.isValid && (
                <p className="text-red-500 text-sm mt-1">
                  This field cannot be empty
                </p>
              )}
            </div>
            {fields.length > 1 && (
              <button
                onClick={() => removeField(field.id)}
                className="h-10 w-10 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addField}
          className="btn-secondary flex flex-1 justify-center items-center"
        >
          <Plus className="size-4 mr-2" />
          Add Field
        </button>
        <button
          onClick={onRegister}
          className="btn-primary flex flex-1 gap-4 justify-center items-center dark:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Register
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DynamicInputFields;
