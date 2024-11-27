import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  options,
  required,
}) => {
  const { register, watch, setValue } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  const renderMultiSelect = () => {
    const selectedValues = watch(id) || [];

    return (
      <div className="relative">
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : "Select options"}
          </span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(
                          (value: any) => value !== option.value
                        );
                    setValue(id, newValues);
                  }}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderField = () => {
    switch (type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(id, { required })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "textarea":
        return (
          <textarea
            id={id}
            placeholder={placeholder}
            {...register(id, { required })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        );
      case "select":
        return (
          <select
            id={id}
            {...register(id, { required })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return renderMultiSelect();
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              id={id}
              type="checkbox"
              {...register(id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
              {label}
            </label>
          </div>
        );
      case "date":
        return (
          <input
            id={id}
            type="datetime-local"
            {...register(id, { required })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      {type !== "checkbox" && (
        <label htmlFor={id} className="block mb-2 font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
    </div>
  );
};

export default FormField;
