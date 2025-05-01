import React from "react";
import Select, {
  SingleValue,
  MultiValue,
  ActionMeta,
  StylesConfig,
} from "react-select";

export type OptionType = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: OptionType[];
  onChange: (selected: OptionType | OptionType[] | null) => void;
  placeholder?: string;
  isMulti?: boolean;
  value?: any;
};

const customStyles: StylesConfig<OptionType, boolean> = {
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    minHeight: "40px",
    height: "40px",
    border: state.isFocused ? "1px solid #145673" : "1px solid #ced4da",
    boxShadow: state.isFocused
      ? "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px #145673"
      : "none",
    "&:hover": {
      border: "1px solid #145673",
      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px #145673",
    },
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    minWidth: "200px",
    fontSize: "16px",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: "100%",
    padding: "0 6px",
    fontSize: "16px",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    paddingBottom: "2px",
    fontSize: "16px",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    paddingTop: "1px",
  }),
  input: (provided, state) => ({
    ...provided,
    height: "100%",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "100%",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "16px",
  }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  isMulti = false,
  value,
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

  const getSelectedValue = (inputList: OptionType[], value: any) => {
    return inputList?.filter(
      (item: any) => item?.value === (value?.value || value)
    )?.[0];
  };

  const getMultiSelectedValue = (inputList: OptionType[], value: any) => {
    const splitValues = Array.isArray(value) ? value : value.split(",");
    return splitValues
      .map((obj: any) => inputList?.filter((item: any) => item?.value == obj))
      .flat();
  };

  console.log("CustomSelect: ", options, value);
  return (
    <div style={{ minWidth: "250px" }}>
      <Select
        value={
          isMulti
            ? getMultiSelectedValue(options, value)
            : getSelectedValue(options, value)
        }
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        isMulti={isMulti}
        styles={customStyles}
        id='react-select-input'
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: "#000",
            primary25: "#777",
          },
        })}
      />
    </div>
  );
};

export default CustomSelect;
