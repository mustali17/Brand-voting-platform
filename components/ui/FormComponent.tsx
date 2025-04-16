'use client';
import { InputFormType } from '@/utils/models/common.model';
import { ErrorMessage } from '@hookform/error-message';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { Button } from './button';
import { Input } from './input';
import CustomSelect from './react-select';
import InputLabel from './input-label';
import { Checkbox } from './checkbox';
import { useValidation } from '@/lib/hook/useValidation';
import { FileInput } from './FileInput';

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
  submitBtnDisabled,
  isSubmitting,
  gridSize,
  handleFile,
}: FormProps<T>) => {
  const validation = useValidation();
  return (
    <div className={`grid grid-cols-${gridSize || 1}`}>
      {formList.map((item) => (
        <div
          key={item.key}
          className={`p-4 py-2 rounded ${
            item.type === 'checkbox' ? 'flex items-center space-x-2' : ''
          }`}
        >
          {item.label && item.type !== 'checkbox' && (
            <InputLabel
              label={item.label}
              htmlFor={item.key?.toString() || ''}
            />
          )}
          <Controller
            name={item.name as Path<T>}
            control={control}
            defaultValue={undefined}
            rules={validation[item.validation as keyof typeof validation]}
            render={({ field }) => {
              return item.type === 'select' ? (
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
              ) : item.type === 'checkbox' ? (
                <Checkbox {...field} onCheckedChange={field.onChange} />
              ) : item.type === 'file' ? (
                <FileInput
                  id={item.key?.toString() || ''}
                  name={item.key?.toString() || ''}
                  label={item.label}
                  accept='image/*'
                  maxSize={10}
                  onChange={(e) => {
                    if (e) {
                      handleFile && handleFile(e, item.key?.toString() || '');
                    }
                  }}
                />
              ) : (
                <Input
                  {...field}
                  type={item.type}
                  placeholder={item.placeholder}
                />
              );
            }}
          />
          {item.type === 'checkbox' && item.label && (
            <InputLabel
              label={item.label}
              htmlFor={item.key?.toString() || ''}
            />
          )}
          <ErrorMessage
            errors={errors}
            name={item.name as keyof T as any}
            render={({ message }) => (
              <p className='text-red-500 text-sm'>{message}</p>
            )}
          />
        </div>
      ))}
      <Button
        className='mt-4'
        title={submitButtonText}
        onClick={handleSubmit(submit)}
        disabled={submitBtnDisabled}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default FormComponent;
