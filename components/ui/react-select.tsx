import React from "react";
import Select, { SingleValue, MultiValue, ActionMeta } from "react-select";

export type OptionType = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: OptionType[];
  onChange: (selected: OptionType | OptionType[] | null) => void;
  placeholder?: string;
  isMulti?: boolean;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  isMulti = false,
}) => {
  const handleChange = (
    newValue: SingleValue<OptionType> | MultiValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    if (isMulti) {
      onChange(Array.isArray(newValue) ? newValue : []);
    } else {
      onChange(newValue as SingleValue<OptionType>);
    }
  };

  return (
    <div style={{ minWidth: "250px" }}>
      <Select
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        isMulti={isMulti}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#ccc",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#aaa",
            },
          }),
        }}
      />
    </div>
  );
};

export default CustomSelect;
