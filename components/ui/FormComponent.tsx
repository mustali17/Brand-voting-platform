import { InputFormType } from "@/utils/models/common.model";
import React from "react";
import CustomSelect from "./react-select";
import { Input } from "./input";
import { Controller, Control, ErrorOption } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Button } from "./button";

interface FormProps {
  formList: InputFormType[];
  submitButtonText: string;
  control: Control;
  errors: ErrorOption;
}

const FormComponent = ({
  formList,
  submitButtonText,
  control,
  errors,
}: FormProps) => {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {formList.map((item, index) => (
        <div key={item.key} className='p-4 border rounded shadow'>
          <Controller
            name={item.name || ""}
            control={control}
            render={({ field }) => {
              return item.type === "select" ? (
                <CustomSelect {...field} options={[]} />
              ) : (
                <Input {...field} placeholder={item.placeholder} />
              );
            }}
          />
          <ErrorMessage
            errors={errors}
            name={item.name || ""}
            render={({ message }) => <p>{message}</p>}
          />
        </div>
      ))}
      <Button title={submitButtonText} />
    </div>
  );
};

export default FormComponent;
