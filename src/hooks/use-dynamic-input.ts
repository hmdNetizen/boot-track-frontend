import { useState } from "react";

export type InputField = {
  id: string;
  value: string;
  isValid: boolean;
};

type Params = {
  fields: Array<InputField>;
  setFields: React.Dispatch<React.SetStateAction<Array<InputField>>>;
};

export const useDynamicInputs = ({ fields, setFields }: Params) => {
  const parseCommaSeparatedString = (text: string): InputField[] => {
    const values = text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const parsedFields: InputField[] = [];

    values.forEach((value, index) => {
      parsedFields.push({
        id: Date.now().toString() + index,
        value,
        isValid: value !== "",
      });
    });

    return parsedFields;
  };

  const handlePaste = (pastedText: string, fieldIndex: number) => {
    const parsedFields = parseCommaSeparatedString(pastedText);

    if (parsedFields.length > 1) {
      // Multiple values detected, replace all fields
      setFields([
        ...parsedFields,
        { id: Date.now().toString(), value: "", isValid: true },
      ]);
    } else if (parsedFields.length === 1) {
      // Single value, update current field
      const newFields = [...fields];
      newFields[fieldIndex] = parsedFields[0];
      setFields(newFields);
    }
  };

  const updateField = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, value, isValid: value.trim() !== "" }
          : field
      )
    );
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        value: "",
        isValid: true,
      },
    ]);
  };

  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields((prev) => prev.filter((field) => field.id !== id));
    }
  };

  const validateAllFields = () => {
    const updatedFields = fields.map((field) => ({
      ...field,
      isValid: field.value.trim() !== "",
    }));
    setFields(updatedFields);
    return updatedFields.every((field) => field.isValid);
  };

  return {
    handlePaste,
    updateField,
    addField,
    removeField,
    validateAllFields,
  };
};
