import Link from "next/link";
import React from "react";

const InputLabel = ({ label, htmlFor }: { label: string; htmlFor: string }) => {
  return (
    <label
      htmlFor={htmlFor}
      className='block text-sm font-medium leading-6 text-gray-900'
    >
      {label === "Accept our terms and conditions" ? (
        <span>
          Accept our
          <Link
            href={"/terms-and-conditions"}
            className='text-blue-500 hover:text-blue-900'
          >
            {" "}
            terms and conditions
          </Link>
        </span>
      ) : (
        label
      )}
    </label>
  );
};

export default InputLabel;
