import { OptionType } from '@/components/ui/react-select';
import { ValidationTypeProps } from '@/lib/hook/useValidation';

export interface InputFormType extends React.HTMLProps<HTMLInputElement> {
  isClearable?: boolean;
  isMulti?: boolean;
  validation?: keyof ValidationTypeProps;
  colSpanSize?: number;
  selectInputList?: OptionType[];
}

export interface FileUploadDto {
  fileId: string;
  url: string;
  previewUrl: string;
}
