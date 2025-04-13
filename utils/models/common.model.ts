import { ValidationTypeProps } from "@/lib/hook/useValidation";

export interface InputFormType extends React.HTMLProps<HTMLInputElement> {
  isClearable?: boolean;
  isMulti?: boolean;
  validation?: keyof ValidationTypeProps;
}
