export interface ValidationTypeProps {
  nullValidation: Object;
  emailValidation: Object;
  phoneNumberValidation: Object;
  numberValidation: Object;
  passwordValidation: Object;
  minLengthValidation: Object;
  maxLengthValidation: Object;
  userNameValidation: Object;
  max50CharAllowedValidation: Object;
  max256CharAllowedValidation: Object;
  CompleteQtyAllowedValidation: Object;
  min1IsRequired: Object;
  min1QtyIsRequired: Object;
  zipValidation: Object;
  onlyNumberValidation: Object;
  maxSecondsAndMinutesValidation: Object;
  websiteUrlValidation: Object;
}
export const useValidation = (): ValidationTypeProps => ({
  nullValidation: {
    required: 'This field is required',
  },
  zipValidation: {
    required: 'This field is required',
    pattern: {
      value: /(^\d{5}(-\d{4})?$)|(^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$)/,
      message: 'Please enter a valid zip code',
    },
  },
  emailValidation: {
    required: 'This field is required',
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: 'Entered value does not match email format',
    },
  },

  phoneNumberValidation: {
    required: 'This field is required',
    pattern: {
      value: /^[0-9\b]+$/,
      message: 'Only numeric values allowed',
    },

    minLength: {
      value: 10,
      message: 'Minimum 10 characters required',
    },
    maxLength: {
      value: 10,
      message: 'Maximum 10 characters are allowed',
    },
  },
  numberValidation: {
    required: 'This field is required',
    pattern: {
      value: /^[0-9]*$/,
      message: 'This field accept number only',
    },
  },

  websiteUrlValidation: {
    required: false,
    pattern: {
      value: /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/,
      message: 'Please enter a valid URL',
    },
  },
  onlyNumberValidation: {
    pattern: {
      value: /^[0-9]*$/,
      message: 'This field accept number only',
    },
  },
  passwordValidation: {
    required: 'This field is required',
    minLength: {
      value: 8,
      message: 'Minimum 8 characters required',
    },
    pattern: {
      value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}/,
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number',
    },

    // commented for future use

    // maxLength: {
    //     value: 15,
    //     message: "Maximum 15 characters are allowed"
    // },
    // pattern: {
    //     value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}/,
    //     message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special characters and 1 number"
    // }
  },
  userNameValidation: {
    required: 'This field is required',
    pattern: {
      value: /^[a-z]*\w{3,}$/,
      message: 'Only lowercase and Underscore are allowed',
    },
  },
  max50CharAllowedValidation: {
    required: 'This field is required',
    maxLength: {
      value: 50,
      message: `Maximum of 50 characters are allowed`,
    },
  },
  max256CharAllowedValidation: {
    required: 'This field is required',
    maxLength: {
      value: 256,
      message: `Maximum of 256 characters are allowed`,
    },
  },
  CompleteQtyAllowedValidation: {
    required: 'This field is required',
    min: {
      value: 1,
      message: `Minimum of 1 Qty is required`,
    },
    max: {
      value: 500,
      message: `Maximum of 500 Qty are allowed`,
    },
  },
  min1IsRequired: {
    required: 'This field is required',
    min: {
      value: 1,
      message: `Minimum of 1 No.of Box is required`,
    },
  },
  min1QtyIsRequired: {
    required: 'This field is required',
    min: {
      value: 1,
      message: `Please enter valid qty`,
    },
  },

  maxSecondsAndMinutesValidation: {
    max: {
      value: 60,
      message: `Please enter valid time`, // Maximum of 60 characters are allowed
    },
  },

  minLengthValidation: (length: number) => {
    return {
      required: 'This field is required',
      minLength: {
        value: length || 100,
        message: `Minimum ${length || 100} characters required`,
      },
    };
  },
  maxLengthValidation: (length: number) => {
    return {
      required: 'This field is required',
      maxLength: {
        value: length || 100,
        message: `Maximum of ${length || 100} characters are allowed`,
      },
    };
  },
});
