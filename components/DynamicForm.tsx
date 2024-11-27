"use client"
import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import FormField from "./FormField";
import { formSchema } from "../formSchema";

const DynamicForm: React.FC = () => {
  const methods = useForm();
  const { handleSubmit, watch } = methods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const openDropdowns = document.querySelectorAll(".absolute.z-10");
        openDropdowns.forEach((dropdown) => {
          if (dropdown.parentElement) {
            const parent = dropdown.parentElement;
            parent
              .querySelector(".cursor-pointer")
              ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          }
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus(
          "Form submitted successfully. You will receive a confirmation email shortly."
        );
      } else {
        setSubmitStatus("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("An error occurred. Please try again.");
    }

    setIsSubmitting(false);
  };

  const renderFields = (fields: any[], parentId: string = "") => {
    return fields.map((field) => {
      const fieldId = parentId ? `${parentId}.${field.id}` : field.id;

      if (field.type === "section") {
        return (
          <div key={fieldId} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{field.label}</h2>
            {renderFields(field.fields, fieldId)}
          </div>
        );
      }

      if (field.type === "checkbox" && field.fields) {
        const isChecked = watch(fieldId);
        return (
          <div key={fieldId} className="mb-4">
            <FormField {...field} id={fieldId} />
            {isChecked && (
              <div className="ml-6 mt-2">
                {renderFields(field.fields, fieldId)}
              </div>
            )}
          </div>
        );
      }

      if (field.type === "select" && field.fields) {
        const selectedOption = watch(fieldId);
        const selectedField = field.fields.find(
          (f: any) => f.condition?.value === selectedOption
        );

        return (
          <div key={fieldId} className="mb-4">
            <FormField {...field} id={fieldId} />
            {selectedField && (
              <div className="ml-6 mt-2">
                {renderFields([selectedField], fieldId)}
              </div>
            )}
          </div>
        );
      }

      return <FormField key={fieldId} {...field} id={fieldId} />;
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto mt-8"
      >
        {renderFields(formSchema)}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {submitStatus && (
          <p
            className={`mt-4 text-center ${
              submitStatus.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {submitStatus}
          </p>
        )}
      </form>
    </FormProvider>
  );
};

export default DynamicForm;

