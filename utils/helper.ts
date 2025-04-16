import { OptionType } from '@/components/ui/react-select';

export const prepareListDataForSelectInput = (
  list: Array<any>,
  labelKey: string,
  valueKey: string,
  additionalKey?: string
) => {
  return list?.map((item: any) => {
    let obj: OptionType = {
      label: item[labelKey] + (additionalKey ? ' ' + item[additionalKey] : ''),
      value: item[valueKey],
    };
    return obj;
  });
};
