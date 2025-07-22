"use client";
import { InputFormType } from "@/utils/models/common.model";
import { ErrorMessage } from "@hookform/error-message";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Button } from "./button";
import { Input } from "./input";
import CustomSelect from "./react-select";
import InputLabel from "./input-label";
import { Checkbox } from "./checkbox";
import { useValidation } from "@/lib/hook/useValidation";
import { FileInput } from "./FileInput";

interface FormProps<T extends FieldValues> {
  formList: InputFormType[];
  submitButtonText: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  submit: (data: T) => void;
  submitBtnDisabled?: boolean;
  isSubmitting?: boolean;
  gridSize?: number;
  handleFile?: (file: File, key: string) => void;
}

const FormComponent = <T extends FieldValues>({
  formList,
  submitButtonText,
  control,
  errors,
  handleSubmit,
  submit,
  submitBtnDisabled = false,
  isSubmitting = false,
  gridSize = 1,
  handleFile,
}: FormProps<T>) => {
  const validation = useValidation();

  return (
    <div className="w-full">
      <div
        className={`grid grid-cols-1 ${gridSize > 1 ? `md:grid-cols-${gridSize}` : ""} w-full gap-2 md:gap-4`}
      >
        {formList.map((item) => (
          <div
            key={item.key}
            className={`w-full ${
              item.type === "checkbox"
                ? "flex items-center space-x-2"
                : "space-y-2"
            }`}
          >
            {item.label && item.type !== "checkbox" && (
              <InputLabel
                label={item.label}
                htmlFor={item.key?.toString() || ""}
              />
            )}
            <Controller
              name={item.name as Path<T>}
              control={control}
              defaultValue={undefined}
              rules={validation[item.validation as keyof typeof validation]}
              render={({ field }) => {
                switch (item.type) {
                  case "select":
                    return (
                      <CustomSelect
                        {...field}
                        options={item.selectInputList || []}
                        isMulti={item.isMulti}
                        onChange={(e) => {
                          if (e) {
                            if (item.isMulti && Array.isArray(e)) {
                              field.onChange(e.map((item: any) => item.value));
                            } else if (!Array.isArray(e)) {
                              field.onChange(e.value);
                            } else {
                              field.onChange(e);
                            }
                          }
                        }}
                      />
                    );

                  case "checkbox":
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox {...field} onCheckedChange={field.onChange} />
                        {item.label && (
                          <InputLabel
                            label={item.label}
                            htmlFor={item.key?.toString() || ""}
                          />
                        )}
                      </div>
                    );

                  case "file":
                    return (
                      <FileInput
                        id={item.key?.toString() || ""}
                        name={item.key?.toString() || ""}
                        label={item.label}
                        accept="image/*"
                        maxSize={10}
                        onChange={(e) => {
                          if (e && handleFile) {
                            handleFile(e, item.key?.toString() || "");
                          }
                        }}
                        {...(field.value && { previewUrl: field.value })}
                      />
                    );

                  case "textarea":
                    return (
                      <textarea
                        {...field}
                        placeholder={item.placeholder}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px] text-sm md:text-base"
                      />
                    );

                  default:
                    return (
                      <Input
                        {...field}
                        type={item.type}
                        placeholder={item.placeholder}
                        className="w-full"
                      />
                    );
                }
              }}
            />

            <ErrorMessage
              errors={errors}
              name={item.name as keyof T as any}
              render={({ message }) => (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {message}
                </p>
              )}
            />
          </div>
        ))}
      </div>

      {/* Only show submit button if submitButtonText is provided and not empty */}
      {submitButtonText &&
        submitButtonText.trim() !== "" &&
        !submitBtnDisabled && (
          <Button
            className="mt-4 md:mt-6 w-full md:w-auto"
            title={submitButtonText}
            onClick={handleSubmit(submit)}
            disabled={submitBtnDisabled}
            isLoading={isSubmitting}
          />
        )}
    </div>
  );
};

export default FormComponent;
