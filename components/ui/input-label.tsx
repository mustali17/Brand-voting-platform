import React from "react";

const InputLabel = ({ label, htmlFor }: { label: string; htmlFor: string }) => {
  return (
    <label
      htmlFor={htmlFor}
      className='block text-sm font-medium leading-6 text-gray-900'
    >
      {label}
    </label>
  );
};

export default InputLabel;
