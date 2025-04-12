import { InputFormType } from "@/utils/models/common.model";
import { ErrorMessage } from "@hookform/error-message";
import {
  Control,
  Controller,
  FieldError,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Button } from "./button";
import { Input } from "./input";
import CustomSelect from "./react-select";
import InputLabel from "./input-label";
import { Checkbox } from "./checkbox";

interface FormProps {
  formList: InputFormType[];
  submitButtonText: string;
  control: Control;
  errors: FieldError | any;
  handleSubmit: UseFormHandleSubmit<any>;
  submit: (data: any) => void;
}

const FormComponent = ({
  formList,
  submitButtonText,
  control,
  errors,
  handleSubmit,
  submit,
}: FormProps) => {
  return (
    <div className='grid grid-cols-1'>
      {formList.map((item, index) => (
        <div key={item.key} className='p-4 py-2 rounded'>
          {item.label && item.type !== "checkbox" && (
            <InputLabel
              label={item.label}
              htmlFor={item.key?.toString() || ""}
            />
          )}
          <Controller
            name={item.name || ""}
            control={control}
            defaultValue={""}
            render={({ field }) => {
              return item.type === "select" ? (
                <CustomSelect {...field} options={[]} />
              ) : item.type === "checkbox" ? (
                <Checkbox {...field} />
              ) : (
                <Input
                  {...field}
                  type={item.type}
                  placeholder={item.placeholder}
                />
              );
            }}
          />
          {item.type === "checkbox" && item.label && (
            <InputLabel
              label={item.label}
              htmlFor={item.key?.toString() || ""}
            />
          )}
          <ErrorMessage
            errors={errors}
            name={item.name || ""}
            render={({ message }) => <p>{message}</p>}
          />
        </div>
      ))}
      <Button
        className='mt-4'
        title={submitButtonText}
        onClick={handleSubmit(submit)}
      />
    </div>
  );
};

export default FormComponent;
